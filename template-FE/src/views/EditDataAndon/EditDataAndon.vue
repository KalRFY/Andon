<template>
  <CRow class="mb-3">
    <CCol>
      <div
        style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
        background-color: #FAFAFA;"
        class="p-4"
      >
        <CTabs :activeItemKey="activeTab">
          <CTabList variant="tabs">
            <CTab aria-controls="machine-tab-pane" :itemKey="'machine'">Machine</CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel class="py-3" aria-labelledby="machine-tab-pane" :itemKey="'machine'">
              <!-- Machine Content -->
              <CRow class="mb-3">
                <CCol>
                  <CCard>
                    <CCardHeader style="font-weight: bold; font-size: medium;">
                      Add New Machines
                    </CCardHeader>
                    <CCardBody>
                      <CRow class="mb-3">
                        <CCol md="6">
                          <label style="font-size: small;" class="form-label">Machine Name</label>
                          <CFormInput
                            id="machineName"
                            required
                            type="text"
                            aria-describedby="machineName"
                            v-model="selectedMachine.fmc_name"
                          />
                        </CCol>
                        <CCol md="3">
                          <label style="font-size: small;" class="form-label">Maker</label>
                          <Treeselect
                            id="makerSelect"
                            v-model="selectedMachine.fmaker"
                            :options="makerOptions"
                            :searchable="true"
                            :clearable="true"
                            placeholder="Select maker"
                            :value-consists-of="['id']"
                            :value-key="'id'"
                            :label-key="'label'"
                          />
                        </CCol>
                        <CCol md="3">
                          <label style="font-size: small;" for="lineSelect" class="form-label">Line</label>
                          <Treeselect
                            id="lineSelect"
                            v-model="selectedMachine.lineId"
                            :options="lineOptions"
                            :searchable="true"
                            :clearable="true"
                            placeholder="Select line"
                            :value-consists-of="['id']"
                            :value-key="'id'"
                            :label-key="'label'"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-3">
                        <CCol md="6">
                          <label style="font-size: small;" class="form-label">Serial Number</label>
                          <CFormInput
                            id="fsn"
                            type="text"
                            v-model="selectedMachine.fsn"
                          />
                        </CCol>
                        <CCol md="3">
                          <label style="font-size: small;" class="form-label">Machine Type</label>
                          <CFormInput
                            id="type"
                            type="text"
                            v-model="selectedMachine.ftype"
                          />
                        </CCol>
                        <CCol md="3">
                          <label style="font-size: small;" class="form-label">Operation No</label>
                          <CFormInput
                            id="operationNo"
                            type="text"
                            v-model="selectedMachine.foperation_no"
                          />
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol md="9">
                          <label style="font-size: small;" class="form-label">Machine Description</label>
                          <CFormInput
                            id="description"
                            type="text"
                            v-model="selectedMachine.fop_desc"
                          />
                        </CCol>
                        <CCol md="3">
                          <label style="font-size: small;" class="form-label">Weight</label>
                          <CFormInput
                            id="weight"
                            type="number"
                            v-model="selectedMachine.fweight"
                            placeholder="in kg"
                          />
                        </CCol>
                      </CRow>
                      <hr></hr>
                      <CRow class="mb-3">
                        <CCol>
                          <CFormCheck
                            id="agreeTermsNew"
                            v-model="agreeTermsNew"
                            label="I agree to the terms and conditions for adding new machine data"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-3" md="12">
                        <CCol>
                          <CButton
                            style="width: 100%"
                            color="primary"
                            @click="saveNewMachine"
                            :disabled="!agreeTermsNew"
                          >
                            Save New Machine
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow class="mb-3">
                <CCol>
                  <CCard>
                    <CCardBody>
                      <CRow class="mb-3">
                        <CCol md="4">
                          <label style="font-size: small;" class="form-label">Line</label>
                          <Treeselect
                            v-model="filterLine"
                            :options="lineOptions"
                            :searchable="true"
                            :clearable="true"
                            placeholder="Select line"
                            :value-consists-of="['id']"
                            :value-key="'id'"
                            :label-key="'label'"
                          />
                        </CCol>
                        <CCol md="4">
                          <label style="font-size: small;" class="form-label">Maker</label>
                          <Treeselect
                            v-model="filterMaker"
                            :options="makerOptions"
                            :searchable="true"
                            :clearable="true"
                            placeholder="Select maker"
                            :value-consists-of="['id']"
                            :value-key="'id'"
                            :label-key="'label'"
                          />
                        </CCol>
                        <CCol md="4">
                          <label style="font-size: small;" class="form-label">Description</label>
                          <CFormInput
                            type="text"
                            v-model="filterDescription"
                            placeholder="Enter description"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-3">
                        <CCol ld="2">
                          <CButton
                            style="width: 100%"
                            variant="outline"
                            color="dark"
                            @click="clearFilters"
                          >
                            Clear
                          </CButton>
                        </CCol>
                        <CCol lg="10">
                          <CButton
                            style="width: 100%; color: white;"
                            color="info"
                            @click="applyFilters"
                          >
                            Search
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CTable bordered hover responsive>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Machine Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Maker</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Serial Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Weight</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Operation</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow v-for="(machine,idx) in machines" :key="machine.fid">
                        <CTableDataCell>{{ idx + 1}}</CTableDataCell>
                        <CTableDataCell>{{ machine.fmc_name }}</CTableDataCell>
                        <CTableDataCell>{{ machine.fmaker}}</CTableDataCell>
                        <CTableDataCell>{{ machine.fline}}</CTableDataCell>
                        <CTableDataCell>{{ machine.fsn }}</CTableDataCell>
                        <CTableDataCell>{{ machine.fweight}}</CTableDataCell>
                        <CTableDataCell>{{ machine.ftype}}</CTableDataCell>
                        <CTableDataCell>{{ machine.foperation_no}}</CTableDataCell>
                        <CTableDataCell>{{ machine.fop_desc}}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            style="font-size: x-small; color: white; font-weight: bold; width: 100%;"
                            @click="openEditMachineModal(machine)"
                          >
                            Edit
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="danger"
                            style="font-size: x-small; color: white; font-weight: bold;"
                            @click="openDeleteMachineModal(machine)"
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CTabPanel>
            <CTabPanel class="py-3" aria-labelledby="maker-tab-pane" :itemKey="'maker'">
              <!-- Maker Content -->
              <CRow class="mb-3">
                <CCol>
                  <CCard>
                    <CCardHeader style="font-weight: bold; font-size: medium;">
                      Add New Maker
                    </CCardHeader>
                    <CCardBody>
                      <CRow class="mb-3">
                        <CCol md="6">
                          <label style="font-size: small;" class="form-label">Add Maker</label>
                          <CFormInput
                            id="makerName"
                            required
                            type="text"
                            aria-describedby="makerName"
                            v-model="selectedMaker.name"
                          />
                        </CCol>
                      </CRow>
                      <hr></hr>
                      <CRow class="mb-3">
                        <CCol>
                          <CFormCheck
                            id="agreeTermsNewMaker"
                            v-model="agreeTermsNewMaker"
                            label="I agree to the terms and conditions for adding new maker data"
                          />
                        </CCol>
                      </CRow>
                      <CRow class="mb-3" md="12">
                        <CCol>
                          <CButton
                            style="width: 100%"
                            color="primary"
                            @click="saveNewMaker"
                            :disabled="!agreeTermsNewMaker"
                          >
                            Save New Maker
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CTable bordered hover responsive>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Maker Name</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow v-for="(maker, idx) in makerOptions" :key="maker.id">
                        <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                        <CTableDataCell>{{ maker.label }}</CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
    </CCol>
  </CRow>

  <div>
      <CModal :visible="visibleLiveDemo" @close="
        () => {
          visibleLiveDemo = false
          }
      " aria-labelledby="LiveDemoExampleLabel">
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Machines</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CRow class="mb-3">
            <CCol md="8">
              <label style="font-size: small; font-weight: bold;" class="form-label">Machine Name</label>
              <CFormInput
                id="machineName"
                required
                type="text"
                aria-describedby="machineName"
                v-model="selectedMachine.fmc_name"
              />
            </CCol>
            <CCol md="4">
              <label style="font-size: small; font-weight: bold;" class="form-label">Maker</label>
              <Treeselect
                id="makerSelect"
                v-model="selectedMachine.fmaker"
                :options="makerOptions"
                :searchable="true"
                :clearable="true"
                placeholder="Select maker"
                :value-consists-of="['id']"
                :value-key="'id'"
                :label-key="'label'"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CCol md="12">
              <label style="font-size: small; font-weight: bold;" for="lineSelect" class="form-label">Line</label>
              <Treeselect
                id="lineSelect"
                v-model="selectedMachine.lineId"
                :options="lineOptions"
                :searchable="true"
                :clearable="true"
                placeholder="Select line"
                :value-consists-of="['id']"
                :value-key="'id'"
                :label-key="'label'"
                @select="onLineSelect"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CCol md="8">
              <label style="font-size: small; font-weight: bold;" class="form-label">Serial Number</label>
              <CFormInput
                id="fsn"
                type="text"
                v-model="selectedMachine.fsn"
              />
            </CCol>
            <CCol md="4">
              <label style="font-size: small; font-weight: bold;" class="form-label">Machine Type</label>
              <CFormInput
                id="type"
                type="text"
                v-model="selectedMachine.ftype"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CCol md="12">
              <label style="font-size: small; font-weight: bold;" class="form-label">Operation No</label>
              <CFormInput
                id="operationNo"
                type="text"
                v-model="selectedMachine.foperation_no"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CCol md="8">
              <label style="font-size: small; font-weight: bold;" class="form-label">Machine Description</label>
              <CFormInput
                id="description"
                type="text"
                v-model="selectedMachine.fop_desc"
              />
            </CCol>
            <CCol md="4">
              <label style="font-size: small; font-weight: bold;" class="form-label">Weight</label>
              <CFormInput
                id="weight"
                type="number"
                v-model="selectedMachine.fweight"
                placeholder="in kg"
              />
            </CCol>
          </CRow>
        </CForm>

      </CModalBody>
      <CModalFooter>
        <CCol>
          <CFormCheck
            id="agreeTerms"
            v-model="agreeTerms"
            label="I agree to the terms and conditions for updating machine data"
          />
        </CCol>
        <CButton color="secondary" @click="closeEditMachineModal">Close</CButton>
        <CButton color="primary" @click="saveMachine" :disabled="!agreeTerms">Save</CButton>
      </CModalFooter>
    </CModal>
  </div>

  <!-- Delete Confirmation Modal -->
  <CModal :visible="visibleDeleteModal" @close="closeDeleteMachineModal" aria-labelledby="DeleteModalLabel">
    <CModalHeader>
      <CModalTitle id="DeleteModalLabel">Confirm Delete</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <p>Are you sure you want to delete the machine <strong>{{ machineToDelete?.fmc_name }}</strong>?</p>
      <p class="text-danger">This action cannot be undone.</p>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeDeleteMachineModal">Cancel</CButton>
      <CButton color="danger" @click="confirmDeleteMachine">Delete</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText, CoffCanvas, CAccordionItem, CFormCheck, CRow, CCol, CTabs, CTabList, CTab, CTabContent, CTabPanel } from '@coreui/vue';
