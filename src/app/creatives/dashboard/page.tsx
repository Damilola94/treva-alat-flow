import { CreativeDashboard } from '@/components/views';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/creatives/dashboard`;

  return {
    title: 'Creative Dashboard | Treva by Wema',
    description:
      'Start your journey on Treva. Set up your profile and explore features.',
    keywords: ['Creative', 'Dashboard', 'dashboard', 'setup', 'Treva'],
    openGraph: {
      title: 'Creative Dashboard | Treva by Wema',
      description: 'Set up your profile and explore features on Treva.',
      url: pageUrl,
      siteName: 'Treva by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Creative Dashboard | Treva by Wema',
      description: 'Set up your profile and explore features on Treva.',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function ClientPage() {
  return <CreativeDashboard />;
}
