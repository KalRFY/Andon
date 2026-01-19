<template>
  <CCard class="mt-3 mb-3 custom-card">
    <CCardBody>
      <CRow>
        <CCol lg="3" class="mb-3">
          <CFormLabel for="startDate">Start</CFormLabel>
          <CInputGroup>
            <CInputGroupText id="basic-addon1">
              <Clock size="16" />
            </CInputGroupText>
            <CFormInput 
              id="startDate" 
              type="date" 
              :model-value="filterStartDate"
              @update:model-value="$emit('update:filterStartDate', $event)" 
            />
          </CInputGroup>
        </CCol>

        <CCol lg="3" class="mb-3">
          <CFormLabel for="finishDate">Finish</CFormLabel>
          <CInputGroup>
            <CInputGroupText id="basic-addon2">
              <Clock size="16" />
            </CInputGroupText>
            <CFormInput 
              id="finishDate" 
              type="date" 
              :model-value="filterFinishDate"
              @update:model-value="$emit('update:filterFinishDate', $event)" 
            />
          </CInputGroup>
        </CCol>

        <CCol class="mb-3" lg="3">
          <CFormLabel for="lineSelect">Line</CFormLabel>
            <Treeselect
              id="lineSelect"
              :model-value="selectedLine"
              @update:model-value="$emit('update:selectedLine', $event)"
              :options="lineOptions"
              :multiple="false"
              :searchable="true"
              :clearable="true"
              :disabled="!lineOptions.length"
              placeholder="Select line"
            />
        </CCol>

        <CCol class="mb-3" lg="3">
          <CFormLabel for="selectedMachineName">Machine Name</CFormLabel>
            <Treeselect
              id="selectedMachineName"
              :model-value="selectedMachineName"
              @update:model-value="$emit('update:selectedMachineName', $event)"
              :options="machineOptions"
              :multiple="false"
              :searchable="true"
              :clearable="true"
              :disabled="!machineOptions.length"
              placeholder="Select machine"
            />
        </CCol>
      </CRow>

      <CRow class="mb-3 mb-4 g-1 align-items-end">
        <CCol md="10" class="px-1">
          <CFormLabel for="keyword">Search</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <Search size="16" />
            </CInputGroupText>
            <CFormInput
              id="keyword"
              placeholder="Search machine, problem, countermeasure, or PIC"
              :model-value="searchKeyword"
              @update:model-value="$emit('update:searchKeyword', $event)"
            />
          </CInputGroup>
        </CCol>

        <CCol lg="1" class="px-1">
          <CFormLabel>Category</CFormLabel>
          <CFormSelect :model-value="selectedCategory" @update:model-value="$emit('update:selectedCategory', $event)">
            <option value="">All</option>
            <option value="Taskforce">TASKFORCE</option>
            <option value="Thema">Focus Thema Member</option>
          </CFormSelect>
        </CCol>

        <CCol lg="1" class="px-1">
          <CFormLabel>Shift</CFormLabel>
          <CFormSelect :model-value="selectedShift" @update:model-value="$emit('update:selectedShift', $event)">
            <option value="">All</option>
            <option value="Red">Red Shift</option>
            <option value="White">White Shift</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <hr />

      <CRow class="mt-4 mb-3">
        <CCol sm="2" class="mb-3">
          <CButton 
            :disabled="loading" 
            style="width: 100%" 
            color="dark" 
            variant="outline" 
            @click="$emit('reset')"
          >
            Reset
          </CButton>
        </CCol>
        <CCol sm="10" class="mb-3">
          <CButton 
            :disabled="loading" 
            style="width: 100%" 
            color="primary" 
            @click="$emit('search')"
          >
            Search
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/vue'
import { Clock, Search } from 'lucide-vue-next'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default {
  name: 'SearchFilters',
  components: {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CFormSelect,
    CButton,
    Clock,
    Search,
    Treeselect,
  },

  props: {
    filterStartDate: String,
    filterFinishDate: String,
    selectedLine: [String, Number],
    selectedMachineName: [String, Number],
    searchKeyword: String,
    selectedCategory: String,
    selectedShift: String,
    lineOptions: { type: Array, default: () => [] },
    machineOptions: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },

  emits: [
    'update:filterStartDate',
    'update:filterFinishDate',
    'update:selectedLine',
    'update:selectedMachineName',
    'update:searchKeyword',
    'update:selectedCategory',
    'update:selectedShift',
    'search',
    'reset',
  ],
}
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}
</style>
