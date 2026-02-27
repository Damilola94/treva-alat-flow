// app/dashboard/page.tsx
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import ClientManagement from '@/components/views/Client-Management/ClientManagement';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/creatives/dashboard/client-management`;

  return {
    title: 'Client Management | Geegs by Wema',
    description:
      'Start your journey on Treva. Set up your profile and explore features.',
    keywords: ['client management', 'dashboard', 'setup', 'Treva'],
    openGraph: {
      title: 'Client Management | Geegs by Wema',
      description: 'Set up your profile and explore features on Treva.',
      url: pageUrl,
      siteName: 'Geegs by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Client Management | Geegs by Wema',
      description: 'Set up your profile and explore features on Treva.',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function DashboardPage() {
  return <ClientManagement />
}
