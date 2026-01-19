<template>
  <div>
    <CFormLabel>Loading data...</CFormLabel>
    <CCol class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </CCol>
  </div>
</template>

<script>
import { CFormLabel, CCol } from '@coreui/vue'

export default {
  name: 'LoadingState',
  components: {
    CFormLabel,
    CCol,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.spinner-border {
  margin: 2rem 0;
}
</style>
