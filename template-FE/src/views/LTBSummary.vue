<template>
  <CRow>
    <CCol>
      <h3>LTB Report Status</h3>
      <p>Problem (≥ 120 min, ASSY LINE ≥ 15 min)</p>
    </CCol>
  </CRow>

  <CCard class="mb-3 custom-card">
    <CCardBody class="d-flex justify-content-between align-items-center custom-card p-2">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink :active="currentTab === 0" @click="selectTab(0)">
            Table Summary
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink :active="currentTab === 1" @click="selectTab(1)">
            Graph Summary
          </CNavLink>
        </CNavItem>
      </CNav>
      <CFormSelect v-if="showYearSelect" v-model="selectedYear" class="w-auto">
        <option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </CFormSelect>
    </CCardBody>
  </CCard>

  <CCard class="mb-3 custom-card">
    <CCardBody>
      <CRow v-show="currentTab === 0">
        <CCol>
          <LegendStatus class="mb-4" />

          <CRow class="mb-3">
            <CCol lg="8">
              <CInputGroup>
                <CInputGroupText id="search-icon">
                  <Search size="16" />
                </CInputGroupText>
                <CFormInput v-model="searchKeyword" placeholder="Search machine or problem" />
              </CInputGroup>
            </CCol>
            <CCol lg="2">
              <treeselect
                v-model="selectedLine"
                :options="lineOptions"
                placeholder="Select Line"
                style="width: 100%;"
                :searchable="true"
                :clearable="true"
              />
            </CCol>
            <CCol lg="2">
              <CFormSelect v-model="selectedType" style="width: 100%;">
                <option value="">All</option>
                <option value="LTR">LTR</option>
                <option value="SLTR">SLTR</option>
              </CFormSelect>
            </CCol>
            <CCol lg="12" class="mt-3">
              <CButton v-if="monthlyDetails.length > 0" color="secondary" @click="clearMonthlyFilter" size="sm" style="color: white; width: 100%;">
                Clear Filter
              </CButton>
            </CCol>
          </CRow>

          <CCol class="tableFixHead">
            <CTable bordered hover class="text-center w-100">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-1">Date</CTableHeaderCell>
                  <CTableHeaderCell>Line</CTableHeaderCell>
                  <CTableHeaderCell>Machine</CTableHeaderCell>
                  <CTableHeaderCell>Problem Description</CTableHeaderCell>
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                  <CTableHeaderCell>TL Check</CTableHeaderCell>
                  <CTableHeaderCell>GL Check</CTableHeaderCell>
                  <CTableHeaderCell>SH Check</CTableHeaderCell>
                  <CTableHeaderCell>Mgr Check</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item, index) in (monthlyDetails.length > 0 ? monthlyDetails : filteredProblems)" :key="item.fid || index">
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell>{{ formatDate(item.fstart_time) }}</CTableDataCell>
                  <CTableDataCell>{{ item.fline }}</CTableDataCell>
                  <CTableDataCell>{{ item.fmc_name }}</CTableDataCell>
                  <CTableDataCell class="text-left" @click="openEditModal(item)" style="cursor: pointer; color: #007bff; text-decoration: underline;">{{ item.ferror_name }}</CTableDataCell>
                  <CTableDataCell>{{ item.fdur }} min</CTableDataCell>
                  <CTableDataCell><span :class="['indicator', item.tlCheck]" /></CTableDataCell>
                  <CTableDataCell><span :class="['indicator', item.lhCheck]" /></CTableDataCell>
                  <CTableDataCell><span :class="['indicator', item.shCheck]" /></CTableDataCell>
                  <CTableDataCell><span :class="['indicator', item.dhCheck]" /></CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>

          <CRow v-if="isLoading" class="text-center mt-3">
            <CCol>
              <CSpinner /> Loading...
            </CCol>
          </CRow>
        </CCol>
      </CRow>

      <CRow v-show="currentTab === 1">
        <CCol>
          <div style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2); background-color: transparent;">
            <CCardBody>
              <CRow class="mb-3">
                <CCol>
                  <CCardTitle style="font-size: medium; height: 35px; color: black;">LTB Summary Chart</CCardTitle>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <ApexCharts
                    :key="selectedYear + '_chart'"
                    :options="chartOptions"
                    :series="chartSeries"
                    type="bar"
                    height="350"
                  />
                </CCol>
              </CRow>

              <!-- Monthly Details Table -->
              <CRow class="mt-4">
                <CCol>
                  <CCard>
                    <CCardHeader>
                      <strong>{{ selectedMonthName ? `Details for ${selectedMonthName} ${selectedYear}` : 'Monthly Details' }}</strong>
                      <CButton v-if="selectedMonthName" color="secondary" size="sm" @click="clearMonthlyFilter" class="float-end">
                        Clear
                      </CButton>
                    </CCardHeader>
                    <CCardBody>
                      <div v-if="monthlyDetails.length > 0">
                        <CTable bordered hover responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>No</CTableHeaderCell>
                              <CTableHeaderCell>Date</CTableHeaderCell>
                              <CTableHeaderCell>Machine</CTableHeaderCell>
                              <CTableHeaderCell>Problem Description</CTableHeaderCell>
                              <CTableHeaderCell>Duration</CTableHeaderCell>
                              <CTableHeaderCell>TL Check</CTableHeaderCell>
                              <CTableHeaderCell>GL Check</CTableHeaderCell>
                              <CTableHeaderCell>SH Check</CTableHeaderCell>
                              <CTableHeaderCell>Mgr Check</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            <CTableRow v-for="(item, index) in monthlyDetails" :key="item.fid || index">
                              <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                              <CTableDataCell>{{ formatDate(item.fstart_time) }}</CTableDataCell>
                              <CTableDataCell>{{ item.fmc_name }}</CTableDataCell>
                              <CTableDataCell class="text-left" @click="openEditModal(item)" style="cursor: pointer; color: #007bff; text-decoration: underline;">{{ item.ferror_name }}</CTableDataCell>
                              <CTableDataCell>{{ item.fdur }} min</CTableDataCell>
                              <CTableDataCell><span :class="['indicator', item.tlCheck]" /></CTableDataCell>
                              <CTableDataCell><span :class="['indicator', item.lhCheck]" /></CTableDataCell>
                              <CTableDataCell><span :class="['indicator', item.shCheck]" /></CTableDataCell>
                              <CTableDataCell><span :class="['indicator', item.dhCheck]" /></CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </div>
                      <div v-else class="text-center">
                        {{ selectedMonthName ? 'No data available for this month.' : 'Click on a bar in the chart to view monthly details.' }}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </div>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
  <EditProblemModal
    :visible="visibleEditModal"
    :submitData="editSubmit"
    :machineOptions="machineOptions"
    :lineOptions="lineOptions"
    :modalLoading="editModalLoading"
    @close="visibleEditModal = false"
    @submit="saveEditSubmit"
  />
