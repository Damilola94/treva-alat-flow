const routes = {
  home: {
    path: '/'
  },

  auth: {
    path: '/auth',

    login: {
      path: '/auth/login'
    },

    logout: {
      path: '/auth/logout'
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
  }
}

export default routes
