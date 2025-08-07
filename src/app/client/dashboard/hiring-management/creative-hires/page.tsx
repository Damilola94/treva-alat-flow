import { CreativeHires } from '@/components/views';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/client/dashboard/hiring-management/creative-hires`;

  return {
    title: 'Creative Hires - Hiring | Treva by Wema',
    description: 'View your hired creatives',
    keywords: ['favorites', 'hiring', 'creatives', 'Treva'],
    openGraph: {
      title: 'Creative Hires - Hiring | Treva by Wema',
      description: 'View your hired creatives',
      url: pageUrl,
      siteName: 'Treva by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Creative Hires - Hiring | Treva by Wema',
      description: 'View your hired creatives',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function BioPage() {
  return <CreativeHires />;
}
