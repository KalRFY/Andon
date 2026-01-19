<template>
  <CRow class="mb-3">
    <CCol md="12">
      <CCard>
        <CCardBody>
          <CRow class="mb-3">
            <CCol>
              <CCard>
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
                          v-model="filterStartDateFreq"
                          aria-label="Start Date"
                          aria-describedby="basic-addon1"
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
                          v-model="filterFinishDateFreq"
                          aria-label="Finish Date"
                          aria-describedby="basic-addon2"
                        />
                      </CInputGroup>
                    </CCol>
        
                    <CCol lg="3" class="mb-3">
                      <CCol class="md-6">
                      <label for="lineSelect" class="form-label">Line</label>
                      <Treeselect
                        id="lineSelect"
                        v-model="selectedLineFreq"
                        :multiple="false"
                        :flat="true"
                        :options="lineOptions"
                        :searchable="true"
                        :clearable="true"
                        placeholder="Select or input line"
                        @input="onMachineInput"
                        :value-consists-of="['id']"
                        :value-key="'id'"
                        :label-key="'label'"
                      />
                      </CCol>
                    </CCol>
        
                    <CCol lg="3" class="mb-3">
                      <label for="selectedMachineName" class="form-label"
                        >Machine Name</label
                      >
                      <Treeselect
                        id="selectedMachineName"
                        v-model="selectedMachineNameFreq"
                        :options="machineOptions"
                        :searchable="true"
                        :clearable="true"
                        :children="false"
                        placeholder="Select or input machine"
                        @input="onMachineInput"
                        :value-consists-of="['id']"
                        :value-key="'id'"
                        :label-key="'label'"
                      />
                    </CCol>
                  </CRow>
                  
                  <CRow class="mb-3">
                    <CCol class="mb-3" lg="6">
                      <CFormLabel for="basic-url">Problem</CFormLabel>
                      <CInputGroup>
                        <CInputGroupText id="basic-addon3">Problem</CInputGroupText>
                        <CFormInput
                          feedbackInvalid="Please input problem"
                          id="problem"
                          placeholder="Problem"
                          v-model="selectedProblemFreq"
                          aria-label="Problem"
                          aria-describedby="basic-addon3"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol class="mb-3" lg="6">
                      <CFormLabel for="basic-url">View</CFormLabel>
                      <CFormSelect
                        v-model="selectedTimeFreq"
                      >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="machines">Machines</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
        
                  <hr />
        
                  <CRow>
                    <CCol sm="2" class="mb-3">
                      <CButton
                        :disabled="loading"
                        style="width: 100%"
                        color="dark"
                        variant="outline"
                        @click="resetFreqFilters"
                      >
                        Reset
                      </CButton>
                    </CCol>
                    <CCol sm="10" class="mb-3">
                      <CButton
                        :disabled="loading"
                        style="width: 100%; color: white;"
                        color="info"
                        @click="fetchFrequencyData"
                      >
                        Search
                      </CButton>
                    </CCol>
                  </CRow>
        
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <hr></hr>
          <div style="position: relative">
            <CRow>
              <CCol>
                <ApexCharts
                  v-if="problemFrequencySeries.length > 0"
                  :key="formatKey"
                  type="line"
                  :options="problemFrequencyOptions"
                  :series="problemFrequencySeries"
                  height="700"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CAccordion :active-item-key="activeItem">
                  <CAccordionItem item-key="sparepart-problems">
                    <CAccordionHeader>
                      Sparepart Problems
                    </CAccordionHeader>
                    <CAccordionBody>
                      <CTable striped hover responsive>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Machine</CTableHeaderCell>
                            <CTableHeaderCell>Problem</CTableHeaderCell>
                            <CTableHeaderCell>Part Change</CTableHeaderCell>
                            <CTableHeaderCell>Start Time</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow v-for="problem in paginatedFrequencyProblems" :key="problem.fid">
                            <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
                            <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
                            <CTableDataCell>{{ problem.fpart_change }}</CTableDataCell>
                            <CTableDataCell>{{ formatDate(problem.fstart_time) }}</CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                shape="rounded-pill"
                                color="primary"
                                style="font-size: x-small; font-weight: bold; color: white;"
                                @click="onEditProblem(problem)"
                              >
                                Edit Problem
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                      <CPagination class="mb-3" responsive>
                        <CPaginationItem @click="goToPageFreq(1)" :disabled="currentPageFreq === 1" style="font-size: 0.8em;">First</CPaginationItem>
                        <CPaginationItem v-if="!isSmallScreen" @click="goToPageFreq(currentPageFreq - 1)" :disabled="currentPageFreq === 1">Previous</CPaginationItem>
                        <CPaginationItem v-for="page in visiblePagesFreq" :key="page" @click="goToPageFreq(page)" :active="page === currentPageFreq">{{ page }}</CPaginationItem>
                        <CPaginationItem v-if="!isSmallScreen" @click="goToPageFreq(currentPageFreq + 1)" :disabled="currentPageFreq === totalPagesFreq">Next</CPaginationItem>
                        <CPaginationItem @click="goToPageFreq(totalPagesFreq)" :disabled="currentPageFreq === totalPagesFreq" style="font-size: 0.8em;">Last</CPaginationItem>
                      </CPagination>
                    </CAccordionBody>
                  </CAccordionItem>
                </CAccordion>
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol>
      <div
        style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
        background-color: #FAFAFA;"
        class="p-4"
      >
        <CTabs :activeItemKey="activeTab">
          <CTabList variant="tabs">
            <CTab aria-controls="usage-tab-pane" :itemKey="'usage'">Top Sparepart Usage</CTab>
            <CTab aria-controls="machine-tab-pane" :itemKey="'machine'">Top Machines by Sparepart Changes</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel class="py-3" aria-labelledby="usage-tab-pane" :itemKey="'usage'">
              <div style="position: relative">
                <div v-if="loading" class="table-loading-overlay">
                  <CSpinner color="primary" style="width: 3rem; height: 3rem" />
                  <div style="margin-top: 10px; font-size: 1.2rem; color: #333">
                    Loading...
                  </div>
                </div>
                <div :class="{ 'table-blur': loading }">
                  <CRow class="mb-3">
                    <CCol md="12">
                      <CCard>
                        <CCardBody>
                          <CRow>
                            <CCol md="2">
                              <CFormLabel>Start Date</CFormLabel>
                              <CFormInput type="date" v-model="filterStartDateUsage" />
                            </CCol>
                            <CCol md="2">
                              <CFormLabel>Finish Date</CFormLabel>
                              <CFormInput type="date" v-model="filterFinishDateUsage" />
                            </CCol>
                            <CCol md="3">
                              <CFormLabel>Line</CFormLabel>
                              <Treeselect v-model="selectedLineUsage" :options="lineOptions" :searchable="true" :clearable="true" placeholder="Select line" />
                            </CCol>
                            <CCol md="3">
                              <CFormLabel>Machine</CFormLabel>
                              <Treeselect v-model="selectedMachineUsage" :options="machineOptions" :searchable="true" :clearable="true" placeholder="Select machine" />
                            </CCol>
                            <CCol md="2">
                              <CFormLabel>Search</CFormLabel>
                              <CButton
                                :disabled="loading"
                                style="width: 100%; font-weight: bold; font-size: x-small; color: white;"
                                color="info"
                                @click="fetchUsageData"
                              >
                                <Search size="16" />
                              </CButton>
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </div>
              </div>
              <CRow md="12">
                <CCol md="8">
                  <ApexCharts
                    v-if="sparepartUsageSeries.length > 0"
                    type="bar"
                    :options="sparepartUsageOptions"
                    :series="sparepartUsageSeries"
                    height="630"
                  />
                </CCol>
                <CCol md="4" v-if="topSparepartUsage.length > 0" class="mt-3">
                  <div
                    style="border-radius: 9px; box-shadow: 1px 5px 7px rgba(0,0,0,0.2); color: white;
                    background: white;"
                    class="p-3 mx-auto"
                  >
                    <CCardBody>
                      <div class="sparepart-list">
                        <div class="sparepart-header">
                          <div class="header-cell fw-semibold">Sparepart</div>
                          <div class="header-cell fw-semibold">Number of Changes</div>
                          <div class="header-cell fw-semibold">Details</div>
                        </div>
                        <div v-for="(change, index) in topSparepartUsage" :key="index" class="sparepart-item">
                          <div class="item-cell fw-bold text-dark">{{ change[0] }}</div>
                          <div class="item-cell text-muted">{{ change[1] }}</div>
                          <div class="item-cell">
                            <CButton
                              color="info"
                              size="sm"
                              class="rounded-pill shadow-sm"
                              @click="showUsageDetails(change[0])"
                              style="color: white;"
                            >
                              Details
                            </CButton>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </div>
                </CCol>
                <CCol md="12" v-else class="mt-3">
                  <p>No data available for top sparepart changes.</p>
                </CCol>
              </CRow>
            </CTabPanel>
            <CTabPanel class="py-3" aria-labelledby="machine-tab-pane" :itemKey="'machine'">
              <CRow class="mb-3" md="12">
                <CCol md="12">
                  <CCard>
                    <CCardBody>
                      <CRow>
                        <CCol md="3">
                          <CFormLabel>Start Date</CFormLabel>
                          <CFormInput type="date" v-model="filterStartDateMachine" />
                        </CCol>
                        <CCol md="3">
                          <CFormLabel>Finish Date</CFormLabel>
                          <CFormInput type="date" v-model="filterFinishDateMachine" />
                        </CCol>
                        <CCol md="3">
                          <CFormLabel>Line</CFormLabel>
                          <Treeselect v-model="selectedLineMachine" :options="lineOptions" :searchable="true" :clearable="true" placeholder="Select line" />
                        </CCol>
                        <CCol md="3">
                          <CFormLabel>Search</CFormLabel>
                          <CButton
                            :disabled="loading"
                            style="width: 100%; font-weight: bold; font-size: x-small; color: white;"
                            color="info"
                            @click="fetchMachineData"
                          >
                            <Search size="16" />
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow md="12">
                <CCol md="8">
                  <ApexCharts
                    v-if="sparepartByMachineSeries.length > 0"
                    :key="machineChartKey"
                    type="bar"
                    :options="sparepartByMachineOptions"
                    :series="sparepartByMachineSeries"
                    height="630"
                  />
                </CCol>
                <CCol md="4">
                  <div
                    v-if="topSparepartByMachine.length > 0"
                    style="border-radius: 9px; box-shadow: 1px 5px 7px rgba(0,0,0,0.2); color: white;
                    background: white;"
                    class="p-3 mx-auto mt-3"
                  >
                    <CCardBody>
                      <div class="sparepart-list">
                        <div class="sparepart-header">
                          <div class="header-cell fw-semibold">Machine</div>
                          <div class="header-cell fw-semibold">Number of Changes</div>
                          <div class="header-cell fw-semibold">Details</div>
                        </div>
                        <div v-for="(machine, index) in topSparepartByMachine" :key="index" class="sparepart-item">
                          <div class="item-cell fw-bold text-dark">{{ machine[0] }}</div>
                          <div class="item-cell text-muted">{{ machine[1] }}</div>
                          <div class="item-cell">
                            <CButton
                              color="info"
                              size="sm"
                              class="rounded-pill shadow-sm"
                              @click="showMachineDetails(machine[0])"
                              style="color: white;"
                            >
                              Details
                            </CButton>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </div>
                  <div v-else class="mt-3">
                    <p>No data available for top machines by sparepart changes.</p>
                  </div>
                </CCol>
              </CRow>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
    </CCol>
  </CRow>

  <EditProblemModal
    :visible="editProblemModalVisible"
    :submitData="selectedProblem"
    :machineOptions="machineOptions"
    :lineOptions="lineOptions"
    :modalLoading="modalLoading"
    :memberOption="memberOption"
    @close="editProblemModalVisible = false"
    @submit="onSubmitEditProblem"
  />

  <CModal
    size="lg"
    :visible="machineDetailsModalVisible"
    @close="machineDetailsModalVisible = false"
  >
    <CModalHeader>
      <CModalTitle>Problems for {{ selectedMachine }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Problem</CTableHeaderCell>
            <CTableHeaderCell>Machine Name</CTableHeaderCell>
            <CTableHeaderCell>Line</CTableHeaderCell>
            <CTableHeaderCell>Start Time</CTableHeaderCell>
            <CTableHeaderCell>Part Change</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="problem in selectedMachineProblems" :key="problem.fid">
            <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
            <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
            <CTableDataCell>{{ problem.fline }}</CTableDataCell>
            <CTableDataCell>{{ formatDate(problem.fstart_time) }}</CTableDataCell>
            <CTableDataCell>{{ problem.fpart_change }}</CTableDataCell>
            <CTableDataCell>
              <CButton
                shape="rounded-pill"
                color="primary"
                style="font-size: x-small; font-weight: bold; color: white;"
                @click="onEditProblem(problem)"
              >
                Edit Problem
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CModalBody>
  </CModal>

  <CModal
    size="lg"
    :visible="usageDetailsModalVisible"
    @close="usageDetailsModalVisible = false"
  >
    <CModalHeader>
      <CModalTitle>Problems for Sparepart: {{ selectedSparepart }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Problem</CTableHeaderCell>
            <CTableHeaderCell>Machine Name</CTableHeaderCell>
            <CTableHeaderCell>Line</CTableHeaderCell>
            <CTableHeaderCell>Start Time</CTableHeaderCell>
            <CTableHeaderCell>Part Change</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="problem in selectedSparepartProblems" :key="problem.fid">
            <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
            <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
            <CTableDataCell>{{ problem.fline }}</CTableDataCell>
            <CTableDataCell>{{ formatDate(problem.fstart_time) }}</CTableDataCell>
            <CTableDataCell>{{ problem.fpart_change }}</CTableDataCell>
            <CTableDataCell>
              <CButton
                shape="rounded-pill"
                color="primary"
                style="font-size: x-small; font-weight: bold; color: white;"
                @click="onEditProblem(problem)"
              >
                Edit Problem
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </CModalBody>
  </CModal>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText, CoffCanvas, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CFormCheck, CRow, CCol, CPagination, CPaginationItem, CFormLabel, CInputGroup, CInputGroupText, CFormInput, CFormSelect, CModal, CModalHeader, CModalTitle, CModalBody, CTabs, CTabList, CTab, CTabContent, CTabPanel, CSpinner } from '@coreui/vue';
import api from '../apis/CommonAPI'
import EditProblemModal from '@/views/ProblemHistory/EditProblemModal.vue'
import {
  AlertTriangle,
  Clock,
  Timer,
  History,
  BarChart2,
  FileText,
  CalendarClock,
  ChartColumnIncreasing,
  BookText,
  Search,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import ApexCharts from 'vue3-apexcharts'
const visibleStaticBackdropDemo = ref(false);
const visibleEnd = ref(false)

export default {
  name: 'Dashboard',
  data() {
    return {
      windowWidth: window.innerWidth,
      problemFrequencySeries: [],
      problemFrequencyOptions: {},
      formatKey: 0,
      sparepartUsageSeries: [],
      sparepartUsageOptions: {},
      sparepartByMachineSeries: [],
      sparepartByMachineOptions: {},
      problemsWithSparepartChanges: [],
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 0,
      currentPageFreq: 1,
      pageSizeFreq: 10,
      totalRecordsFreq: 0,
      totalPagesFreq: 0,
      lineOptions: [],
      machineOptions: [],
      filterStartDate: moment().startOf('year').format('YYYY-MM-DD'),
      filterFinishDate: moment().format('YYYY-MM-DD'),
      selectedLine: null,
      selectedMachineName: null,
      selectedProblem: '',
      loading: false,
      // Filters for frequency chart
      filterStartDateFreq: moment().startOf('year').format('YYYY-MM-DD'),
      filterFinishDateFreq: moment().format('YYYY-MM-DD'),
      selectedLineFreq: null,
      selectedMachineNameFreq: null,
      selectedProblemFreq: '',
      selectedTimeFreq: 'machines',
      // Filters for usage chart
      filterStartDateUsage: moment().startOf('year').format('YYYY-MM-DD'),
      filterFinishDateUsage: moment().format('YYYY-MM-DD'),
      selectedLineUsage: null,
      selectedMachineUsage: null,
      // Filters for machine chart
      filterStartDateMachine: moment().startOf('year').format('YYYY-MM-DD'),
      filterFinishDateMachine: moment().format('YYYY-MM-DD'),
      selectedLineMachine: null,
      // Data for each chart
      frequencyProblems: [],
      usageProblems: [],
      machineProblems: [],
      topSparepartUsage: [],
      topSparepartByMachine: [],
      activeItem: null,
      activeItemKey: 1,
      activeTab: 'usage',
      machineChartKey: 0,

      submit: {
        machineName: null,
        lineName: null,
      },
      // Filters for maker chart
      filterStartDateMaker: moment().startOf('year').format('YYYY-MM-DD'),
      filterFinishDateMaker: moment().format('YYYY-MM-DD'),
      selectedLineMaker: null,
      // Data for maker chart
      makerProblems: [],
      sparepartByMakerSeries: [],
      sparepartByMakerOptions: {},
      machineToMaker: {},
      editProblemModalVisible: false,
      selectedProblem: null,
      modalLoading: false,
      memberOption: [],
      machineDetailsModalVisible: false,
      selectedMachine: '',
      selectedMachineProblems: [],
      usageDetailsModalVisible: false,
      selectedSparepart: '',
      selectedSparepartProblems: [],
    }
  },

  computed: {
    isSmallScreen() {
      return this.windowWidth < 360
    },
    visiblePages() {
      const total = this.totalPages
      const current = this.currentPage
      const maxVisible = 5
      let start = Math.max(1, current - Math.floor(maxVisible / 2))
      let end = start + maxVisible - 1

      if (end > total) {
        end = total
        start = Math.max(1, end - maxVisible + 1)
      }

      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },
    paginatedProblems() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.problemsWithSparepartChanges.slice(start, end)
    },
    paginatedFrequencyProblems() {
      const start = (this.currentPageFreq - 1) * this.pageSizeFreq
      const end = start + this.pageSizeFreq
      return this.frequencyProblems.slice(start, end)
    },
    visiblePagesFreq() {
      const total = this.totalPagesFreq
      const current = this.currentPageFreq
      const maxVisible = 5
      let start = Math.max(1, current - Math.floor(maxVisible / 2))
      let end = start + maxVisible - 1

      if (end > total) {
        end = total
        start = Math.max(1, end - maxVisible + 1)
      }

      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },

  components: {
    AlertTriangle,
    Clock,
    Timer,
    History,
    BarChart2,
    FileText,
    CalendarClock,
    ChartColumnIncreasing,
    BookText,
    Search,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CoffCanvas,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    Treeselect,
    CPagination,
    CPaginationItem,
    EditProblemModal,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
    ApexCharts,
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowWidth)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth)
  },

  watch: {
  },

  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    async fetchProblems(page = 1, filters = {}) {
      this.loading = true;
      try {
        const {
          filterStartDate = this.filterStartDate,
          filterFinishDate = this.filterFinishDate,
          selectedLine = this.selectedLine,
          selectedMachineName = this.selectedMachineName,
          selectedProblem = this.selectedProblem,
        } = filters;

        let machineLabel = undefined;
        if (filters.selectedMachineName) {
          const machine = this.machineOptions.find(m => m.id === filters.selectedMachineName);
          if (machine) {
            machineLabel = machine.label;
          }
        }

        const params = {
          limitView: 'sparepart',
          page,
          limit: this.pageSize,
          startDate: filterStartDate && filterStartDate !== '' ? filterStartDate : undefined,
          finishDate: filterFinishDate && filterFinishDate !== '' ? filterFinishDate : undefined,
          line: selectedLine && selectedLine !== null ? selectedLine : undefined,
          machineName: machineLabel || undefined,
          problem: selectedProblem && selectedProblem !== '' ? selectedProblem : undefined,
        };

        const response = await api.get('/smartandon/problemView', {
          search: JSON.stringify(params),
        });
        if (response.status !== 200) {
          throw new Error('Failed to fetch problems, status: ' + response.status);
        }

        const problems = response.data.data;
        this.problemsWithSparepartChanges = problems;
        this.totalRecords = response.data.total;
        this.currentPage = response.data.page;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);


      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        this.loading = false;
      }
    },

    generateFrequencyChart(problems) {
      let frequencyMap = {};
      let sortedKeys = [];
      let title = 'Sparepart Change Frequency Over Time';
      if (this.selectedTimeFreq === 'machines') {
        // Group by machine
        problems.forEach(problem => {
          const key = problem.fmc_name || 'Unknown';
          frequencyMap[key] = (frequencyMap[key] || 0) + 1;
        });
        sortedKeys = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1]).map(([key]) => key);
        title = 'Sparepart Changes by Machine';
      } else {
        // Group by date or month
        problems.forEach(problem => {
          let key;
          if (this.selectedTimeFreq === 'monthly') {
            key = new Date(problem.fstart_time).toISOString().slice(0, 7); // YYYY-MM
          } else {
            key = new Date(problem.fstart_time).toISOString().split('T')[0]; // YYYY-MM-DD
          }
          frequencyMap[key] = (frequencyMap[key] || 0) + 1;
        });
        sortedKeys = Object.keys(frequencyMap).sort();
      }
      // Set series
      this.problemFrequencySeries = [{
        name: 'Sparepart Changes',
        type: 'column',
        data: sortedKeys.map(key => frequencyMap[key])
      }];
      // Set options
      this.problemFrequencyOptions = {
        chart: {
          height: 700,
          type: 'line',
        },
        colors: ['#ff007b'],
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
        stroke: {
          width: [4]
        },
        fill: {
          opacity: 0.8
        },
        title: {
          text: title
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        xaxis: {
          categories: sortedKeys
        },
        yaxis: [{
          title: {
            text: 'Frequency',
          },
        }],
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 400
            }
          }
        }, {
          breakpoint: 480,
          options: {
            chart: {
              height: 300
            }
          }
        }]
      };
      this.formatKey = Date.now();
    },

    generateUsageChart(problems) {
      // Sparepart usage frequency
      const sparepartMap = {};
      problems.forEach(problem => {
        let parts = [];
        if (problem.fpart_change) {
          if (typeof problem.fpart_change === 'string') {
            try {
              const parsed = JSON.parse(problem.fpart_change);
              if (Array.isArray(parsed)) {
                parts = parsed.map(p => p.toString().trim());
              } else {
                parts = problem.fpart_change.split(',').map(p => p.trim());
              }
            } catch {
              parts = problem.fpart_change.split(',').map(p => p.trim());
            }
          } else if (Array.isArray(problem.fpart_change)) {
            parts = problem.fpart_change.map(p => p.toString().trim());
          }
        }
        parts.forEach(part => {
          if (part) {
            sparepartMap[part] = (sparepartMap[part] || 0) + 1;
          }
        });
      });
      const sortedSpareparts = Object.entries(sparepartMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
      this.sparepartUsageSeries = [{
        name: 'Usage Count',
        type: 'column',
        data: sortedSpareparts.map(([name, count]) => count)
      }];
      this.sparepartUsageOptions = {
        chart: {
          height: 630,
          type: 'bar',
        },
        colors: ['#833AB4'],
        plotOptions: {
          bar: {
            borderRadius: 20,
            dataLabels: {
              position: 'top'
            }
          },
        },
        stroke: {
          width: [0]
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: ['#00D4FF', '#833AB4'],
            inverseColors: false,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [0, 75, 100]
          }
        },
        title: {
          text: 'Top 10 Sparepart Usage Frequency'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0],
          position: 'top',
          style: {
            fontSize: '14px',
            colors: ['#333']
          },
          offsetY: -20
        },
        xaxis: {
          categories: sortedSpareparts.map(([name]) => name)
        },
        yaxis: [{
          title: {
            text: 'Usage Count',
          },
        }],
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            }
          }
        }, {
          breakpoint: 480,
          options: {
            chart: {
              height: 250
            }
          }
        }]
      };
    },

    generateMachineChart(problems) {
      // Sparepart changes by machine
      const machineMap = {};
      problems.forEach(problem => {
        const machineName = problem.fmc_name || 'Unknown';
        machineMap[machineName] = (machineMap[machineName] || 0) + 1;
      });
      const sortedMachines = Object.entries(machineMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
      this.sparepartByMachineSeries = [{
        name: 'Change Count',
        type: 'column',
        data: sortedMachines.map(([name, count]) => count)
      }];
      this.sparepartByMachineOptions = {
        chart: {
          height: 630,
          type: 'bar',
        },
        colors: ['#00FF99'],
        plotOptions: {
          bar: {
            borderRadius: 20,
          },
        },
        stroke: {
          width: [0]
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: ['#00D4FF', '#833AB4'],
            inverseColors: false,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [0, 75, 100]
          }
        },
        title: {
          text: 'Top 10 Machines by Sparepart Changes'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        xaxis: {
          categories: sortedMachines.map(([name]) => name),
          labels: {
            rotate: -45,
            rotateAlways: true,
            style: {
              fontSize: '12px',
            },
            trim: false,
            hideOverlappingLabels: false,
          }
        },
        yaxis: [{
          title: {
            text: 'Change Count',
          },
        }],
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            }
          }
        }, {
          breakpoint: 480,
          options: {
            chart: {
              height: 250
            }
          }
        }]
      };
      this.machineChartKey = Date.now();
      this.topSparepartByMachine = sortedMachines;
    },

    resetFilters() {
      this.filterStartDate = '';
      this.filterFinishDate = '';
      this.selectedMachineName = null;
      this.selectedLine = null;
      this.selectedProblem = '';
      this.currentPage = 1;
      this.fetchProblems(this.currentPage, {
        filterStartDate: this.filterStartDate,
        filterFinishDate: this.filterFinishDate,
        selectedLine: this.selectedLine,
        selectedMachineName: this.selectedMachineName,
        selectedProblem: this.selectedProblem,
      });
    },

    resetFreqFilters() {
      this.filterStartDateFreq = moment().startOf('year').format('YYYY-MM-DD');
      this.filterFinishDateFreq = moment().format('YYYY-MM-DD');
      this.selectedLineFreq = null;
      this.selectedMachineNameFreq = null;
      this.selectedProblemFreq = '';
      this.selectedTimeFreq = 'monthly';
    },

    onMachineInput() {
      console.log('Machine input changed:', this.selectedMachineName);
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchProblems(page, {
          filterStartDate: this.filterStartDate,
          filterFinishDate: this.filterFinishDate,
          selectedLine: this.selectedLine,
          selectedMachineName: this.selectedMachineName,
          selectedProblem: this.selectedProblem,
        });
      }
    },

    goToPageFreq(page) {
      if (page >= 1 && page <= this.totalPagesFreq) {
        this.currentPageFreq = page;
      }
    },

    async fetchFrequencyData() {
      try {
        let machineLabel = undefined;
        if (this.selectedMachineNameFreq) {
          const machine = this.machineOptions.find(m => m.id === this.selectedMachineNameFreq);
          if (machine) machineLabel = machine.label;
        }
        const params = {
          limitView: 'sparepart',
          startDate: this.filterStartDateFreq,
          finishDate: this.filterFinishDateFreq,
          line: this.selectedLineFreq,
          machineName: machineLabel,
          problem: this.selectedProblemFreq,
        };
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        this.frequencyProblems = response.data.data;
        this.totalRecordsFreq = this.frequencyProblems.length;
        this.currentPageFreq = 1;
        this.totalPagesFreq = Math.ceil(this.totalRecordsFreq / this.pageSizeFreq);
        this.activeItem = this.frequencyProblems.length > 0 ? 'sparepart-problems' : null;
        this.generateFrequencyChart(this.frequencyProblems);
      } catch (error) {
        console.error('Failed to fetch frequency data:', error);
      }
    },

    async fetchUsageData() {
      try {
        let machineLabel = undefined;
        if (this.selectedMachineUsage) {
          const machine = this.machineOptions.find(m => m.id === this.selectedMachineUsage);
          if (machine) machineLabel = machine.label;
        }
        const params = {
          limitView: 'sparepart',
          startDate: this.filterStartDateUsage,
          finishDate: this.filterFinishDateUsage,
          line: this.selectedLineUsage,
          machineName: machineLabel,
        };
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        this.usageProblems = response.data.data;
        this.generateUsageChart(this.usageProblems);
        this.generateTopSparepartUsage(this.usageProblems);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      }
    },

    async fetchMachineData() {
      try {
        const params = {
          limitView: 'sparepart',
          startDate: this.filterStartDateMachine,
          finishDate: this.filterFinishDateMachine,
          line: this.selectedLineMachine,
        };
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        this.machineProblems = response.data.data;
        this.generateMachineChart(this.machineProblems);
        this.generateTopSparepartUsage(this.machineProblems);
      } catch (error) {
        console.error('Failed to fetch machine data:', error);
      }
    },

    generateTopSparepartUsage(problems) {
      // Sparepart changes frequency
      const sparepartMap = {};
      problems.forEach(problem => {
        let parts = [];
        if (problem.fpart_change) {
          if (typeof problem.fpart_change === 'string') {
            try {
              const parsed = JSON.parse(problem.fpart_change);
              if (Array.isArray(parsed)) {
                parts = parsed.map(p => p.toString().trim());
              } else {
                parts = problem.fpart_change.split(',').map(p => p.trim());
              }
            } catch {
              parts = problem.fpart_change.split(',').map(p => p.trim());
            }
          } else if (Array.isArray(problem.fpart_change)) {
            parts = problem.fpart_change.map(p => p.toString().trim());
          }
        }
        parts.forEach(part => {
          if (part) {
            sparepartMap[part] = (sparepartMap[part] || 0) + 1;
          }
        });
      });
      this.topSparepartUsage = Object.entries(sparepartMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    },

    async onEditProblem(problem) {
      try {
        this.modalLoading = true
        const response = await api.get(`/smartandon/problemId/${problem.fid}`)
        if (response.status !== 200) {
          throw new Error('Failed to fetch problem, status: ' + response.status)
        }
        const problemData = response.data
        console.log('Problem data:', problemData)
    this.selectedProblem = this.mapProblemDataToSubmit(problemData)
    console.log('Submit data sent to EditProblemModal:', JSON.stringify(this.selectedProblem, null, 2))
    this.machineDetailsModalVisible = false
    this.usageDetailsModalVisible = false
    this.editProblemModalVisible = true
      } catch (error) {
        alert('Failed to load problem data: ' + error.message)
        console.error(error)
      } finally {
        this.modalLoading = false
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

    async onSubmitEditProblem(submitData) {
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
          alert('Input updated successfully')
          this.editProblemModalVisible = false
          this.selectedProblem = null
          // Refresh the frequency data
          await this.fetchFrequencyData()
        } else {
          throw new Error('Failed to update input, status: ' + response.status)
        }
      } catch (error) {
        console.error(error)
        alert('Error updating input: ' + error.message)
      }
    },

    async showMachineDetails(machineName) {
      this.selectedMachine = machineName;
      try {
        const params = {
          limitView: 'sparepart',
          startDate: this.filterStartDateMachine,
          finishDate: this.filterFinishDateMachine,
          line: this.selectedLineMachine,
          machineName: machineName,
        };
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        this.selectedMachineProblems = response.data.data;
        this.machineDetailsModalVisible = true;
      } catch (error) {
        console.error('Failed to fetch machine details:', error);
      }
    },

    async showUsageDetails(sparepartName) {
      this.selectedSparepart = sparepartName;
      try {
        let machineLabel = undefined;
        if (this.selectedMachineUsage) {
          const machine = this.machineOptions.find(m => m.id === this.selectedMachineUsage);
          if (machine) machineLabel = machine.label;
        }
        const params = {
          limitView: 'sparepart',
          startDate: this.filterStartDateUsage,
          finishDate: this.filterFinishDateUsage,
          line: this.selectedLineUsage,
          machineName: machineLabel,
        };
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        // Client-side filter for problems containing the sparepart
        const allProblems = response.data.data;
        const filteredProblems = allProblems.filter(problem => {
          let parts = [];
          if (problem.fpart_change) {
            if (typeof problem.fpart_change === 'string') {
              try {
                const parsed = JSON.parse(problem.fpart_change);
                if (Array.isArray(parsed)) {
                  parts = parsed.map(p => p.toString().trim());
                } else {
                  parts = problem.fpart_change.split(',').map(p => p.trim());
                }
              } catch {
                parts = problem.fpart_change.split(',').map(p => p.trim());
              }
            } else if (Array.isArray(problem.fpart_change)) {
              parts = problem.fpart_change.map(p => p.toString().trim());
            }
          }
          return parts.includes(sparepartName);
        });
        this.selectedSparepartProblems = filteredProblems;
        this.usageDetailsModalVisible = true;
      } catch (error) {
        console.error('Failed to fetch usage details:', error);
      }
    },
  },

  async created() {
    try {
      const response = await api.get('/smartandon/machine');
      if (response.status !== 200) {
        throw new Error('Failed to fetch machines, status: ' + response.status);
      }
      this.machines = response.data?.data || response.data;
      this.machineOptions = this.machines.map(machine => ({
        id: machine.fid,
        label: machine.fmc_name
      }));
      // Extract unique makers from machines data, excluding 'unknown'
      this.makerOptions = [...new Set(this.machines.map(machine => machine.fmaker).filter(maker => maker && maker.trim() !== '' && maker.toLowerCase() !== 'unknown'))].map(maker => ({
        id: maker,
        label: maker
      }));
      // Fetch lines from dedicated endpoint
      try {
        const lineResponse = await api.get('/smartandon/line');
        this.lineOptions = lineResponse.data.map(line => ({
          id: line.fid,
          label: line.fline
        }));
      } catch (error) {
        console.error('Failed to fetch lines:', error);
        this.lineOptions = [];
      }
      // Fetch members
      try {
        const memberResponse = await api.get('/smartandon/member');
        this.memberOption = memberResponse.data.map(member => ({
          id: member.fid,
          label: member.fname
        }));
      } catch (error) {
        console.error('Failed to fetch members:', error);
        this.memberOption = [];
      }
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
    await this.fetchProblems();
    await this.fetchFrequencyData();
    await this.fetchUsageData();
    await this.fetchMachineData();
  },
}
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

.aesthetic-table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.aesthetic-table thead th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  padding: 15px 10px;
}

.aesthetic-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.aesthetic-table tbody tr:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.aesthetic-table tbody td {
  padding: 12px 10px;
  vertical-align: middle;
  border: none;
}

.aesthetic-table tbody tr:nth-child(even) {
  background: rgba(0, 0, 0, 0.02);
}

.aesthetic-table tbody tr:nth-child(even):hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
}

.aesthetic-table .btn {
  transition: all 0.3s ease;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 12px;
  font-weight: bold;
}

.aesthetic-table .btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.sparepart-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sparepart-header {
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  background: #343a40;
  color: white;
  padding: 5px;
  border-radius: 50px;
  font-weight: bold;
  text-align: center;
}

.sparepart-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  background: white;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  transition: all 0.3s ease;
  align-items: center;
}

.sparepart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-cell {
  text-align: center;
  padding: 5px;
}

.header-cell {
  text-align: center;
}

.table-blur {
  filter: blur(2px);
}

.table-loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffffcc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-tabs .nav-link {
  color: #0099ff;
}

.nav-tabs .nav-link.active {
  color: black;
}

</style>
