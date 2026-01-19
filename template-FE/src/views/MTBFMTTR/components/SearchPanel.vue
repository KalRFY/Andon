<template>
  <CCard class="mb-4 search-card">
    <CCardBody>
      <CRow class="mb-3">
        <CCol :md="4" class="mb-3 mb-md-0">
          <CFormLabel for="start-date">Start Date</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <Clock size="16" />
            </CInputGroupText>
            <CFormInput
              type="date"
              id="start-date"
              :value="startDate"
              @input="$emit('update:startDate', $event.target.value)"
            />
          </CInputGroup>
        </CCol>

        <CCol :md="4">
          <CFormLabel for="end-date">End Date</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <Clock size="16" />
            </CInputGroupText>
            <CFormInput
              type="date"
              id="end-date"
              :value="endDate"
              @input="$emit('update:endDate', $event.target.value)"
            />
          </CInputGroup>
        </CCol>

        <CCol :md="4" class="d-flex align-items-end">
          <CButton
            color="primary"
            class="w-100 d-flex align-items-center justify-content-center"
            @click="$emit('search')"
          >
            <SearchIcon class="me-2" size="16" /> Search
          </CButton>
        </CCol>
      </CRow>

      <CRow class="mt-3">
        <CCol>
          <div class="quick-filter-section">
            <div class="quick-filter-title mb-2">Quick Filters</div>
            <div class="d-flex flex-wrap gap-2">
              <CBadge
                color="info"
                class="quick-filter-badge"
                @click="$emit('selectTimeRange', 'today')"
                >Today</CBadge
              >
              <CBadge
                color="info"
                class="quick-filter-badge"
                @click="$emit('selectTimeRange', 'lastWeek')"
                >Last Week</CBadge
              >
              <CBadge
                color="info"
                class="quick-filter-badge"
                @click="$emit('selectTimeRange', 'lastMonth')"
                >Last Month</CBadge
              >
              <CBadge
                color="info"
                class="quick-filter-badge"
                @click="$emit('selectTimeRange', 'lastQuarter')"
                >Last Quarter</CBadge
              >
              <CBadge
                color="info"
                class="quick-filter-badge"
                @click="$emit('selectTimeRange', 'thisYear')"
                >This Year</CBadge
              >
              <CBadge
                color="info"
                class="quick-filter-badge"
                @click="$emit('selectTimeRange', 'lastYear')"
                >Last Year</CBadge
              >
            </div>
          </div>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CFormLabel,
  CButton,
} from '@coreui/vue'
import { Clock, Search as SearchIcon } from 'lucide-vue-next'

export default {
  name: 'SearchPanel',
  components: {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CBadge,
    CFormLabel,
    CButton,
    Clock,
    SearchIcon,
  },
  props: {
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  emits: ['update:startDate', 'update:endDate', 'search', 'selectTimeRange'],
}
</script>

<style scoped>
.search-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

.quick-filter-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.quick-filter-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.quick-filter-badge {
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.quick-filter-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .quick-filter-section .d-flex {
    flex-wrap: wrap;
    gap: 8px;
  }

  .quick-filter-badge {
    margin-bottom: 5px;
  }
}
</style>