</template>

<script>
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell
} from '@coreui/vue'
import { Search } from 'lucide-vue-next'
import LegendStatus from '@/components/LTBSummary/LegendStatus.vue'
import api from '@/apis/CommonAPI'
import ApexCharts from 'vue3-apexcharts'
import EditProblemModal from './ProblemHistory/EditProblemModal.vue'
import { ref } from 'vue'
import Treeselect from 'vue3-treeselect'

import 'vue3-treeselect/dist/vue3-treeselect.css'

const LINE_MAP = {
  hpdc: 'casting',
  cnc: 'machining',
  assy: 'assy'
}

export default {
  name: 'LTBSummary',
  components: {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CNav,
    CNavItem,
    CNavLink,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CSpinner,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    LegendStatus,
    ApexCharts,
    Search,
    EditProblemModal,
    Treeselect,
  },
  data() {
    return {
      problems: [],
      searchKeyword: '',
      selectedType: '',
      selectedLine: null,
      isLoading: false,
      currentTab: 0,
      selectedYear: null,
      showMonthlyModal: false,
      monthlyDetails: [],
      selectedMonthName: '',
      graphData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: true
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const monthIndex = config.dataPointIndex;
              this.showMonthlyDetails(monthIndex);
            }
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Month'
          }
        },
        yaxis: {
          title: {
            text: 'LTB Total'
          },
          min: 0
        },
        fill: {
          opacity: 1
        },
        colors: ['#007bff'],
        title: {
          align: 'left',
          style: {
            fontSize: '16px',
            color: '#666'
          }
        }
      },
      chartSeries: [{
        name: 'LTB Total',
        data: []
      }],
      visibleEditModal: false,
      editModalLoading: false,
      editSubmit: {},
      machines: [],
      machineOptions: [],
      lines: [],
      lineOptions: [],
      memberOption: [],
    }
  },
  computed: {
    filteredProblems() {
      let list = this.problems

      if (this.selectedLine) {
        const selectedLineObj = this.lineOptions.find(l => l.id === this.selectedLine);
        if (selectedLineObj) {
          list = list.filter(item => item.fline === selectedLineObj.label);
        }
      }

      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase().trim()
        list = list.filter(item => {
          const machineName = (item.fmc_name || '').toLowerCase()
          const problemName = (item.ferror_name || '').toLowerCase()
          return machineName.includes(keyword) || problemName.includes(keyword)
        })
      }
      // Note: Filtering for selectedType might require more info on data structure
      if (this.selectedType) {
        // This is a placeholder logic. We need to know how to identify LTR/SLTR problems.
        // Assuming a property like 'item.type' or similar.
        // The 'fetchFilteredData' method suggests this might be a server-side filter.
      }
      return list
    },
    yearOptions() {
      const years = this.problems.map(item => new Date(item.fstart_time).getFullYear())
      const uniqueYears = Array.from(new Set(years))
      uniqueYears.sort((a, b) => b - a)
      return uniqueYears
    },
    showYearSelect() {
      return this.currentTab === 1 && this.yearOptions.length > 0
    },
    yearlyGraphData() {
      if (!this.selectedYear) {
        return this.graphData
      }
      const monthlyCounts = {}
      this.problems.forEach(item => {
        const date = new Date(item.fstart_time)
        const year = date.getFullYear()
        const month = date.getMonth()
        if (year === Number(this.selectedYear)) {
          if (!monthlyCounts[month]) {
            monthlyCounts[month] = 0
          }
          monthlyCounts[month] += 1
        }
      })
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyData = monthLabels.map((_, index) => monthlyCounts[index] || 0)

      return {
        labels: monthLabels,
        datasets: [{ label: 'LTB Total in ' + this.selectedYear, backgroundColor: '#007bff', data: monthlyData }]
      }
    }
  },
  methods: {
    selectTab(tabIndex) {
      this.currentTab = tabIndex
    },
    formatDate(dateTime) {
      const date = new Date(dateTime)
      if (isNaN(date)) return dateTime
      // Format to show only year, month, day
      return date.toLocaleDateString('en-CA') // Format: YYYY-MM-DD
    },
    getClass(approveState, feedback) {
      if (approveState === 1) {
        return 'approved'
      } else if (feedback) {
        return 'commented'
      } else {
        return 'delayed'
      }
    },
    getTlIndicator(fpermanet_cm, fpermanet_cm_lama) {
      const isNonEmpty = (value) => {
        if (Array.isArray(value)) {
          return value.length > 0
        } else if (typeof value === 'string') {
          const trimmed = value.trim()
          if (trimmed === '' || trimmed === '[]') {
            return false
          }
          return true
        }
        return false
      }
      if (isNonEmpty(fpermanet_cm) || isNonEmpty(fpermanet_cm_lama)) {
        return 'approved'
      } else {
        return 'delayed'
      }
    },
    prepareProblems(raw) {
      return raw.map(item => {
        const processedItem = {
          ...item,
          tlCheck: this.getTlIndicator(item.fpermanet_cm, item.fpermanet_cm_lama),
          lhCheck: this.getClass(Number(item.cmLhApprove), item.cmLhFeedback),
          shCheck: this.getClass(Number(item.cmShApprove), item.cmShFeedback),
          dhCheck: this.getClass(Number(item.cmDhApprove), item.cmDhFeedback)
        }
        return processedItem
      })
    },
    prepareGraphData(list) {
      const counts = {}
      list.forEach(item => {
        const date = new Date(item.fstart_time)
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
        if (!counts[key]) {
          counts[key] = 0
        }
        counts[key] += 1
      })
      const sortedKeys = Object.keys(counts).sort()
      return { labels: sortedKeys, datasets: [{ label: 'Total LTB', backgroundColor: '#007bff', data: sortedKeys.map(key => counts[key]) }] }
    },
    async fetchData() {
      this.isLoading = true
      try {
        const response = await api.get('/summary/ltb-summary')
        if (response.status !== 200) {
          throw new Error('Failed to fetch LTB summary, status: ' + response.status)
        }
        let raw = response.data.data.delayProblems
        raw = Array.isArray(raw[0]) ? raw[0] : raw
        console.log('▶️ RAW SAMPLE:', raw[0])
        console.log('📋 Total problems loaded:', raw.length)
        console.log('📅 Available years:', this.yearOptions)

        this.problems = this.prepareProblems(raw)
        this.graphData = this.prepareGraphData(this.problems)

        console.log('✅ Problems processed:', this.problems.length)
        console.log('📊 Graph data prepared:', this.graphData)

        if (this.yearOptions.length > 0) {
          this.selectedYear = this.yearOptions[0]
          console.log('🎯 Selected year set to:', this.selectedYear)
        }
        // Initialize chart series with empty data
        this.updateChartSeries()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchFilteredData(type) {
      this.isLoading = true
      try {
        const response = await api.get(`/summary/ltr-sltr-summary?type=${type}`)
        if (response.status !== 200) {
          throw new Error('Failed to fetch filtered LTB summary, status: ' + response.status)
        }
        let raw = response.data.data.delayProblems
        raw = Array.isArray(raw[0]) ? raw[0] : raw
        console.log(`▶️ RAW SAMPLE for ${type}:`, raw[0])
        console.log(`📋 Total ${type} problems loaded:`, raw.length)

        this.problems = this.prepareProblems(raw)
        this.graphData = this.prepareGraphData(this.problems)

        console.log(`✅ ${type} Problems processed:`, this.problems.length)
        console.log('📊 Graph data prepared:', this.graphData)

        if (this.yearOptions.length > 0) {
          this.selectedYear = this.yearOptions[0]
          console.log('🎯 Selected year set to:', this.selectedYear)
        }
        // Initialize chart series with empty data
        this.updateChartSeries()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    updateChartSeries() {
      if (!this.selectedYear) {
        this.chartSeries[0].data = new Array(12).fill(0)
        return
      }

      const monthlyCounts = {}
      this.problems.forEach(item => {
        const date = new Date(item.fstart_time)
        const year = date.getFullYear()
        const month = date.getMonth()
        if (year === Number(this.selectedYear)) {
          if (!monthlyCounts[month]) {
            monthlyCounts[month] = 0
          }
          monthlyCounts[month] += 1
        }
      })

      const monthlyData = Array.from({ length: 12 }, (_, index) => monthlyCounts[index] || 0)
      this.chartSeries[0].data = monthlyData

      console.log('📊 Chart series updated:', {
        selectedYear: this.selectedYear,
        monthlyData: monthlyData,
        chartSeries: this.chartSeries[0].data
      })
    },
    showMonthlyDetails(monthIndex) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.selectedMonthName = monthNames[monthIndex];
      const year = this.selectedYear;

      // Filter problems for the selected month and year
      this.monthlyDetails = this.problems.filter(item => {
        const date = new Date(item.fstart_time);
        return date.getFullYear() === Number(year) && date.getMonth() === monthIndex;
      });

      console.log(`Showing details for ${this.selectedMonthName} ${year}:`, this.monthlyDetails.length, 'problems');
    },
    clearMonthlyFilter() {
      this.monthlyDetails = [];
      this.selectedMonthName = '';
    },
    async openEditModal(problem) {
      try {
        this.editModalLoading = true
        const response = await api.get(`/smartandon/problemId/${problem.fid}`)
        if (response.status !== 200) {
          throw new Error('Failed to fetch problem, status: ' + response.status)
        }
        const problemData = response.data
        console.log('Problem data:', problemData)
        this.editSubmit = this.mapProblemDataToSubmit(problemData)
        console.log('Edit submit data sent to EditProblemModal:', JSON.stringify(this.editSubmit, null, 2))

        this.visibleEditModal = true
      } catch (error) {
        alert('Failed to load problem data: ' + error.message)
        console.error(error)
      } finally {
        this.editModalLoading = false
      }
    },

    mapProblemDataToSubmit(problemData) {
      const formatDateToISO = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      const terjadiRaw = problemData?.analysis?.TERJADI
      const lamaRaw = problemData?.analysis?.LAMA

      return {
        machineName: problemData?.fmc_name || '',
        line: problemData?.fline || '',
        fidProblem: problemData?.fid || '',
        maker: problemData?.fmaker || '',
        operationNo: problemData?.foperation_no || '',
        problems: problemData?.ferror_name || '',
        uraianKejadian: problemData?.descResult?.general || '',
        uploadImage: problemData?.uraianResult?.general || '',
        ilustrasiStandart: problemData?.descResult?.standard || '',
        standartImage: problemData?.uraianResult?.standard || '',
        ilustrasiActual: problemData?.descResult?.actual || '',
        actualImage: problemData?.uraianResult?.actual || '',
        gapBetweenStandarAndActual: problemData?.gapIlustrasi || '',
        pilihFocusThemaMember: problemData?.pilihFocusThemaMember || '',
        pilihTaskforce: problemData?.pilihTaskforce || '',
        operator: problemData?.foperator ? problemData.foperator.split(/,|&/) : [],
        avCategory: problemData?.fav_categoty || '',
        shift: problemData?.fshift || '',
        startDate: formatDateToISO(problemData?.fstart_time) || '',
        finishDate: formatDateToISO(problemData?.fend_time) || '',
        durationMin: problemData?.fdur || '',
        problemCategory: problemData?.problemCategory || '',
        itemTemporaryAction: problemData?.temporaryAction || '',
        rootcauses5Why: problemData?.freal_prob || '',
        tambahAnalysisTerjadi: (() => {
          if (Array.isArray(terjadiRaw)) return terjadiRaw
          if (typeof terjadiRaw === 'string') {
            try { const v = JSON.parse(terjadiRaw); return Array.isArray(v) ? v : [] } catch { return [] }
          }
          return []
        })(),
        tambahAnalisisLama: (() => {
          if (Array.isArray(lamaRaw)) return lamaRaw
          if (typeof lamaRaw === 'string') {
            try { const v = JSON.parse(lamaRaw); return Array.isArray(v) ? v : [] } catch { return [] }
          }
          return []
        })(),
        whyImage: problemData?.why1_img || '',
        pilihO6: problemData?.oCategory || '',
        stepRepair: problemData?.fstep_repair || '',
        stepRepairNew: problemData?.fstep_new || '',
        partChange: problemData?.fpart_change || '',
        countermeasureKenapaTerjadi: problemData?.fpermanet_cm || '',
        yokoten: problemData?.fyokoten || '',
        rootcause5WhyKenapaLama: problemData?.rootcause5WhyKenapaLama || '',
        pilihQ6: problemData?.qCategory || '',
        pilihPM6: problemData.pmCategory || '',
        whyLamaImage: problemData?.why2_img || '',
        countermeasureKenapaLama: problemData?.fpermanet_cm_lama || '',
        attachmentMeeting: problemData?.attachmentMeeting || '',
        comments5WhySH: problemData?.comments5WhySH || '',
        comments5WhyLH: problemData?.comments5WhyLH || '',
        commentsCountermeasure: problemData?.commentsCountermeasure || '',
        file_report: problemData?.file_report || '',
        uploadFile: problemData?.uploadFile || '',
        agreeTerms: false,
        fiveWhyLhApprove: problemData?.fiveWhyLhApprove || 0,
        fiveWhyShApprove: problemData?.fiveWhyShApprove || 0,
        fiveWhyLhFeedback: problemData?.fiveWhyLhFeedback,
        fiveWhyShFeedback: problemData?.fiveWhyShFeedback,
        cmLhApprove: problemData?.cmLhApprove || 0,
        cmShApprove: problemData?.cmShApprove || 0,
        cmTlApprove: problemData?.cmTlApprove || 0,
        cmDhApprove: problemData?.cmDhApprove || 0,
        cmLhFeedback: problemData?.cmLhFeedback,
        cmShFeedback: problemData?.cmShFeedback,
        cmTlFeedback: problemData?.cmTlFeedback,
        cmDhFeedback: problemData?.cmDhFeedback,
        fiveWhyTlApprove: problemData?.fiveWhyTlApprove || 0,
        sparepart_list: JSON.stringify(problemData?.sparepart_list ?? []),
      }
    },

    async saveEditSubmit(submitData) {
      console.log('Saving edit submit data: ', submitData)
      if (!submitData.machineName) {
        alert('Please input machine name')
        return
      }
      if (!submitData.line) {
        alert('Please input line')
        return
      }
      if (!submitData.problems) {
        alert('Please input problems')
        return
      }
      if (!submitData.agreeTerms) {
        alert('You must agree to terms and conditions before submitting')
        return
      }

      let machineId = submitData.machineName;
      let lineId = submitData.line;

      if (typeof machineId === 'string') {
        const machineObj = this.machineOptions.find(m => m.label === machineId);
        if (machineObj) machineId = machineObj.id;
      }
      if (typeof lineId === 'string') {
        const lineObj = this.lineOptions.find(l => l.label === lineId);
        if (lineObj) lineId = lineObj.id;
      }

      let operatorNames = Array.isArray(submitData.operator)
        ? submitData.operator.map(op => {
            if (typeof op === 'string') {
              return op;
            }
            const memberObj = this.memberOption.find(m => m.id === op);
            return memberObj ? memberObj.label : op;
          })
        : [];

      try {
        const payload = {
          machineName: submitData.machineName,
          lineName: submitData.line,
          problemDescription: submitData.problems,
          operator: operatorNames.join(','),
          fid: submitData.fidProblem,
          maker: submitData.maker,
          operationNo: submitData.operationNo,
          avCategory: submitData.avCategory,
          shift: submitData.shift,
          startDate: submitData.startDate,
          finishDate: submitData.finishDate,
          durationMin: submitData.durationMin,
          problemCategory: submitData.problemCategory,
          itemTemporaryAction: submitData.itemTemporaryAction,
          rootcauses5Why: submitData.rootcauses5Why,
          stepRepair: JSON.stringify(submitData.stepRepair),
          stepRepairNew: JSON.stringify(submitData.stepRepairNew),
          partChange: submitData.partChange,
          countermeasureKenapaTerjadi: JSON.stringify(submitData.cmKenapaTerjadi),
          countermeasureKenapaLama: JSON.stringify(submitData.cmKenapaLama),
          yokoten: JSON.stringify(submitData.yokoten),
          rootcause5WhyKenapaLama: submitData.rootcause5WhyKenapaLama,
          tambahAnalisisLama: JSON.stringify(submitData.tambahAnalisisLama || []),
          tambahAnalysisTerjadi: JSON.stringify(submitData.tambahAnalysisTerjadi || []),
          whyImage: submitData.whyImage,
          whyLamaImage: submitData.whyLamaImage,
          comments5WhySH: submitData.comments5WhySH,
          comments5WhyLH: submitData.comments5WhyLH,
          commentsCountermeasure: submitData.commentsCountermeasure,
          attachmentMeeting: submitData.attachmentMeeting,
          file_report: submitData.file_report,
          uploadFile: submitData.uploadFile,
          actualImage: submitData.actualImage,
          uploadImage: submitData.uploadImage,
          ilustrasiActual: submitData.ilustrasiActual,
          ilustrasiStandart: submitData.ilustrasiStandart,
          standartImage: submitData.standartImage,
          gapBetweenStandarAndActual: submitData.gapBetweenStandarAndActual,
          uraianKejadian: submitData.uraianKejadian,
          agreeTerms: submitData.agreeTerms,
          oCategory: submitData.oCategory,
          qCategory: submitData.qCategory,
          pmCategory: submitData.pmCategory,
          fiveWhyTlApprove: submitData.fiveWhyTlApprove,
          fiveWhyLhApprove: submitData.fiveWhyLhApprove,
          fiveWhyShApprove: submitData.fiveWhyShApprove,
          cmTlApprove: submitData.cmTlApprove,
          cmLhApprove: submitData.cmLhApprove,
          cmShApprove: submitData.cmShApprove,
          cmDhApprove: submitData.cmDhApprove,
          fiveWhyLhFeedback: submitData.fiveWhyLhFeedback,
          fiveWhyShFeedback: submitData.fiveWhyShFeedback,
          cmLhFeedback: submitData.cmLhFeedback,
          cmShFeedback: submitData.cmShFeedback,
          cmTlFeedback: submitData.cmTlFeedback,
          cmDhFeedback: submitData.cmDhFeedback,
          sparepart_list: JSON.stringify(submitData.sparepart_list ?? []),
        }
        const formData = new FormData()
        Object.keys(payload).forEach((key) => {
          const value = payload[key]
          const isFileField = [
            'actualImage',
            'uploadImage',
            'whyLamaImage',
            'whyImage',
            'attachmentMeeting',
            'standartImage',
          ].includes(key)

          if (isFileField && value instanceof File) {
            formData.append(key, value)
          } else if (isFileField && typeof value === 'string' && value) {
            formData.append(key, value)
          } else if (isFileField && !value) {
          } else {
            formData.append(key, value ?? '')
          }
        })

        const response = await api.put('/smartandon/update', null, formData)
        console.log('Update response:', response)
        if (response.status === 200) {
          alert('Problem updated successfully')
          this.visibleEditModal = false
          this.editSubmit = {}
          this.fetchData()
        } else {
          throw new Error('Failed to update problem, status: ' + response.status)
        }
      } catch (error) {
        console.error(error)
        alert('Error updating problem: ' + error.message)
      }
    },
    async fetchOptions() {
      try {
        const responseMachines = await api.get('/smartandon/machine');
        this.machines = responseMachines.data;
        this.machineOptions = responseMachines.data.map((machine) => ({
          id: machine.fid,
          label: machine.fmc_name,
        }));
      } catch (error) {
        console.error('Failed to fetch machines:', error);
      }
      try {
        const responseLines = await api.get('/smartandon/line');
        this.lines = responseLines.data;
        this.lineOptions = responseLines.data.map((line) => ({
          id: line.fid,
          label: line.fline,
        }));
      } catch (error) {
        console.error('Failed to fetch lines:', error);
        this.lineOptions = [];
      }
      try {
        const memberResponse = await api.get('/smartandon/member')
        if (memberResponse.status !== 200) {
          throw new Error('Failed to fetch members, status: ' + memberResponse.status)
        }
        this.memberOption = memberResponse.data.map((member) => ({
          id: member.fid,
          label: member.fname,
        }))
      } catch (error) {
        console.error('Failed to fetch members:', error)
      }
    },
  },
  watch: {
    selectedType(newValue) {
      if (newValue) {
        this.fetchFilteredData(newValue);
      } else {
        this.fetchData();
      }
      console.log('Selected Type changed to:', newValue)
    },
    selectedYear() {
      console.log('Selected year changed to:', this.selectedYear)
      this.updateChartSeries()
    }
  },
  mounted() {
    this.fetchData()
    this.fetchOptions()
  }
}
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}

.card-header {
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.tableFixHead {
  max-height: 100vh;
  overflow-y: auto;
  width: 100%;
}

.tableFixHead thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.tableFixHead table {
  table-layout: fixed;
}

.tableFixHead th,
.tableFixHead td {
  word-wrap: break-word;
}

.indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: auto;
}

.indicator.delayed {
  background-color: #e55353;
}

.indicator.approved {
  background-color: #2eb85c;
}

.indicator.commented {
  background-color: #f9ca24;
}

:deep(.nav-link) {
  cursor: pointer;
}
</style>
