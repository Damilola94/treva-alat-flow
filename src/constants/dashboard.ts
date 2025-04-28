import dashboard from '@/lib/assets/dashboard';
import routes from '@/lib/routes';

export const dashboardCards = [
  {
    id: 1,
    img: dashboard.getStartedCard,
    title: 'Start a Tour',
    details:
      "Welcome to Creathrivity! Let's take a quick tour to help you get started and make the most of our features. Click 'Get started' to begin your journey!",
    btnText: 'Start tour',
    bottomInfo: '',
    bg: 'linear-gradient(137deg, rgba(165, 166, 246, 0) 33.3%, #a5a6f6 100%)',
  },

  {
    id: 2,
    img: dashboard.getStartedCard2,
    title: 'Complete onboarding',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of Creathrivity and start achieving your goals today. Click ‘Get started’ to continue.",
    btnText: 'Continue',
    bottomInfo: '1/3 steps',
    bg: 'linear-gradient(135deg, rgba(199, 255, 107, 0) 0%, #c7ff6b 100%)',
  },
];

export const clientOnboardingSteps = [
  {
    id: 1,
    label: 'Personal details',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of",
    href: routes.creatives.dashboard.getStarted.professionalDetails.path,
  },

  {
    id: 2,
    label: 'Social media details',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of ",
    href: routes.creatives.dashboard.getStarted.socialMediaDetails.path,
  },

  {
    id: 3,
    label: 'Bio',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of",
    href: routes.creatives.dashboard.getStarted.bio.path,
  },
];

export const clientDashboardTasks = [
  { label: 'All Project', value: 'All' },
  { label: 'Pending Project', value: 'Pending' },
  { label: 'Completed Project', value: 'Completed' },
];
