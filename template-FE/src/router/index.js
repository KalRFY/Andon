import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'

// Route groups
const appRoutes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/app/Dashboard2',
    name: 'Dashboard2',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Dashboard2.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard2',
    },
  },
  {
    path: '/app/MTBFMTTR',
    name: 'MTB FMTTR',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/MTBFMTTR/MTBFMTTR.vue'),
    meta: {
      requiresAuth: true,
      title: 'MTBF MTTR',
    },
  },
  {
    path: '/app/RealtimeParetto',
    name: 'Realtime Paretto',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/RealtimeParetto/RealtimeParetto.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Realtime Paretto',
    },
  },

  {
    path: '/app/DashboardDataDisplay',
    name: 'Dashboard Data Display',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/DashboardDataDisplay.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Dashboard Data Display',
    },
  },

  {
    path: '/app/EditDataSmartandon',
    name: 'Edit Data Smartandon',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/EditDataSmartandon.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Edit Data Smartandon',
    },
  },

  {
    path: '/app/SparepartAnalysis',
    name: 'Sparepart Analysis',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/SparepartAnalysis.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Sparepart Analysis',
    },
  },

  {
    path: '/app/JobAnalysis',
    name: 'Job Analysis',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/JobAnalysis.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Job Analysis',
    },
  },
  // Add the uncommented Quality Operational route
  // {
  //   path: '/qdc/quality-operational',
  //   name: 'QualityOperational',
  //   component: () => import(/* webpackChunkName: "quality-operational" */ '@/views/qdc/QualityOperational.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Quality Operational'
  //   }
  // },
  // New route
  {
    path: '/dc/dashboard',
    name: 'dcDashboard',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'dcDashboard',
    },
  },
  {
    path: '/app/Q6-Analysis',
    name: 'Q6Analysis',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/q6analysis/Q6Analysis.vue'),
    meta: {
      requiresAuth: true,
      title: 'Q6 Analysis',
    },
  },
  {
    path: '/app/ProblemHistory',
    name: 'Problem History',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/ProblemHistory/ProblemHistory.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Problem History',
    },
  },
  {
    path: '/app/TemporaryActionList',
    name: 'Temporary Action List',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/TemporaryActionList.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Temporary Action List',
    },
  },

  {
    path: '/app/FloatingPlungerTips',
    name: 'Floating Plunger Tips',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/FloatingPlungerTips.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Floating Plunger Tips',
    },
  },

  {
    path: '/app/FocusThema',
    name: 'Focus Thema',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/FocusThema.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Focus Thema',
    },
  },
  
  {
    path: '/app/LTBSummary',
    name: 'LTB Summary',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/LTBSummary.vue'),
    meta: {
      requiresAuth: true,
      title: 'LTB Summary',
    },
  },
  {
    path: '/app/CMFollowup',
    name: 'CM Followup',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/CMFollowup.vue'),
    meta: {
      requiresAuth: true,
      title: 'CM Followup',
    },
  },
  {
    path: '/app/KYMachine',
    name: 'KY Machines',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/KYMachine.vue'),
    meta: {
      requiresAuth: true,
      title: 'KY Machines',
    },
  },
  {
    path: '/app/tpm-redirect',
    name: 'Redirect TPM',
    component: () =>
      import(/* webpackChunkName: "redirect-tpm" */ '@/views/RedirectTPM.vue'),
    meta: {
      requiresAuth: false,
      title: 'Redirect TPM',
    },
  },
  {
    path: '/app/order-spareparts-redirect',
    name: 'Redirect Order Spareparts',
    component: () =>
      import(/* webpackChunkName: "redirect-order-spareparts" */ '@/views/RedirectOrderSpareparts.vue'),
    meta: {
      requiresAuth: false,
      title: 'Redirect Order Spareparts',
    },
  },
  {
    path: '/app/RobotInspection',
    name: 'Robot Inspection',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/RobotInspection.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Robot Inspection',
    },
  },

  {
    path: '/app/CameraSettings',
    name: 'Camera Settings',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/CameraSettings.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Camera Settings',
    },
  },

  {
    path: '/app/CollectingSample',
    name: 'Collecting Sample',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/CollectingSample.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Collecting Sample',
    },
  },

  {
    path: '/app/InspectionClass',
    name: 'Inspection Class',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/InspectionClass.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Inspection Class',
    },
  },

  {
    path: '/app/HistoryInspection',
    name: 'History Inspection',
    component: () =>
      import(
        /* webpackChunkName: "reports" */ '@/views/HistoryInspection.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'History Inspection',
    },
  },
]

const authRoutes = [
  {
    path: '/auth/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Register/Register.vue'),
    meta: {
      title: 'Register',
    },
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "reports" */ '@/views/Login/Login.vue'),
    meta: {
      title: 'Login',
    },
  },
]

// Error pages
const errorRoutes = [
  {
    path: '/404',
    name: 'Page404',
    component: () =>
      import(/* webpackChunkName: "error-404" */ '@/views/pages/Page404'),
    meta: { title: 'Page Not Found' },
  },
  {
    path: '/500',
    name: 'Page500',
    component: () =>
      import(/* webpackChunkName: "error-500" */ '@/views/pages/Page500'),
    meta: { title: 'Server Error' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const isStandalone = process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
console.log('Stand alone single SPA: ', isStandalone)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: isStandalone ? DefaultLayoutStandAlone : DefaultLayout,
    redirect: () => {
      if (!isStandalone && (!localStorage.token || localStorage.token === '')) {
        window.location.href = process.env.dc + '/#/auth/login'
        return
      }
      return '/app/dashboard'
    },
    children: [...appRoutes],
  },
  ...authRoutes,
  ...errorRoutes,
]

const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000
  } catch (e) {
    return true
  }
}

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

// Navigation guards for authentication
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = `Smartandon - ${to.meta.title}`
  }

  const token = localStorage.token
  const isLoggedIn = !!token && token !== '' && !isTokenExpired(token)
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token')
  }
  // Redirect to login only if route requires auth and not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
    return
  }
  // Prevent logged in user from accessing login/register
  if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }
  next()
})

export default router
