<template>
  <CContainer class="my-4">
    <h1 class="text-center mb-4">Ambil Gambar Sampel (Dataset AI)</h1>

    <CAlert color="danger" v-if="!isCameraSupported">
      Fitur kamera tidak didukung di browser ini.
    </CAlert>

    <div v-if="isCameraSupported">
      <CRow class="justify-content-center mb-3">
        <CCol md="6">
          <CFormLabel for="camera-select">Pilih Kamera:</CFormLabel>
          <CFormSelect
            id="camera-select"
            v-model="selectedDeviceId"
            @change="startCamera"
            :options="cameraOptions"
            :disabled="isAnyCaptureRunning"
          />
        </CCol>
      </CRow>

      <CRow class="justify-content-center mb-4">
        <CCol lg="8" md="10">
          <div class="camera-box">
            <video ref="videoPlayer" class="camera-feed" autoplay playsinline></video>
            <div v-if="!isCameraRunning" class="placeholder">
              <span>Kamera tidak aktif</span>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <!-- Manual Capture -->
        <CCol md="4" class="mb-3">
          <CCard class="h-100">
            <CCardBody class="text-center d-flex flex-column">
              <CCardTitle>Manual Capture</CCardTitle>
              <CCardText class="flex-grow-1">Ambil gambar satu per satu.</CCardText>
              <CButton color="primary" @click="takePicture" :disabled="!isCameraRunning || isAnyCaptureRunning">
                <CIcon name="cil-camera" class="me-2" />
                Ambil Gambar
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Interval Capture -->
        <CCol md="4" class="mb-3">
          <CCard class="h-100">
            <CCardBody class="text-center d-flex flex-column">
              <CCardTitle>Interval Capture</CCardTitle>
              <CCardText class="flex-grow-1">Ambil gambar tanpa batas sampai dihentikan.</CCardText>
              <div class="mb-3">
                <CFormLabel for="interval-time" class="d-inline me-2">Interval (detik):</CFormLabel>
                <CFormInput id="interval-time" type="number" v-model.number="intervalTime" min="1" :disabled="isAnyCaptureRunning" style="max-width: 100px; display: inline-block;" />
              </div>
              <div class="mt-auto">
                <CButton color="success" @click="startIntervalCapture" :disabled="!isCameraRunning || isAnyCaptureRunning" class="me-2" style="color: white;">
                  Mulai
                </CButton>
                <CButton :color="isIntervalRunning ? 'danger' : 'dark'" @click="stopIntervalCapture" :disabled="!isIntervalRunning" style="color: white;">
                  Hentikan
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        <!-- Rapid Collect -->
        <CCol md="4" class="mb-3">
          <CCard class="h-100">
            <CCardBody class="text-center d-flex flex-column">
              <CCardTitle>Rapid Collect</CCardTitle>
              <CCardText class="flex-grow-1">Ambil gambar dengan interval dan batas jumlah.</CCardText>
              <CRow>
                <CCol class="mb-3">
                  <CFormLabel for="rapid-interval" class="d-inline me-2">Interval:</CFormLabel>
                  <CFormInput id="rapid-interval" type="number" v-model.number="rapidCollectInterval" min="1" :disabled="isAnyCaptureRunning" style="max-width: 80px; display: inline-block;" />
                </CCol>
                <CCol class="mb-3">
                  <CFormLabel for="rapid-limit" class="d-inline me-2">Batas:</CFormLabel>
                  <CFormInput id="rapid-limit" type="number" v-model.number="rapidCollectLimit" min="1" :disabled="isAnyCaptureRunning" style="max-width: 80px; display: inline-block;" />
                </CCol>
              </CRow>
              <div class="mt-auto">
                <CButton color="info" @click="startRapidCollect" :disabled="!isCameraRunning || isAnyCaptureRunning" style="color: white;">
                  Mulai Rapid Collect
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>

    <CCard v-if="capturedImages.length > 0" class="mt-4">
      <CCardHeader>
        <CRow class="align-items-center">
          <CCol>
            <strong>Galeri Gambar ({{ capturedImages.length }} gambar)</strong>
          </CCol>
          <CCol class="text-end">
            <CButton color="primary" size="sm" @click="openSaveModal" class="me-2">
              Save All
            </CButton>
            <CButton color="secondary" size="sm" @click="clearImages">
              Bersihkan Galeri
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow class="image-gallery g-3">
          <CCol v-for="(image, index) in capturedImages" :key="index" xs="6" sm="4" md="3" lg="2">
            <div class="image-container">
              <img :src="image" alt="Gambar hasil tangkapan" class="captured-image" />
              <CButton color="danger" size="sm" class="delete-btn" @click="deleteImage(index)">
                <CIcon name="cil-trash" />
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <canvas ref="canvasElement" style="display: none;"></canvas>

    <CModal :visible="isSaveModalVisible" @close="closeSaveModal">
      <CModalHeader>
        <CModalTitle>Save All Images</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-3">
          <CFormLabel for="name-input">Nama Format</CFormLabel>
          <CFormInput id="name-input" v-model="saveName" />
        </div>
        <div class="mb-3">
          <CFormLabel for="save-option">Opsi Simpan</CFormLabel>
          <CFormSelect id="save-option" v-model="saveOption" :options="['default', 'new']" />
        </div>
        <div v-if="saveOption === 'new'" class="mb-3">
          <CFormLabel for="new-folder-name">Nama Folder Baru</CFormLabel>
          <CFormInput id="new-folder-name" v-model="newFolderName" />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeSaveModal">Cancel</CButton>
        <CButton color="primary" @click="saveAllImages">Save</CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script>
