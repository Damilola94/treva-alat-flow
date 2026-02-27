import { Favorites } from '@/components/views';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/client/dashboard/hiring-management/favorites`;

  return {
    title: 'Favorites - Hiring | Geegs by Wema',
    description: 'Explore your favorite hires',
    keywords: ['favorites', 'hiring', 'creatives', 'Treva'],
    openGraph: {
      title: 'Favorites - Hiring | Treva',
      description: 'Explore your favorite hires',
      url: pageUrl,
      siteName: 'Geegs by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Favorites - Hiring | Treva',
      description: 'Explore your favorite hires',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function BioPage() {
  return <Favorites />;
}
