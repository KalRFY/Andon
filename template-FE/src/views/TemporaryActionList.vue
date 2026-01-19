<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardBody>
          <!-- Filter Section -->
          <CRow class="mb-3">
            <CCol lg="3" class="mb-3">
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
            <CCol lg="3" class="mb-3">
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
            <CCol lg="2" class="mb-3">
              <CFormLabel for="statusSelect" class="fw-bold">Status</CFormLabel>
              <CFormSelect
                id="statusSelect"
                v-model="selectedStatus"
                @change="handleStatusChange"
              >
                <option value="">All Status</option>
                <option value="0">Temporary</option>
                <option value="1">Fix</option>
              </CFormSelect>
            </CCol>
            <CCol lg="2" class="mb-3">
              <CFormLabel for="lineSelect" class="fw-bold">Line</CFormLabel>
              <Treeselect
                id="lineSelect"
                :searchable="true"
                :clearable="true"
                :multiple="false"
                :children="false"
                v-model="selectedLines"
                :options="lineOptions"
                placeholder="All Lines"
                :value-consists-of="'LEAF_PRIORITY'"
                :value-key="'id'"
                :label-key="'label'"
                @input="handleLineChange"
              />
            </CCol>
            <CCol lg="2" class="mb-3">
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
            <CCol lg="12">
              <CFormLabel for="basic-url" class="fw-bold">Description Search</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon3">Description</CInputGroupText>
                <CFormInput
                  id="problemName"
                  type="text"
                  v-model="problemName"
                  placeholder="Enter problem description"
                  aria-label="Description"
                  aria-describedby="basic-addon3"
                />
              </CInputGroup>
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
        <!-- <CCardHeader style="font-weight: bold; font-size: medium;">
          Temporary Action List
        </CCardHeader> -->
        <CCardBody>
          <!-- Summary Section -->
          <CRow class="mb-1">
            <CCol lg="4" class="mb-3">
              <div class="summary-card total-card">
                <div class="summary-icon">
                  <BarChart3 size="24" />
                </div>
                <div class="summary-content">
                  <div class="summary-number">{{ totalProblems }}</div>
                  <div class="summary-label">Total Item Temporary Actions List</div>
                </div>
              </div>
            </CCol>
            <CCol lg="4" class="mb-3">
              <div class="summary-card temporary-card">
                <div class="summary-icon">
                  <AlertTriangle size="24" />
                </div>
                <div class="summary-content">
                  <div class="summary-number">{{ temporaryCount }}</div>
                  <div class="summary-label">Temporary</div>
                </div>
              </div>
            </CCol>
            <CCol lg="4" class="mb-3">
              <div class="summary-card fix-card">
                <div class="summary-icon">
                  <CheckCircle2 size="24" />
                </div>
                <div class="summary-content">
                  <div class="summary-number">{{ fixCount }}</div>
                  <div class="summary-label">Fix</div>
                </div>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CButton
                class="mb-3"
                color="primary"
                size="lg"
                style="
                  font-size: medium;
                  font-weight: bold;
                  color: white;
                  width: 100%;
                "
                @click="openAddModal"
              >+ Add Item Temporary +</CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <!-- Table -->
              <CTable bordered hover responsive class="hour-table">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style="width: 1%; text-align: center;">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">fpic</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Machine Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 6%; text-align: center;">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 15%; text-align: center;">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(problem, idx) in problems" :key="problem.fid">
                    <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                    <CTableDataCell>{{ formatDate(problem.fdate) }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fpic }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fmc }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fchanges_item }}</CTableDataCell>
                    <CTableDataCell class="text-center">
                      <span :class="getStatusClass(problem.fstatus)">{{ getStatusLabel(problem.fstatus) }}</span>
                    </CTableDataCell>
                    <CTableDataCell style="text-align: center;">
                      <CButton
                        class="me-2"
                        color="secondary"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                          padding: 6px 8px;
                        "
                        @click="openEditModal(problem)"
                      >
                        <Edit size="16" />
                      </CButton>
                      <CButton
                        class="me-2"
                        color="primary"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                          padding: 6px 8px;
                        "
                        @click="confirmDelete(problem)"
                      >
                        <Trash2 size="16" />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </div>
    </CCol>
  </CRow>

  <!-- Add/Edit Item Modal -->
  <CModal
    :visible="showModal"
    @close="closeModal"
    size="xl"
    backdrop="static"
  >
    <CModalHeader>
      <CModalTitle>{{ modalMode === 'add' ? 'Add Temporary Item' : 'Edit Temporary Item' }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <!-- Form Section -->
      <CForm>
        <div class="form-section">
          <h6 class="section-title">Item Details</h6>
          <CRow class="mb-3">
            <CCol md="6" class="mb-3">
              <CFormLabel for="itemName">Item Name</CFormLabel>
              <CFormInput
                id="itemName"
                v-model="newItem.fchanges_item"
                placeholder="Enter item name"
                required
              />
            </CCol>
            <CCol md="6" class="mb-3">
              <CFormLabel for="lineSelect">Line</CFormLabel>
              <CFormInput
                id="lineSelect"
                :value="getLineLabel(newItem.fline)"
                disabled
                placeholder="Line will be auto-selected based on machine"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CCol md="6" class="mb-3">
              <label for="machineName">Machine Name</label>
              <Treeselect
                id="machineName"
                :searchable="true"
                :clearable="true"
                :children="false"
                v-model="newItem.fmc"
                :options="machineOptions"
                placeholder="Select machine"
                :required="true"
                :value-consists-of="'LEAF_PRIORITY'"
                :value-key="'id'"
                :label-key="'label'"
              />
            </CCol>
            <CCol md="6" class="mb-3">
              <CFormLabel for="status">Status</CFormLabel>
              <CFormSelect
                id="status"
                v-model="newItem.fstatus"
                required
              >
              <option value="0">Temporary</option>
              <option value="1">Fix</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </div>

        <div class="form-section">
          <h6 class="section-title">Assignment & Timeline</h6>
          <CRow class="mb-3">
            <CCol md="6" class="mb-3">
              <CFormLabel for="picSelect">PIC (Person In Charge)</CFormLabel>
              <Treeselect
                id="picSelect"
                :searchable="true"
                :clearable="true"
                :children="false"
                v-model="newItem.fpic"
                :options="memberOption"
                placeholder="Select PIC"
                :required="true"
                :value-consists-of="'LEAF_PRIORITY'"
                :value-key="'id'"
                :label-key="'label'"
              />
            </CCol>
            <CCol md="6" class="mb-3">
              <CFormLabel for="henkatenTime">Henkaten Time</CFormLabel>
              <CFormInput
                id="henkatenTime"
                type="datetime-local"
                v-model="newItem.fdate"
                required
              />
            </CCol>
          </CRow>
        </div>

        <div class="form-section">
          <h6 class="section-title">Description</h6>
          <CRow class="mb-3">
            <CCol>
              <CFormLabel for="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                v-model="newItem.fnote"
                placeholder="Enter description"
                rows="3"
                required
              />
            </CCol>
          </CRow>
        </div>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">
        Cancel
      </CButton>
      <CButton color="primary" @click="modalMode === 'add' ? saveNewItem() : updateItem()">
        {{ modalMode === 'add' ? 'Save Item' : 'Update Item' }}
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
      <p>Are you sure you want to delete this temporary action?</p>
      <p><strong>Item:</strong> {{ itemToDelete ? itemToDelete.fchanges_item : '' }}</p>
      <p><strong>Line:</strong> {{ itemToDelete ? itemToDelete.fline : '' }}</p>
      <p><strong>Machine:</strong> {{ itemToDelete ? itemToDelete.fmc : '' }}</p>
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
import { CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CFormSelect, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormLabel, CFormTextarea, CInputGroup, CInputGroupText } from '@coreui/vue';
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { BarChart3, AlertTriangle, CheckCircle2, Plus, Trash2, Edit, Clock } from 'lucide-vue-next'
import api from '../apis/CommonAPI'

export default {
  name: 'Dashboard',
  data() {
    return {
      problems: [],
      loading: false,
      problemName: '',
      startDate: '',
      endDate: '',
      selectedLines: null,
      selectedMachines: null,
      selectedStatus: '',
      lineOptions: [],
      machineOptions: [],
      machines: [],
      lines: [],
      members: [],
      memberOption: [],
      showModal: false,
      modalMode: 'add', // 'add' or 'edit'
      selectedProblem: null,
      showDeleteModal: false,
      itemToDelete: null,
      newItem: {
        fchanges_item: null,
        fmc: null,
        fpic: null,
        fdate: '',
        fnote: null,
        fstatus: '1', // Default to temporary
        fline: null
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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormLabel,
    CFormTextarea,
    Treeselect,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Plus,
    Trash2,
    Edit,
    Clock,
    CInputGroup,
    CInputGroupText,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
  },

  computed: {
    totalProblems() {
      return this.problems.length;
    },
    temporaryCount() {
      return this.problems.filter(p => p.fstatus == 0).length;
    },
    fixCount() {
      return this.problems.filter(p => p.fstatus == 1).length;
    },
  },

  watch: {
    selectedLines(newVal) {
      console.log('Selected lines changed:', newVal);
    },
    selectedMachines(newVal) {
      console.log('Selected machines changed:', newVal);
    },
    'newItem.fmc'(newVal) {
      console.log('Machine in modal changed:', newVal);
      if (newVal) {
        const selectedMachine = this.machines.find(machine => machine.fid === newVal);
        if (selectedMachine && selectedMachine.line_id) {
          this.newItem.fline = selectedMachine.line_id;
        }
      } else {
        this.newItem.fline = null;
      }
    },
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    formatTime(date) {
      return moment(date).format('HH:mm');
    },
    isProblemHour(problem, hour) {
      const startHour = moment(problem.fstart_time).hour();
      const endHour = moment(problem.fend_time).hour();
      return hour >= startHour && hour <= endHour;
    },
    async fetchLines() {
      try {
        const responseLines = await api.get('/smartandon/line');
        console.log('[FE Debug] Line API response:', responseLines.data);
        this.lines = responseLines.data;
        this.lineOptions = responseLines.data.map((line) => ({
          id: line.fid,
          label: line.fline,
        }));
        console.log('[FE Debug] Line options created:', this.lineOptions);
      } catch (error) {
        console.error('Failed to fetch lines:', error);
        this.lineOptions = [];
      }
    },
    async fetchMachines() {
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
    },
    async fetchMembers() {
      try {
        const responseMembers = await api.get('/smartandon/member');
        this.members = responseMembers.data;
        this.memberOption = responseMembers.data.map((member) => ({
          id: member.fid,
          label: member.fname,
        }));
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    },
    async fetchProblems() {
      this.loading = true;
      try {
        const params = {};
        if (this.startDate) params.startDate = this.startDate;
        if (this.endDate) params.endDate = this.endDate;
        if (this.problemName) params.problemName = this.problemName;
        if (this.selectedStatus !== '') params.status = this.selectedStatus;

        // Convert selectedLines IDs to labels
        if (this.selectedLines) {
          const lineIds = Array.isArray(this.selectedLines) ? this.selectedLines : [this.selectedLines];
          if (lineIds.length > 0) {
            const lineLabels = lineIds.map(id => {
              const lineObj = this.lineOptions.find(l => l.id === id);
              return lineObj ? lineObj.label : id;
            });
            params.line = lineLabels.join(',');
          }
        }

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

        const response = await api.get('/smartandon/temporary', params);
        if (response.status !== 200) {
          throw new Error('Failed to fetch temporary actions, status: ' + response.status);
        }
        console.log('Response data:', response.data);
        this.problems = response.data;
      } catch (error) {
        console.error('Failed to fetch temporary actions:', error);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.startDate = '';
      this.endDate = '';
      this.problemName = '';
      this.selectedLines = null;
      this.selectedMachines = null;
      this.selectedStatus = '';
    },
    openAddModal() {
      this.modalMode = 'add';
      this.newItem = {
        fchanges_item: null,
        fmc: null,
        fpic: null,
        fdate: '',
        fnote: null,
        fstatus: '1', // Default to temporary
        fline: null
      };
      this.showModal = true;
    },
    openEditModal(problem) {
      this.modalMode = 'edit';
      this.selectedProblem = problem;
      // Convert labels back to IDs for editing
      const machineObj = this.machineOptions.find(m => m.label === problem.fmc);
      const picObj = this.memberOption.find(p => p.label === problem.fpic);
      const lineObj = this.lineOptions.find(l => l.label === problem.fline);

      this.newItem = {
        fchanges_item: problem.fchanges_item,
        fmc: machineObj ? machineObj.id : null,
        fpic: picObj ? picObj.id : null,
        fdate: this.formatDateForInput(problem.fdate),
        fnote: problem.fnote,
        fstatus: problem.fstatus.toString(),
        fline: lineObj ? lineObj.id : null
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedProblem = null;
      this.modalMode = 'add';
    },
    // resetNewItem() {
    //   this.newItem = {
    //     fchanges_item: '',
    //     fmc: '',
    //     fpic: '',
    //     fdate: '',
    //     fnote: '',
    //     fstatus: '1', // Default to temporary
    //     fline: ''
    //   };
    // },
    async saveNewItem() {
      // Validate required fields
      // if (!this.newItem.fchanges_item || !this.newItem.fline || !this.newItem.fmc || !this.newItem.fpic || !this.newItem.fdate || !this.newItem.fnote) {
      //   alert('Please fill in all required fields');
      //   return;
      // }

      try {
        // Convert IDs to labels for line, machine, and PIC
        const lineObj = this.lineOptions.find(l => l.id === this.newItem.fline);
        const machineObj = this.machineOptions.find(m => m.id === this.newItem.fmc);
        const picObj = this.memberOption.find(p => p.id === this.newItem.fpic);

        const payload = {
          fchanges_item: this.newItem.fchanges_item,
          fline: lineObj ? lineObj.label : this.newItem.fline,
          fmc: machineObj ? machineObj.label : this.newItem.fmc,
          fpic: picObj ? picObj.label : this.newItem.fpic,
          fdate: this.newItem.fdate,
          fnote: this.newItem.fnote,
          fstatus: this.newItem.fstatus
        };

        console.log('Saving new temporary item:', payload);

        const response = await api.post('/smartandon/temporary', payload);

        if (response.status === 201) {
          alert('Item saved successfully!');
          this.closeModal();
          await this.fetchProblems();
        } else {
          throw new Error('Failed to save item');
        }

      } catch (error) {
        console.error('Failed to save temporary item:', error);
        alert('Failed to save item. Please try again.');
      }
    },

    getStatusLabel(status) {
      return status == 0 ? 'Temporary' : 'Fix';
    },
    getStatusClass(status) {
      return status == 0 ? 'status-temporary' : 'status-fix';
    },
    getLineLabel(lineId) {
      if (!lineId) return '';
      const lineObj = this.lineOptions.find(l => l.id === lineId);
      return lineObj ? lineObj.label : '';
    },
    formatDateForInput(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    async updateItem() {
      try {
        // Convert IDs to labels for line, machine, and PIC
        const lineObj = this.lineOptions.find(l => l.id === this.newItem.fline);
        const machineObj = this.machineOptions.find(m => m.id === this.newItem.fmc);
        const picObj = this.memberOption.find(p => p.id === this.newItem.fpic);

        const payload = {
          fchanges_item: this.newItem.fchanges_item,
          fline: lineObj ? lineObj.label : this.newItem.fline,
          fmc: machineObj ? machineObj.label : this.newItem.fmc,
          fpic: picObj ? picObj.label : this.newItem.fpic,
          fdate: this.newItem.fdate,
          fnote: this.newItem.fnote,
          fstatus: this.newItem.fstatus
        };

        console.log('Updating temporary item:', payload);

        const response = await api.put('/smartandon/temporary', this.selectedProblem.fid, payload);

        if (response.status === 200) {
          alert('Item updated successfully!');
          this.closeModal();
          await this.fetchProblems();
        } else {
          throw new Error('Failed to update item');
        }

      } catch (error) {
        console.error('Failed to update temporary item:', error);
        alert('Failed to update item. Please try again.');
      }
    },
    handleLineChange(value) {
      console.log('Line selection changed:', value);
      this.selectedLines = value;
    },
    handleMachineChange(value) {
      console.log('Machine selection changed:', value);
      this.selectedMachines = value;
    },
    handleStatusChange(value) {
      console.log('Status selection changed:', value);
      this.selectedStatus = value;
    },

    confirmDelete(problem) {
      this.itemToDelete = problem;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.itemToDelete = null;
    },
    proceedDelete() {
      if (this.itemToDelete) {
        this.deleteProblem(this.itemToDelete.fid);
        this.closeDeleteModal();
      }
    },
    async deleteProblem(fid) {
      try {
        const response = await api.delete('/smartandon/temporary', fid);
        if (response.status === 200) {
          alert('Item deleted successfully!');
          await this.fetchProblems();
        } else {
          throw new Error('Failed to delete item');
        }
      } catch (error) {
        alert('Error deleting temporary: ' + error.message);
      }
    },
  },
  async created() {
    console.log('TemporaryActionList page opened - fetching data...');
    await this.fetchLines();
    await this.fetchMachines();
    await this.fetchMembers();
    await this.fetchProblems();
    console.log('Data fetching completed for TemporaryActionList');
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

</style>
