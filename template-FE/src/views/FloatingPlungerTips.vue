<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardBody>
          <!-- Filter Section -->
          <CRow class="mb-3">
            <CCol lg="4" class="mb-3">
              <CFormLabel for="startDate" class="fw-bold">Start Date</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1">
                  <Clock size="16" />
                </CInputGroupText>
                <CFormInput
                  id="startDate"
                  type="date"
                  v-model="startDate"
                  aria-label="Start Date"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
            </CCol>
            <CCol lg="4" class="mb-3">
              <CFormLabel for="endDate" class="fw-bold">End Date</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon2">
                  <Clock size="16" />
                </CInputGroupText>
                <CFormInput
                  id="endDate"
                  type="date"
                  v-model="endDate"
                  aria-label="End Date"
                  aria-describedby="basic-addon2"
                />
              </CInputGroup>
            </CCol>

            <CCol lg="4" class="mb-3">
              <CFormLabel for="machineSelect" class="fw-bold">Machine</CFormLabel>
              <Treeselect
                id="machineSelect"
                :searchable="true"
                :clearable="true"
                :multiple="false"
                :children="false"
                v-model="selectedMachines"
                :options="machineOptions"
                placeholder="All Machines"
                :value-consists-of="'LEAF_PRIORITY'"
                :value-key="'id'"
                :label-key="'label'"
                @input="handleMachineChange"
              />
            </CCol>
          </CRow>

          <hr></hr>
          <CRow lg="12" class="mb-3">
            <CCol lg="3" class="mb-3">
              <CButton variant="outline" style="width: 100%;" color="dark" @click="resetFilters">
                Reset
              </CButton>
            </CCol>
            <CCol lg="9" class="mb-3">
              <CButton style="width: 100%; color: white;" color="info" @click="fetchProblems">
                Filter
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  
  <CRow>
    <CCol>
      <div class="main-card">
        <CCardBody>
          <!-- Chart Section with Tabs -->
          <CRow class="mb-3">
            <CCol>
              <CCard>
                <CCardBody>
                  <CRow>
                    <CCol>
                      <CButton
                        color="primary"
                        size="lg"
                        style="
                          font-size: medium;
                          font-weight: 600;
                          color: white;
                          width: 100%;
                        "
                        @click="openAddModal"
                      >Add Record</CButton>
                    </CCol>
                  </CRow>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CTabs :activeItemKey="activeTab">
            <CTabList variant="tabs">
              <CTab aria-controls="charts-tab-pane" :itemKey="'charts'">Charts</CTab>
              <CTab aria-controls="table-tab-pane" :itemKey="'table'">Table</CTab>
            </CTabList>
            <CTabContent>
              <CTabPanel class="py-3" aria-labelledby="charts-tab-pane" :itemKey="'charts'">
                <!-- ikdm-0102 Charts First -->
                <div v-if="!selectedMachineLabel || selectedMachineLabel.includes('0102')">
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Upper Gap Tip for IKDM-0102</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesUpperGap0102[0]?.data?.length > 0 && chartOptionsUpperGap0102" type="line" height="350" :options="chartOptionsUpperGap0102" :series="chartSeriesUpperGap0102"></apexchart>
                          <div v-else>No data available for Upper Gap Tip IKDM-0102</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Upper Depth Tip for IKDM-0102</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesUpperDepth0102[0]?.data?.length > 0 && chartOptionsUpperDepth0102" type="line" height="350" :options="chartOptionsUpperDepth0102" :series="chartSeriesUpperDepth0102"></apexchart>
                          <div v-else>No data available for Upper Depth Tip IKDM-0102</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Lower Gap Tip for IKDM-0102</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesLowerGap0102[0]?.data?.length > 0 && chartOptionsLowerGap0102" type="line" height="350" :options="chartOptionsLowerGap0102" :series="chartSeriesLowerGap0102"></apexchart>
                          <div v-else>No data available for Lower Gap Tip IKDM-0102</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Lower Depth Tip for IKDM-0102</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesLowerDepth0102[0]?.data?.length > 0 && chartOptionsLowerDepth0102" type="line" height="350" :options="chartOptionsLowerDepth0102" :series="chartSeriesLowerDepth0102"></apexchart>
                          <div v-else>No data available for Lower Depth Tip IKDM-0102</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </div>

                <!-- ikdm-0101 Charts Second -->
                <div v-if="!selectedMachineLabel || selectedMachineLabel.includes('0101')">
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Upper Gap Tip for IKDM-0101</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesUpperGap0101[0]?.data?.length > 0 && chartOptionsUpperGap0101" type="line" height="350" :options="chartOptionsUpperGap0101" :series="chartSeriesUpperGap0101"></apexchart>
                          <div v-else>No data available for Upper Gap Tip IKDM-0101</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Upper Depth Tip for IKDM-0101</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesUpperDepth0101[0]?.data?.length > 0 && chartOptionsUpperDepth0101" type="line" height="350" :options="chartOptionsUpperDepth0101" :series="chartSeriesUpperDepth0101"></apexchart>
                          <div v-else>No data available for Upper Depth Tip IKDM-0101</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Lower Gap Tip for IKDM-0101</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesLowerGap0101[0]?.data?.length > 0 && chartOptionsLowerGap0101" type="line" height="350" :options="chartOptionsLowerGap0101" :series="chartSeriesLowerGap0101"></apexchart>
                          <div v-else>No data available for Lower Gap Tip IKDM-0101</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CRow class="mb-3">
                    <CCol lg="12" class="mb-3">
                      <CCard class="chart-card">
                        <CCardHeader>
                          <strong>Lower Depth Tip for IKDM-0101</strong>
                        </CCardHeader>
                        <CCardBody>
                          <div v-if="chartLoading" class="text-center">Loading chart...</div>
                          <apexchart v-else-if="chartSeriesLowerDepth0101[0]?.data?.length > 0 && chartOptionsLowerDepth0101" type="line" height="350" :options="chartOptionsLowerDepth0101" :series="chartSeriesLowerDepth0101"></apexchart>
                          <div v-else>No data available for Lower Depth Tip IKDM-0101</div>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </div>
              </CTabPanel>
              <CTabPanel class="py-3" aria-labelledby="table-tab-pane" :itemKey="'table'">
                <!-- Table Content -->
                <CRow>
                  <CCol>
                    <!-- Table -->
                    <CTable bordered hover responsive class="hour-table">
                      <CTableHead color="dark">
                        <CTableRow>
                          <CTableHeaderCell scope="col" style="width: 1%; text-align: center;">No</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Machine Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Check Date</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Tip Counter</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Sleeve Counter</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Spruebush Counter</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Upper Gap Tip</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Upper Depth Tip</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Lower Gap Tip</CTableHeaderCell>
                          <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Lower Depth Tip</CTableHeaderCell>
                          <CTableHeaderCell>Notes</CTableHeaderCell>
                          <CTableHeaderCell>Action</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow v-for="(tip, idx) in problems" :key="tip.id">
                          <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                          <CTableDataCell>{{ tip.machine_nm }}</CTableDataCell>
                          <CTableDataCell>{{ formatDateTimeDisplay(tip.check_date) }}</CTableDataCell>
                          <CTableDataCell>{{ tip.tip_counter }}</CTableDataCell>
                          <CTableDataCell>{{ tip.sleeve_counter }}</CTableDataCell>
                          <CTableDataCell>{{ tip.spruebush_counter }}</CTableDataCell>
                          <CTableDataCell>{{ tip.upper_gap_tip }}</CTableDataCell>
                          <CTableDataCell>{{ tip.upper_depth_tip }}</CTableDataCell>
                          <CTableDataCell>{{ tip.lower_gap_tip }}</CTableDataCell>
                          <CTableDataCell>{{ tip.lower_depth_tip }}</CTableDataCell>
                          <CTableDataCell>{{ tip.notes }}</CTableDataCell>
                          <CTableDataCell style="text-align: center;">
                            <div style="display: flex; justify-content: center; gap: 5px;">
                              <CButton
                                color="secondary"
                                style="
                                  font-size: x-small;
                                  font-weight: bold;
                                  color: white;
                                  padding: 6px 8px;
                                "
                                @click="openEditModal(tip)"
                              >
                                <Edit size="16" />
                              </CButton>
                              <CButton
                                color="primary"
                                style="
                                  font-size: x-small;
                                  font-weight: bold;
                                  color: white;
                                  padding: 6px 8px;
                                "
                                @click="confirmDelete(tip)"
                                :disabled="isDeleting"
                              >
                                <Trash2 size="16" />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
              </CTabPanel>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </div>
    </CCol>
  </CRow>

  <!-- Add/Edit Record Modal -->
  <CModal
    :visible="showModal"
    @close="closeModal"
    size="lg"
  >
    <CModalHeader>
      <CModalTitle>{{ modalMode === 'add' ? 'Add Floating Plunger Tip Record' : 'Edit Floating Plunger Tip Record' }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CRow class="mb-3">
          <CCol lg="6">
            <div class="mb-3">
              <CFormLabel for="machine_nm" class="fw-bold">Machine Name *</CFormLabel>
              <CFormSelect
                id="machine_nm"
                v-model="newRecord.machine_nm"
                :options="machineSelectOptions"
                placeholder="Select Machine"
              />
            </div>
            <div class="mb-3">
              <CFormLabel for="check_date" class="fw-bold">Check Date & Time *</CFormLabel>
              <CFormInput
                id="check_date"
                type="datetime-local"
                v-model="newRecord.check_date"
              />
            </div>
            <div class="mb-3">
              <CFormLabel for="tip_counter">Counter Tip</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="tip_counter"
                  type="number"
                  step="any"
                  v-model="newRecord.tip_counter"
                  placeholder="Enter counter tip"
                />
                <CInputGroupText>shot</CInputGroupText>
              </CInputGroup>
            </div>
            <div class="mb-3">
              <CFormLabel for="sleeve_counter">Counter Sleeve</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="sleeve_counter"
                  type="number"
                  step="any"
                  v-model="newRecord.sleeve_counter"
                  placeholder="Enter counter sleeve"
                />
                <CInputGroupText>shot</CInputGroupText>
              </CInputGroup>
            </div>
            <div class="mb-3">
              <CFormLabel for="spruebush_counter">Counter Spruebush</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="spruebush_counter"
                  type="number"
                  step="any"
                  v-model="newRecord.spruebush_counter"
                  placeholder="Enter counter spruebush"
                />
                <CInputGroupText>shot</CInputGroupText>
              </CInputGroup>
            </div>
          </CCol>
          <CCol lg="6">
            <div class="mb-3">
              <CFormLabel for="upper_gap_tip">Celah Tip Atas</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="upper_gap_tip"
                  type="number"
                  step="any"
                  v-model="newRecord.upper_gap_tip"
                  placeholder="Enter upper gap tip"
                />
                <CInputGroupText>mm</CInputGroupText>
              </CInputGroup>
            </div>
            <div class="mb-3">
              <CFormLabel for="upper_depth_tip">Kedalaman Tip Atas</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="upper_depth_tip"
                  type="number"
                  step="any"
                  v-model="newRecord.upper_depth_tip"
                  placeholder="Enter upper depth tip"
                />
                <CInputGroupText>mm</CInputGroupText>
              </CInputGroup>
            </div>
            <div class="mb-3">
              <CFormLabel for="lower_gap_tip">Celah Tip Bawah</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="lower_gap_tip"
                  type="number"
                  step="any"
                  v-model="newRecord.lower_gap_tip"
                  placeholder="Enter lower gap tip"
                />
                <CInputGroupText>mm</CInputGroupText>
              </CInputGroup>
            </div>
            <div class="mb-3">
              <CFormLabel for="lower_depth_tip">Kedalaman Tip Bawah</CFormLabel>
              <CInputGroup>
                <CFormInput
                  id="lower_depth_tip"
                  type="number"
                  step="any"
                  v-model="newRecord.lower_depth_tip"
                  placeholder="Enter lower depth tip"
                />
                <CInputGroupText>mm</CInputGroupText>
              </CInputGroup>
            </div>
            <div class="mb-3">
              <CFormLabel for="notes">Notes</CFormLabel>
              <CFormTextarea
                id="notes"
                v-model="newRecord.notes"
                placeholder="Enter notes"
                rows="3"
              />
            </div>
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol lg="6">
          </CCol>
          <CCol lg="6">
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Cancel
      </CButton>
      <CButton color="primary" @click="submitRecord()" :disabled="isSubmitting">
        {{ isSubmitting ? (modalMode === 'add' ? 'Saving...' : 'Updating...') : (modalMode === 'add' ? 'Save Record' : 'Update Record') }}
      </CButton>
    </CModalFooter>
  </CModal>



  <!-- Delete Confirmation Modal -->
  <CModal
    :visible="showDeleteModal"
    @close="closeDeleteModal"
    size="md"
    backdrop="static"
  >
    <CModalHeader>
      <CModalTitle>Confirm Delete</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <p>Are you sure you want to delete this floating plunger tip record?</p>
      <p><strong>Machine:</strong> {{ itemToDelete ? itemToDelete.machine_nm : '' }}</p>
      <p><strong>Date:</strong> {{ itemToDelete ? formatDate(itemToDelete.check_date) : '' }}</p>
      <p><strong>Notes:</strong> {{ itemToDelete ? itemToDelete.notes : '' }}</p>
      <p class="text-danger">This action cannot be undone.</p>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeDeleteModal">
        Cancel
      </CButton>
      <CButton color="danger" @click="proceedDelete">
        Delete
      </CButton>
    </CModalFooter>
  </CModal>

</template>
<script>
import { ref, computed } from 'vue'
import moment from 'moment'
import { CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CFormSelect, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormLabel, CFormTextarea, CInputGroup, CInputGroupText, CTabs, CTabList, CTab, CTabContent, CTabPanel } from '@coreui/vue';
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { BarChart3, AlertTriangle, CheckCircle2, Plus, Trash2, Edit, Clock } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import api from '../apis/CommonAPI'

export default {
  name: 'Dashboard',
  data() {
    return {
      problems: [],
      loading: false,
      chartLoading: false,
      problemName: '',
      startDate: '',
      endDate: '',
      selectedMachines: null,
      machineOptions: [],
      machines: [],
      chartData0101: [],
      chartData0102: [],
      // Fixed 4 charts
      chartOptionsUpperGap0101: {},
      chartSeriesUpperGap0101: [],
      chartOptionsUpperDepth0101: {},
      chartSeriesUpperDepth0101: [],
      chartOptionsLowerGap0101: {},
      chartSeriesLowerGap0101: [],
      chartOptionsLowerDepth0101: {},
      chartSeriesLowerDepth0101: [],
      chartOptionsUpperGap0102: {},
      chartSeriesUpperGap0102: [],
      chartOptionsUpperDepth0102: {},
      chartSeriesUpperDepth0102: [],
      chartOptionsLowerGap0102: {},
      chartSeriesLowerGap0102: [],
      chartOptionsLowerDepth0102: {},
      chartSeriesLowerDepth0102: [],
      // Summary data
      totalTips0101: 0,
      totalTips0102: 0,
      // Error handling
      fetchError: null,
      retryCount: 0,
      activeTab: 'charts',
      // Modal data
      showModal: false,
      modalMode: 'add', // 'add' or 'edit'
      isSubmitting: false,
      isDeleting: false,
      showDeleteModal: false,
      itemToDelete: null,
      itemToEdit: null,
      newRecord: {
        machine_nm: '',
        check_date: '',
        tip_counter: null,
        sleeve_counter: null,
        spruebush_counter: null,
        upper_gap_tip: null,
        upper_depth_tip: null,
        lower_gap_tip: null,
        lower_depth_tip: null,
        notes: ''
      }
    }
  },

  components: {
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CFormInput,
    CFormSelect,
    CButton,
    Treeselect,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Clock,
    CInputGroup,
    CInputGroupText,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    apexchart: VueApexCharts,
    CTabs,
    CTabList,
    CTab,
    CTabContent,
    CTabPanel,
    Trash2,
    Edit,
  },

  computed: {
    totalProblems() {
      return this.problems.length;
    },
    machineSelectOptions() {
      return [
        { value: '', label: 'Select Machine' },
        ...this.machines.map(machine => ({
          value: machine,
          label: machine
        }))
      ];
    },
    selectedMachineLabel() {
      if (this.selectedMachines) {
        const machineObj = this.machineOptions.find(m => m.id === this.selectedMachines);
        return machineObj ? machineObj.label : null;
      }
      return null;
    },
  },

  watch: {
    selectedMachines(newVal) {
      console.log('Selected machines changed:', newVal);
    },
  },
  methods: {
    handleMachineChange(value) {
      this.selectedMachines = value;
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getUTCFullYear()
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
    formatDateTimeDisplay(dateString) {
      if (!dateString) return ''
      // Parse the date string as UTC to avoid local timezone conversion
      const date = new Date(dateString)
      const year = date.getUTCFullYear()
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
      const day = date.getUTCDate().toString().padStart(2, '0')
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    },
    formatTime(date) {
      return moment(date).format('HH:mm');
    },
    isProblemHour(problem, hour) {
      const startHour = moment(problem.fstart_time).hour();
      const endHour = moment(problem.fend_time).hour();
      return hour >= startHour && hour <= endHour;
    },

    async fetchMachines() {
      try {
        const responseMachines = await api.get('/smartandon/floatingPlungerTips/machines');
        this.machines = responseMachines.data;
        this.machineOptions = responseMachines.data.map((machine, index) => ({
          id: index + 1,
          label: machine,
        }));
      } catch (error) {
        console.error('Failed to fetch machines:', error);
      }
    },

    async fetchProblems() {
      this.loading = true;
      this.fetchError = null;
      try {
        const params = {};
        if (this.startDate) params.startDate = this.startDate;
        if (this.endDate) params.endDate = this.endDate;
        if (this.problemName) params.problemName = this.problemName;

        // Convert selectedMachines IDs to labels
        if (this.selectedMachines) {
          const machineIds = Array.isArray(this.selectedMachines) ? this.selectedMachines : [this.selectedMachines];
          if (machineIds.length > 0) {
            const machineLabels = machineIds.map(id => {
              const machineObj = this.machineOptions.find(m => m.id === id);
              return machineObj ? machineObj.label : id;
            });
            params.machine = machineLabels.join(',');
          }
        }

        console.log('Filter params:', params);

        const response = await api.get('/smartandon/floatingPlungerTips/', params);
        if (response.status !== 200) {
          throw new Error('Failed to fetch floating plunger tips, status: ' + response.status);
        }
        console.log('Response data:', response.data);
        this.problems = response.data;
        // Fetch chart data after table data is loaded
        await this.fetchChartData0101();
        await this.fetchChartData0102();
      } catch (error) {
        console.error('Failed to fetch floating plunger tips:', error);
        this.fetchError = error.message;
        if (this.retryCount < 3) {
          this.retryCount++;
          console.log(`Retrying fetch... attempt ${this.retryCount}`);
          setTimeout(() => this.fetchProblems(), 1000 * this.retryCount);
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchChartData0101() {
      this.chartLoading = true;
      try {
        const params = {};
        if (this.startDate) params.startDate = this.startDate;
        if (this.endDate) params.endDate = this.endDate;
        if (this.problemName) params.problemName = this.problemName;

        const response = await api.get('/smartandon/floatingPlungerTips/ikdm-0101', params);
        if (response.status !== 200) {
          throw new Error('Failed to fetch chart data for ikdm-0101, status: ' + response.status);
        }
        console.log('Chart data for ikdm-0101:', response.data);
        this.chartData0101 = response.data;
        this.prepareChartData0101();
      } catch (error) {
        console.error('Failed to fetch chart data for ikdm-0101:', error);
        this.fetchError = error.message;
      } finally {
        this.chartLoading = false;
      }
    },

    async fetchChartData0102() {
      this.chartLoading = true;
      try {
        const params = {};
        if (this.startDate) params.startDate = this.startDate;
        if (this.endDate) params.endDate = this.endDate;
        if (this.problemName) params.problemName = this.problemName;

        const response = await api.get('/smartandon/floatingPlungerTips/ikdm-0102', params);
        if (response.status !== 200) {
          throw new Error('Failed to fetch chart data for ikdm-0102, status: ' + response.status);
        }
        console.log('Chart data for ikdm-0102:', response.data);
        this.chartData0102 = response.data;
        this.prepareChartData0102();
      } catch (error) {
        console.error('Failed to fetch chart data for ikdm-0102:', error);
        this.fetchError = error.message;
      } finally {
        this.chartLoading = false;
      }
    },
    resetFilters() {
      this.startDate = '';
      this.endDate = '';
      this.problemName = '';
      this.selectedMachines = null;
      this.fetchError = null;
      this.retryCount = 0;
      // Reset chart data
      this.chartData0101 = [];
      this.chartData0102 = [];
      this.totalTips0101 = 0;
      this.totalTips0102 = 0;
    },
    prepareChartData0101() {
      // Data is already filtered by backend, use directly
      let filteredData = this.chartData0101;

      // Get all unique dates from filtered data, sorted
      const allDates = [...new Set(filteredData.map(tip => tip.check_date))].sort();
      this.totalTips0101 = filteredData.length;

      // Calculate date categories (DD MMMM format)
      const categories = allDates.map(date => {
        const d = new Date(date);
        const options = { day: 'numeric', month: 'long' };
        return d.toLocaleDateString('en-US', options);
      });

      // Function to get data for a field
      const getData = (field) => {
        const dataMap = new Map(filteredData.map(tip => [tip.check_date, parseFloat(tip[field]) || null]));
        return allDates.map(date => dataMap.get(date) || null);
      };

      // Upper Gap Tip for IKDM-0101
      this.chartOptionsUpperGap0101 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Upper Gap Tip' } },
        title: { text: 'Upper Gap Tip for IKDM-0101', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 0.1,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 0.1 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Upper Gap Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesUpperGap0101 = [{
        name: 'IKDM-0101',
        data: getData('upper_gap_tip')
      }];

      // Upper Depth Tip for IKDM-0101
      this.chartOptionsUpperDepth0101 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Upper Depth Tip' } },
        title: { text: 'Upper Depth Tip for IKDM-0101', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 100,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 100 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Upper Depth Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesUpperDepth0101 = [{
        name: 'IKDM-0101',
        data: getData('upper_depth_tip')
      }];

      // Lower Gap Tip for IKDM-0101
      this.chartOptionsLowerGap0101 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Lower Gap Tip' } },
        title: { text: 'Lower Gap Tip for IKDM-0101', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 0.05,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 0.05 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Lower Gap Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesLowerGap0101 = [{
        name: 'IKDM-0101',
        data: getData('lower_gap_tip')
      }];

      // Lower Depth Tip for IKDM-0101
      this.chartOptionsLowerDepth0101 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Lower Depth Tip' } },
        title: { text: 'Lower Depth Tip for IKDM-0101', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [
            {
              y: 3,
              borderColor: '#FF0000',
              strokeDashArray: 0,
              strokeWidth: 3,
              label: {
                borderColor: '#FF0000',
                style: {
                  color: '#fff',
                  background: '#FF0000'
                },
                text: 'Threshold 3 mm'
              }
            },
            {
              y: 5,
              borderColor: '#FF0000',
              strokeDashArray: 0,
              strokeWidth: 3,
              label: {
                borderColor: '#FF0000',
                style: {
                  color: '#fff',
                  background: '#FF0000'
                },
                text: 'Threshold 5 mm'
              }
            }
          ]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const options = { day: 'numeric', month: 'long' };
              const dateStr = d.toLocaleDateString('en-US', options);
              return dateStr === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Lower Depth Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesLowerDepth0101 = [{
        name: 'IKDM-0101',
        data: getData('lower_depth_tip')
      }];
    },

    prepareChartData0102() {
      // Data is already filtered by backend, use directly
      let filteredData = this.chartData0102;

      // Get all unique dates from filtered data, sorted
      const allDates = [...new Set(filteredData.map(tip => tip.check_date))].sort();
      this.totalTips0102 = filteredData.length;

      // Calculate date categories (MM/DD format)
      const categories = allDates.map(date => {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      });

      // Function to get data for a field
      const getData = (field) => {
        const dataMap = new Map(filteredData.map(tip => [tip.check_date, parseFloat(tip[field]) || null]));
        return allDates.map(date => dataMap.get(date) || null);
      };

      // Upper Gap Tip for IKDM-0102
      this.chartOptionsUpperGap0102 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Upper Gap Tip' } },
        title: { text: 'Upper Gap Tip for IKDM-0102', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 0.1,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 0.1 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Upper Gap Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesUpperGap0102 = [{
        name: 'IKDM-0102',
        data: getData('upper_gap_tip')
      }];

      // Upper Depth Tip for IKDM-0102
      this.chartOptionsUpperDepth0102 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Upper Depth Tip' } },
        title: { text: 'Upper Depth Tip for IKDM-0102', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 100,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 100 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Upper Depth Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesUpperDepth0102 = [{
        name: 'IKDM-0102',
        data: getData('upper_depth_tip')
      }];

      // Lower Gap Tip for IKDM-0102
      this.chartOptionsLowerGap0102 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Lower Gap Tip' } },
        title: { text: 'Lower Gap Tip for IKDM-0102', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 0.05,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 0.05 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Lower Gap Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesLowerGap0102 = [{
        name: 'IKDM-0102',
        data: getData('lower_gap_tip')
      }];

      // Lower Depth Tip for IKDM-0102
      this.chartOptionsLowerDepth0102 = {
        chart: { type: 'line', height: 180 },
        stroke: { curve: 'smooth', width: 4 },
        xaxis: { type: 'category', categories: categories },
        yaxis: { title: { text: 'Lower Depth Tip' } },
        title: { text: 'Lower Depth Tip for IKDM-0102', align: 'left' },
        markers: { size: 4 },
        grid: { show: true, borderColor: '#e7e7e7' },
        annotations: {
          yaxis: [{
            y: 3,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 3 mm'
            }
          },
          {
            y: 5,
            borderColor: '#FF0000',
            strokeDashArray: 0,
            strokeWidth: 3,
            label: {
              borderColor: '#FF0000',
              style: {
                color: '#fff',
                background: '#FF0000'
              },
              text: 'Threshold 5 mm'
            }
          }]
        },
        dataLabels: {
          enabled: true,
          offsetY: -10,
          formatter: function(val, opts) {
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === opts.w.globals.categoryLabels[opts.dataPointIndex];
            });
            return tipData && tipData.notes ? `${val} (${tipData.notes})` : val;
          },
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        tooltip: {
          enabled: true,
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = w.globals.categoryLabels[dataPointIndex];
            const tipData = filteredData.find(tip => {
              const d = new Date(tip.check_date);
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              return `${month}/${day}` === date;
            });
            if (tipData) {
              return `
                <div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
                  <strong>${date}</strong><br/>
                  Lower Depth Tip: ${data || 'N/A'} ${tipData.notes ? `(${tipData.notes})` : ''}<br/>
                  Tip Counter: ${tipData.tip_counter || 'N/A'}<br/>
                  Sleeve Counter: ${tipData.sleeve_counter || 'N/A'}<br/>
                  Spruebush Counter: ${tipData.spruebush_counter || 'N/A'}
                </div>
              `;
            }
            return `<div style="padding: 10px;">${date}: ${data || 'N/A'}</div>`;
          }
        }
      };
      this.chartSeriesLowerDepth0102 = [{
        name: 'IKDM-0102',
        data: getData('lower_depth_tip')
      }];
    },
    openAddModal() {
      this.modalMode = 'add';
      this.resetNewRecord();
      this.showModal = true;
    },
    openEditModal(tip) {
      this.modalMode = 'edit';
      this.itemToEdit = tip;
      this.newRecord = {
        machine_nm: tip.machine_nm,
        check_date: this.formatDateTime(tip.check_date),
        tip_counter: tip.tip_counter,
        sleeve_counter: tip.sleeve_counter,
        spruebush_counter: tip.spruebush_counter,
        upper_gap_tip: tip.upper_gap_tip,
        upper_depth_tip: tip.upper_depth_tip,
        lower_gap_tip: tip.lower_gap_tip,
        lower_depth_tip: tip.lower_depth_tip,
        notes: tip.notes
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalMode = 'add';
      this.itemToEdit = null;
      this.resetNewRecord();
    },
    resetNewRecord() {
      this.newRecord = {
        machine_nm: '',
        check_date: this.formatDateTime(new Date()),
        tip_counter: null,
        sleeve_counter: null,
        spruebush_counter: null,
        upper_gap_tip: null,
        upper_depth_tip: null,
        lower_gap_tip: null,
        lower_depth_tip: null,
        notes: ''
      };
    },
    async submitRecord() {
      if (!this.newRecord.machine_nm || !this.newRecord.check_date) {
        alert('Machine Name and Check Date are required!');
        return;
      }

      this.isSubmitting = true;
      try {
        let response;
        if (this.modalMode === 'add') {
          console.log('Data being sent for add:', this.newRecord);
          response = await api.post('/smartandon/floatingPlungerTips/', this.newRecord);
          if (response.status === 201) {
            alert('Record added successfully!');
          } else {
            throw new Error('Failed to add record');
          }
        } else if (this.modalMode === 'edit') {
          console.log('Data being sent for update:', this.newRecord);
          response = await api.put('/smartandon/floatingPlungerTips', this.itemToEdit.id, this.newRecord);
          if (response.status === 200) {
            alert('Record updated successfully!');
          } else {
            throw new Error('Failed to update record');
          }
        }
        this.closeModal();
        // Refresh the data
        await this.fetchProblems();
      } catch (error) {
        console.error('Error submitting record:', error);
        alert('Failed to submit record. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    },

    confirmDelete(tip) {
      this.itemToDelete = tip;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.itemToDelete = null;
    },
    proceedDelete() {
      if (this.itemToDelete) {
        this.deleteTip(this.itemToDelete.id);
        this.closeDeleteModal();
      }
    },


    async deleteTip(id) {
      this.isDeleting = true;
      try {
        const response = await api.delete('/smartandon/floatingPlungerTips', id);
        if (response.status === 200) {
          alert('Record deleted successfully!');
          // Refresh the data
          await this.fetchProblems();
        } else {
          throw new Error('Failed to delete record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record. Please try again.');
      } finally {
        this.isDeleting = false;
      }
    },

  },
  async created() {
    console.log('FloatingPlungerTips page opened - fetching data...');

    // Set default date filter to last month
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    this.startDate = oneMonthAgo.toISOString().split('T')[0]; // YYYY-MM-DD format

    await this.fetchMachines();
    await this.fetchProblems();
    console.log('Data fetching completed for FloatingPlungerTips');
  },
}
</script>

<style scoped>
/* Card styling */
/* .card {
  background-color: #ffffff !important;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-body {
  background-color: #ffffff !important;
} */

.main-card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.status-temporary {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #ffc107;
  color: #212529;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  min-width: 80px;
}

.status-fix {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  min-width: 80px;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.total-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.total-card .summary-icon {
  color: #ffffff;
}

.total-card .summary-number,
.total-card .summary-label {
  color: #ffffff;
}

.temporary-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.temporary-card .summary-icon {
  color: #ffffff;
}

.temporary-card .summary-number,
.temporary-card .summary-label {
  color: #ffffff;
}

.fix-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.fix-card .summary-icon {
  color: #ffffff;
}

.fix-card .summary-number,
.fix-card .summary-label {
  color: #ffffff;
}

.summary-icon {
  margin-right: 15px;
}

.summary-content {
  flex: 1;
}

.summary-number {
  font-size: 28px;
  font-weight: bold;
  color: #495057;
  margin-bottom: 5px;
}

.summary-label {
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 600;
}

.form-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #495057;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

.chart-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

</style>
