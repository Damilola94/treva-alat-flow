export const USER_SERVICE_BASE_API_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_API_URL;
export const PROJECT_SERVICE_BASE_API_URL =
  process.env.NEXT_PUBLIC_PROJECT_SERVICE_API_URL;
export const CHAT_SERVICE_BASE_API_URL =
  process.env.NEXT_PUBLIC_CHAT_SERVICE_API_URL;
export const PAYMENT_SERVICE_BASE_API_URL =
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_API_URL;

export const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  TRACE: "TRACE",
  CONNECT: "CONNECT",
};

export const endpoints = {
  // user service
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',
    verifyAccount: '/auth/verify-account',
    resendVerification: '/auth/resend-email-verification',
    changePassword: '/auth/change-password',
  },

  location: {
    getStates: `/locations/states`,
    getCities: `/locations/cities`,
    getLGA: `/locations/lga`,
  },

  professions: {
    getProfessions: "/professions",
  },

  subscription: {
    getAllSubs: "/subscriptions",
    getSubById: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  },

  users: {
    saveClientOnboarding: "/users/save-client-onboarding",
    saveCreativeOnboarding: "/users/save-creative-onboarding",
    getClientOnboarding: "/users/client-onboarding-record",
    getCreativeOnboarding: "/users/creative-onboarding-record",
    getUserProfile: "/users/my-profile",
    getHiriingStatistics: "/users/my-hiring-statistics",
    getCreatives: "/users/creatives",
    getCreativesById: (userId: string) => `/users/creative-detail/${userId}`,
    getUserRatings: (userId: string) => `/users/${userId}/ratings`,
    updateUserProfile: "/users/update-profile",
    deleteUserProfile: (userId: string) => `/users/${userId}/delete`,
  },

  selfieVerification: {
    bvn: "/selfieverification/verify-bvn",
    nin: "/selfieverification/verify-nin",
    callback: "/selfieverification/callback",
  },

  userFavorites: {
    getAllFavorites: "/userfavorites/client-user-favorites-creative",
    addFavorite: "/userfavorites/add-client-favorite-creative",
    deleteFavorite: (creativeUserId: string) =>
      `/userfavorites/remove-client-favorite-creative/${creativeUserId}`,
  },

  // project service
  agreements: {
    getAgreements: (projectId: string) => `/projects/${projectId}/agreements`,
    createAgreement: (projectId: string) => `/projects/${projectId}/agreements`,
    getAgreementById: (projectId: string, agreementId: string) =>
      `/projects/${projectId}/agreements/${agreementId}`,
    updateAgreement: (projectId: string, agreementId: string) =>
      `/projects/${projectId}/agreements/${agreementId}`,
    deleteAgreement: (projectId: string, agreementId: string) =>
      `/projects/${projectId}/agreements/${agreementId}`,
  },
  projects: {
    getAllProjects: "/projects",
    createProject: "/projects",
    getProjectById: (projectId: string) => `/projects/${projectId}`,
    updateProject: (projectId: string) => `/projects/${projectId}`,
    deleteProject: (projectId: string) => `/projects/${projectId}`,
    rateProject: (projectId: string) => `/projects/${projectId}/rate`,
    getCreativeHires: "/projects/hired-creative-users",
    dashboardSummaryCount: "/projects/dashboard-summary-count",
  },
  deliverables: {
    getDeliverables: (projectId: string) =>
      `/projects/${projectId}/deliverables`,
    createDeliverable: (projectId: string) =>
      `/projects/${projectId}/deliverables`,
    getDeliverableById: (projectId: string, deliverableId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}`,
    updateDeliverable: (projectId: string, deliverableId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}`,
    deleteDeliverable: (projectId: string, deliverableId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}`,
    getDeliverableTasks: (projectId: string, deliverableId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}/tasks`,
    createDeliverableTask: (projectId: string, deliverableId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}/tasks`,
    getDeliverableTaskById: (
      projectId: string,
      deliverableId: string,
      taskId: string
    ) => `/projects/${projectId}/deliverables/${deliverableId}/tasks/${taskId}`,
    updateDeliverableTask: (
      projectId: string,
      deliverableId: string,
      taskId: string
    ) => `/projects/${projectId}/deliverables/${deliverableId}/tasks/${taskId}`,
    deleteDeliverableTask: (
      projectId: string,
      deliverableId: string,
      taskId: string
    ) => `/projects/${projectId}/deliverables/${deliverableId}/tasks/${taskId}`,
  },
  paymentSchedules: {
    getPaymentSchedules: (projectId: string) =>
      `/projects/${projectId}/payment-schedules`,
    createPaymentSchedules: (projectId: string) =>
      `/projects/${projectId}/payment-schedules`,
    getPaymentScheduleById: (projectId: string, paymentScheduleId: string) =>
      `/projects/${projectId}/payment-schedules/${paymentScheduleId}`,
    updatePaymentSchedules: (projectId: string, paymentScheduleId: string) =>
      `/projects/${projectId}/payment-schedules/${paymentScheduleId}`,
    deletePaymentSchedules: (projectId: string, paymentScheduleId: string) =>
      `/projects/${projectId}/payment-schedules/${paymentScheduleId}`,
  },
  extraCosts: {
    getExtraCosts: (projectId: string) => `/projects/${projectId}/extra-costs`,
    createExtraCosts: (projectId: string) =>
      `/projects/${projectId}/extra-costs`,
    getExtraCostById: (projectId: string, extraCostId: string) =>
      `/projects/${projectId}/extra-costs/${extraCostId}`,
    updateExtraCosts: (projectId: string, extraCostId: string) =>
      `/projects/${projectId}/extra-costs/${extraCostId}`,
    deleteExtraCosts: (projectId: string, extraCostId: string) =>
      `/projects/${projectId}/extra-costs/${extraCostId}`,
  },
  comments: {
    getComments: (projectId: string) => `/projects/${projectId}/comments`,
    createComment: (projectId: string) => `/projects/${projectId}/comments`,
  },
  clientManagement: {
    getMyClients: "/clientmanagement/my-clients",
    addClient: `/clientmanagement/create-client`,
    updateClient: `/clientmanagement/update-client`,
    deleteClient: `/clientmanagement/delete-client`,
  },
  invoices: {
    getInvoice: "/invoices",
    getMyInvoice: (invoiceId: string) => `/invoices/${invoiceId}`,
    addInvoice: (invoiceId: string) => `/invoices/${invoiceId}/pay`,
  },
  notifications: {
    getNotifications: "/notifications",
    getNotificationCount: "/notifications/unread-count",
    readNotification: (notificationId: number) =>
      `/notifications/${notificationId}/read`,
  },
  messages: {
    getMessageByChatId: (chatId: number) => `/chats/${chatId}/messages`,
    postMessageByChatId: (chatId: number) => `/chats/${chatId}/messages`,
  },
  chats: {
    getAllChats: `/chats`,
    startChat: `/chats`,
  },

  // payment service
  wallets: {
    getMyWallets: `/wallets/my-wallet`,
    getTransactions: (walletId: string) => `wallets/${walletId}/transactions`,
    addWithdrawFunds: (walletId: string) => `wallets/${walletId}/withdraw-fund`,
    sendOtp: "/wallets/otp/send",
    verifyOtp: "/wallets/otp/verify",
    resendOtp: "/wallets/otp/resend",
    setPin: "/wallets/pin/set",
    resetPin: "/wallets/pin/reset"
  },
  beneficiaryManagement: {
    getBeneficiarymanagement: `/beneficiarymanagement/all`,
    addBeneficiary: `/beneficiarymanagement/create`,
    bankNameEnquiry: `/beneficiarymanagement/bank-name-enquiry`,
    deleteBeneficiary: (accountNumber: string) =>
      `/beneficiarymanagement/delete/${accountNumber}`,
  },
  common: {
    getBanks: `/common/banks`,
  },
};
