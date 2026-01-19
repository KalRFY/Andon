<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1 mt-1 mb-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" style="color: #EB0A1E" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none d-md-none">
        <h3 id="headerLabel1">{{headerLabel}}</h3>
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex ms-3 mb-1 me-auto">
        <h3 id="headerLabel2">{{headerLabel}}</h3>
      </CHeaderNav>
      <CHeaderNav>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid style="height: 19px !important; min-height: 19px; ">
      <CRow>
        <CCol>
          <AppBreadcrumb />
        </CCol>
      </CRow>
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { logo } from '@/standalone/assets/brand/logo'
export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  data(){
    return {
      headerLabel: process.env.VUE_APP_HEADER_LABEL
    }
  },
  setup() {
    return {
      logo,
    }
  },
}
</script>

<style scoped>
.c-header {
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

#headerLabel1, #headerLabel2 {
  color: #333333;
  font-weight: 600;
  margin: 0;
}

.c-header-nav {
  align-items: center;
}

.c-header-brand {
  display: flex;
  align-items: center;
}

.c-header-divider {
  margin: 0;
  opacity: 0.2;
}

.c-container {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

@media (max-width: 768px) {
  #headerLabel2 {
    display: none;
  }

  #headerLabel1 {
    font-size: 1.2rem;
  }
}

@media (max-width: 402px) {
  #headerLabel1 {
    font-size: 1rem;
  }
}
</style>
