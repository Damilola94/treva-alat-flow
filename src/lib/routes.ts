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

    accountType: {
      path: '/onboarding/account-type'
    },

    emailVerification: {
      path: '/onboarding/email-verification'
    },

    personalDetails: {
      path: '/onboarding/personal-details'
    },

    security: {
      path: '/onboarding/security'
    },

    individual: {
      path: '/onboarding/individual',

      profession: {
        path: '/onboarding/individual/profession'
      }
    },

    team: {
      path: '/onboarding/team',

      companyDetails: {
        path: '/onboarding/team/company-details'
      }
    }
  }
}

export default routes
