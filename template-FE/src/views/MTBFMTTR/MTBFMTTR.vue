<template>
  <div class="mtbf-mttr-dashboard">
    <DashboardHeader
      :username="username"
      :currentDate="currentDate"
      :currentTime="currentTime"
    />
    <SearchPanel
      v-model:startDate="startDate"
      v-model:endDate="endDate"
      @search="search"
      @selectTimeRange="selectTimeRange"
    />

    <CRow class="mb-3 justify-content-center">
      <CCol md="10" lg="8" class="w-100">
        <CCard class="w-100 mb-3">
          <CCardBody
            class="d-flex justify-content-center align-items-center"
          >
            <CRow>
              <CCol class="mb-3" style="justify-content: center; align-items: center; display: flex;">
                <CButtonGroup class="me-3" role="group" aria-label="Chart mode">
                  <CButton
                    v-for="mode in chartModes"
                    :key="mode.value"
                    :color="
                      chartViewMode === mode.value ? 'primary' : 'outline-primary'
                    "
                    @click="setChartViewMode(mode.value)"
                    :disabled="isLoading"
                  >
                    {{ mode.label }}
                  </CButton>
                </CButtonGroup>
              </CCol>
              <CCol class="mb-3" style="justify-content: center; align-items: center; display: flex;">
                <CButtonGroup role="group" aria-label="Filter type">
                  <CButton
                    v-for="type in filterTypes"
                    :key="type.value"
                    :color="
                      filterType === type.value ? 'primary' : 'outline-primary'
                    "
                    @click="setFilterType(type.value)"
                    :disabled="isLoading"
                  >
                    {{ type.label }}
                  </CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CRow class="production-lines-container flex flex-column">
      <template v-if="filterType === 'machines'">
        <CCol
          v-for="lineId in lineIds"
          :key="lineId"
          cols="12"
          class="line-chart-container w-100"
        >
          <CCard class="w-100">
            <CCardBody>
              <template v-if="isLoading">
                <div class="loading-message">Loading data...</div>
              </template>
              <template v-else>
                <div
                  v-if="!apiData[lineId] || apiData[lineId].length === 0"
                  class="empty-message"
                >
                  No data available for {{ getLineTitle(lineId) }}
                </div>
                <apexchart
                  v-else
                  :options="getChartOptions(lineId)"
                  :series="getChartSeries(lineId)"
                  :height="350"
                  :type="getChartOptions(lineId).chart.type"
                />
              </template>
            </CCardBody>
          </CCard>
        </CCol>
      </template>
      <template v-else>
        <CCol
          v-for="lineId in lineIds"
          :key="lineId"
          cols="12"
          class="line-chart-container w-100"
        >
          <CCard class="w-100">
            <CCardBody>
              <template v-if="isLoading">
                <div class="loading-message">Loading data...</div>
              </template>
              <template v-else>
                <div v-if="!hasData(lineId)" class="empty-message">
                  No data available for {{ getLineTitle(lineId) }}
                </div>
                <apexchart
                  v-else
                  :options="getChartOptions(lineId)"
                  :series="getChartSeries(lineId)"
                  :height="350"
                  :type="getChartOptions(lineId).chart.type"
                />
              </template>
            </CCardBody>
          </CCard>
        </CCol>
      </template>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ApexChart from 'vue3-apexcharts'
import DashboardHeader from './components/DashboardHeader.vue'
import SearchPanel from './components/SearchPanel.vue'
import {
  CButtonGroup,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
} from '@coreui/vue'
import api from '../../apis/CommonAPI'

function sortMachineData(data, metric) {
  if (!Array.isArray(data)) return data
  return [...data].sort((a, b) => {
    if (metric === 'mtbf') {
      return b.mtbf - a.mtbf
    } else if (metric === 'mttr') {
      return b.mttr - a.mttr
    } else if (metric === 'comparison') {
      return b.mtbf + b.mttr - (a.mtbf + a.mttr)
    }
    return 0
  })
}

const workingHoursPerDay = 15 + 10 / 60 // 15 hours 10 minutes

const chartModes = [
  { value: 'mtbf', label: 'MTBF' },
  { value: 'mttr', label: 'MTTR' },
  { value: 'comparison', label: 'Comparison' },
]
const filterTypes = [
  { value: 'machines', label: 'Machines' },
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'total', label: 'Total' },
]

