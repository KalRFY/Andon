<template>
  <CCard class="mt-3 mb-5">
    <CCardBody>
      <CRow v-if="loading">
        <CCol class="text-center py-5">
          Loading data...
        </CCol>
      </CRow>

      <template v-else>
        <CRow>
          <CCol>
            <LegendStatus class="mb-4" />
          </CCol>
        </CRow>

        <CRow class="mt-2 mb-4 justify-content-center">
          <CCol sm="auto">
            <CButton :disabled="loading" color="primary" variant="outline" @click="$emit('reset')" class="px-4">
              Download Countermeasure
            </CButton>
          </CCol>
          <CCol sm="auto">
            <CButton :disabled="loading" color="primary" variant="outline" @click="$emit('search')" class="px-4">
              Send Reminder
            </CButton>
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <CRow style="max-height: 750px; overflow-y: auto; overflow-x: auto; display: block;">
              <CTable bordered responsive hover-align="middle" class="text-sm mb-2"
                      style="min-width: 1000px; width: 100%;">
                
                <CTableHead>
                  <CTableRow class="bg-gray-100 text-center">
                    <CTableHeaderCell rowspan="3">No</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Line</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Machine</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Date Problem</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Problem Description</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Duration</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Rootcause</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Countermeasure</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Due Date</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">PIC</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Status</CTableHeaderCell>
                    <CTableHeaderCell colspan="2">CM Category (v)</CTableHeaderCell>
                    <CTableHeaderCell colspan="12">Schedule Countermeasure</CTableHeaderCell>
                    <CTableHeaderCell rowspan="3">Actions</CTableHeaderCell>
                  </CTableRow>

                  <CTableRow class="bg-gray-50 text-center">
                    <CTableHeaderCell rowspan="2">Cause of Occurrence</CTableHeaderCell>
                    <CTableHeaderCell rowspan="2">Cause of Delay</CTableHeaderCell>
                    <CTableHeaderCell colspan="12">2025</CTableHeaderCell>
                  </CTableRow>

                  <CTableRow class="bg-gray-50 text-center">
                    <CTableHeaderCell v-for="month in 12" :key="month">
                      {{ new Date(0, month - 1).toLocaleString('default', { month: 'short' }) }}
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  <CTableRow v-for="(row, idx) in data" :key="idx" class="text-center"
                    :class="{ 'table-danger': row.status === 'NOT YET' }">
                    
                    <CTableDataCell>{{ row.no }}</CTableDataCell>
                    <CTableDataCell>{{ row.line }}</CTableDataCell>
                    <CTableDataCell>{{ row.machine }}</CTableDataCell>
                    <CTableDataCell>{{ row.date }}</CTableDataCell>
                    <CTableDataCell class="text-left">{{ row.problem }}</CTableDataCell>
                    <CTableDataCell>{{ row.duration }}</CTableDataCell>
                    <CTableDataCell class="text-left">{{ row.rootcause || '-' }}</CTableDataCell>
                    <CTableDataCell class="text-left">{{ row.countermeasure || '-' }}</CTableDataCell>
                    <CTableDataCell>{{ row.dueDate || '-' }}</CTableDataCell>
                    <CTableDataCell>{{ row.pic || '-' }}</CTableDataCell>
                    <CTableDataCell>{{ row.status || 'NOT YET' }}</CTableDataCell>

                    <CTableDataCell>
                      <CFormCheck disabled :checked="!!row.reason_occurred" />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormCheck disabled :checked="!!row.reason_delayed" />
                    </CTableDataCell>

                    <CTableDataCell v-for="month in 12" :key="month">
                      <CFormCheck disabled :checked="Array.isArray(row.schedule) && row.schedule.includes(month)" />
                    </CTableDataCell>

                    <CTableDataCell>
                      <CButton v-if="row.status === 'OK'" size="sm" color="success" class="text-xs px-2 py-1">
                        OK
                      </CButton>
                      <CButton v-else size="sm" color="primary" class="text-xs px-2 py-1">
                        Confirmation
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>

                  <CTableRow v-if="!data || data.length === 0">
                    <CTableDataCell colspan="28" class="text-center py-2">
                      No data available.
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CRow>
          </CCol>
        </CRow>
      </template>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { defineProps } from 'vue'
import {
  CCard, CCardBody,
  CRow, CCol,
  CButton,
  CTable, CTableHead, CTableRow, CTableBody,
  CTableDataCell, CTableHeaderCell,
  CFormCheck
} from '@coreui/vue'

import LegendStatus from '@/components/CMFollowup/LegendStatus.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}
</style>
