<template>
  <CSidebar position="fixed" :unfoldable="sidebarUnfoldable" :visible="sidebarVisible" :class="sidebarClass" @visible-change="
    (event) =>
      $store.commit({
        type: 'updateSidebarVisible',
        value: event,
      })
  ">
    <CSidebarBrand>
      <div class="sidebar-brand-text sidebar-andon-text">ANDON</div>
    </CSidebarBrand>
    <AppSidebarNav v-bind:nav="nav" />
    <CSidebarToggler id="SidebarToggler" class="d-none d-lg-flex" @click="$store.commit('toggleUnfoldable')" />
  </CSidebar>
</template>

  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { AppSidebarNav } from './AppSidebarNav'
  import { logoNegative } from '@/standalone/assets/brand/logo-negative'
  import { sygnet } from '@/standalone/assets/brand/sygnet'
  import utils from "@/utils/CommonUtils"
  import api from "@/apis/CommonAPI"
  import navtemplate from '@/_nav.js'

  var strAuthorizedNav = '';
  var appAuthorized = {};
  const generateNav = async (newAuthorizedData, isChild) => {
    strAuthorizedNav += '[';
    let newAuthorizedDataLength = (newAuthorizedData.length)
    for (var i = 0; i < newAuthorizedDataLength; i++) {
      let currentNewAuthorizedData = newAuthorizedData[i];
      if (currentNewAuthorizedData.children && currentNewAuthorizedData.children.length > 0) {
        strAuthorizedNav += '{';
        strAuthorizedNav += ' "component": "CNavGroup",';
        strAuthorizedNav += ' "name": "' + (isChild ? '' : '') + currentNewAuthorizedData.displayText + '",';
        strAuthorizedNav += ' "to": "' + currentNewAuthorizedData.path + '",';
        strAuthorizedNav += ' "icon": "' + (currentNewAuthorizedData.icon) + '",';
        strAuthorizedNav += ' "parentId": "' + currentNewAuthorizedData.parentId + '",';
        strAuthorizedNav += ' "items": '
        generateNav(currentNewAuthorizedData.children, true);
        strAuthorizedNav += '},';
      } else {
        strAuthorizedNav += '{';
        strAuthorizedNav += ' "component": "CNavItem",';
        strAuthorizedNav += ' "name": "' + (isChild ? '' : '') + currentNewAuthorizedData.displayText + '",';
        strAuthorizedNav += ' "to": "' + currentNewAuthorizedData.path + '",';
        strAuthorizedNav += ' "icon": "' + (currentNewAuthorizedData.icon) + '",';
        strAuthorizedNav += ' "parentId": "' + currentNewAuthorizedData.parentId + '",';
        strAuthorizedNav += ' "applicationId": "' + currentNewAuthorizedData.applicationId + '",';
        strAuthorizedNav += ' "linkProps": { "queryParams": { "applicationId": "' + currentNewAuthorizedData.applicationId
          + '", "functionId": "' + currentNewAuthorizedData.functionId + '" } }';
        strAuthorizedNav += '},';
      }
    }
    strAuthorizedNav += ']';
  }

  export default {
    name: 'AppSidebar',
    components: {
      AppSidebarNav,
    },
    computed: {
      sidebarClass() {
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768;
        return isMobile ? 'custom-mobile-bg' : '';
      }
    },
    data() {
      return {
        showAndonText: false,
        nav: [
          {
            component: 'CNavItem',
            name: 'Home',
            to: '/app/dashboard',
            icon: 'cilHome',
            parentId: 'ROOT',
          },
          {
            component: 'CNavItem',
            to: '/app/Smartandon',
            name: 'Andon',
            icon: 'cilFactory',
            parentId: 'ROOT',

          items: [
            // {
            //   component: 'CNavItem',
            //   to: '/app/Dashboard2',
            //   name: 'Dashboard',
            //   icon: 'cilHome',
            //   parentId: 'ROOT',
            // },
            // {
            //   component: 'CNavItem',
            //   to: '/app/DashboardDataDisplay',
            //   name: 'Dashboard Data Display',
            //   icon: 'cilListNumbered',
            //   parentId: 'ROOT',
            // },
            {
              component: 'CNavItem',
              to: '/app/ProblemHistory',
              name: 'Problem History',
              icon: 'cilHistory',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/RealtimeParetto',
              name: 'Realtime Paretto',
              icon: 'cilChart',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/CMFollowup',
              name: 'CM Followup',
              icon: 'cilCalendar',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/MTBFMTTR',
              name: 'MTBF MTTR',
              icon: 'cilSpeedometer',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/LTBSummary',
              name: 'LTB Report Status',
              icon: 'cilDescription',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/KYMachine',
              name: 'KY Machines',
              icon: 'cilWarning',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/q6-analysis',
              name: 'Q6 Analysis',
              icon: 'cilMagnifyingGlass',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/TemporaryActionList',
              name: 'Temporary Action List',
              icon: 'cilJustifyLeft',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/FloatingPlungerTips',
              name: 'Floating Plunger Tips',
              icon: 'cilLineStyle',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/SparepartAnalysis',
              name: 'Sparepart Analysis',
              icon: 'cilBarChart',
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              to: '/app/JobAnalysis',
              name: 'Job Analysis',
              icon: 'cilFolderOpen',
              parentId: 'ROOT',
            },
          ]
        },
        {
          component: 'CNavItem',
          to: '/app/Others',
          name: 'Others',
          icon: 'cilApps',
          parentId: 'ROOT',

            items: [
              {
                component: 'CNavItem',
                to: '/app/FocusThema',
                name: 'Focus Thema',
                icon: 'cilBlurCircular',
                parentId: 'ROOT',
              },
              {
                component: 'CNavItem',
                to: '/app/EditDataSmartandon',
                name: 'Edit Data Smartandon',
                icon: 'cilClipboard',
                parentId: 'ROOT',
              },
            ]
          }
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/calibration-item/:idGauge',
          //   name: 'Calibration Item',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/calibration-item/add/:idGauge',
          //   name: 'Calibration Item Add',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/calibration-item/edit/:id',
          //   name: 'Calibration Item Edit',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/monthly-planning',
          //   name: 'Monthly Planning',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/daily-management',
          //   name: 'Daily Management',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/monthly-planning-holiday',
          //   name: 'Monthly Planning Holiday',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/monthly-planning-holiday/add',
          //   name: 'Monthly Planning Holiday Add',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/monthly-planning-holiday/edit/:id',
          //   name: 'Monthly Planning Holiday Edit',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/custom-planning',
          //   name: 'Custom Planning',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/custom-planning/add',
          //   name: 'Custom Planning',
          //   icon: '',
          //   parentId: 'ROOT',
          // },
          // {
          //   component: 'CNavItem',
          //   to: '/qdc/custom-planning/edit/:id',
          //   name: 'Custom Planning',
          //   icon: '',
          //   parentId: 'ROOT',
          // }

          /*define other in here*/
        ],
      }
    },
    setup() {
      const store = useStore()
      return {
        logoNegative,
        sygnet,
        sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
        sidebarVisible: computed(() => store.state.sidebarVisible),
      }
    },
    // async created() {
    //   let authorizedView = await api.scQueryApi('/api/common/menu-authorized', 'POST', '');
    //   strAuthorizedNav = '';
    //   if (authorizedView.data) {
    //     await generateNav(authorizedView.data.children)
    //     let jsonAuthorizedNavJSON = JSON.parse('{"value": ' + strAuthorizedNav.replaceAll('},]', '}]') + '}');

    //     //this.nav = this.nav.concat(jsonAuthorizedNavJSON.value);
    //     // this.nav=navtemplate;
    //   }
    //   setInterval(async () => {
    //     let authorizedView = await api.scQueryApi('/api/common/user-info', 'POST', '');
    //   }, 60 * 1000);

    //   //this.$router.push('/dc/dashboard');
    // }
    methods: {
      async fetchDataFrontend() {
        try {

          console.log('[FE fetchDataFrontend1] Starting API call...');
          const frontendResponse = await api.get('/smartandon/frontend');

          console.log('[FE fetchDataFrontend1] API response received:', frontendResponse.data);

          if (frontendResponse.data && Array.isArray(frontendResponse.data) && frontendResponse.data.length > 0) {
            console.log('[FE fetchDataFrontend1] First item of frontend data:', frontendResponse.data[0]);

            if (frontendResponse.data[0].frontend === 1) {
              this.showAndonText = true;
            } else {
              this.showAndonText = false;
            }
          } else {
            
            console.warn('[FE fetchDataFrontend1] No valid data array in response');
            this.showAndonText = false;
          }
        } catch (error) {
          console.error('[FE fetchDataFrontend1] Error fetching frontend data:', error);
          console.error('[FE fetchDataFrontend1] Error details:', error.response?.data || error.message);
          this.showAndonText = false;
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

<style scoped>
  .sidebar-andon-text {
    font-size: 50px;
    font-weight: 800;
    font-family: 'Inter', sans-serif;
    padding-left: 15px;
    width: 100%;
  }
</style>
