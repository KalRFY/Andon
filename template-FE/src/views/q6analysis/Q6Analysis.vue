<template>
    <CContainer fluid class="q6-analysis-dashboard">
        <DashboardHeader
            :username="username"
            :currentDate="currentDate"
            :currentTime="currentTime"
        />

        <SearchPanel
            v-model:startDate="startDate"
            v-model:endDate="endDate"
            v-model:selectedLine="selectedLine"
            :isLoading="isLoading"
            @search="search"
            @selectTimeRange="selectTimeRange"
        />

        <ViewControls
            v-model:abnormal="abnormal"
            v-model:isFreq="isFreq"
            :isLoading="isLoading"
        />

        <CRow class="production-lines-container flex flex-column">
            <CCol cols="12" class="line-chart-container w-100">
                <CCard class="w-100">
                    <CCardBody>
                        <template v-if="isLoading">
                            <CContainer fluid class="loading-message text-center">Loading data...</CContainer>
                        </template>
                        <template v-else>
                            <CContainer fluid v-if="seriesData.length === 0" class="empty-message text-center">
                                No data available
                            </CContainer>
                            <CContainer fluid v-else class="chart-wrapper" v-show="chartReady">
                                <Q6Charts
                                    :key="chartKey"
                                    :graphData="graphData"
                                    :seriesData="seriesData"
                                    :categories="q6Categories"
                                    :title="'Q6 Analysis Graph'"
                                />
                            </CContainer>
                        </template>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        <CRow class="production-lines-container flex flex-column">
            <CCol cols="12" class="line-chart-container w-100">
                <CCard class="w-100">
                    <CCardBody>
                        <template v-if="isLoading">
                            <CContainer fluid class="loading-message text-center">Loading data...</CContainer>
                        </template>
                        <template v-else>
                            <CContainer fluid v-if="o6SeriesData.length === 0" class="empty-message text-center">
                                No data available
                            </CContainer>
                            <CContainer fluid v-else class="chart-wrapper" v-show="o6ChartReady">
                                <Q6Charts
                                    :key="o6ChartKey"
                                    :graphData="o6GraphData"
                                    :seriesData="o6SeriesData"
                                    :categories="o6Categories"
                                    :title="'O6 Analysis Graph'"
                                />
                            </CContainer>
                        </template>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </CContainer>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Q6Charts from './components/Q6Charts.vue'
import DashboardHeader from './components/DashboardHeader.vue'
import api from '../../apis/CommonAPI'
import SearchPanel from './components/SearchPanel.vue'
import ViewControls from './components/ViewControls.vue'
import { CCard, CCardBody, CRow, CCol, CContainer } from '@coreui/vue'

const username = ref('Admin User')
const currentTime = ref('')
const currentDate = ref('')
const seriesData = ref([])
const chartReady = ref(false)
const chartKey = ref(0)
const graphData = ref({})

const o6SeriesData = ref([])
const o6ChartReady = ref(false)
const o6ChartKey = ref(0)
const o6GraphData = ref({})

const q6Categories = [
  'Q1 (Diagnose)',
  'Q2 (SpareParts)',
  'Q3 (Tools)',
  'Q4 (Maintenance Ability)',
  'Q5 (Machine Setting)',
  'Q6 (Machine Backup)'
]

const o6Categories = [
  'O1 (Design & Installation)',
  'O2 (Henkaten Issue)',
  'O3 (PM Issue)',
  'O4 (Symptom)',
  'O5 (Environment & 3rd Factor)',
  'O6 (Lifetime Issue)'
]

const now = new Date()
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
currentDate.value = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

const isLoading = ref(false)

const selectedLine = ref('ALL')
const startDate = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`)
const endDate = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)

const abnormal = ref(false)
const isFreq = ref(false)

const fetchQ6Data = async() => {
    try {
        isLoading.value = true
    const params = {
      line: selectedLine.value,
      startDate: startDate.value,
      endDate: endDate.value,
      isAbnormal: abnormal.value,
      isFreq: isFreq.value,
    }
        const response = await api.get('/q6/q6-analysis', params)
        if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`)
        }
        const data = response.data.data || response.data || {}
        graphData.value = data
        seriesData.value = Array.isArray(data.series) ? data.series : []

        console.log('Fetched Q6 data:', data)
        console.log('Series length:', seriesData.value.length)
    } catch(e) {
        console.error('Error fetching Q6 data:', e)
    } finally {
        isLoading.value = false
    }
}

