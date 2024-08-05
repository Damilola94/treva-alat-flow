const routes = {
  home: {
    path: '/'
  },

  auth: {
    path: '/auth',

    signIn: {
      path: '/auth/sign-in'
    },

    signOut: {
      path: '/auth/sign-out'
    }
  },

  dashboard: {
    entry: {
      path: '/dashboard'
    },

    accountManagement: {
      path: '/dashboard/account-management'
    },

    customerInformation: {
      path: '/dashboard/customer-information'
    }
  },

  onboarding: {
    path: '/onboarding',

    signUp: {
      path: '/onboarding/sign-up'
    }
  }
}

export default routes
