<template>
  <CRow class="justify-content-center">
    <CCol md="10" lg="8" class="w-100">
      <CCard class="w-100 mb-3">
        <CCardBody class="d-flex justify-content-center align-items-center p-2 gap-3">
          <CContainer fluid class="d-flex justify-content-center align-items-center gap-2 p-0">
            <CFormSwitch
              v-model="abnormalModel"
              :disabled="isLoading"
              id="switch-abnormal"
              inline
            />
            <label for="switch-abnormal" class="mb-0">Abnormal</label>
          </CContainer>

          <CContainer fluid class="d-flex justify-content-center align-items-center gap-2 p-0">
            <CFormSwitch
              v-model="isFreqModel"
              :disabled="isLoading"
              id="switch-frequency"
              inline
            />
            <label for="switch-frequency" class="mb-0">Frequency</label>
          </CContainer>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import {
  CFormSwitch,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
} from '@coreui/vue'

const props = defineProps({
  abnormal: { type: Boolean, default: false },
  isFreq: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:abnormal', 'update:isFreq'])

const abnormalModel = computed({
  get: () => props.abnormal,
  set: (v) => emit('update:abnormal', v),
})

const isFreqModel = computed({
  get: () => props.isFreq,
  set: (v) => emit('update:isFreq', v),
})
</script>

<style scoped>
/* Custom button group styling */
.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
</style>