const fetchO6Data = async() => {
    try {
        isLoading.value = true
    const params = {
      line: selectedLine.value,
      startDate: startDate.value,
      endDate: endDate.value,
      isFreq: isFreq.value,
    }
        const response = await api.get('/q6/o6-analysis', params)
        if (response.status !== 200) {
            throw new Error(`API request failed with status ${response.status}`)
        }
        const data = response.data.data || response.data || {}
        o6GraphData.value = data
        o6SeriesData.value = Array.isArray(data.series) ? data.series : []

        console.log('Fetched O6 data:', data)
        console.log('O6 Series length:', o6SeriesData.value.length)
    } catch(e) {
        console.error('Error fetching O6 data:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(async() => {
    try {
        await nextTick()
        chartReady.value = true
        o6ChartReady.value = true
        await fetchQ6Data()
        await fetchO6Data()

        setInterval(() => {
            const now = new Date()
            currentTime.value = now.toLocaleString()
        }, 1000)
    } catch (error) {
        console.error('Error in onMounted:', error)
        isLoading.value = false
    }
})

const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const search = async () => {
    isLoading.value = true
    try {
        chartReady.value = false
        o6ChartReady.value = false
        await new Promise((r) => setTimeout(r, 100))
        await fetchQ6Data()
        await fetchO6Data()
        await nextTick()
        chartReady.value = true
        o6ChartReady.value = true
        chartKey.value += 1
        o6ChartKey.value += 1
        await new Promise((r) => setTimeout(r, 400))
    } finally {
        isLoading.value = false
    }
}

const selectTimeRange = async (range) => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    switch (range) {
        case 'today':
        startDate.value = formatDate(today)
        endDate.value = formatDate(now)
        break
        case 'lastWeek': {
        const s = new Date(today)
        s.setDate(today.getDate() - 7)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
        case 'lastMonth': {
        const s = new Date(today)
        s.setMonth(today.getMonth() - 1)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
        case 'lastQuarter': {
        const s = new Date(today)
        s.setMonth(today.getMonth() - 3)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
        case 'thisYear': {
        const s = new Date(today.getFullYear(), 0, 1)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
    }
    search()
}
</script>

<style scoped>
.q6-analysis-dashboard {
  padding: 0px;
}

.loading-message {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 20px;
}

.empty-message {
  text-align: center;
  color: #aaa;
  padding: 15px 0 30px 0;
  font-size: 16px;
}

.line-chart-container {
  margin-bottom: 30px;
}

.production-lines-container {
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .q6-analysis-dashboard {
    padding: 0 10px;
  }
}

/* Chart container styling */
.chart-wrapper {
  width: 100%;
  height: 400px;
  min-height: 400px;
}

/* Force crosshair cursor inside the chart area */
:deep(.apexcharts-canvas) {
  cursor: crosshair;
}

/* Ensure chart is properly sized */
:deep(.apexcharts-graphical) {
  outline: none;
}

/* Fix chart container width */
:deep(.apexcharts-inner) {
  position: relative;
  width: 100%;
}

/* Custom tooltip styling */
:deep(.custom-tooltip) {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  padding: 10px;
  color: white;
  font-size: 12px;
  min-width: 200px;
}

:deep(.tooltip-title) {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 13px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
}

:deep(.tooltip-item) {
  display: flex;
  align-items: center;
  margin: 4px 0;
  gap: 8px;
}

:deep(.tooltip-color) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

:deep(.tooltip-line) {
  width: 15px;
  height: 2px;
  display: inline-block;
  flex-shrink: 0;
}

:deep(.tooltip-text) {
  font-size: 12px;
}
</style>