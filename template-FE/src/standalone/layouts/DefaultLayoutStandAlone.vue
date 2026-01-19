<template>
  <div>

    <AppSidebar />
    
    <div :class="['wrapper d-flex flex-column min-vh-100', { 'bg-blurred': isBgBlurred }]">
      <AppHeader />
      <div class="body flex-grow-1 px-1">
        <CContainer fluid>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/standalone/components/AppFooter.vue'
import AppHeader from '@/standalone/components/AppHeader.vue'
import AppSidebar from '@/standalone/components/AppSidebar.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '../../apis/CommonAPI'

export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
  },
  data() {
    return {
      isBgBlurred: true,
    }
  },
  setup() {
    const router = useRouter()
    const getBreadcrumbs = (route) => {
      let breadcrumbs = route.matched.map((match, index) => ({
        name: match.meta?.breadcrumb || match.name || match.path,
        path: match.path,
        active: index === route.matched.length - 1,
      }))
      // Add Home if not present
      if (breadcrumbs.length > 0 && breadcrumbs[0].name !== 'Home') {
        breadcrumbs.unshift({ name: 'Home', path: '#/dc/dashboard', active: false })
      }
      // Show only the last two items (previous and current)
      if (breadcrumbs.length > 2) {
        breadcrumbs = breadcrumbs.slice(-2)
      }
      return breadcrumbs
    }
    const updateBreadcrumbs = () => {
      const currentRoute = router.currentRoute.value
      const breadcrumbs = getBreadcrumbs(currentRoute)
      localStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs))
      // Trigger update in AppBreadcrumb
      setTimeout(() => {
        const button = document.getElementById('breadcrumbsChangeValue')
        if (button) button.click()
      }, 0)
    }
    router.afterEach(updateBreadcrumbs)
    // Update on mount
    onMounted(updateBreadcrumbs)
    return {}
  },
  pluginOptions: {
    singleSpa: {
      importMapOverrides: false, // Disable import-map-overrides UI
    },
  },

  methods: {
    async fetchDataFrontend() {
      try {

        console.log('[FE fetchDataFrontend] Starting API call...');
        const frontendResponse = await api.get('/smartandon/frontend');

        console.log('[FE fetchDataFrontend] API response received:', frontendResponse.data);

        if (frontendResponse.data && Array.isArray(frontendResponse.data) && frontendResponse.data.length > 0) {
          console.log('[FE fetchDataFrontend] First item of frontend data:', frontendResponse.data[0]);

          if (frontendResponse.data[0].frontend === 1) {
            this.isBgBlurred = false;
          } else {
            this.isBgBlurred = true;
          }
        } else {
          
          console.warn('[FE fetchDataFrontend] No valid data array in response');

          this.isBgBlurred = true;
        }
      } catch (error) {
        console.error('[FE fetchDataFrontend] Error fetching frontend data:', error);
        console.error('[FE fetchDataFrontend] Error details:', error.response?.data || error.message);
        this.isBgBlurred = true;
      }
    },
  },
  mounted() {
    this.fetchDataFrontend();
    this.fetchInterval = setInterval(() => {
      this.fetchDataFrontend();
    }, 20 * 60 * 1000); // 20 minutes interval
  },
  beforeUnmount() {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }
  },
}
</script>
