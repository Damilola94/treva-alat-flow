import { Notifications } from '@/components/views';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/client/dashboard/notifications`;

  return {
    title: 'Notifications - Client | Treva by Wema',
    description: 'View Notifications',
    keywords: [
      'chat',
      'connect',
      'dashboard',
      'setup',
      'Treva',
      'Treva by Wema',
    ],
    openGraph: {
      title: 'Notifications | Treva by Wema',
      description: 'View Notifications',
      url: pageUrl,
      siteName: 'Treva by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Notifications - Client | Treva by Wema',
      description: 'View Notifications',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function Page() {
  return <Notifications />;
}
