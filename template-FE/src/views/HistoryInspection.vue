<template>
  <div>
    <!-- Search and Filter Section -->
    <CRow class="mb-3">
      <CCol>
        <CCard>
          <CCardHeader>Search History</CCardHeader>
          <CCardBody>
            <CRow class="g-3">
              <CCol :md="4">
                <CFormLabel for="startDate">Start Date</CFormLabel>
                <CFormInput id="startDate" type="date" v-model="filters.startDate" />
              </CCol>
              <CCol :md="4">
                <CFormLabel for="finishDate">Finish Date</CFormLabel>
                <CFormInput id="finishDate" type="date" v-model="filters.finishDate" />
              </CCol>
              <CCol :md="4">
                <CFormLabel for="engineNumber">Engine Number</CFormLabel>
                <CFormInput id="engineNumber" type="text" v-model="filters.engineNumber" placeholder="Nomor Engine" />
              </CCol>
            </CRow>
            <hr />
            <CRow>
              <CCol :sm="2">
                <CButton :disabled="loading" style="width: 100%" color="dark" variant="outline" @click="resetFilters">Reset</CButton>
              </CCol>
              <CCol :sm="10">
                <CButton :disabled="loading" style="width: 100%" color="primary" @click="fetchHistory(1)">
                   <CSpinner component="span" size="sm" v-if="loading" />
                  Search
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- History Table Section -->
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <strong>History Inspeksi</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mb-3">
               <CCol :sm="2">
                <CFormLabel style="font-weight: bold;">Download</CFormLabel>
                <CButton :disabled="loading" style="width: 100%; font-weight: bold; color: white" color="success" @click="downloadExcel">Download</CButton>
              </CCol>
            </CRow>
            <hr/>
            <div v-if="loading && items.length === 0" class="text-center">
              <CSpinner color="primary" />
              <p>Loading data...</p>
            </div>
            <CTable v-else-if="items.length > 0" striped hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Inspection ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Engine Number</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Judge ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item, index) in items" :key="item.uuid">
                  <CTableDataCell>{{ (pagination.currentPage - 1) * pagination.pageSize + index + 1 }}</CTableDataCell>
                  <CTableDataCell>{{ item.inspection_id }}</CTableDataCell>
                  <CTableDataCell>{{ item.engine_number }}</CTableDataCell>
                  <CTableDataCell>{{ formatDate(item.created_at) }}</CTableDataCell>
                  <CTableDataCell>{{ item.judge_id }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="info" @click="viewDetails(item)" style="color: white;">Lihat Detail</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
             <CAlert color="info" v-else class="text-center">
              Tidak ada data riwayat inspeksi yang ditemukan.
            </CAlert>

            <!-- Pagination -->
            <CPagination v-if="pagination.totalPages > 1" aria-label="Page navigation">
              <CPaginationItem :disabled="pagination.currentPage === 1" @click.prevent="goToPage(1)">First</CPaginationItem>
              <CPaginationItem :disabled="pagination.currentPage === 1" @click.prevent="goToPage(pagination.currentPage - 1)">Previous</CPaginationItem>
              <CPaginationItem
                v-for="page in visiblePages"
                :key="page"
                :active="page === pagination.currentPage"
                @click.prevent="goToPage(page)"
              >
                {{ page }}
              </CPaginationItem>
              <CPaginationItem :disabled="pagination.currentPage === pagination.totalPages" @click.prevent="goToPage(pagination.currentPage + 1)">Next</CPaginationItem>
              <CPaginationItem :disabled="pagination.currentPage === pagination.totalPages" @click.prevent="goToPage(pagination.totalPages)">Last</CPaginationItem>
            </CPagination>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  CRow, CCol, CButton, CFormLabel, CFormInput,
  CCard, CCardBody, CCardHeader, CTable, CTableHead,
  CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CAlert, CSpinner, CBadge, CPagination, CPaginationItem
} from '@coreui/vue';
import axios from 'axios';

export default {
  name: 'HistoryInspection',
  components: {
    CRow, CCol, CButton, CFormLabel, CFormInput,
    CCard, CCardBody, CCardHeader, CTable, CTableHead,
    CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    CAlert, CSpinner, CBadge, CPagination, CPaginationItem
  },
  data() {
    return {
      items: [],
      filters: {
        startDate: '',
        finishDate: '',
        engineNumber: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalRecords: 0,
      },
      loading: false,
      error: null,
    };
  },
  computed: {
    visiblePages() {
      const total = this.pagination.totalPages;
      const current = this.pagination.currentPage;
      const maxVisible = 5;
      if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > total) {
        end = total;
        start = Math.max(1, end - maxVisible + 1);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page,
          limit: this.pagination.pageSize,
          startDate: this.filters.startDate || undefined,
          finishDate: this.filters.finishDate || undefined,
          engineNumber: this.filters.engineNumber || undefined,
        };
        const response = await axios.get('/api/inspections/history', { params });
        
        if (response && response.data && Array.isArray(response.data.data)) {
          this.items = response.data.data;
          this.pagination.currentPage = response.data.page || 1;
          this.pagination.totalRecords = response.data.total || 0;
          this.pagination.totalPages = Math.ceil(this.pagination.totalRecords / this.pagination.pageSize) || 0;
        } else {
          this.items = [];
          this.pagination.currentPage = 1;
          this.pagination.totalRecords = 0;
          this.pagination.totalPages = 0;
          console.warn('Received unexpected data structure from API:', response.data);
        }

      } catch (err) {
        this.error = 'Gagal memuat data riwayat inspeksi dari API.';
        this.items = [];
        this.pagination.totalPages = 0;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    resetFilters() {
      this.filters.startDate = '';
      this.filters.finishDate = '';
      this.filters.engineNumber = '';
      this.fetchHistory(1);
    },
    goToPage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.fetchHistory(page);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    },
    viewDetails(item) {
      alert(`Melihat detail untuk Inspection ID: ${item.inspection_id}`);
    },
    downloadExcel() {
       alert('Fungsi download Excel akan diimplementasikan.');
    }
  },
};
</script>

<style scoped>
/* Custom styles can be added here */
</style>
