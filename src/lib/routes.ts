const routes = {
  home: {
    path: '/',
  },

  onboarding: {
    types: {
      path: '/onboarding-type',
    },
  },

  auth: {
    path: '/auth',

    signIn: {
      path: '/auth/sign-in',
    },

    signOut: {
      path: '/auth/sign-out',
    },

    forgotPassword: {
      path: '/auth/forgot-password',
      resetEmail: {
        path: '/auth/forgot-password/reset-email',
      },
      resetPassword: {
        path: '/auth/forgot-password/reset-password',
      },
      passwordResetSuccessful: {
        path: '/auth/forgot-password/password-reset-successful',
      },
    },

    verification: {
      path: '/auth/verification',
    },
  },

  client: {
    onboarding: {
      inputEmail: {
        path: '/client/onboarding/input-email',
      },
      personalDetails: {
        path: '/client/onboarding/personal-details',
      },
      phoneNumber: {
        path: '/client/onboarding/input-phone',
      },
      security: {
        path: '/client/onboarding/security',
      },
      emailVerification: {
        path: '/client/onboarding/email-verification',
      },
    },
    dashboard: {
      entry: {
        path: '/client/dashboard',
      },
      hiringManagement: {
        path: '/client/dashboard/hiring-management'
      },
    },
  },

  creatives: {
    onboarding: {
      inputEmail: {
        path: '/creatives/onboarding/input-email',
      },

      accountType: {
        path: '/creatives/onboarding/account-type',
      },

      emailVerification: {
        path: '/creatives/onboarding/email-verification',
      },

      personalDetails: {
        path: '/creatives/onboarding/personal-details',
      },

      security: {
        path: '/creatives/onboarding/security',
      },

      individual: {
        path: '/creatives/onboarding/individual',

        profession: {
          path: '/creatives/onboarding/individual/profession',
        },
      },

      team: {
        path: '/creatives/onboarding/team',

        companyDetails: {
          path: '/creatives/onboarding/team/company-details',
        },

        profession: {
          path: '/creatives/onboarding/team/profession',
        },
      },
    },
    dashboard: {
      entry: {
        path: '/creatives/dashboard',
      },

      getStarted: {
        path: '/creatives/dashboard/get-started',

        professionalDetails: {
          path: '/creatives/dashboard/get-started/professional-details',
        },

        socialMediaDetails: {
          path: '/creatives/dashboard/get-started/social-media-details',
        },

        bio: {
          path: '/creatives/dashboard/get-started/bio',
        },

        selectPlan: {
          path: '/creatives/dashboard/get-started/select-plan',
        },

        teamSetup: {
          path: '/creatives/dashboard/get-started/team-setup',
        },

        done: {
          path: '/creatives/dashboard/get-started/done',
        },
      },

      invoiceAndPayment: {
        path: '/creatives/dashboard/invoice-and-payment',

        projectDetails: {
          path: '/creatives/dashboard/invoice-and-payment/project-details',
        },

        deliverables: {
          path: '/creatives/dashboard/invoice-and-payment/deliverables',
        },

        payment: {
          path: '/creatives/dashboard/invoice-and-payment/payment',
        },

        agreement: {
          path: '/creatives/dashboard/invoice-and-payment/agreement',
        },

        review: {
          path: '/creatives/dashboard/invoice-and-payment/review',
        },
      },

      projectManagement: {
        path: '/creatives/dashboard/project-management',

        personalProject: {
          path: '/creatives/dashboard/project-management/personal-project',
          create: {
            path: '/creatives/dashboard/project-management/personal-project/create',
          },
        },
        clientProject: {
          path: '/creatives/dashboard/project-management/client-project',
        },
      },

      clientManagement: {
        path: '/creatives/dashboard/client-management',
      },
    },
  },
};

export default routes;