import { 
  CContainer, CRow, CCol, CButton, CAlert, CFormLabel, CFormSelect, 
  CFormInput, CCard, CCardBody, CCardTitle, CCardText, CCardHeader,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/vue';
import { CIcon } from '@coreui/icons-vue';

export default {

  name: 'CollectingSample',

  components: {
    CContainer, CRow, CCol, CButton, CAlert, CFormLabel, CFormSelect, 
    CFormInput, CCard, CCardBody, CCardTitle, CCardText, CCardHeader,
    CIcon,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
  },
  
  data() {
    return {
      isCameraSupported: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      cameras: [],
      selectedDeviceId: null,
      stream: null,
      isCameraRunning: false,
      capturedImages: [],
      
      // Interval Capture Data
      intervalTime: 5,
      intervalId: null,
      isIntervalRunning: false,

      // Rapid Collect Data
      rapidCollectInterval: 1,
      rapidCollectLimit: 10,
      rapidIntervalId: null,
      isRapidCollecting: false,

      // Save All Modal
      isSaveModalVisible: false,
      saveName: '',
      saveOption: 'default',
      newFolderName: '',
    };
  },
  computed: {
    cameraOptions() {
      return this.cameras.map(camera => ({
        value: camera.deviceId,
        label: camera.label || `Kamera ${camera.deviceId.substring(0, 6)}`
      }));
    },
    isAnyCaptureRunning() {
      return this.isIntervalRunning || this.isRapidCollecting;
    }
  },
  mounted() {
    if (this.isCameraSupported) {
      this.loadCameras();
    }
  },
  beforeDestroy() {
    this.stopCamera();
  },
  methods: {
    async loadCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.cameras = devices.filter(device => device.kind === 'videoinput');
        if (this.cameras.length > 0) {
          this.selectedDeviceId = this.cameras[0].deviceId;
          this.startCamera();
        } else {
          console.warn('Tidak ada kamera yang ditemukan.');
        }
      } catch (error) {
        console.error('Error saat memuat daftar kamera:', error);
      }
    },
    async startCamera() {
      this.stopCamera();
      if (!this.selectedDeviceId) return;

      const constraints = { video: { deviceId: { exact: this.selectedDeviceId } } };

      try {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.videoPlayer.srcObject = this.stream;
        this.isCameraRunning = true;
      } catch (error) {
        console.error('Error saat memulai kamera:', error);
        this.isCameraRunning = false;
      }
    },
    stopCamera() {
      this.stopIntervalCapture();
      this.stopRapidCollect();
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
      this.isCameraRunning = false;
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.srcObject = null;
      }
      this.stream = null;
    },
    takePicture() {
      if (!this.isCameraRunning) return;

      const video = this.$refs.videoPlayer;
      const canvas = this.$refs.canvasElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      this.capturedImages.unshift(canvas.toDataURL('image/png'));
    },
    startIntervalCapture() {
      if (this.isAnyCaptureRunning || !this.isCameraRunning) return;
      
      this.isIntervalRunning = true;
      this.takePicture(); 
      this.intervalId = setInterval(this.takePicture, this.intervalTime * 1000);
    },
    stopIntervalCapture() {
      if (!this.isIntervalRunning) return;

      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isIntervalRunning = false;
    },
    startRapidCollect() {
      if (this.isAnyCaptureRunning || !this.isCameraRunning) return;

      this.isRapidCollecting = true;
      let captureCount = 0;

      this.rapidIntervalId = setInterval(() => {
        if (captureCount >= this.rapidCollectLimit || !this.isCameraRunning) {
          this.stopRapidCollect();
          return;
        }
        
        this.takePicture();
        captureCount++;

        if (captureCount >= this.rapidCollectLimit) {
          this.stopRapidCollect();
        }
      }, this.rapidCollectInterval * 1000);
    },
    stopRapidCollect() {
      if (!this.isRapidCollecting) return;

      clearInterval(this.rapidIntervalId);
      this.rapidIntervalId = null;
      this.isRapidCollecting = false;
    },
    clearImages() {
      this.capturedImages = [];
    },
    deleteImage(index) {
      this.capturedImages.splice(index, 1);
    },
    openSaveModal() {
      this.isSaveModalVisible = true;
    },
    closeSaveModal() {
      this.isSaveModalVisible = false;
    },
    saveAllImages() {
      if (!this.saveName.trim()) {
        alert('Nama file tidak boleh kosong.');
        return;
      }

      this.capturedImages.forEach((image, index) => {
        const link = document.createElement('a');
        const sanitizedName = this.saveName.replace(/[^a-zA-Z0-9-]/g, '_');
        link.download = `${sanitizedName}-${index + 1}.png`;
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      this.closeSaveModal();
    },
  },
};
</script>

<style scoped>
.camera-box {
  position: relative;
  width: 100%;
  background-color: #000;
  border-radius: var(--cui-border-radius);
  overflow: hidden;
  border: 1px solid var(--cui-border-color);
}

.camera-feed {
  width: 100%;
  height: auto;
  display: block;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 1.2rem;
}

.image-gallery {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px; /* for scrollbar */
}

.captured-image {
  width: 100%;
  height: auto;
  border-radius: var(--cui-border-radius);
  border: 1px solid var(--cui-border-color);
  display: block;
}

.image-container {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
}

.image-container:hover .delete-btn {
  opacity: 1;
}
</style>
