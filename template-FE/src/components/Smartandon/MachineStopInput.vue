<template>
  <custom-modal
    name="MachineStopInput"
    :dismissible="true"
    min-width="100vw"
    max-width="100vw"
    :show-close-icon="false"
    classContent="p-0 br-10px h-100">
    <div class="d-flex flex-column w-100 h-100 align-items-center">
      <div class="align-self-center">
        <button class="btn-none my-3" @click="close">
          <CIcon name="cil-x"/>
        </button>
      </div>
      <div class="mb-2 w-layout">
        <div class="input-group">
          <input type="text" class="form-control shadow-none" placeholder="Search Anything" v-model="search"
                 @keyup.enter="onSearch"/>
          <button class="btn btn-info text-center text-white" @click="onSearch">
            <CIcon name="cilSearch"/>
          </button>
          <div class="x-mark" @click="clearSearch">
            <CIcon name="cilXCircle"/>
          </div>
        </div>
      </div>
      <div class="bg-white rounded shadow w-layout"
           style="max-height: 70vh !important; min-height: 200px; overflow: auto;">
        <div v-if="false" class="d-flex flex-column align-items-center justify-content-center h-100">
          <span v-if="!isLoading && (!resultSearch || resultSearch.length === 0)" style="opacity: 0.5;">Search Machine / Line / Item Check / Schedule / History</span>
          <div v-else>
            <CSpinner component="span" size="lg" aria-hidden="true">
              Loading...
            </CSpinner>
          </div>
        </div>
        <template v-else>
          <div class="py-2 px-3 h-100">
            <template v-for="(parent, i) in resultSearch" :key="i">
              <template v-if="Array.isArray(parent?.child) && parent?.child?.length">
                <div class="ms-2  mb-1 text-start">
                  <h6 class="fw-bold">{{ parent.category }}</h6>
                </div>
                <div v-for="(item, i) in parent.child" :key="i" class="row m-2 item p-2">
                  <div class="col-12 col-md-12 w-100" @click="onCLickItem(item)">
                    <div class="d-flex gap-2">
                      <CIcon v-if="item.icon" :name="item.icon"/>
                      <div class="d-flex flex-column text-start flex-grow-1">
                        <h6 class="fw-bold mb-1">{{ item.featureName }}</h6>
                        <p v-if="item.itemName" class="mb-0">{{ item.itemName }}</p>
                      </div>
                      <CIcon name="cil-arrow-thick-from-left"/>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="d-flex h-100 align-items-center justify-content-center">
                  <span class="text-center">
                    Pencarian tidak ditemukan
                  </span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </div>
  </custom-modal>
</template>
<script>
import api from "@/apis/CommonAPI";
import utils from "@/utils/CommonUtils";
import {mainMenu} from "@/utils/SidebarUtils";
import CustomModal from "@/components/Tpm/Modal/CustomModal.vue";

const sampleJson = [
  {
    "category": "Features",
    "featureName": "Schedule",
    "itemName": "IMSP-002",
    "route": "/tpm/monitoring",
    "icon": null,
  },
  {
    "category": "Features",
    "featureName": "Master Ledger",
    "itemName": "IMSP-002",
    "route": "/tpm/ledger",
    "icon": null,
  },
  {
    "category": "Features",
    "featureName": "Finding",
    "itemName": "IMSP-002",
    "route": "/tpm/findings",
    "icon": null,
  }
];

export default {
  name: "OverlaySearchBar",
  components: {CustomModal},
  data() {
    return {
      isLoading: false,
      search: null,
      resultSearch: [],
    };
  },
  mounted() {
    this.init();
    /*this.$nextTick(() => {
      setTimeout(() => {
        this.$store.dispatch('MODALS/open', 'DialogGlobalSearch');
      }, 500);
    });*/
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.mappedMenu();
    },
    async onSearch() {
      if (!this.search) {
        this.mappedMenu();
        return;
      }

      try {
        this.isLoading = true;
        this.mappedMenu();

        const result = await api.get(`/tpm/features`, `?search=${this.search}`);
        if (result.status === 200) {
          const features = result.data.data.length ? {
            category: "Features",
            child: result.data.data,
          } : null;

          this.resultSearch = [
            ...this.resultSearch,
            features && features,
          ];
        }
      } catch (e) {
        console.log('onSearch', e);
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 3000);
      }
    },
    mappedMenu() {
      const childMenu = [];
      const menuNames = [];

      for (let i = 0; i < mainMenu.length; i++) {
        if (mainMenu[i].items) {
          for (let j = 0; j < mainMenu[i].items.length; j++) {
            menuNames.push(mainMenu[i].items[j].name);
            childMenu.push({
              featureName: mainMenu[i].items[j].name,
              itemName: null,
              route: mainMenu[i].items[j].to,
              icon: mainMenu[i].items[j].icon,
            });
          }
        } else {
          menuNames.push(mainMenu[i].name);
          childMenu.push({
            featureName: mainMenu[i].name,
            itemName: null,
            route: mainMenu[i].to,
            icon: mainMenu[i].icon,
          });
        }
      }

      //console.log('childmenu', JSON.stringify(childMenu));
      let menu = {
        category: "Menus",
        child: childMenu,
      };

      if (this.search) {
        menu.child = menu.child.filter((item) => item.featureName.toLowerCase().includes(this.search.toLowerCase()));
      }

      if (menu.child.length) {
        this.resultSearch = [
          menu,
        ];
      } else {
        this.resultSearch = [];
      }
    },
    onCLickItem(item) {
      this.close();
      this.$store.dispatch("globalSearchFeature/selected", item);
      this.$router.push(item.route);
    },
    clearSearch() {
      this.search = null;
      this.onSearch();
    },
    close() {
      this.$store.dispatch('MODALS/close', 'DialogGlobalSearch')
    }
  },
  mixins: [],
};
</script>
<style>
.w-layout {
  width: 650px !important;
}

.item {
  cursor: pointer !important;
  padding: 0.5rem !important;
  margin: 0.5rem !important;
}

.item:hover {
  background-color: #c7cace !important;
  border-radius: 10px !important;
}

.x-mark {
  position: absolute;
  top: 0.5rem;
  right: 3rem;
  cursor: pointer;
  z-index: 9999;
}
</style>
