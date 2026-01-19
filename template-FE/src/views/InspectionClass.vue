<template>
  <div>
    <!-- Form untuk menambah kelas baru -->
    <CRow>
      <CCol>
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Tambah Kelas Inspeksi Baru</strong>
          </CCardHeader>
          <CCardBody>
            <CForm @submit.prevent="addInspectionClass">
              <div class="mb-3">
                <CFormLabel for="classValue">Value (ID Unik)</CFormLabel>
                <CFormInput id="classValue" v-model="newClass.value" placeholder="Contoh: CLASS_21" required />
              </div>
              <div class="mb-3">
                <CFormLabel for="classLabel">Label (Nama Kelas)</CFormLabel>
                <CFormInput id="classLabel" v-model="newClass.label" placeholder="Contoh: Inspeksi Sistem Pendingin" required />
              </div>
              <CButton type="submit" color="primary" :disabled="loading">
                <CSpinner component="span" size="sm" v-if="loading" />
                Tambah Kelas
              </CButton>
            </CForm>
            <CAlert color="danger" v-if="errorMessage" class="mt-3">
              {{ errorMessage }}
            </CAlert>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Tabel untuk menampilkan daftar kelas -->
    <CRow>
      <CCol>
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Daftar Kelas Inspeksi</strong>
          </CCardHeader>
          <CCardBody>
            <div v-if="loading && inspectionClasses.length === 0">Memuat data...</div>
            <CTable v-else striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Value</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Label</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in inspectionClasses" :key="item.value">
                  <CTableDataCell>{{ item.value }}</CTableDataCell>
                  <CTableDataCell>{{ item.label }}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
             <CAlert color="info" v-if="!loading && inspectionClasses.length === 0">
              Tidak ada data kelas inspeksi.
            </CAlert>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import {
  CRow, CCol, CButton, CFormLabel, CFormInput, CForm,
  CCard, CCardBody, CCardHeader, CTable, CTableHead,
  CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
  CAlert, CSpinner
} from '@coreui/vue';

export default {
  name: 'InspectionClass',
  components: {
    CRow, CCol, CButton, CFormLabel, CFormInput, CForm,
    CCard, CCardBody, CCardHeader, CTable, CTableHead,
    CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    CAlert, CSpinner
  },
  data() {
    return {
      newClass: {
        label: '',
        value: ''
      },
      inspectionClasses: [],
      loading: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.fetchInspectionClasses();
  },
  methods: {
    async fetchInspectionClasses() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await fetch('/api/inspections/classes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.inspectionClasses = await response.json();
      } catch (error) {
        this.errorMessage = `Gagal memuat daftar kelas: ${error.message}`;
        console.error(this.errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async addInspectionClass() {
      if (!this.newClass.label || !this.newClass.value) {
        this.errorMessage = 'Label dan Value tidak boleh kosong.';
        return;
      }
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await fetch('/api/inspections/classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newClass),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        // Reset form dan refresh tabel
        this.newClass.label = '';
        this.newClass.value = '';
        await this.fetchInspectionClasses();
      } catch (error) {
        this.errorMessage = `Gagal menambah kelas: ${error.message}`;
        console.error(this.errorMessage);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Gaya kustom dapat ditambahkan di sini */
</style>
