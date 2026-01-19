<template>
  <div class="realtime-pareto-container">
    <CCard class="search-card mb-4">
      <CCardHeader class="text-white">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong style="font-size: medium;">Search</strong>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mb-3">
          <CCol :md="6" class="mb-3 mb-md-0">
            <CFormLabel for="start-date">Start Date</CFormLabel>
            <CInputGroup>
              <CInputGroupText>
                <Clock size="16" />
              </CInputGroupText>
              <CFormInput type="date" id="start-date" v-model="startDate" />
            </CInputGroup>
          </CCol>

          <CCol md="6">
            <CFormLabel for="end-date">End Date</CFormLabel>
            <CInputGroup>
              <CInputGroupText>
                <Clock size="16" />
              </CInputGroupText>
              <CFormInput type="date" id="end-date" v-model="endDate" />
            </CInputGroup>
          </CCol>
        </CRow>

        <CRow class="mb-3">
          <CCol>
            <CFormLabel for="av-category">AV Category</CFormLabel>
            <CFormSelect id="av-category" v-model="selectedCategory" :options="avCategories" />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <CButton color="primary" class="w-100 d-flex align-items-center justify-content-center" @click="search"
              :disabled="isLoading">
              <SearchIcon class="me-2" size="16" />
              {{ isLoading ? 'Loading...' : 'Search' }}
            </CButton>
          </CCol>
        </CRow>

        <CRow class="mt-3">
          <CCol>
            <div class="quick-filter-section">
              <div class="quick-filter-title mb-2">Quick Filters</div>
              <div class="d-flex flex-wrap gap-2">
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('today')">Today</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('yesterdayAll')">Yesterday All
                </CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('yesterdayDay')">Yesterday Day
                </CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('yesterdayNight')">Yesterday
                  Night</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('lastNight')">Last Night
                </CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('thisMonth')">This Month
                </CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('lastMonth')">Last Month
                </CBadge>
              </div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CCard class="pareto-card mb-4">
      <CCardHeader class="text-white">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="m-0">REALTIME PARETO</h3>
          <div class="d-flex align-items-center">
            <div class="live-indicator d-flex align-items-center">
              <span class="live-dot"></span>
            </div>
            <span class="me-3"></span>
            <span class="me-3">{{ currentDate }}</span>
          </div>
        </div>
      </CCardHeader>

      <CCardBody>
        <CRow class="mb-4">
          <CCol :md="6" class="mb-3 mb-md-0">
            <CCard class="h-100 control-card">
              <CCardBody>
                <h5 class="control-title">View Controls</h5>
                <div class="d-flex flex-wrap gap-2">
                  <CButtonGroup role="group" aria-label="Machine or Problem view">
                    <CButton :color="viewMode === 'machines' ? 'primary' : 'outline-primary'
                      " @click="toggleViewMode('machines')" :disabled="isLoading">
                      <Tool size="16" class="me-1" /> Machine View
                    </CButton>
                    <CButton :color="viewMode === 'problems' ? 'primary' : 'outline-primary'
                      " @click="toggleViewMode('problems')" :disabled="isLoading">
                      <AlertTriangle size="16" class="me-1" /> Problem View
                    </CButton>
                  </CButtonGroup>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol :md="6">
            <CCard class="h-100 control-card">
              <CCardBody>
                <h5 class="control-title">Metric Controls</h5>
                <div class="d-flex flex-wrap gap-2">
                  <CButtonGroup role="group" aria-label="Duration or Frequency view">
                    <CButton :color="metricMode === 'duration'
                        ? 'primary'
                        : 'outline-primary'
                      " @click="toggleMetricMode('duration')" :disabled="isLoading">
                      <Clock size="16" class="me-1" /> Duration
                    </CButton>
                    <CButton :color="metricMode === 'frequency'
                        ? 'primary'
                        : 'outline-primary'
                      " @click="toggleMetricMode('frequency')" :disabled="isLoading">
                      <BarChart2 size="16" class="me-1" /> Frequency
                    </CButton>
                  </CButtonGroup>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div v-if="isLoading" class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading production data...</p>
        </div>

        <div v-else-if="dataLoaded && productionLines.length > 0" class="production-lines">
          <template v-for="(line, index) in productionLines" :key="`line-${index}-${line.title || index}`">
            <ProductionLineSection :title="line.title" :panelId="line.panelId" :chartData="getChartData(line)"
              :tableData="getTableData(line)" :viewMode="viewMode" :metricMode="metricMode"
              :minQuantity="line.minQuantity" @refresh="handleRefresh(line.panelId)" @view-item="viewItem"
              @edit-item="editItem" @delete-item="deleteItem" @show-problem-modal="showProblemModal" />
          </template>
        </div>

        <div v-else class="no-data-container">
          <div class="text-center py-5">
            <AlertTriangle size="48" class="text-muted mb-3" />
            <h5 class="text-muted">No Production Data Available</h5>
            <p class="text-muted">
              Please check your connection or try refreshing the page.
            </p>
            <CButton color="primary" @click="fetchAllData" :disabled="isLoading">
              <SearchIcon size="16" class="me-1" /> Retry
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>

  <ProblemDetailsModal
    :visible="modalVisible"
    :problem-name="selectedProblemName"
    :problem-data="selectedProblemData"
    @close="closeProblemModal"
  />
  
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CButton,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CButtonGroup,
  CFormLabel,
} from '@coreui/vue'
import {
  Clock,
  Search as SearchIcon,
  Tool,
  AlertTriangle,
  BarChart2,
} from 'lucide-vue-next'
import ProductionLineSection from './ProductionLineSection.vue'
import ProblemDetailsModal from './ProblemDetailsModal.vue'
import api from '@/apis/CommonAPI'

