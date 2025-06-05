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

    resetPassword: {
      path: '/auth/reset-password',
    },

    forgotPassword: {
      path: '/auth/forgot-password',
      resetEmail: {
        path: '/auth/forgot-password/reset-email',
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
      getStarted: {
        path: '/client/dashboard/get-started',

        personalDetails: {
          path: '/client/dashboard/get-started/personal-details',
        },

        socialMediaDetails: {
          path: '/client/dashboard/get-started/social-media-details',
        },

        bio: {
          path: '/client/dashboard/get-started/bio',
        },

        done: {
          path: '/client/dashboard/get-started/done',
        },
      },
      hiringManagement: {
        path: '/client/dashboard/hiring-management',
      },
      projectManagement: {
        path: '/client/dashboard/project-management',
      },
      payment: {
        path: '/client/dashboard/payment',
      },
      chat: {
        path: '/client/dashboard/chat',
      },
      notifications: {
        path: '/client/dashboard/notifications',
      },
      settings: {
        path: '/client/dashboard/settings',

        profile: {
          path: '/client/dashboard/settings/profile',
        },

        security: {
          path: '/client/dashboard/settings/security',
        },

        notifications: {
          path: '/client/dashboard/settings/notifications',
        },
      },
    },
  },

  creatives: {
    onboarding: {
      inputEmail: {
        path: '/creatives/onboarding/input-email',
      },
      phoneNumber: {
        path: '/creatives/onboarding/input-phone',
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
      payment: {
        path: '/creatives/dashboard/payment',
      },
      chat: {
        path: '/creatives/dashboard/chat',
      },
      notifications: {
        path: '/creatives/dashboard/notifications',
      },
      settings: {
        path: '/creatives/dashboard/settings',

        profile: {
          path: '/creatives/dashboard/settings/profile',
        },

        security: {
          path: '/creatives/dashboard/settings/security',
        },

        notifications: {
          path: '/creatives/dashboard/settings/notifications',
        },
      },
    },
  },
};

export default routes;
