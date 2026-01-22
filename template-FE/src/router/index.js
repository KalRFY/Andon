import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'

const isStandalone = process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'

const appRoutes = [
  // Dashboard Routes
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
    },
  },
  {
    path: '/app/Dashboard2',
    name: 'Dashboard2',
    component: () => import('@/views/Dashboard2.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard 2',
    },
  },
  {
    path: '/dc/dashboard',
    name: 'dcDashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      title: 'DC Dashboard',
    },
  },

  // Analysis & Reporting Routes
  {
    path: '/app/MTBFMTTR',
    name: 'MTBFMTTR',
    component: () => import('@/views/MTBFMTTR/MTBFMTTR.vue'),
    meta: {
      requiresAuth: true,
      title: 'MTBF MTTR',
    },
  },
  {
    path: '/app/RealtimeParetto',
    name: 'RealtimeParetto',
    component: () => import('@/views/RealtimeParetto/RealtimeParetto.vue'),
    meta: {
      requiresAuth: true,
      title: 'Realtime Pareto',
    },
  },
  {
    path: '/app/Q6-Analysis',
    name: 'Q6Analysis',
    component: () => import('@/views/q6analysis/Q6Analysis.vue'),
    meta: {
      requiresAuth: true,
      title: 'Q6 Analysis',
    },
  },
  {
    path: '/app/SparepartAnalysis',
    name: 'SparepartAnalysis',
    component: () => import('@/views/SparepartAnalysis.vue'),
    meta: {
      requiresAuth: true,
      title: 'Sparepart Analysis',
    },
  },
  {
    path: '/app/JobAnalysis',
    name: 'JobAnalysis',
    component: () => import('@/views/JobAnalysis.vue'),
    meta: {
      requiresAuth: true,
      title: 'Job Analysis',
    },
  },

  // Data Management Routes
  {
    path: '/app/DashboardDataDisplay',
    name: 'DashboardDataDisplay',
    component: () => import('@/views/DashboardDataDisplay.vue'),
    meta: {
      requiresAuth: true,
      title: 'Dashboard Data Display',
    },
  },
  {
    path: '/app/EditDataSmartandon',
    name: 'EditDataSmartandon',
    component: () => import('@/views/EditDataSmartandon.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Data Smartandon',
    },
  },

  // Problem & Action Tracking Routes
  {
    path: '/app/ProblemHistory',
    name: 'ProblemHistory',
    component: () => import('@/views/ProblemHistory/ProblemHistory.vue'),
    meta: {
      requiresAuth: true,
      title: 'Problem History',
    },
  },
  {
    path: '/app/TemporaryActionList',
    name: 'TemporaryActionList',
    component: () => import('@/views/TemporaryActionList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Temporary Action List',
    },
  },
  {
    path: '/app/FocusThema',
    name: 'FocusThema',
    component: () => import('@/views/FocusThema.vue'),
    meta: {
      requiresAuth: true,
      title: 'Focus Thema',
    },
  },

  // Maintenance & Machine Routes
  {
    path: '/app/FloatingPlungerTips',
    name: 'FloatingPlungerTips',
    component: () => import('@/views/FloatingPlungerTips.vue'),
    meta: {
      requiresAuth: true,
      title: 'Floating Plunger Tips',
    },
  },
  {
    path: '/app/LTBSummary',
    name: 'LTBSummary',
    component: () => import('@/views/LTBSummary.vue'),
    meta: {
      requiresAuth: true,
      title: 'LTB Summary',
    },
  },
  {
    path: '/app/CMFollowup',
    name: 'CMFollowup',
    component: () => import('@/views/CMFollowup.vue'),
    meta: {
      requiresAuth: true,
      title: 'CM Followup',
    },
  },
  {
    path: '/app/KYMachine',
    name: 'KYMachine',
    component: () => import('@/views/KYMachine.vue'),
    meta: {
      requiresAuth: true,
      title: 'KY Machines',
    },
  },
]

const authRoutes = [
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/views/Register/Register.vue'),
    meta: {
      title: 'Register',
    },
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
    meta: {
      title: 'Login',
    },
  },
]

const errorRoutes = [
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/pages/Page404'),
    meta: { title: 'Page Not Found' },
  },
  {
    path: '/500',
    name: 'Page500',
    component: () => import('@/views/pages/Page500'),
    meta: { title: 'Server Error' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const routes = [
  {
    path: '/',
    name: 'Home',
    component: isStandalone ? DefaultLayoutStandAlone : DefaultLayout,
    redirect: () => {
      // In single-spa mode, redirect to login if no token
      if (!isStandalone && (!localStorage.token || localStorage.token === '')) {
        window.location.href = process.env.dc + '/#/auth/login'
        return
      }
      // Default redirect to dashboard
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
    // Decode JWT payload (middle part of token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    // If no expiration time, consider token valid
    if (!payload.exp) return false
    
    // Check if current time exceeds expiration time
    return Date.now() >= payload.exp * 1000
  } catch (e) {
    // If decoding fails, consider token invalid
    return true
  }
}

const router = createRouter({
  // Use hash mode (#/) for compatibility with single-spa and static hosting
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Always scroll to top when navigating to a new route
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  // Update browser tab title based on route meta
  if (to.meta.title) {
    document.title = `Andon - ${to.meta.title}`
  }

  // Check authentication status
  const token = localStorage.token
  const isLoggedIn = !!token && token !== '' && !isTokenExpired(token)
  
  // Clean up expired tokens
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token')
  }

  // Redirect to login if route requires auth and user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' })
    return
  }

  // Prevent logged-in users from accessing login/register pages
  if ((to.name === 'Login' || to.name === 'Register') && isLoggedIn) {
    next({ name: 'Dashboard' })
    return
  }

  // Allow navigation
  next()
})

export default router