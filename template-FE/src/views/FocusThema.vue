<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardBody>
          <!-- Filter Section -->
          <CRow class="mb-3">
            <CCol lg="3" class="mb-3">
              <CFormLabel for="startDate" style="font-weight: 600;">Start Date</CFormLabel>
              <CFormInput
                id="startDate"
                type="date"
                v-model="startDate"
              />
            </CCol>
            <CCol lg="3" class="mb-3">
              <CFormLabel for="endDate" style="font-weight: 600;">End Date</CFormLabel>
              <CFormInput
                id="endDate"
                type="date"
                v-model="endDate"
              />
            </CCol>
            <CCol lg="3" class="mb-3">
              <CFormLabel for="lineSelect" style="font-weight: 600;">Line</CFormLabel>
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
            <CCol lg="3" class="mb-3">
              <CFormLabel for="machineSelect" style="font-weight: 600;">Machine</CFormLabel>
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
              <CFormLabel for="problemName" style="font-weight: 600;">Focus Thema Problem</CFormLabel>
              <CFormInput
                id="problemName"
                type="text"
                v-model="problemName"
                placeholder="Enter problem name"
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
        <!-- <CCardHeader style="font-weight: bold; font-size: medium;">
          Temporary Action List
        </CCardHeader> -->
        <CCardBody>
          <!-- Summary Section -->
          <CRow class="mb-1">
            <CCol lg="6" class="mb-3">
              <div class="summary-card total-card">
                <div class="summary-icon">
                  <BarChart3 size="24" />
                </div>
                <div class="summary-content">
                  <div class="summary-number">{{ uniqueMembersInFocusThema }}</div>
                  <div class="summary-label">Unique Members (Taken Focus Thema)</div>
                </div>
              </div>
            </CCol>
            <CCol lg="6" class="mb-3">
              <div class="summary-card temporary-card">
                <div class="summary-icon">
                  <AlertTriangle size="24" />
                </div>
                <div class="summary-content">
                  <div class="summary-number">{{ uniqueMembers }}</div>
                  <div class="summary-label">Members Available</div>
                </div>
              </div>
            </CCol>
          </CRow>
          <!-- Removed Add Item button as this is now read-only data from v_ft_member -->
          <CRow>
            <CCol>
              <!-- Table -->
              <CTable bordered hover responsive class="hour-table">
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style="width: 1%; text-align: center;">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 8%; text-align: center;">Member Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Problem Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="text-align: center;">Machine</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 15%; text-align: center;">Start Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 15%; text-align: center;">End Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Duration</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(problem, idx) in problems" :key="problem.fid">
                    <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                    <CTableDataCell>{{ problem.member_name }}</CTableDataCell>
                    <CTableDataCell>{{ problem.problem_name }}</CTableDataCell>
                    <CTableDataCell>{{ problem.problem_line }}</CTableDataCell>
                    <CTableDataCell>{{ problem.problem_machine }}</CTableDataCell>
                    <CTableDataCell>{{ formatDateTime(problem.problem_start_time) }}</CTableDataCell>
                    <CTableDataCell>{{ formatDateTime(problem.problem_end_time) }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fdur }}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </div>
    </CCol>
  </CRow>

  <!-- Modals removed as this is now read-only data from v_ft_member -->

</template>

<script>
import { ref, computed } from 'vue'
import moment from 'moment'
import { CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CFormSelect, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormLabel, CFormTextarea } from '@coreui/vue';
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { BarChart3, AlertTriangle, CheckCircle2, Plus, Trash2, Edit } from 'lucide-vue-next'
import api from '../apis/CommonAPI'

export default {
  name: 'Dashboard',
  data() {
    return {
      problems: [],
      loading: false,
      startDate: '',
      endDate: '',
      problemName: '',
      selectedLines: null,
      selectedMachines: null,
      lineOptions: [],
      machineOptions: [],
      machines: [],
      lines: [],
      members: [],
      memberOption: [],
      totalMembers: 0,
      uniqueMembersInFocusThema: 0,
      // Modal and form data removed as this is now read-only
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
    CButton,
    Treeselect,
    BarChart3,
    AlertTriangle,
  },

  computed: {
    totalProblems() {
      return this.problems.length;
    },
    uniqueMembers() {
      // Calculate total members minus members who have taken focus thema
      const memberIdsInFocusThema = [...new Set(this.problems.map(p => p.id_m_member))];
      this.uniqueMembersInFocusThema = memberIdsInFocusThema.length;
      return this.totalMembers - this.uniqueMembersInFocusThema;
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
    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
        console.log('[FE Debug] Member API response:', responseMembers.data);
        this.members = responseMembers.data;
        this.totalMembers = responseMembers.data.length;
        console.log('[FE Debug] Total members:', this.totalMembers);
      } catch (error) {
        console.error('Failed to fetch members:', error);
        this.members = [];
        this.totalMembers = 0;
      }
    },
    async fetchProblems() {
      this.loading = true;
      try {
        const params = {};
        if (this.startDate) params.startDate = this.startDate;
        if (this.endDate) params.endDate = this.endDate;
        if (this.problemName) params.problemName = this.problemName;

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

        const response = await api.get('/smartandon/focusThema/', params);
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
    },
    handleLineChange(value) {
      console.log('Line selection changed:', value);
      this.selectedLines = value;
    },
    handleMachineChange(value) {
      console.log('Machine selection changed:', value);
      this.selectedMachines = value;
    },
  },
  async created() {
    console.log('Focus Thema page opened - fetching data...');
    await this.fetchLines();
    await this.fetchMachines();
    await this.fetchMembers();
    await this.fetchProblems();
    console.log('Data fetching completed for Focus Thema');
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
