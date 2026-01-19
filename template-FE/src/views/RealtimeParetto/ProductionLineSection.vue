<template>
  <div class="production-line-section">
    <CCard>
      <CCardHeader
        class="bg-light d-flex justify-content-between align-items-center"
      >
        <h5 class="m-0 line-title">{{ title }}</h5>
        <div>
          <CButton
            size="sm"
            variant="ghost"
            color="primary"
            @click="exportData"
            class="me-2"
          >
            <Download size="16" class="me-1" /> Export
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody v-if="isExpanded">
        <div v-if="loading" class="text-center p-5">
          <CSpinner />
          <p class="mt-2">Loading data...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else>
          <div class="chart-container">
            <apexchart
              type="line"
              :options="chartOptions"
              :series="series"
              height="350"
            ></apexchart>
          </div>
          <CAccordion :active-item-key="null">
            <CAccordionItem :item-key="1">
              <CAccordionHeader>
                <div class="d-flex align-items-center">
                  <component :is="panelIcon" size="16" class="me-2" />
                  <span>{{ panelId }} Data Table</span>
                </div>
              </CAccordionHeader>
              <CAccordionBody>
                <CTable responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col"
                        >Last Occurred</CTableHeaderCell
                      >
                      <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="(row, index) in tableData" :key="index">
                      <CTableHeaderCell scope="row">{{
                        row.no
                      }}</CTableHeaderCell>
                      <CTableDataCell>{{
                        formatDateTime(row.startTime)
                      }}</CTableDataCell>
                      <CTableDataCell>{{ row.problem }}</CTableDataCell>
                      <CTableDataCell>{{ row.duration }}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </div>
      </CCardBody>
    </CCard>

  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/vue'
