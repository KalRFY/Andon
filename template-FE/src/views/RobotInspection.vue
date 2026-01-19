<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardBody>
          <!-- AI Camera Selection -->
          <CRow class="mb-3 justify-content-center">
            <CCol lg="2" v-for="camera in cameras" :key="camera.id" class="mb-3">
              <CCard>
                <CCardBody class="text-center">
                  <div class="camera-placeholder">
                    <div class="camera-icon">
                      <Camera size="48" />
                    </div>
                    <div class="camera-label">{{ camera.name }}</div>
                    <CButton
                      class="mt-2"
                      color="primary"
                      size="sm"
                      @click="inspectCamera(camera.id)"
                    >
                      Inspect
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
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
                @click="openUploadModal"
              >+ Upload Inspection Media +</CButton>
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
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Robot ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 10%; text-align: center;">Machine</CTableHeaderCell>
                    <CTableHeaderCell scope="col">AI Results</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 6%; text-align: center;">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style="width: 15%; text-align: center;">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(inspection, idx) in inspections" :key="inspection.id">
                    <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                    <CTableDataCell>{{ formatDate(inspection.inspection_date) }}</CTableDataCell>
                    <CTableDataCell>{{ inspection.robot_id }}</CTableDataCell>
                    <CTableDataCell>{{ getLineName(inspection.robot_id) }}</CTableDataCell>
                    <CTableDataCell>{{ getMachineName(inspection.robot_id) }}</CTableDataCell>
                    <CTableDataCell>
                      <div class="ai-results">
                        <div class="confidence-score">
                          Confidence: {{ inspection.ai_results ? inspection.ai_results.confidence_score.toFixed(1) : 'N/A' }}%
                        </div>
                        <div class="issues-count">
                          Issues: {{ inspection.ai_results && inspection.ai_results.detected_issues ? inspection.ai_results.detected_issues.length : 0 }}
                        </div>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell class="text-center">
                      <span :class="getStatusClass(inspection.status)">{{ getStatusLabel(inspection.status) }}</span>
                    </CTableDataCell>
                    <CTableDataCell style="text-align: center;">
                      <CButton
                        class="me-2"
                        color="info"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                          padding: 6px 8px;
                        "
                        @click="viewInspectionDetails(inspection)"
                      >
                        <Eye size="16" />
                      </CButton>
                      <CButton
                        class="me-2"
                        color="success"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                          padding: 6px 8px;
                        "
                        @click="approveInspection(inspection)"
                      >
                        <Check size="16" />
                      </CButton>
                      <CButton
                        class="me-2"
                        color="warning"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                          padding: 6px 8px;
                        "
                        @click="rejectInspection(inspection)"
                      >
                        <X size="16" />
                      </CButton>
                      <CButton
                        class="me-2"
                        color="danger"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                          padding: 6px 8px;
                        "
                        @click="confirmDelete(inspection)"
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



  <!-- Details Modal -->
  <CModal
    :visible="showDetailsModal"
    @close="closeDetailsModal"
    size="xl"
    backdrop="static"
  >
    <CModalHeader>
      <CModalTitle>Inspection Details</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow v-if="selectedInspection">
        <CCol md="6">
          <h6>Inspection Media:</h6>
          <img v-if="isImageFile(selectedInspection.image_path)" :src="getImageUrl(selectedInspection.image_path)" alt="Inspection" class="details-image" />
          <video v-else :src="getImageUrl(selectedInspection.image_path)" controls class="details-video"></video>
        </CCol>
        <CCol md="6">
          <h6>AI Analysis Results:</h6>
          <div v-if="selectedInspection.ai_results" class="ai-analysis">
            <div class="confidence-bar">
              <span>Overall Confidence: {{ selectedInspection.ai_results.confidence_score.toFixed(1) }}%</span>
              <CProgress :value="selectedInspection.ai_results.confidence_score" class="mt-2" />
            </div>
            <div class="detected-issues mt-3">
              <h6>Detected Issues:</h6>
              <ul v-if="selectedInspection.ai_results.detected_issues && selectedInspection.ai_results.detected_issues.length">
                <li v-for="issue in selectedInspection.ai_results.detected_issues" :key="issue.type">
                  <strong>{{ issue.type }}</strong> - Severity: {{ issue.severity }} ({{ issue.confidence }}% confidence)
                  <br><small>Location: {{ issue.location }}</small>
                </li>
              </ul>
              <p v-else>No issues detected.</p>
            </div>
            <div class="recommendations mt-3">
              <h6>Recommendations:</h6>
              <ul v-if="selectedInspection.ai_results.recommendations && selectedInspection.ai_results.recommendations.length">
                <li v-for="rec in selectedInspection.ai_results.recommendations" :key="rec">
                  {{ rec }}
                </li>
              </ul>
              <p v-else>No recommendations.</p>
            </div>
            <div v-if="selectedInspection.user_validation" class="user-validation mt-3">
              <h6>User Validation:</h6>
              <p>{{ selectedInspection.user_validation }}</p>
            </div>
          </div>
          <div v-else>
            <p>No AI analysis results available.</p>
          </div>
        </CCol>
      </CRow>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeDetailsModal">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <!-- Upload Modal -->
  <CModal
    :visible="showUploadModal"
    @close="closeUploadModal"
    size="lg"
    backdrop="static"
  >
    <CModalHeader>
      <CModalTitle>Upload Inspection Media</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel for="robotId">Robot ID</CFormLabel>
            <CInputGroup>
              <CInputGroupText>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </CInputGroupText>
              <input
                type="number"
                id="robotId"
                class="form-control"
                v-model="selectedRobot"
                placeholder="Enter Robot ID"
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <CFormLabel for="cameraId">Camera ID</CFormLabel>
            <CInputGroup>
              <CInputGroupText>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h6l-3-3-3 3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </CInputGroupText>
              <input
                type="number"
                id="cameraId"
                class="form-control"
                v-model="selectedCamera"
                placeholder="Camera ID"
                readonly
              />
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol>
            <CFormLabel for="inspectionFile">Inspection Media</CFormLabel>
            <input
              type="file"
              id="inspectionFile"
              class="form-control"
              @change="onFileChange"
              accept="image/*,video/*"
            />
          </CCol>
        </CRow>
        <CRow v-if="filePreview" class="mb-3">
          <CCol>
            <div class="file-preview">
              <h6>Preview:</h6>
              <img v-if="isImage" :src="filePreview" alt="Preview" class="preview-image" />
              <video v-else :src="filePreview" controls class="preview-video"></video>
            </div>
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeUploadModal" :disabled="uploading">
        Cancel
      </CButton>
      <CButton
        color="primary"
        @click="uploadInspection"
        :disabled="!selectedRobot || !selectedFile || uploading"
      >
        <span v-if="uploading">Uploading...</span>
        <span v-else>Upload & Analyze</span>
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
      <p>Are you sure you want to delete this inspection?</p>
      <p><strong>Robot ID:</strong> {{ itemToDelete ? itemToDelete.robot_id : '' }}</p>
      <p><strong>Date:</strong> {{ itemToDelete ? formatDate(itemToDelete.inspection_date) : '' }}</p>
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

  <!-- Camera Live-Feed Modal -->
  <CModal
    :visible="showCameraModal"
    @close="closeCameraModal"
    size="lg"
    backdrop="static"
  >
    <CModalHeader>
      <CModalTitle>Live Feed: {{ selectedCameraForStream ? selectedCameraForStream.name : '' }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <video ref="videoPlayer" class="camera-feed" autoplay playsinline style="width: 100%;"></video>
      <div v-if="cameraError" class="alert alert-danger m-3">
        <strong>Error:</strong> {{ cameraError }}
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeCameraModal">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

</template>

<script>
import moment from 'moment'
import { CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormLabel, CFormTextarea, CInputGroup, CInputGroupText, CProgress, CFormSelect } from '@coreui/vue';

import { BarChart3, AlertTriangle, CheckCircle2, Trash2, Eye, Check, X, Camera } from 'lucide-vue-next'
import api from '../apis/CommonAPI'

export default {
  name: 'RobotInspection',
  data() {
    return {
      cameras: [],
      inspections: [],
      loading: false,
      showUploadModal: false,
      showDetailsModal: false,
      showDeleteModal: false,
      selectedInspection: null,
      itemToDelete: null,
      selectedRobot: null,
      selectedFile: null,
      filePreview: '',
      uploading: false,
      selectedCamera: null,
      showCameraModal: false,
      cameraError: null,
      selectedCameraForStream: null,
      selectedStatus: 'All',
      selectedLine: null,
      selectedMachine: null,
      lineOptions: [],
      machineOptions: [],
    }
  },

  components: {
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormLabel,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CProgress,
    CFormSelect,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Trash2,
    Eye,
    Check,
    X,
    Camera,
  },

  computed: {
    totalInspections() {
      if (!Array.isArray(this.inspections)) return 0;
      return this.inspections.length;
    },
    pendingCount() {
      if (!Array.isArray(this.inspections)) return 0;
      return this.inspections.filter(i => i.status === 'pending').length;
    },
    approvedCount() {
      if (!Array.isArray(this.inspections)) return 0;
      return this.inspections.filter(i => i.status === 'approved').length;
    },
    rejectedCount() {
      if (!Array.isArray(this.inspections)) return 0;
      return this.inspections.filter(i => i.status === 'rejected').length;
    },

    isImage() {
      return this.selectedFile && this.selectedFile.type.startsWith('image/');
    }
  },



  methods: {
    async fetchCameras() {
      try {
        const response = await api.get('/camera/list');
        if (response.status === 200 && Array.isArray(response.data)) {
          this.cameras = response.data.map(cameraName => ({
            id: cameraName,
            name: cameraName
          }));
        } else {
          throw new Error('Failed to fetch cameras or data is not an array');
        }
      } catch (error) {
        console.error('Error fetching cameras:', error);
        alert('Could not load camera data.');
      }
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
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

    async fetchInspections() {
      this.loading = true;
      try {
        const params = {};
        if (this.selectedStatus && this.selectedStatus !== 'All') {
          params.status = this.selectedStatus.toLowerCase();
        }
        if (this.selectedLine) {
          params.line_id = this.selectedLine;
        }
        if (this.selectedMachine) {
          params.machine_id = this.selectedMachine;
        }
        const response = await api.get('/robot-inspection', { params });
        if (response.status !== 200) {
          throw new Error('Failed to fetch inspections, status: ' + response.status);
        }
        console.log('Response data:', response.data);
        this.inspections = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Failed to fetch inspections:', error);
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      this.fetchInspections();
    },
    getStatusLabel(status) {
      return status === 'pending' ? 'Pending' : status === 'approved' ? 'Approved' : 'Rejected';
    },
    getStatusClass(status) {
      return status === 'pending' ? 'status-pending' : status === 'approved' ? 'status-approved' : 'status-rejected';
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
        this.deleteInspection(this.itemToDelete.id);
        this.closeDeleteModal();
      }
    },
    async deleteInspection(id) {
      try {
        const response = await api.delete(`/robot-inspection/${id}`);
        if (response.status === 200) {
          alert('Inspection deleted successfully!');
          await this.fetchInspections();
        } else {
          throw new Error('Failed to delete inspection');
        }
      } catch (error) {
        alert('Error deleting inspection: ' + error.message);
      }
    },

    // New methods for robot inspection
    openUploadModal() {
      this.showUploadModal = true;
    },

    closeUploadModal() {
      this.showUploadModal = false;
      this.selectedRobot = null;
      this.selectedFile = null;
      this.filePreview = '';
      this.selectedCamera = null;
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async uploadInspection() {
      if (!this.selectedRobot || !this.selectedFile) {
        alert('Please select a robot and upload a file.');
        return;
      }

      this.uploading = true;
      try {
        const formData = new FormData();
        formData.append('robot_id', this.selectedRobot);
        formData.append('inspection_media', this.selectedFile);
        formData.append('camera_id', this.selectedCamera);

        const response = await api.post('/robot-inspection/ai-analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 201) {
          alert('Inspection uploaded and analyzed successfully!');
          this.closeUploadModal();
          await this.fetchInspections();
        } else {
          throw new Error('Failed to upload inspection');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading inspection: ' + error.message);
      } finally {
        this.uploading = false;
      }
    },

    closeCameraModal() {
      this.showCameraModal = false;
      this.cameraError = null;
      this.selectedCameraForStream = null;
      this.stopCameraStream();
    },

    async initializeCamera() {
      this.stopCameraStream(); // Ensure any existing stream is stopped

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.cameraError = "Your browser does not support the MediaDevices API.";
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoPlayer = this.$refs.videoPlayer;
        if (videoPlayer) {
          videoPlayer.srcObject = stream;
          videoPlayer.play();
          this.cameraError = null;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err.name === 'NotAllowedError') {
          this.cameraError = "Permission to use camera was denied. Please allow camera access in your browser settings.";
        } else if (err.name === 'NotFoundError') {
          this.cameraError = "No camera was found. Please ensure a camera is connected.";
        } else {
          this.cameraError = `Could not access the camera. Error: ${err.name}`;
        }
      }
    },

    stopCameraStream() {
      const videoPlayer = this.$refs.videoPlayer;
      if (videoPlayer && videoPlayer.srcObject) {
        const stream = videoPlayer.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoPlayer.srcObject = null;
      }
    },

    inspectCamera(cameraId) {
      const camera = this.cameras.find(c => c.id === cameraId);
      if (camera) {
        this.selectedCameraForStream = camera;
        this.showCameraModal = true;
        this.$nextTick(() => {
          this.initializeCamera();
        });
      }
    },

    viewInspectionDetails(inspection) {
      this.selectedInspection = inspection;
      this.showDetailsModal = true;
    },

    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedInspection = null;
    },

    async approveInspection(inspection) {
      await this.updateInspectionStatus(inspection.id, 'approved');
    },

    async rejectInspection(inspection) {
      const validation = prompt('Please provide validation reason for rejection:');
      if (validation !== null) {
        await this.updateInspectionStatus(inspection.id, 'rejected', validation);
      }
    },

    async updateInspectionStatus(id, status, validation = '') {
      try {
        const response = await api.put(`/robot-inspection/${id}`, {
          status,
          user_validation: validation
        });

        if (response.status === 200) {
          alert(`Inspection ${status} successfully!`);
          await this.fetchInspections();
        } else {
          throw new Error(`Failed to ${status} inspection`);
        }
      } catch (error) {
        alert(`Error ${status}ing inspection: ` + error.message);
      }
    },

    getLineName(robotId) {
      // Mock function - replace with actual logic to get line name from robot ID
      return `Line ${Math.floor(robotId / 10) + 1}`;
    },

    getMachineName(robotId) {
      // Mock function - replace with actual logic to get machine name from robot ID
      return `Machine ${robotId}`;
    },

    isImageFile(path) {
      return path && (path.toLowerCase().endsWith('.jpg') || path.toLowerCase().endsWith('.jpeg') || path.toLowerCase().endsWith('.png'));
    },

    getImageUrl(path) {
      return `http://localhost:3000${path}`;
    },
  },
  async created() {
    console.log('Robot Inspection page opened - fetching data...');
    await this.fetchCameras();
    await this.fetchLines();
    await this.fetchMachines();
    await this.fetchInspections();
    console.log('Data fetching completed for Robot Inspection');
  },
  beforeUnmount() {
    this.stopCameraStream();
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
