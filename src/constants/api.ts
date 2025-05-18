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
  },
  projects: {
    getAllProjects: '/projects',
  },
};