import {
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  BarChart,
  BarChart2,
  RefreshCw,
  Download,
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import * as XLSX from 'xlsx'

export default {
  name: 'ProductionLineSection',
  components: {
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CSpinner,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    ChevronDown,
    ChevronUp,
    FileSpreadsheet,
    BarChart,
    BarChart2,
    RefreshCw,
    Download,
    apexchart: VueApexCharts,
  },
  props: {
    title: { type: String, required: true },
    panelId: { type: String, required: true },
    chartData: { type: Array, required: true },
    tableData: { type: Array, required: true },
    viewMode: { type: String, default: 'problems' },
    metricMode: { type: String, default: 'duration' },
    minQuantity: { type: Number, default: 0 },
  },
  emits: ['refresh', 'view-item', 'edit-item', 'delete-item'],
  setup(props, { emit }) {
    console.log('ProductionLineSection mounted with props:', props)
    const isExpanded = ref(true)
    const loading = ref(false)
    const error = ref(null)
    const modalVisible = ref(false)
    const selectedProblemData = ref([])
    const selectedProblemName = ref('')



    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value
    }
    const refreshData = () => {
      loading.value = true
      error.value = null
      setTimeout(() => {
        loading.value = false
        emit('refresh', props.panelId)
      }, 1000)
    }
    const exportData = () => {
      try {
        // Prepare worksheet from chartData
        const worksheetData = props.chartData.map((item) => ({
          Name: item.name,
          Quantity: item.quantity,
        }))
        const worksheet = XLSX.utils.json_to_sheet(worksheetData)

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

        // Generate Excel file buffer
        const wbout = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        })

        // Create Blob and download link
        const blob = new Blob([wbout], {
          type: 'application/octet-stream',
        })
        const url = URL.createObjectURL(blob)
        const exportFileDefaultName = `${props.title}_${props.viewMode}_${props.metricMode}_${new Date().toISOString()}.xlsx`
        const linkElement = document.createElement('a')
        linkElement.href = url
        linkElement.download = exportFileDefaultName
        document.body.appendChild(linkElement)
        linkElement.click()
        document.body.removeChild(linkElement)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error exporting data to Excel:', error)
      }
    }

    const panelIcon = computed(() =>
      props.panelId.includes('PANEL')
        ? FileSpreadsheet
        : props.metricMode === 'duration'
        ? BarChart
        : BarChart2,
    )

    const series = computed(() => {
      if (!props.chartData || props.chartData.length === 0) {
        return [{
          name: 'No Data',
          data: []
        }]
      }
      const sortedData = [...props.chartData].sort(
        (a, b) => b.quantity - a.quantity,
      )

      // Calculate cumulative percentage
      const total = sortedData.reduce((sum, item) => sum + item.quantity, 0)
      let cumulative = 0
      const cumulativePercentages = sortedData.map((item) => {
        cumulative += item.quantity
        return Math.round((cumulative / total) * 100)
      })

      return [{
        name: props.metricMode === 'frequency' ? 'Frequency' : 'Duration (mins)',
        type: 'column',
        data: sortedData.map((item) => item.quantity),
      }, {
        name: 'Cumulative %',
        type: 'line',
        data: cumulativePercentages,
      }]
    })

    const chartOptions = computed(() => ({
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        },
        background: 'transparent',
        events: {
          click: function(event, chartContext, config) {
            console.log('Chart clicked:', { event, chartContext, config })
            if (config && config.seriesIndex === 0 && config.dataPointIndex !== undefined) {
              const categories = config.w?.config?.xaxis?.categories || []
              console.log('Categories from config:', categories)
              console.log('DataPointIndex:', config.dataPointIndex)
              const problemName = categories[config.dataPointIndex]
              console.log('Problem name:', problemName)

              // Try alternative way to get categories
              const sortedData = [...props.chartData].sort((a, b) => b.quantity - a.quantity)
              const altCategories = sortedData.map(item => item.name)
              console.log('Alternative categories from props:', altCategories)
              const altProblemName = altCategories[config.dataPointIndex]
              console.log('Alternative problem name:', altProblemName)

              const finalProblemName = altProblemName || problemName
              console.log('Final problem name:', finalProblemName)

              if (finalProblemName) {
                const problemData = props.tableData.filter(row => row.problem === finalProblemName).map(row => row.rawData || row)
                console.log('Filtered problem data:', problemData)
                emit('show-problem-modal', { problemName: finalProblemName, problemData })
              }
            }
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
        formatter: function(val) {
          return val + '%'
        },
        style: {
          fontSize: '12px',
          colors: ['#304758']
        },
        offsetY: -10
      },
      stroke: {
        show: true,
        width: [0, 4],
        curve: 'straight'
      },
      markers: {
        size: [0, 6],
        colors: ['#fff'],
        strokeColors: '#00E396',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: props.chartData && props.chartData.length > 0
          ? [...props.chartData].sort((a, b) => b.quantity - a.quantity).map((item) => item.name)
          : [],
        title: {
          text: 'Problems'
        },
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px'
          }
        }
      },

      yaxis: [{
        title: {
          text: props.metricMode === 'frequency' ? 'Frequency' : 'Duration (mins)',
        },
      }, {
        opposite: true,
        title: {
          text: 'Cumulative %'
        },
        labels: {
          formatter: function (val) {
            return val + '%'
          }
        }
      }],
      fill: {
        opacity: 1
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val, { seriesIndex }) {
            if (seriesIndex === 0) {
              return props.metricMode === 'frequency' ? val + " times" : val + " mins"
            } else {
              return val + "%"
            }
          }
        }
      },
      title: {
        text: `${props.title} - Problem ${props.metricMode === 'frequency' ? 'Frequency' : 'Duration'} Chart`,
        align: 'center',
        style: {
          fontSize: '14px',
          fontWeight: 'bold'
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          xaxis: {
            labels: {
              rotate: -90,
              style: {
                fontSize: '10px'
              }
            }
          },
          title: {
            style: {
              fontSize: '12px'
            }
          }
        }
      }]
    }))


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

    return {
      isExpanded,
      loading,
      error,
      modalVisible,
      selectedProblemData,
      selectedProblemName,
      toggleExpanded,
      refreshData,
      exportData,
      panelIcon,
      formatDateTime,
      series,
      chartOptions,
    }
  },
}
</script>

<style scoped>
.production-line-section {
  margin-bottom: 15px;
}

.line-title {
  font-weight: 600;
  color: #3c4b64;
}

.chart-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
  padding: 10px;
  overflow: hidden;
  background-color: transparent;
}

.action-btn {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 350px;
  }
}
</style>
