'use client';
import { useEffect, useRef } from 'react';
import { useProfile } from '@/hooks/Users';
import { useAppSelector } from '@/store';

const ALAT_PROVIDER_KEY = 'TESTPROV';
const ALAT_API_KEY = 'GxxN5foX6iMuHEpMYJucyrmRf4EVWnr08diqwX1zGS8';
const ALAT_SIGNING_SECRET = 'ekx8JDi3gULZzS0y8LkOlNc9ooIUFHhBTryAqSFoapY';
const ALAT_PROVIDER_ID = 'cd5533bb-e88e-4389-8de9-d33950f16bcc';

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

  const keyBytes = Uint8Array.from(atob(signingSecret), (c) => c.charCodeAt(0));
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
console.log(data, "data");

  const firstName = data?.data?.firstName || 'John';
  const lastName = data?.data?.lastName || 'Doe';
  const userEmail = data?.data?.email || '';
  const phoneNumber = data?.data?.phoneNumber || '';

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
          email: userEmail || '',
          firstName: firstName || '',
          lastName: lastName || '',
          phoneNumber: phoneNumber || '',
          externalUserId: userId,
          externalTenantId: ALAT_PROVIDER_ID,
          roles: [],
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
        const { code, embedUrl: url } = bootstrapData?.responseData || {};
        if (!code || !url) {
          console.error('Bootstrap failed:', bootstrapData);
          return;
        }

        embedUrlRef.current = url;

        const exchangeRes = await fetch(
          'https://dev-empayment.somee.com/api/v1/integration/exchange',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          },
        );

        const exchangeData = await exchangeRes.json();
        const token = exchangeData?.responseData?.login?.token;
        if (!token) {
          console.error('Exchange failed:', exchangeData);
          return;
        }

        accessTokenRef.current = token;
        sendTokenToIframe(token, url);
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