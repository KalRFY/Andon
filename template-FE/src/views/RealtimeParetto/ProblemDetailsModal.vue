<template>
  <CModal :visible="visible" @close="$emit('close')" size="lg">
    <CModalHeader>
      <CModalTitle>Details for {{ problemName }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable responsive hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Last Occurred</CTableHeaderCell>
            <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
            <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(row, index) in problemData" :key="index">
            <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
            <CTableDataCell>{{ formatDateTime(row.fstart_time) }}</CTableDataCell>
            <CTableDataCell>{{ row.metric }}</CTableDataCell>
            <CTableDataCell>{{ row.fdur }} min</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit('close')">Close</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  problemName: { type: String, default: '' },
  problemData: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

watch(() => props.visible, (newVal) => {
  console.log('ProblemDetailsModal visible changed:', newVal, 'problemName:', props.problemName, 'problemData length:', props.problemData.length)
})

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
</style>