import axios from 'axios';
import { CChart } from '@coreui/vue-chartjs'
import ApexCharts from 'vue3-apexcharts'
import MainChartExample from '../charts/MainChartExample'
import WidgetsStatsA from '../widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from '../widgets/WidgetsStatsTypeD.vue'
import api from '../../apis/CommonAPI'
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
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
const visibleStaticBackdropDemo = ref(false);
const visibleEnd = ref(false)

export default {
  name: 'Dashboard',
  data() {
    return {
      types: [],
      lines: [],
      linesOptions: [],
      makers: [],
      makerOptions: [],
      machines: [],
      machineOptions: [],
      lineOptions: [],
      oee: [],
      oeeOption: [],
      oeeTarget: [],
      oeeActual: [],
      oeePlan: [],
      chartDataPerLine: [],
      chartDataTargetPerLine: [],
      chartDataActualPerLine: [],
      cumulativeOeeSeries: [],
      cumulativeOeeOptions: {},
      visibleEnd: false,
      problemActive: [],
      loadingProblemActive: false,
      visibleLiveDemo: false,
      visibleDeleteModal: false,
      machineToDelete: null,
      selectedMachine: {
        fmc_name: '',
        fmaker: null,
        selectedLine: null,
        lineId: null,
        fsn: '',
        ftype: '',
        foperation_no: '',
        fop_desc: '',
        fweight: '',
        is_deleted: 0
      },
      agreeTerms: false,
      agreeTermsNew: false,
      agreeTermsNewMaker: false,
      isEdit: false,
      activeTab: 'machine',
      selectedMaker: {
        name: ''
      },
      filterLine: null,
      filterMaker: null,
      filterDescription: '',
      isSearching: false,

      submit: {
        machineName: null,
        lineName: null,
        operatorName: null,
        problems: null,
      },
    }
  },
  methods: {
    openEditMachineModal(machine) {
      this.selectedMachine = { ...machine };
      // Set lineId based on line_id
      const matchingLine = this.lineOptions.find(line => line.id === machine.line_id);
      this.selectedMachine.lineId = matchingLine ? matchingLine.id : null;
      // Set fmaker based on maker
      const matchingMaker = this.makerOptions.find(maker => maker.label === machine.fmaker);
      this.selectedMachine.fmaker = matchingMaker ? matchingMaker.id : machine.fmaker;
      // Parse weight to number, converting TON to KG if present
      if (this.selectedMachine.fweight && typeof this.selectedMachine.fweight === 'string') {
        if (this.selectedMachine.fweight.toUpperCase().includes('TON')) {
          const weightNum = parseFloat(this.selectedMachine.fweight.replace(/ TON/i, '').replace(/TON/i, ''));
          if (!isNaN(weightNum)) {
            this.selectedMachine.fweight = weightNum * 1000; // Convert TON to KG
          }
        } else if (this.selectedMachine.fweight.toUpperCase().includes('KG')) {
          const weightNum = parseFloat(this.selectedMachine.fweight.replace(/ KG/i, '').replace(/KG/i, ''));
          this.selectedMachine.fweight = isNaN(weightNum) ? '' : weightNum;
        }
      }
      this.visibleLiveDemo = true;
    },
    closeEditMachineModal() {
      this.visibleLiveDemo = false;
      this.selectedMachine = {
        fmc_name: '',
        fmaker: null,
        selectedLine: null,
        lineId: null,
        fsn: '',
        ftype: '',
        foperation_no: '',
        fop_desc: '',
        fweight: '',
        is_deleted: 0
      };
      this.agreeTerms = false;
    },
    async saveMachine() {
      if (!this.selectedMachine.fmc_name || this.selectedMachine.fmc_name.length < 8 || this.selectedMachine.fmc_name.length > 20) {
        alert('Machine Name must be 8-20 characters long.');
        return;
      }
      // Set fline from selected selectedLine
      if (this.selectedMachine.selectedLine) {
        this.selectedMachine.lineId = this.selectedMachine.selectedLine.id;
        this.selectedMachine.fline = this.selectedMachine.selectedLine.label;
      }
      // Add KG unit to weight if not present
      if (this.selectedMachine.fweight && this.selectedMachine.fweight !== '' && !this.selectedMachine.fweight.toString().toUpperCase().includes('KG')) {
        this.selectedMachine.fweight = this.selectedMachine.fweight + ' KG';
      }
      console.log('Updating machine data:', this.selectedMachine);
      try {
        const response = await api.put('/smartandon/machine', this.selectedMachine.fid, this.selectedMachine);
        if (response.status === 200) {
          console.log('Machine updated successfully:', response.data);
          alert('Machine saved successfully');
          this.closeEditMachineModal();
          // Refresh machine list
          const machineResponse = await api.get('/smartandon/machine');
          this.machines = machineResponse.data?.data || machineResponse.data;
          this.machineOptions = this.machines.map(machine => ({
            id: machine.fid,
            label: machine.fmc_name
          }));
        }
      } catch (error) {
        console.error('Failed to save machine:', error);
        alert('Failed to save machine: ' + error.message);
      }
    },
    async saveNewMachine() {
      if (!this.selectedMachine.fmc_name || this.selectedMachine.fmc_name.length < 8 || this.selectedMachine.fmc_name.length > 20) {
        alert('Machine Name must be 8-20 characters long.');
        return;
      }
      // Set fline from lineId
      if (this.selectedMachine.lineId) {
        const lineObj = this.lineOptions.find(l => l.id == this.selectedMachine.lineId);
        this.selectedMachine.fline = lineObj ? lineObj.label : '';
        console.log('FE: Setting fline:', this.selectedMachine.fline, 'from lineId:', this.selectedMachine.lineId);
      }
      // Add KG unit to weight if not present
      if (this.selectedMachine.fweight && this.selectedMachine.fweight !== '' && !this.selectedMachine.fweight.toString().toUpperCase().includes('KG')) {
        this.selectedMachine.fweight = this.selectedMachine.fweight + ' KG';
      }
      // Set is_deleted to 0 explicitly before sending
      this.selectedMachine.is_deleted = 0;
      console.log('FE: Sending new machine data:', this.selectedMachine);
      try {
        const response = await api.post('/smartandon/newMachine', this.selectedMachine);
        console.log('FE: Response from backend:', response);
        if (response.status === 201) {
          alert('New machine added successfully');
          this.resetNewMachineForm();
          // Refresh machine list
          const machineResponse = await api.get('/smartandon/machine');
          this.machines = machineResponse.data?.data || machineResponse.data;
          this.machineOptions = this.machines.map(machine => ({
            id: machine.fid,
            label: machine.fmc_name
          }));
        }
      } catch (error) {
        console.error('FE: Error adding new machine:', error);
        alert('Failed to add new machine: ' + error.message);
      }
    },
    resetNewMachineForm() {
      this.selectedMachine = {
        fmc_name: '',
        fmaker: null,
        selectedLine: null,
        lineId: null,
        fsn: '',
        ftype: '',
        foperation_no: '',
        fop_desc: '',
        fweight: '',
        is_deleted: 0
      };
      this.agreeTermsNew = false;
    },
    async saveNewMaker() {
      if (!this.selectedMaker.name || this.selectedMaker.name.length < 2 || this.selectedMaker.name.length > 50) {
        alert('Maker Name must be 2-50 characters long.');
        return;
      }
      console.log('Adding new maker:', this.selectedMaker.name);
      try {
        const response = await api.post('/smartandon/newMaker', { name: this.selectedMaker.name });
        if (response.status === 201) {
          alert('New maker added successfully');
          this.resetNewMakerForm();
          // Refresh maker options
          const makerResponse = await api.get('/smartandon/makers');
          this.makerOptions = makerResponse.data?.data || makerResponse.data.map(maker => ({
            id: maker.fid,
            label: maker.name
          }));
        }
      } catch (error) {
        console.error('Failed to add new maker:', error);
        alert('Failed to add new maker: ' + error.message);
      }
    },
    resetNewMakerForm() {
      this.selectedMaker = {
        name: ''
      };
      this.agreeTermsNewMaker = false;
    },
    openDeleteMachineModal(machine) {
      this.machineToDelete = machine;
      this.visibleDeleteModal = true;
    },
    closeDeleteMachineModal() {
      this.visibleDeleteModal = false;
      this.machineToDelete = null;
    },
    async confirmDeleteMachine() {
      if (!this.machineToDelete) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(process.env.VUE_APP_API_URL + '/smartandon/machine/' + this.machineToDelete.fid, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        if (response.status === 200) {
          alert('Machine deleted successfully');
          this.closeDeleteMachineModal();
          // Refresh machine list
          const machineResponse = await api.get('/smartandon/machine');
          this.machines = machineResponse.data?.data || machineResponse.data;
          this.machineOptions = this.machines.map(machine => ({
            id: machine.fid,
            label: machine.fmc_name
          }));
        }
      } catch (error) {
        console.error('Failed to delete machine:', error);
        alert('Failed to delete machine: ' + error.message);
      }
    },
    async applyFilters() {
      try {
        this.isSearching = true;
        const filters = {};
        if (this.filterLine) {
          const lineObj = this.lineOptions.find(l => l.id === this.filterLine);
          if (lineObj) {
            filters.line = lineObj.label;
          }
        }
        if (this.filterMaker) {
          const makerObj = this.makerOptions.find(m => m.id === this.filterMaker);
          if (makerObj) {
            filters.maker = makerObj.label;
          }
        }
        if (this.filterDescription) {
          filters.description = this.filterDescription;
        }

        console.log('[FE Debug] EditDataSmartandon filters built:', filters);
        const searchParam = Object.keys(filters).length > 0 ? JSON.stringify(filters) : undefined;
        console.log('[FE Debug] EditDataSmartandon search param to send:', searchParam);
        console.log('[FILTER DEBUG] Sending search param:', searchParam);

        const response = await api.get('/smartandon/machine', {
          search: searchParam,
        });
        this.machines = response.data?.data || response.data;
        this.machineOptions = this.machines.map(machine => ({
          id: machine.fid,
          label: machine.fmc_name
        }));
        console.log('[FE Debug] EditDataSmartandon received machines:', this.machines.length);
      } catch (error) {
        console.error('Failed to filter machines:', error);
        alert('Failed to filter machines: ' + error.message);
      } finally {
        this.isSearching = false;
      }
    },
    clearFilters() {
      this.filterLine = null;
      this.filterMaker = null;
      this.filterDescription = '';
      this.fetchMachines();
    },
    async fetchMachines() {
      try {
        const response = await api.get('/smartandon/machine');
        this.machines = response.data?.data || response.data;
        this.machineOptions = this.machines.map(machine => ({
          id: machine.fid,
          label: machine.fmc_name
        }));
      } catch (error) {
        console.error('Failed to fetch machines:', error);
        alert('Failed to fetch machines: ' + error.message);
      }
    },
    onLineSelect(selectedLine) {
      if (selectedLine) {
        this.selectedMachine.fline = selectedLine.label;
        console.log('FE: Line selected, setting fline:', this.selectedMachine.fline);
      }
    },
  },
  mounted() {
    this.clearFilters();
  },

  components: {
    MainChartExample,
    WidgetsStatsA,
    WidgetsStatsD,
    AlertTriangle,
    Clock,
    Timer,
    History,
    BarChart2,
    FileText,
    CalendarClock,
    ChartColumnIncreasing,
    BookText,
    CChart,
    ApexCharts,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CoffCanvas,
    Treeselect,
    ApexCharts,
  },

  async created() {
    try {
      const response = await api.get('/smartandon/spareparts');
      if (response.status !== 200) {
        throw new Error('Failed to fetch spareparts, status: ' + response.status);
      }
      this.spareparts = response.data?.data || response.data;
      this.sparepartsOption = this.spareparts.map(sparepart => ({
        id: sparepart.sparepart_id,
        label: sparepart.sparepart_nm
      }));
    } catch (error) {
      console.error('Failed to fetch spareparts:', error);
    }
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
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
  },
}
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

</style>