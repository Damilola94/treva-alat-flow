// app/dashboard/page.tsx
import { GetStarted } from '@/components/views';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/client/dashboard`;

  return {
    title: 'Get Started | Geegs by Wema',
    description:
      'Start your journey on Treva. Set up your profile and explore features.',
    keywords: ['get started', 'dashboard', 'setup', 'Treva'],
    openGraph: {
      title: 'Get Started | Geegs by Wema',
      description: 'Set up your profile and explore features on Treva.',
      url: pageUrl,
      siteName: 'Geegs by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Get Started | Geegs by Wema',
      description: 'Set up your profile and explore features on Treva.',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function DashboardPage() {
  return <GetStarted />;
}
