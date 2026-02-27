import { ProfileSetup } from "@/components/views/Dashboard/creativesGetStarted";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const fullHost = `${protocol}://${host}`;
  const pageUrl = `${fullHost}/creatives/dashboard/get-started/personal-details`;

  return {
    title: 'Profile Setup - Get Started | Geegs by Wema',
    description:
      'Start your journey on Treva. Set up your profile and explore features.',
    keywords: ['get started', 'dashboard', 'setup', 'Treva'],
    openGraph: {
      title: 'Profile Setup - Get Started| Treva',
      description: 'Set up your profile and explore features on Treva.',
      url: pageUrl,
      siteName: 'Geegs by Wema',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Profile Setup - Get Started | Geegs by Wema',
      description: 'Set up your profile and explore features on Treva.',
      images: [`${fullHost}/images/og-dashboard.png`],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function PersonalDetailsPage () {
  return <ProfileSetup />;
}
