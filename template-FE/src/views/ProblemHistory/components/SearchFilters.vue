<!-- SearchFilters.vue -->
<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardHeader style="font-weight: bold; font-size: medium;">Search</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="3" class="mb-3">
              <CFormLabel for="startDate" style="font-weight: bold;">Start</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1">
                  <Clock size="16" />
                </CInputGroupText>
                <CFormInput
                  id="startDate"
                  type="date"
                  :model-value="filterStartDate"
                  @update:model-value="$emit('update:filterStartDate', $event)"
                  aria-label="Start Date"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
            </CCol>

            <CCol md="3" class="mb-3">
              <CFormLabel for="finishDate" style="font-weight: bold;">Finish</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon2">
                  <Clock size="16" />
                </CInputGroupText>
                <CFormInput
                  id="finishDate"
                  type="date"
                  :model-value="filterFinishDate"
                  @update:model-value="$emit('update:filterFinishDate', $event)"
                  aria-label="Finish Date"
                  aria-describedby="basic-addon2"
                />
              </CInputGroup>
            </CCol>

            <CCol md="3" class="mb-3">
              <CCol class="md-6">
              <label for="lineSelect" class="form-label" style="font-weight: bold;">Line</label>
              <Treeselect
                id="lineSelect"
                :model-value="selectedLine"
                @update:model-value="handleLineUpdate"
                :multiple="false"
                :flat="true"
                :options="lineOptions"
                :searchable="true"
                :clearable="true"
                placeholder="Select or input line"
                @input="$emit('machineInput')"
                :value-consists-of="['id']"
                :value-key="'id'"
                :label-key="'label'"
              />
              </CCol>
            </CCol>

            <CCol md="3" class="mb-3">
              <label for="selectedMachineName" class="form-label" style="font-weight: bold;">Machine Name</label>
              <Treeselect
                id="selectedMachineName"
                :model-value="selectedMachineName"
                @update:model-value="handleMachineUpdate"
                :options="machineOptions"
                :searchable="true"
                :clearable="true"
                :children="false"
                placeholder="Select or input machine"
                @input="$emit('machineInput')"
                :value-consists-of="['id']"
                :value-key="'id'"
                :label-key="'label'"
              />
            </CCol>
          </CRow>

          <CRow class="mb-3">
            <CFormLabel for="basic-url" style="font-weight: bold;">Problem</CFormLabel>
            <CInputGroup>
              <CInputGroupText id="basic-addon3">Problem</CInputGroupText>
              <CFormInput
                feedbackInvalid="Please input problem"
                id="problem"
                placeholder="Problem"
                :model-value="selectedProblem"
                @update:model-value="$emit('update:selectedProblem', $event)"
                aria-label="Problem"
                aria-describedby="basic-addon3"
              />
            </CInputGroup>
          </CRow>

          <hr />

          <CRow>
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

          <CRow v-if="loading" class="mb-3">
            <CCol class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from '@coreui/vue'
import { Clock } from 'lucide-vue-next'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default {
  name: 'SearchFilters',
  components: {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CButton,
    Clock,
    Treeselect,
  },

  props: {
    filterStartDate: {
      type: String,
      default: '',
    },
    filterFinishDate: {
      type: String,
      default: '',
    },
    selectedLine: {
      type: [String, Number],
      default: null,
    },
    selectedMachineName: {
      type: [String, Number],
      default: null,
    },
    selectedProblem: {
      type: String,
      default: '',
    },
    lineOptions: {
      type: Array,
      default: () => [],
    },
    machineOptions: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    'update:filterStartDate',
    'update:filterFinishDate',
    'update:selectedLine',
    'update:selectedMachineName',
    'update:selectedProblem',
    'search',
    'reset',
    'machineInput',
  ],

  methods: {
    handleLineUpdate(value) {
      console.log('[Treeselect Debug] Line updated:', value)
      this.$emit('update:selectedLine', value)
    },

    handleMachineUpdate(value) {
      console.log('[Treeselect Debug] Machine updated:', value)
      this.$emit('update:selectedMachineName', value)
    },
  },
}
</script>
