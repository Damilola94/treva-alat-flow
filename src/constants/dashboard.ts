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
    href: routes.client.dashboard.getStarted.personalDetails.path,
  },

  {
    id: 2,
    label: 'Social media details',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of ",
    href: routes.client.dashboard.getStarted.socialMediaDetails.path,
  },

  {
    id: 3,
    label: 'Bio',
    details:
      "You're almost there! Complete your onboarding to unlock the full potential of",
    href: routes.client.dashboard.getStarted.bio.path,
  },
];

export const clientDashboardTasks = [
  { label: 'All Project', value: 'All' },
  { label: 'Pending Project', value: 'Pending' },
  { label: 'Completed Project', value: 'Completed' },
];

export const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    creative: 'Alex Johnson',
    budget: '10000',
    startDate: 'June 15, 2020',
    dueDate: 'June 15, 2023',
    priority: 'High',
    status: 'Completed'
  },
  {
    id: '2',
    name: 'Summer Marketing Campaign',
    creative: 'Sarah Miller',
    budget: '10000',
    startDate: 'June 15, 2020',
    dueDate: 'July 1, 2023',
    priority: 'Medium',
    status: 'Pending'
  },
  {
    id: '3',
    name: 'Product Packaging Design',
    creative: 'Jamie Chen',
    budget: '10000',
    startDate: 'June 15, 2020',
    dueDate: 'May 30, 2023',
    priority: 'Low',
    status: 'Due'
  },
  {
    id: '4',
    name: 'Brand Identity Refresh',
    creative: 'Taylor Williams',
    budget: '10000',
    startDate: 'June 15, 2020',
    dueDate: 'April 10, 2023',
    priority: 'Low',
    status: 'Completed'
  },
  {
    id: '5',
    name: 'Mobile App UI/UX',
    creative: 'Jordan Smith',
    budget: '10000',
    startDate: 'June 15, 2020',
    dueDate: 'August 5, 2023',
    priority: 'High',
    status: 'Pending'
  },
  {
    id: '6',
    name: 'Social Media Graphics',
    creative: 'Morgan Taylor',
    budget: '10000',
    startDate: 'June 15, 2020',
    dueDate: 'June 28, 2023',
    priority: 'Medium',
    status: 'Due'
  }
];
