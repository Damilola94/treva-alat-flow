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
    },

    verification: {
      path: '/auth/verification'
    }
  },

  dashboard: {
    entry: {
      path: '/dashboard'
    },

    getStarted: {
      path: '/dashboard/get-started',

      professionalDetails: {
        path: '/dashboard/get-started/professional-details'
      },

      socialMediaDetails: {
        path: '/dashboard/get-started/social-media-details'
      },

      bio: {
        path: '/dashboard/get-started/bio'
      },

      selectPlan: {
        path: '/dashboard/get-started/select-plan'
      },

      teamSetup: {
        path: '/dashboard/get-started/team-setup'
      },

      done: {
        path: '/dashboard/get-started/done'
      }
    },

    projectManagement: {
      path: '/dashboard/project-management'
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
      },

      profession: {
        path: '/onboarding/team/profession'
      }
    }
  }
}

export default routes