const currentTime = ref('')
const now = new Date()
const days = [  
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const currentDate = ref(
  `${days[now.getDay()]}, ${
    months[now.getMonth()]
  } ${now.getDate()}, ${now.getFullYear()}`,
)
const startDate = ref(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,
)
const endDate = ref(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`,
)
const chartViewMode = ref('mtbf')
const filterType = ref('machines')
const lineIds = [
  'lpdc',
  'hpdc',
  'camshaft',
  'crankshaft',
  'cylinderhead',
  'cylinderblock',
  'assyline',
]
const apiData = ref({})
const isLoading = ref(false)

const flineMap = {
  LPDC: 'lpdc',
  HPDC: 'hpdc',
  'CAM SHAFT': 'camshaft',
  'CRANK SHAFT': 'crankshaft',
  'CYLINDER HEAD': 'cylinderhead',
  'CYLINDER BLOCK': 'cylinderblock',
  'ASSY LINE': 'assyline',
}

function setChartViewMode(val) {
  if (chartViewMode.value !== val) {
    chartViewMode.value = val
  }
}
function setFilterType(val) {
  if (filterType.value !== val) {
    filterType.value = val
  }
}

const getApiEndpoint = () => {
  if (chartViewMode.value === 'mtbf') return '/mtbfmttr/mtbf'
  if (chartViewMode.value === 'mttr') return '/mtbfmttr/mttr'
  return '/mtbfmttr/mtbfmttr'
}

function safeArray(val) {
  return Array.isArray(val) ? val : []
}

const fetchAllData = async () => {
  isLoading.value = true
  try {
    const endpoint = getApiEndpoint()
    const url = `${endpoint}?startDate=${startDate.value}&endDate=${endDate.value}&type=${filterType.value}`
    const response = await api.get(url)
    const result = response.data
    console.log('Fetch URL:', response)
    if (response.status === 200 && Array.isArray(result?.data)) {
      const mapped = {}
      if (filterType.value === 'machines') {
        result.data.forEach((item) => {
          const id =
            flineMap[item.fline] ||
            item.fline?.toLowerCase()?.replace(/\s/g, '') ||
            null
          if (!id) return
          if (!Array.isArray(mapped[id])) mapped[id] = []
          mapped[id].push({
            machine: item.fmc_name,
            mtbf: item.mtbf ? parseFloat((parseFloat(item.mtbf) / 60).toFixed(5)) : 0,
            mttr: item.mttr ? parseFloat((parseFloat(item.mttr) / 60).toFixed(5)) : 0,
          })
        })
        // Sort each machine array by selected metric descending using the new function
        Object.keys(mapped).forEach((key) => {
          mapped[key] = sortMachineData(mapped[key], chartViewMode.value)
        })
      } else {
        result.data.forEach((item) => {
          const id =
            flineMap[item.fline] ||
            item.fline?.toLowerCase()?.replace(/\s/g, '') ||
            null
          if (!id) return

          if (filterType.value === 'daily' || filterType.value === 'monthly') {
            if (!Array.isArray(mapped[id])) mapped[id] = []
            mapped[id].push({
              date: item.date,
              mtbf: item.mtbf ? parseFloat((parseFloat(item.mtbf) / 60).toFixed(5)) : 0,
              mttr: item.mttr ? parseFloat((parseFloat(item.mttr) / 60).toFixed(5)) : 0,
            })
          } else if (filterType.value === 'total') {
            mapped[id] = {
              mtbf: item.mtbf ? parseFloat((parseFloat(item.mtbf) / 60).toFixed(5)) : 0,
              mttr: item.mttr ? parseFloat((parseFloat(item.mttr) / 60).toFixed(5)) : 0,
            }
          }
        })
      }
      apiData.value = mapped
    } else {
      apiData.value = {}
      throw new Error('Failed to fetch MTBF/MTTR data, status: ' + response.status)
    }
  } catch (e) {
    apiData.value = {}
    console.error('Failed to fetch MTBF/MTTR data', e)
  } finally {
    isLoading.value = false
  }
}

const getLineTitle = (lineId) =>
  ({
    lpdc: 'LPDC Line',
    hpdc: 'HPDC Line',
    camshaft: 'CAM SHAFT Line',
    crankshaft: 'CRANK SHAFT Line',
    cylinderhead: 'CYLINDER HEAD Line',
    cylinderblock: 'CYLINDER BLOCK Line',
    assyline: 'ASSY LINE',
  }[lineId] || lineId)

const hasData = (lineId) => {
  const data = apiData.value[lineId]
  if (!data) return false
  if (Array.isArray(data)) {
    if (chartViewMode.value === 'mtbf')
      return data.length > 0 && data.some((d) => d.mtbf && d.mtbf > 0)
    if (chartViewMode.value === 'mttr')
      return data.length > 0 && data.some((d) => d.mttr && d.mttr > 0)
    if (chartViewMode.value === 'comparison') return data.length > 0
    return false
  }
  if (chartViewMode.value === 'comparison') {
    return (data.mtbf && data.mtbf > 0) || (data.mttr && data.mttr > 0)
  }
  if (chartViewMode.value === 'mtbf') {
    return data.mtbf && data.mtbf > 0
  }
  if (chartViewMode.value === 'mttr') {
    return data.mttr && data.mttr > 0
  }
  return false
}

const colorMTTRBar = '#FF4560'
const colorMTBFBar = '#008FFB'
const colorMTTRLine = colorMTTRBar
const colorMTBFLine = colorMTBFBar

const chartBg = '#fff'

const getChartOptions = (lineId) => {
  const data = safeArray(apiData.value[lineId])
  const title = getLineTitle(lineId)

  if (filterType.value === 'machines') {
    const isComparison = chartViewMode.value === 'comparison';
    return {
      chart: {
        background: chartBg,
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            download: true,
          },
          autoSelected: 'zoom',
        },
        zoom: { enabled: true },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toLocaleString(),
        background: {
          enabled: true,
          foreColor: '#fff',
          borderRadius: 1,
          padding: 1,
          opacity: 1,
          borderWidth: 0,
          borderColor: '#fff',
        },
        style: { fontSize: '14px', colors: ['#333']},
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: data.map((d) => d.machine ?? '') },
      yaxis: {
        title: { text: isComparison ? 'Value' : chartViewMode.value === 'mtbf' ? 'MTBF (Hours)' : 'MTTR (Hours)' },
        min: 0,
      },
      tooltip: { theme: 'dark' },
      colors: isComparison ? [colorMTBFBar, colorMTTRBar] : [chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar],
      plotOptions: {
        bar: {
          columnWidth: isComparison ? '50%' : '50%',
          dataLabels: { position: 'top' },
        },
      },
      legend: { show: isComparison },
    }
  }

  if (
    (chartViewMode.value === 'mtbf' || chartViewMode.value === 'mttr') &&
    filterType.value === 'total'
  ) {
    return {
      chart: {
        background: chartBg,
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            download: true,
          },
          autoSelected: 'zoom',
        },
        zoom: { enabled: true },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: [chartViewMode.value.toUpperCase()] },
      yaxis: {
        title: { text: chartViewMode.value === 'mtbf' ? 'MTBF (Hours)' : 'MTTR (Hours)' },
        min: 0,
      },
      tooltip: { theme: 'dark' },
      colors: [chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          dataLabels: { position: 'top' },
        },
      },
      legend: { show: false },
    }
  }

  if (chartViewMode.value === 'comparison' && filterType.value === 'total') {
    return {
      chart: {
        background: chartBg,
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            download: true,
          },
          autoSelected: 'zoom',
        },
        zoom: { enabled: true },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: ['Total'] },
      yaxis: { title: { text: 'Value (Hours)' }, min: 0 },
      tooltip: { theme: 'dark' },
      colors: [colorMTBFBar, colorMTTRBar],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          dataLabels: { position: 'top' },
        },
      },
      legend: { show: true },
    }
  }

  if (
    (chartViewMode.value === 'mtbf' || chartViewMode.value === 'mttr') &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    const highlightLineColor =
      chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar
    return {
      chart: {
        background: chartBg,
        type: 'line',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            download: true,
          },
          autoSelected: 'zoom',
        },
        zoom: { enabled: true },
      },
      stroke: {
        width: [0, 4],
        curve: 'smooth',
        colors: [null, highlightLineColor],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      markers: {
        size: [0, 8],
        strokeWidth: [0, 4],
        strokeColors: [null, highlightLineColor],
        fillColors: [null, highlightLineColor],
        hover: { size: 12 },
        shape: 'circle',
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: data.map((d) => d.date ?? '') },
      yaxis: [
        {
          title: { text: chartViewMode.value === 'mtbf' ? 'MTBF (Hours)' : 'MTTR (Hours)' },
          min: 0,
        },
      ],
      tooltip: { theme: 'dark' },
      colors: [
        chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar,
        highlightLineColor,
      ],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          dataLabels: { position: 'top' },
        },
      },
      legend: { show: false },
    }
  }

  if (
    chartViewMode.value === 'comparison' &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    return {
      chart: {
        background: chartBg,
        type: 'line',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            download: true,
          },
          autoSelected: 'zoom',
        },
        zoom: { enabled: true },
      },
      stroke: {
        width: [0, 0, 3, 3],
        curve: 'smooth',
        colors: [colorMTTRBar, colorMTBFBar, colorMTTRLine, colorMTBFLine],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      markers: {
        size: [0, 0, 5, 5],
        strokeWidth: [0, 0, 3, 3],
        strokeColors: [
          colorMTTRBar,
          colorMTBFBar,
          colorMTTRLine,
          colorMTBFLine,
        ],
        fillColors: [colorMTTRBar, colorMTBFBar, colorMTTRLine, colorMTBFLine],
        hover: { size: 7 },
        shape: 'circle',
        discrete: [],
      },
      legend: {
        show: true,
        labels: {
          colors: '#222',
          useSeriesColors: true,
        },
      },
      title: { text: title, align: 'left' },
      xaxis: {
        categories: data.map((d) => d.date ?? ''),
        tickPlacement: 'on',
      },
      yaxis: [
        {
          title: { text: 'Value (Hours)' },
          min: 0,
        },
      ],
      tooltip: { theme: 'dark' },
      colors: [colorMTTRBar, colorMTBFBar, colorMTTRLine, colorMTBFLine],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          dataLabels: { position: 'top' },
        },
      },
    }
  }

  let categories = []
  let ytitle = chartViewMode.value === 'mtbf' ? 'MTBF (Hours)' : 'MTTR (Hours)'
  if (Array.isArray(data) && data.length > 0) {
    categories = data.map((d) => d.date ?? '')
  } else if (data) {
    categories = [chartViewMode.value.toUpperCase()]
  } else {
    categories = []
  }
  return {
    chart: {
      background: chartBg,
      height: 350,
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
          download: true,
        },
        autoSelected: 'zoom',
      },
      zoom: { enabled: true },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      style: { fontSize: '14px', colors: ['#333'] },
    },
    title: { text: title, align: 'left' },
    xaxis: {
      categories,
      title: {
        text: Array.isArray(data)
          ? filterType.value === 'monthly'
            ? 'Month'
            : 'Date'
          : 'Metric',
      },
    },
    yaxis: { title: { text: ytitle }, min: 0 },
    tooltip: { theme: 'dark' },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        dataLabels: { position: 'top' },
      },
    },
    colors: [chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar],
    legend: { show: false },
  }
}

const getChartSeries = (lineId) => {
  const data = safeArray(apiData.value[lineId])

  if (filterType.value === 'machines') {
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: data.map((d) => parseFloat(d.mtbf) || 0) }]
    } else if (chartViewMode.value === 'mttr') {
      return [{ name: 'MTTR', data: data.map((d) => parseFloat(d.mttr) || 0) }]
    } else if (chartViewMode.value === 'comparison') {
      return [
        { name: 'MTBF', data: data.map((d) => parseFloat(d.mtbf) || 0) },
        { name: 'MTTR', data: data.map((d) => parseFloat(d.mttr) || 0) },
      ]
    }
  }

  if (filterType.value === 'total') {
    const d = apiData.value[lineId] || {}
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: [parseFloat(d.mtbf) || 0] }]
    } else if (chartViewMode.value === 'mttr') {
      return [{ name: 'MTTR', data: [parseFloat(d.mttr) || 0] }]
    } else if (chartViewMode.value === 'comparison') {
      return [
        { name: 'MTBF', data: [parseFloat(d.mtbf) || 0] },
        { name: 'MTTR', data: [parseFloat(d.mttr) || 0] },
      ]
    }
  }

  if (
    (chartViewMode.value === 'mtbf' || chartViewMode.value === 'mttr') &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    if (chartViewMode.value === 'mtbf') {
      const values = data.map((d) => parseFloat(d.mtbf) || 0)
      return [
        { name: 'MTBF', type: 'bar', data: values },
        { name: '', type: 'line', data: values },
      ]
    } else {
      const values = data.map((d) => parseFloat(d.mttr) || 0)
      return [
        { name: 'MTTR', type: 'bar', data: values },
        { name: '', type: 'line', data: values },
      ]
    }
  }

  if (
    chartViewMode.value === 'comparison' &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    return [
      {
        name: 'MTTR (Bar)',
        type: 'bar',
        data: data.map((d) => parseFloat(d.mttr) || 0),
      },
      {
        name: 'MTBF (Bar)',
        type: 'bar',
        data: data.map((d) => parseFloat(d.mtbf) || 0),
      },
      {
        name: 'MTTR (Line)',
        type: 'line',
        data: data.map((d) => parseFloat(d.mttr) || 0),
      },
      {
        name: 'MTBF (Line)',
        type: 'line',
        data: data.map((d) => parseFloat(d.mtbf) || 0),
      },
    ]
  }

  if (Array.isArray(data) && data.length > 0) {
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: data.map((d) => parseFloat(d.mtbf) || 0) }]
    } else {
      return [{ name: 'MTTR', data: data.map((d) => parseFloat(d.mttr) || 0) }]
    }
  } else if (data) {
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: [parseFloat(data.mtbf) || 0] }]
    } else {
      return [{ name: 'MTTR', data: [parseFloat(data.mttr) || 0] }]
    }
  }
  return [{ name: chartViewMode.value.toUpperCase(), data: [] }]
}

const search = async () => {
  await fetchAllData()
}
watch([chartViewMode, filterType], fetchAllData)

const selectTimeRange = async (range) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (range) {
    case 'today':
      startDate.value = formatDate(today)
      endDate.value = formatDate(now)
      break
    case 'lastWeek': {
      const lastWeekStart = new Date(today)
      lastWeekStart.setDate(today.getDate() - 7)
      startDate.value = formatDate(lastWeekStart)
      endDate.value = formatDate(today)
      break
    }
    case 'lastMonth': {
      const lastMonthStart = new Date(today)
      lastMonthStart.setMonth(today.getMonth() - 1)
      startDate.value = formatDate(lastMonthStart)
      endDate.value = formatDate(today)
      break
    }
    case 'lastQuarter': {
      const lastQuarterStart = new Date(today)
      lastQuarterStart.setMonth(today.getMonth() - 3)
      startDate.value = formatDate(lastQuarterStart)
      endDate.value = formatDate(today)
      break
    }
    case 'thisYear': {
      const thisYearStart = new Date(today.getFullYear(), 0, 1)
      startDate.value = formatDate(thisYearStart)
      endDate.value = formatDate(today)
      break
    }
    case 'lastYear': {
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31)
      startDate.value = formatDate(lastYearStart)
      endDate.value = formatDate(lastYearEnd)
      break
    }
  }
  search()
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(() => {
  setInterval(() => {
    const now = new Date()
    currentTime.value = now.toLocaleString()
  }, 1000)
  fetchAllData()
})
</script>

<script>
export default {
  components: {
    apexchart: ApexChart,
  },
}
</script>

<style scoped>
.mtbf-mttr-dashboard {
  padding: 0px;
}
.toggle-group {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  background: #f5f6fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  padding: 6px 12px;
  gap: 100px;
}
.toggle-btn {
  background: transparent;
  border: none;
  outline: none;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 16px;
  color: #444;
  border-radius: 6px;
  transition: background 0.13s, color 0.13s;
  cursor: pointer;
}
.toggle-btn.active {
  background: linear-gradient(95deg, #0d6efd 60%, #0dcaf0 100%);
  color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 123, 255, 0.08);
}
.toggle-btn:not(.active):hover {
  background: #e3eafc;
  color: #0d6efd;
}
.toggle-btn-filter {
  font-size: 14px;
  padding: 8px 16px;
  margin-left: 2px;
}
.toggle-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.toggle-btn-filter:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
.divider {
  display: inline-block;
  width: 1.5px;
  height: 26px;
  background: #e5e7eb;
  margin: 0 8px;
  border-radius: 2px;
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

.toggle-mode {
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.toggle-mode .toggle-btn {
  border-radius: 0;
  border-right: 1.5px solid #e5e7eb;
  margin: 0;
}
.toggle-mode .toggle-btn:last-child {
  border-right: none;
}
.toggle-filter {
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.toggle-filter .toggle-btn-filter {
  border-radius: 0;
  border-right: 1.5px solid #e5e7eb;
  margin: 0;
}
.toggle-filter .toggle-btn-filter:last-child {
  border-right: none;
}
</style>
