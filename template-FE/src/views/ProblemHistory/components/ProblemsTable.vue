<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardBody>
          <TableActions
            ref="tableActions"
            @freq="$emit('freq')"
            @ltb="$emit('ltb')"
            @filterCategory="onFilterCategory"
            @download="$emit('download')"
            :problemsData="problems"
          />

          <hr />

          <CRow>
            <CCol class="mb-3">
              <CTable v-if="problems.length" bordered hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col" @click="sortBy('fend_time')" style="cursor: pointer;">
                      Date
                      <span v-if="sortColumn === 'fend_time'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" @click="sortBy('fmc_name')" style="cursor: pointer;">
                      Machine
                      <span v-if="sortColumn === 'fmc_name'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" @click="sortBy('ferror_name')" style="cursor: pointer;">
                      Problem
                      <span v-if="sortColumn === 'ferror_name'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" @click="sortBy('foperator')" style="cursor: pointer;">
                      PIC
                      <span v-if="sortColumn === 'foperator'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" @click="sortBy('fline')" style="cursor: pointer;">
                      Line
                      <span v-if="sortColumn === 'fline'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" @click="sortBy('fdur')" style="cursor: pointer;">
                      Duration
                      <span v-if="sortColumn === 'fdur'">
                        {{ sortDirection === 'asc' ? '↑' : '↓' }}
                      </span>
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    <CTableHeaderCell scope="col">LTB Reports</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Delete</CTableHeaderCell>

                    <!-- <CTableHeaderCell scope="col">Terjadi</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Lama</CTableHeaderCell>
                    <CTableHeaderCell scope="col">CM</CTableHeaderCell>
                    <CTableHeaderCell scope="col">CM Lama</CTableHeaderCell> -->

                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                <CTableRow
                  v-for="(problem, index) in sortedProblems"
                  :key="problem.fid"
                  :color="getRowColor(problem)"
                >
                    <CTableDataCell>{{
                      (currentPage - 1) * pageSize + index + 1
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      formatDate(problem.fend_time)
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      problem.fmc_name || ''
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      problem.ferror_name || ''
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      problem.foperator || ''
                    }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fdur || '' }}</CTableDataCell>
                    <CTableDataCell style="width: 10%;">
                      <CButton
                        class="mb-3"
                        shape="rounded-pill"
                        color="success"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                        "
                        @click="$emit('editProblem', problem)"
                      >
                        Edit Problem
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell style="width: 15%;">
                      <CButton
                        v-if="!problem.file_report && (isLtrProblem(problem) || isSltrProblem(problem))"
                        class="mb-3"
                        shape="rounded-pill"
                        color="primary"
                        style="
                          width: 100%;
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                        "
                      >
                        Belum Upload Report
                      </CButton>
                      <div v-if="problem.file_report && (isLtrProblem(problem) || isSltrProblem(problem))">
                        <CButton
                          class="mb-2"
                          shape="rounded-pill"
                          color="info"
                          style="
                            width: 100%;
                            font-size: x-small;
                            font-weight: bold;
                            color: white;
                          "
                          @click="$emit('downloadLtbReport', problem)"
                        >
                          Download LTB Report
                        </CButton>
                      </div>
                    </CTableDataCell>

                    <CTableDataCell style="width: 5%;">
                      <CButton
                        class="mb-3"
                        shape="rounded-pill"
                        color="danger"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                        "
                        @click="$emit('deleteProblem', problem.fid)"
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>

                    <!-- <CTableDataCell>{{ problem.terjadiAnalysis || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.lamaAnalysis || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fpermanet_cm || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fpermanet_cm_lama || '' }}</CTableDataCell> -->
                    
                  </CTableRow>
                </CTableBody>
              </CTable>

              <template v-else>
                <tr>
                  <td colspan="10" class="text-center py-3 text-muted">
                    No data available for the selected search criteria.
                  </td>
                </tr>
              </template>

              <LoadingState v-if="loading" />

              <PaginationControls
                :currentPage="currentPage"
                :totalPages="totalPages"
                :visiblePages="visiblePages"
                @goToPage="$emit('goToPage', $event)"
              />
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
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
} from '@coreui/vue'
import TableActions from './TableActions.vue'
import LoadingState from './LoadingState.vue'
import PaginationControls from './PaginationControls.vue'

