import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)
const router = new Router({
  base: process.env.VUE_APP_BASE_URL || '',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      meta: {
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/WelcomePage')
    },
    {
      path: '/',
      name: 'home',
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/DashboardPages/DashboardPage')
    },
    {
      path: '/certs-keys/:id?',
      name: 'certs-keys',
      props: true,
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/ObjectsPages/ObjectsPage')
    },
    {
      path: '/services',
      name: 'services',
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/ServicesPages/ServicesPage')
    },
    {
      path: '/service/:id',
      name: 'service',
      props: true,
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/ServicesPages/ServiceDetailPage')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/LoginPage/LoginPage')
    },
    {
      path: '/login/partner',
      meta: {
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/PartnerRedirectPage'),
    },
    {
      path: '/join',
      name: 'join',
      props: true,
      meta: {
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/SignUpPage/SignUpPage')
    },
    {
      path: '/email-sent',
      name: 'email-sent',
      meta: {
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/EmailSentPage')
    },
    { path: '/verify_email/:token', redirect: '/verify-email/:token'},
    {
      path: '/verify-email/:token',
      name: 'verify-email',
      meta: {
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/VerifyEmailPage')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: {
        layout: 'blank',
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/PwdResetPages/ForgotPasswordPage')
    },
    { path: '/reset_password/:token', redirect: '/reset-password/:token'},
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      meta: {
        layout: 'blank',
        publicOnly: true
      },
      component: () => import('./pages/AuthPages/PwdResetPages/PasswordResetPage')
    },
    {
      path: '/change-password',
      name: 'change-password',
      meta: {
        layout: 'blank'
      },
      component: () => import('./pages/ChangePasswordPage')
    },
    {
      path: '/telemetry',
      name: 'telemetry',
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/TelemetryPages/TelemetryPage')
    },
    {
      path: '/certs-report',
      name: 'certs-report',
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/CertReportPages/CertReportPage')
    },
    {
      path: '/lgpd-get-started',
      name: 'lgpd-get-started',
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/SVaultPages/LgpdDemoPages/LgpdDemoPage')
    },
    {
      path: '/vault/:id?',
      name: 'vault',
      props: true,
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/SVaultPages/VaultPages/VaultPage')
    },
    {
      path: '/engine/:id?',
      name: 'engine',
      props: true,
      meta: {
        layout: 'page'
      },
      component: () => import('./pages/SVaultPages/EnginePages/EnginePage')
    },
    {
      path: '/account',
      name: 'account',
      component: () =>
        import('./pages/AccountManagementPages/AccountPage'),
      children: [
        {
          path: 'settings',
          name: 'settings',
          meta: {
            layout: 'page'
          },
          component: () =>
            import('./pages/AccountManagementPages/SettingsPages/SettingsPage')
        },
        {
          path: 'billing',
          name: 'billing',
          meta: {
            layout: 'page'
          },
          component: () =>
            import('./pages/AccountManagementPages/BillingPages/BillingPage')
        },
        {
          path: 'api-keys',
          name: 'api-keys',
          meta: {
            layout: 'page'
          },
          component: () =>
            import('./pages/AccountManagementPages/ApiKeysPages/ApiKeysPage')
        },
        {
          path: 'hsm-lan/:id?',
          name: 'hsm-lan',
          props: true,
          meta: {
            layout: 'page'
          },
          component: () =>
            import('./pages/AccountManagementPages/HsmPages/HsmPage'),
          children: [
            {
              path: 'cert-management',
              name: 'cert-management',
              props: true,
              meta: {
                layout: 'page'
              },
              component: () =>
                import('./pages/AccountManagementPages/HsmPages/CertManagementPage/CertManagementPage')
            }
          ]
        }
      ]
    },
    {
      path: '/file-encryption',
      name: 'file-encryption',
      props: true,
      meta: {
        layout: 'page'
      },
      component: () =>
        import('./pages/FileEncryptionPages/FileEncryptionPage')
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () =>
        import('./pages/NotFoundPage')
    },
    {
      path: '/not-authorized',
      name: 'not-authorized',
      meta: {
        layout: 'page'
      },
      component: () =>
        import('./pages/NotAuthorizedPage')
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        next({ name: 'not-found' })
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogged = store.state.auth.isLogged

  store.commit('ui/SET_LOADING', true)
  store.commit('ui/SET_LAYOUT', to.meta.layout)

  if (!isLogged) {
    if (to.matched.some(record => record.meta.publicOnly || record.meta.public)) {
      store.commit('ui/SET_LOADING', false)
      return next()
    } else {
      store.commit('ui/SET_LAYOUT', 'auth')
      store.commit('ui/SET_LOADING', false)
      return next({ name: 'welcome' })
    }
  } else {
    if (to.matched.some(record => record.meta.publicOnly)) {
      store.commit('ui/SET_LAYOUT', 'page')
      store.commit('ui/SET_LOADING', false)
      return next({ name: 'home' })
    } else {
      store.commit('ui/SET_LOADING', false)     
      return next()
    }
  }
})

export default router