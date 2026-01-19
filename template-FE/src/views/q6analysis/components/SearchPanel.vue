<template>
  <CRow>
    <CCol>
      <CCard class="mb-3">
        <CCardBody>
          <CRow class="align-items-end">
            <CCol md="3">
              <label class="form-label fw-semibold">Start Date</label>
              <CFormInput
                type="date"
                :value="startDate"
                @input="updateStartDate"
                :disabled="isLoading"
              />
            </CCol>
            <CCol md="3">
              <label class="form-label fw-semibold">End Date</label>
              <CFormInput
                type="date"
                :value="endDate"
                @input="updateEndDate"
                :disabled="isLoading"
              />
            </CCol>
            
            <CCol md="3">
              <label class="form-label fw-semibold">Production Line</label>
              <CFormSelect
                :value="selectedLine"
                @change="updateSelectedLine"
                :disabled="isLoading"
              >
                <option v-for="line in productionLines" :key="line.value" :value="line.value">
                  {{ line.label }}
                </option>
              </CFormSelect>
            </CCol>
            
            <CCol md="3">
              <CButton
                color="primary"
                @click="handleSearch"
                :disabled="isLoading"
                class="w-100"
              >
                <template v-if="isLoading">
                  <CSpinner size="sm" class="me-2" />
                  Loading...
                </template>
                <template v-else>
                  Search
                </template>
              </CButton>
            </CCol>
          </CRow>
          
          <CRow class="mt-3">
            <CCol cols="12">
              <CContainer fluid class="d-flex flex-wrap gap-2 p-0">
                <small class="text-muted me-2 align-self-center">Quick select:</small>
                <CButton
                  v-for="range in timeRanges"
                  :key="range.value"
                  size="sm"
                  color="primary"
                  @click="selectTimeRange(range.value)"
                  :disabled="isLoading"
                >
                  {{ range.label }}
                </CButton>
              </CContainer>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import {
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CSpinner,
  CContainer,
} from '@coreui/vue'

const props = defineProps({
  startDate: String,
  endDate: String,
  selectedLine: String,
  isLoading: Boolean
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'update:selectedLine', 'search', 'selectTimeRange'])

const productionLines = [
  {value: 'ALL', label: 'All' },
  { value: 'LPDC', label: 'LPDC Line' },
  { value: 'HPDC', label: 'HPDC Line' },
  { value: 'Cam Shaft', label: 'CAM SHAFT Line' },
  { value: 'Crank shaft', label: 'CRANK SHAFT Line' },
  { value: 'Cylinder Head', label: 'CYLINDER HEAD Line' },
  { value: 'Cylinder Block', label: 'CYLINDER BLOCK Line' },
  { value: 'ASSY LINE', label: 'ASSY LINE' }
]

const timeRanges = [
  { value: 'today', label: 'Today' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'lastQuarter', label: 'Last Quarter' },
  { value: 'thisYear', label: 'This Year' }
]

const updateStartDate = (event) => {
  emit('update:startDate', event.target.value)
}

const updateEndDate = (event) => {
  emit('update:endDate', event.target.value)
}

const updateSelectedLine = (event) => {
  emit('update:selectedLine', event.target.value)
}

const handleSearch = () => {
  emit('search')
}

const selectTimeRange = (range) => {
  emit('selectTimeRange', range)
}
</script>

<style scoped>
.form-label {
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 14px;
}

.fw-semibold {
  font-weight: 600 !important;
}

@media (max-width: 768px) {
  .form-label {
    font-size: 12px;
  }
}
</style>