export default {
  name: 'RealtimePareto',
  components: {
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CButton,
    CInputGroup,
    CInputGroupText,
    CBadge,
    CButtonGroup,
    CFormLabel,
    Clock,
    SearchIcon,
    Tool,
    AlertTriangle,
    BarChart2,
    ProductionLineSection,
    ProblemDetailsModal,
  },
  setup() {
    const todayStr = (() => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })()

    const startOfMonthStr = (() => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}-01`
    })()

    const startDate = ref(startOfMonthStr)
    const startDateFetch = ref(startOfMonthStr)
    const endDate = ref(todayStr)
    const endDateFetch = ref(todayStr)
    const selectedCategory = ref('')
    const avCategories = ref([{ value: '', label: 'Select category' }])

    const currentTime = ref('')
    const currentDate = ref('')
    const viewMode = ref('machines')
    const metricMode = ref('duration')
    const isLoading = ref(true)
    const dataLoaded = ref(false)

    const productionLines = ref([])
    const isFilterMc = ref(true)
    const isFilterProblem = ref(false)
    const isOrderFreq = ref(false)
    let clockInterval = null

    const modalVisible = ref(false)
    const selectedProblemName = ref('')
    const selectedProblemData = ref([])

    onMounted(async () => {
      console.log('RealtimePareto component mounted')
      updateDateTime()
      clockInterval = setInterval(updateDateTime, 1000)
      await fetchAvCategories()
      await fetchAllData()
    })

    onUnmounted(() => {
      if (clockInterval) {
        clearInterval(clockInterval)
      }
    })

    const fetchAvCategories = async () => {
      console.log('Fetching AV categories')
      try {
        const response = await api.get('/realtime-pareto/av-category', null)
        if (response.status === 200) {
          avCategories.value = [
            { value: '', label: 'Select category' },
            ...response.data.data.map((item) => ({
              value: item.value,
              label: item.label,
            })),
          ]
        } else {
          throw new Error('Failed to fetch AV categories')
        }
      } catch (err) {
        console.error('Error fetching AV categories:', err)
      }
    }

    const fetchAllData = async () => {
      isLoading.value = true
      dataLoaded.value = false
      productionLines.value = []
      let avCategoty = ''
      let fline = ''
      let group = ``
      let order = 'sum(fdur)'
      const state = 'yesterdayDay'
      let startDateParam = ''
      let endDateParam = ''
      if (selectedCategory.value) {
        avCategoty = `fav_categoty = '${selectedCategory.value} AND'`
      }
      if (isFilterMc.value) {
        group = 'fmc_name'
      }
      if (isFilterProblem.value) {
        group = 'ferror_name'
      }
      if (isOrderFreq.value) {
        order = 'count(fid)'
      }
      if (startDate.value) {
        startDateParam = formatDate2(startDate.value)
      }
      if (endDate.value) {
        endDateParam = formatDate2(endDate.value)
      }
      if (viewMode.value === 'machines') {
        group = 'fmc_name'
      } else {
        group = 'ferror_name'
      }
      if (metricMode.value === 'duration') {
        order = 'sum(fdur)'
      } else {
        order = 'count(fid)'
      }
      let d = new Date(endDateParam)
      let offSetTimeEndDate = d.setDate(d.getDate() + 1)
      let offSetEndDate = formatDate2(new Date(offSetTimeEndDate))

      if (state == 'yesterdayDay') {
        startDateParam = `${startDateParam} 07:00:00`
        endDateParam = `${endDateParam} 19:59:59`
        startDateFetch.value = startDateParam
        endDateFetch.value = endDateParam
      } else if (state == 'yesterdayNight') {
        startDateParam = `${startDateParam} 20:00:00`
        endDateParam = `${offSetEndDate} 06:59:59`
        startDateFetch.value = startDateParam
        endDateFetch.value = endDateParam
      } else {
        startDateParam = `${startDateParam} 07:00:00`
        endDateParam = `${endDateParam} 06:59:59`
        startDateFetch.value = startDateParam
        endDateFetch.value = endDateParam
      }
      try {
        const result = await api.get(
          `/realtime-pareto/realtime-pareto?group=${group}&order=${order}&avCategory=${avCategoty}&fline=${fline}&startDate=${startDateParam}&endDate=${endDateParam}`,
        )
        productionLines.value = result.data.data
        dataLoaded.value = false
        setTimeout(() => {
          dataLoaded.value = true
        }, 200)
      } catch (error) {
        console.error('Error fetching production lines:', error)
      } finally {
        isLoading.value = false
      }
    }

    const formatDate2 = (date) => {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    }

    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const selectTimeRange = (range) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      switch (range) {
        case 'today':
          startDate.value = formatDate(today)
          endDate.value = formatDate(now)
          break
        case 'yesterdayAll':
          startDate.value = formatDate(yesterday)
          endDate.value = formatDate(yesterday)
          break
        case 'yesterdayDay': {
          startDate.value = formatDate(yesterday)
          const yesterdayDay = new Date(yesterday)
          yesterdayDay.setHours(18, 0, 0, 0)
          endDate.value = formatDate(yesterdayDay)
          break
        }
        case 'yesterdayNight': {
          const yesterdayEvening = new Date(yesterday)
          yesterdayEvening.setHours(18, 0, 0, 0)
          startDate.value = formatDate(yesterdayEvening)
          endDate.value = formatDate(yesterday)
          break
        }
        case 'lastNight': {
          const lastNightStart = new Date(yesterday)
          lastNightStart.setHours(18, 0, 0, 0)
          startDate.value = formatDate(lastNightStart)
          const lastNightEnd = new Date(today)
          lastNightEnd.setHours(6, 0, 0, 0)
          endDate.value = formatDate(lastNightEnd)
          break
        }
        case 'thisMonth':
          startDate.value = formatDate(
            new Date(now.getFullYear(), now.getMonth(), 1),
          )
          endDate.value = formatDate(now)
          break
        case 'lastMonth':
          startDate.value = formatDate(
            new Date(now.getFullYear(), now.getMonth() - 1, 1),
          )
          endDate.value = formatDate(
            new Date(now.getFullYear(), now.getMonth(), 0),
          )
          break
      }
      search()
    }

    const search = async () => {
      console.log('Searching with parameters:', {
        startDate: startDate.value,
        endDate: endDate.value,
        category: selectedCategory.value,
      })
      await fetchAllData()
    }

    const updateDateTime = () => {
      const now = new Date()
      currentDate.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      currentTime.value = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }

    const toggleViewMode = async (mode) => {
      if (!isLoading.value) {
        viewMode.value = mode
        isLoading.value = true
        await fetchAllData()
        isLoading.value = false
      }
    }

    const toggleMetricMode = async (mode) => {
      if (!isLoading.value) {
        metricMode.value = mode
        isLoading.value = true
        await fetchAllData()
        isLoading.value = false
      }
    }

    const getChartData = (line) => {
      console.log('Getting chart data for line:', line)
      if (!Array.isArray(line.problems) || line.problems.length === 0) return []

      let data = line.problems.map((problem, idx) => ({
        name: problem.metric || `Problem ${idx + 1}`,
        quantity: Number(problem.fdur) || 0,
      }))

      if (typeof line.minQuantity === 'number') {
        data = data.filter((item) => item.quantity >= line.minQuantity)
      }
      return data
    }

    const getTableData = (line) => {
      console.log('Getting table data for line:', line)
      if (!Array.isArray(line.problems) || line.problems.length === 0) return []
      return line.problems.map((problem, idx) => ({
        no: idx + 1,
        problem: problem.metric,
        operator: problem.operator || 'N/A',
        startTime: problem.fstart_time,
        duration: `${problem.fdur} min`,
        rawData: problem, // Keep raw data for modal
      }))
    }

    const handleRefresh = async (panelId) => {
      console.log(`Refreshing panel: ${panelId}`)
      await fetchAllData()
    }

    const viewItem = (item) => {
      console.log('View item:', item)
    }

    const editItem = (item) => {
      console.log('Edit item:', item)
    }

    const deleteItem = (item) => {
      console.log('Delete item:', item)
    }

    const showProblemModal = (data) => {
      console.log('showProblemModal called with data:', data)
      selectedProblemName.value = data.problemName
      selectedProblemData.value = data.problemData
      modalVisible.value = true
      console.log('Modal state after show:', { modalVisible: modalVisible.value, selectedProblemName: selectedProblemName.value, selectedProblemData: selectedProblemData.value })
    }

    const closeProblemModal = () => {
      modalVisible.value = false
      selectedProblemName.value = ''
      selectedProblemData.value = []
    }

    return {
      startDate,
      endDate,
      selectedCategory,
      avCategories,

      currentTime,
      currentDate,
      viewMode,
      metricMode,
      isLoading,
      dataLoaded,

      productionLines,

      selectTimeRange,
      search,
      toggleViewMode,
      toggleMetricMode,
      getChartData,
      getTableData,
      fetchAllData,

      handleRefresh,
      viewItem,
      editItem,
      deleteItem,
      showProblemModal,
      closeProblemModal,
      modalVisible,
      selectedProblemName,
      selectedProblemData,
    }
  },
}
</script>

<style scoped>
.realtime-pareto-container {
  padding: 0px;
}

.search-card,
.pareto-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

.search-card .card-header,
.pareto-card .card-header {
  background-color: #3c4b64;
  border-bottom: none;
}

.pareto-card .control-card {
  border: 1px solid #ebedef;
  box-shadow: none;
}

.control-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #3c4b64;
}

.live-indicator {
  display: flex;
  align-items: center;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: #20c997;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.production-lines {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
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

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.7);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(32, 201, 151, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0);
  }
}

@media (max-width: 768px) {
  .quick-filter-section .d-flex {
    flex-wrap: wrap;
    gap: 8px;
  }

  .quick-filter-badge {
    margin-bottom: 5px;
  }

  .control-card {
    margin-bottom: 10px;
  }

  .loading-container,
  .no-data-container {
    min-height: 200px;
  }
}
</style>
