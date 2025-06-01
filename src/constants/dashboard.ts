import clientManagement from '@/lib/assets/client-management';
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

export const invoiceTabs = [
  { label: 'All Invoice', value: 'All Invoice' },
  { label: 'Pending Invoice', value: 'Pending Invoice' },
  { label: 'Closed Invoice', value: 'Closed Invoice' },
  { label: 'Due Invoice', value: 'Due Invoice'},
];

export const transactionTabs = [
  { label: 'All', value: 'All' },
  { label: 'Credit', value: 'Credit' },
  { label: 'Debit', value: 'Debit' },
];

export const popoverItems = [
  { label: 'All Project', value: '' },
  { label: 'Personal Project', value: 'Personal' },
  { label: 'Client Project', value: 'Client' },
]

export const priorityItems = [
  { label: 'All', value: '' },
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
]

 export const statusItems = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Due', value: 'Due' },
  ]

  export const deliverableItems = [
    { label: 'All', value: 'All' },
    { label: 'Completed', value: 'Completed' },
  ]

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

export const mockTransactions = [
  {
    id: '1',
    description: 'Project funding inflow',
    amount: 100000,
    recipient: 'Wema Bank',
    date: new Date('2023-04-14'),
    type: 'Credit',
  },
  {
    id: '2',
    description: 'Project funding inflow',
    amount: 100000,
    recipient: 'Wema Bank',
    date: new Date('2023-04-14'),
    type: 'Debit',
  },
  {
    id: '3',
    description: 'Project funding inflow',
    amount: 100000,
    recipient: 'Wema Bank',
    date: new Date('2023-04-14'),
    type: 'Debit',
  },
  {
    id: '4',
    description: 'Project funding inflow',
    amount: 100000,
    recipient: 'Wema Bank',
    date: new Date('2023-04-14'),
    type: 'Credit',
  },
  {
    id: '5',
    description: 'Salary payment',
    amount: 250000,
    recipient: 'GTBank',
    date: new Date('2023-04-10'),
    type: 'Debit',
  },
  {
    id: '6',
    description: 'Client payment',
    amount: 350000,
    recipient: 'First Bank',
    date: new Date('2023-04-05'),
    type: 'Credit',
  },
  {
    id: '7',
    description: 'Office supplies',
    amount: 45000,
    recipient: 'Office Depot',
    date: new Date('2023-04-02'),
    type: 'Debit',
  },
  {
    id: '8',
    description: 'Consulting fee',
    amount: 200000,
    recipient: 'Access Bank',
    date: new Date('2023-03-28'),
    type: 'Credit',
  },
  {
    id: '9',
    description: 'Equipment purchase',
    amount: 180000,
    recipient: 'Tech Store',
    date: new Date('2023-03-25'),
    type: 'Debit',
  },
  {
    id: '10',
    description: 'Marketing campaign',
    amount: 120000,
    recipient: 'Ad Agency',
    date: new Date('2023-03-20'),
    type: 'Debit',
  },
]

export const mockInvoices = [
  {
    id: 1,
    projectName: 'Website Redesign',
    client: 'Acme Corporation',
    amount: '₦ 250,000',
    dueDate: 'May 15, 2025',
    status: 'Completed',
  },
  {
    id: 2,
    projectName: 'Mobile App Development',
    client: 'TechStart Inc.',
    amount: '₦ 450,000',
    dueDate: 'June 10, 2025',
    status: 'Pending',
  },
  {
    id: 3,
    projectName: 'Brand Identity Design',
    client: 'Green Ventures',
    amount: '₦ 180,000',
    dueDate: 'May 5, 2025',
    status: 'Due',
  },
  {
    id: 4,
    projectName: 'SEO Optimization',
    client: 'Global Solutions',
    amount: '₦ 120,000',
    dueDate: 'July 20, 2025',
    status: 'Completed',
  },
]

export const mockComments = [
     {
      id: "1",
      author: {
        name: "Client's Name",
        avatar: clientManagement.femaleClient,
        isClient: true,
      },
      content: "Can we hasten the duration of the project? I'd really like to get it done within the few days.",
      timestamp: "Time",
    },
    {
      id: "2",
      author: {
        name: "Creative's Name",
        avatar: clientManagement.femaleClient,
        isClient: false,
      },
      content: "Can we hasten the duration of the project? I'd really like to get it done within the few days.",
      timestamp: "Time",
    },
    {
      id: "3",
      author: {
        name: "Client's Name",
        avatar: clientManagement.femaleClient,
        isClient: true,
      },
      content: "Can we hasten the duration of the project? I'd really like to get it done within the few days.",
      timestamp: "Time",
    },
    {
      id: "4",
      author: {
        name: "Creative's Name",
        avatar: clientManagement.femaleClient,

        isClient: false,
      },
      content: "Can we hasten the duration of the project? I'd really like to get it done within the few days.",
      timestamp: "Time",
    },
    {
      id: "5",
      author: {
        name: "Client's Name",
         avatar: clientManagement.femaleClient,
        isClient: true,
      },
      content: "Can we hasten the duration of the project? I'd really like to get it done within the few days.",
      timestamp: "Time",
    }
  ]
