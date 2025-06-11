import { Chat } from '@/components/views';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/client/dashboard/chat`;

  return {
    title: 'Chat - Client | Treva by Wema',
    description:
      'Stay connected with seamless, real-time messaging on Treva. Chat securely and collaborate effortlessly with your network.',
    keywords: [
      'chat',
      'connect',
      'dashboard',
      'setup',
      'Treva',
      'Treva by Wema',
    ],
    openGraph: {
      title: 'Chat - Client | Treva by Wema',
      description:
        'Stay connected with seamless, real-time messaging on Treva. Chat securely and collaborate effortlessly with your network.',
      url: pageUrl,
      siteName: 'Treva by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Client Chat| Treva by Wema',
      description:
        'Stay connected with seamless, real-time messaging on Treva. Chat securely and collaborate effortlessly with your network.',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function Page() {
  return <Chat />;
}