export default {
  name: 'ProblemsTable',
  components: {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableBody,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CButton,
    TableActions,
    LoadingState,
    PaginationControls,
  },

  data() {
    return {
      sortColumn: null,
      sortDirection: 'asc',
    }
  },

  props: {
    problems: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 50,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    visiblePages: {
      type: Array,
      default: () => [],
    },
  },

  emits: [
    'editProblem',
    'deleteProblem',
    'viewLtbReport',
    'downloadLtbReport',
    'goToPage',
    'freq',
    'ltb',
    'download',
    'repeat',
    'ltr',
    'filterCategory',
    'filteredCategory',
    'sort',
  ],

  computed: {
    sortedProblems() {
      // Since sorting is now handled by the backend, just return the problems as-is
      return this.problems
    },
  },

  methods: {
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortDirection = 'asc'
      }
      this.$emit('sort', { column: this.sortColumn, direction: this.sortDirection })
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    onFilterCategory(category) {
      console.log(`ProblemsTable emitted filterCategory with category: ${category}`)
      this.$emit('filterCategory', category)
    },
    onFilterCategoryWhycm(filtered) {
      this.$emit('filteredCategory', filtered)
    },
    getRowColor(problem) {
      // Check if problem duration is less than 30 minutes - no color for short problems
      const duration = parseInt(problem.fdur) || 0
      if (duration <= 29) {
        return ''
      }

      const analysisArray = Array.isArray(problem.terjadiAnalysis) ? problem.terjadiAnalysis : []
      const hasTerjadi = analysisArray.some(item => item.id_problem === problem.fid)
      const analysisArrayLama = Array.isArray(problem.lamaAnalysis) ? problem.lamaAnalysis : []
      const hasLama = analysisArrayLama.some(item => item.id_problem === problem.fid)
      if (!hasTerjadi && !hasLama) {
        console.log('Row color: danger (Five Why missing)')
        return 'danger'
      }

      // Check if any analysis item has empty fpermanet_cm
      // const hasEmptyPermanentCm = analysisArray.some(item => {
      //   const cm = item.fpermanet_cm
      //   // const cmLama = item.fpermanet_cm_lama
      //   const isCmEmpty = !cm || (Array.isArray(cm) && cm.length === 0)
      //   // const isCmLamaEmpty = !cmLama || (Array.isArray(cmLama) && cmLama.length === 0)
      //   return isCmEmpty
      // })
      if (
        (problem.fpermanet_cm != '[]' && problem.fpermanet_cm.length !== 0) || 
        (problem.fpermanet_cm_lama != '[]' && problem.fpermanet_cm_lama.length !== 0)) {
        return ''
      }
      return 'warning'
    },

    isLtrProblem(problem) {
      const duration = parseInt(problem.fdur) || 0
      const lineId = parseInt(problem.line_id) || 0
      
      // LTR criteria based on the SQL query
      return (
        (problem.problemCategory == 3) || ((duration >= 120 && duration < 659) && (lineId === 1 || lineId === 2)) ||
        ((duration >= 120 && duration < 359) && [3, 4, 5, 6].includes(lineId)) ||
        (duration >= 15 && duration < 179 && lineId === 7)
      )
    },

    isSltrProblem(problem) {
      const duration = parseInt(problem.fdur) || 0
      const lineId = parseInt(problem.line_id) || 0
      
      // SLTR criteria (opposite of LTR)
      return (
        (problem.problemCategory == 4) || (duration >= 659 && (lineId === 1 || lineId === 2)) ||
        (duration >= 359 && [3, 4, 5, 6].includes(lineId)) ||
        (duration >= 179 && lineId === 7)
      )
    },
  },

}
</script>

<style scoped>
@media (max-width: 360px) {
  .btn {
    border-radius: 0.375rem !important;
  }
}
</style>
