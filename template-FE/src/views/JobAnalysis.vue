<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardBody>
          <!-- Filter Section -->
          <CRow class="mb-3">
            <CCol md="6">
              <label for="filterDate">Date</label>
              <CFormInput
                id="filterDate"
                type="date"
                v-model="filterDate"
              />
            </CCol>
            <CCol md="6">
              <label for="lineSelect">Line</label>
              <CFormSelect
                id="lineSelect"
                v-model="selectedLine"
              >
                <option value="">All Lines</option>
                <option
                  v-for="line in lineOptions"
                  :key="line.id"
                  :value="line.id"
                >
                  {{ line.label }}
                </option>
              </CFormSelect>
            </CCol>
          </CRow>
          <hr></hr>
          <CRow lg="12" class="mb-3">
            <CCol lg="3">
              <CButton variant="outline" style="width: 100%;" color="dark" @click="resetFilters">
                Reset
              </CButton>
            </CCol>
            <CCol lg="9">
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
      <CCard>
        <CCardHeader style="font-weight: bold; font-size: medium;">
          Job analysis
        </CCardHeader>
        <CCardBody>
          <!-- Table -->
          <CTable bordered hover responsive class="hour-table">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">No</CTableHeaderCell>
                <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                <CTableHeaderCell scope="col">Machine Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Problem Name</CTableHeaderCell>
                <CTableHeaderCell v-for="hour in 24" :key="hour" scope="col" class="hour-header">{{ String(hour - 1).padStart(2, '0') }}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(problem, idx) in problems" :key="problem.fid">
                <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
                <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
                <CTableDataCell
                  v-for="hour in 24"
                  :key="hour"
                  :class="{ 'problem-hour': isProblemHour(problem, hour - 1) }"
                ></CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import moment from 'moment'
import { CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCard, CCardBody, CCardHeader, CRow, CCol, CFormInput, CFormSelect, CButton } from '@coreui/vue';
import api from '../apis/CommonAPI'

export default {
  name: 'Dashboard',
  data() {
    return {
      problems: [],
      loading: false,
      filterDate: moment().format('YYYY-MM-DD'),
      selectedLine: '',
      lineOptions: [],
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
  },

  watch: {
  },

  methods: {
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
        const response = await api.get('/smartandon/line');
        if (response.status !== 200) {
          throw new Error('Failed to fetch lines, status: ' + response.status);
        }
        this.lineOptions = response.data.map(line => ({
          id: line.fid,
          label: line.fline
        }));
      } catch (error) {
        console.error('Failed to fetch lines:', error);
      }
    },
    async fetchProblems() {
      this.loading = true;
      try {
        const params = {
          startDate: this.filterDate,
          finishDate: this.filterDate,
          line: this.selectedLine && this.selectedLine !== '' ? this.selectedLine : undefined,
        };
        const response = await api.get('/smartandon/problemView', {
          search: JSON.stringify(params),
        });
        if (response.status !== 200) {
          throw new Error('Failed to fetch problems, status: ' + response.status);
        }
        // Filter to only show problems that are finished (have fend_time)
        this.problems = response.data.data.filter(problem => problem.fend_time).sort((a, b) => moment(a.fstart_time).isBefore(moment(b.fstart_time)) ? -1 : 1);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.filterDate = moment().format('YYYY-MM-DD');
      this.selectedLine = '';
      this.fetchProblems();
    },
  },

  async created() {
    await this.fetchLines();
    await this.fetchProblems();
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
  background-color: rgba(255, 255, 255, 0.8);
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

.hour-table .hour-header {
  text-align: center;
  font-size: 12px;
  padding: 5px;
}

.hour-table tbody td {
  padding: 8px;
  text-align: center;
}

.hour-table .problem-hour {
  background-color: #ff6b6b !important;
  color: white;
}

</style>
