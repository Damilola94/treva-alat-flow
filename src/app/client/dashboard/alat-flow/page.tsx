'use client';
import { useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/Users';
import { useAppSelector } from '@/store';

const ALAT_PROVIDER_KEY = 'POCDEV3';
const ALAT_API_KEY = 'x7xMyc_4_3atmY1pJEY1e45yjEioSYB7_0OTF4ePwJM';
const ALAT_SIGNING_SECRET = '_HVTvLosoO5gmipjQNPLdHdqA5k9wqhtMNWVjlK1Xnk';

async function computeSignature(
  providerKey: string,
  method: string,
  path: string,
  timestamp: string,
  nonce: string,
  body: string,
  signingSecret: string,
): Promise<string> {
  const bodyBytes = new TextEncoder().encode(body);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bodyBytes);
  const bodyHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const signingString = [
    providerKey,
    method.toUpperCase(),
    path.toLowerCase(),
    timestamp,
    nonce,
    bodyHash,
  ].join('\n');

  const keyBytes = new TextEncoder().encode(signingSecret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(signingString),
  );

  return btoa(String.fromCharCode(...Array.from(new Uint8Array(sigBuffer))));
}

export default function AlatFlowPage() {
  const { data } = useProfile();
  const { userId } = useAppSelector((state) => state?.auth);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const accessTokenRef = useRef<string | null>(null);
  const embedUrlRef = useRef<string | null>(null);

  const firstName = data?.data?.firstName || 'John';
  const lastName = data?.data?.lastName || 'Doe';
  const userEmail = data?.data?.email || 'john.doe@example.com';
  const phoneNumber = data?.data?.phoneNumber || '09012345678';

  const sendTokenToIframe = (token: string, url: string) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: 'ALAT_AUTH', accessToken: token },
      new URL(url).origin,
    );
  };

  const handleIframeLoad = () => {
    if (accessTokenRef.current && embedUrlRef.current) {
      sendTokenToIframe(accessTokenRef.current, embedUrlRef.current);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const bootstrap = async () => {
      try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = crypto.randomUUID();
        const path = '/api/v1/integration/bootstrap';

        const bodyPayload = {
          email: userEmail,
          firstName,
          lastName,
          phoneNumber,
          externalUserId: userId,
          externalTenantId: 'ext-tenant-001',
          roles: ['user'],
          context: {},
        };

        const bodyString = JSON.stringify(bodyPayload);

        const signature = await computeSignature(
          ALAT_PROVIDER_KEY,
          'POST',
          path,
          timestamp,
          nonce,
          bodyString,
          ALAT_SIGNING_SECRET,
        );

        const bootstrapRes = await fetch(
          `https://dev-empayment.somee.com${path}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Provider-Key': ALAT_PROVIDER_KEY,
              'X-Api-Key': ALAT_API_KEY,
              'X-Timestamp': timestamp,
              'X-Nonce': nonce,
              'X-Signature': signature,
            },
            body: bodyString,
          },
        );

        const bootstrapData = await bootstrapRes.json();
  
        if (!bootstrapData.isSuccess) {
          console.error('Bootstrap failed:', bootstrapData);
          return;
        }

        const { code, integrationContextId: integrationContextId } = bootstrapData.responseData;

        console.log(code);
        console.log(integrationContextId      );

        if (!code || !integrationContextId) return;

        embedUrlRef.current = integrationContextId;

        const exchangeRes = await fetch(
          'https://dev-empayment.somee.com/api/v1/integration/exchange?providerKey=' + ALAT_PROVIDER_KEY,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          },
        );

        const exchangeData = await exchangeRes.json();
        console.log('Exchange response:', exchangeData);

        const token =
          exchangeData?.responseData?.login?.accessToken ??
          exchangeData?.responseData?.login?.token;

        if (!token) {
          console.error('Exchange failed — no token:', exchangeData);
          return;
        }

        accessTokenRef.current = token;
        sendTokenToIframe(token, integrationContextId);
      } catch (err) {
        console.error('ALAT bootstrap error:', err);
      }
    };

    bootstrap();
  }, [userId]);

  return (
    <iframe
      ref={iframeRef}
      src="https://alat-flow.netlify.app/"
      title="ALAT Flow"
      onLoad={handleIframeLoad}
      style={{
        width: '100%',
        height: 'calc(100vh - 56px)',
        border: 'none',
        display: 'block',
      }}
    />
  );
}