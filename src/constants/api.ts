export const USER_SERVICE_BASE_API_URL =
  process.env.NEXT_PUBLIC_USER_SERVICE_API_URL;
export const PROJECT_SERVICE_BASE_API_URL =
  process.env.NEXT_PUBLIC_PROJECT_SERVICE_API_URL;

export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  CONNECT: 'CONNECT',
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
    changePassword: '/auth/change-password',
  },

  location: {
    getStates: `/locations/states`,
    getCities: `/locations/cities`,
  },

  professions: {
    getProfessions: '/professions',
  },

  users: {
    saveClientOnboarding: '/users/save-client-onboarding',
    getClientOnboarding: '/users/client-onboarding-record',
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
    getAllProjects: '/projects',
    createProject: '/projects',
    getProjectById: (projectId: string) => `/projects/${projectId}`,
    updateProject: (projectId: string) => `/projects/${projectId}`,
    deleteProject: (projectId: string) => `/projects/${projectId}`,
    rateProject: (projectId: string) => `/projects/${projectId}/rate`
  },
  deliverables: {
    getDeliverables: (projectId: string) => `/projects/${projectId}/deliverables`,
    createDeliverable: (projectId: string) => `/projects/${projectId}/deliverables`,
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
    getDeliverableTaskById: (projectId: string, deliverableId: string, taskId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}/tasks/${taskId}`,
    updateDeliverableTask: (projectId: string, deliverableId: string, taskId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}/tasks/${taskId}`,
    deleteDeliverableTask: (projectId: string, deliverableId: string, taskId: string) =>
      `/projects/${projectId}/deliverables/${deliverableId}/tasks/${taskId}`,
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
    getExtraCosts: (projectId: string) =>
      `/projects/${projectId}/extra-costs`,
    createExtraCosts: (projectId: string) =>
      `/projects/${projectId}/extra-costs`,
    getExtraCostById: (projectId: string, extraCostId: string) =>
      `/projects/${projectId}/extra-costs/${extraCostId}`,
    updateExtraCosts: (projectId: string, extraCostId: string) =>
      `/projects/${projectId}/extra-costs/${extraCostId}`,
    deleteExtraCosts: (projectId: string, extraCostId: string) =>
      `/projects/${projectId}/extra-costs/${extraCostId}`,
  }
};
