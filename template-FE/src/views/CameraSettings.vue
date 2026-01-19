<template>
  <div>
    <CRow>
      <!-- Camera Feed Column -->
      <CCol :md="7">
        <CCard class="mb-4">
          <CCardHeader>
            <h5>Live Camera Feed</h5>
          </CCardHeader>
          <CCardBody class="p-0">
            <video ref="videoPlayer" class="camera-feed" autoplay playsinline></video>
            <div v-if="cameraError" class="alert alert-danger m-3">
              <strong>Error:</strong> {{ cameraError }}
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Settings Column -->
      <CCol :md="5">
        <CCard class="mb-4">
          <CCardHeader>
            <CRow>
              <CCol>
                <h6>Camera Settings</h6>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody class="settings-body">
            <CForm>
              <div class="mb-3">
                <CFormLabel for="camera-select">Select Camera</CFormLabel>
                <CFormSelect id="camera-select" v-model="selectedCamera" @change="handleCameraChange" :options="cameras"></CFormSelect>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-3">
                <CButton v-if="!isEditing" color="primary" @click="editSettings" size="sm">
                  Edit
                </CButton>
                <template v-if="isEditing">
                  <CButton color="primary" @click="saveSettings" size="sm" :disabled="!isDirty">
                    Save
                  </CButton>
                  <CButton color="secondary" @click="resetToDefaults" size="sm">
                    Reset
                  </CButton>
                </template>
              </div>

              <!-- Dynamically generate controls -->
              <div v-for="control in controls" :key="control.name" class="mb-2">
                <CRow>
                  <CFormLabel :for="control.name" class="col-sm-5 col-form-label col-form-label-sm text-capitalize">
                    {{ control.name.replace(/_/g, ' ') }}
                    <span v-if="control.type === 'int'"> ({{ control.value }})</span>
                  </CFormLabel>
                  <CCol :sm="7">
                    <!-- Slider for Integer type -->
                    <CFormRange
                      v-if="control.type === 'int'"
                      :id="control.name"
                      :min="control.min"
                      :max="control.max"
                      :step="control.step"
                      v-model="control.value"
                      :disabled="!isEditing || (control.flags && control.flags.includes('inactive'))"
                      size="sm"
                    />
                    <!-- Switch for Boolean type -->
                    <CFormCheck
                      v-if="control.type === 'bool'"
                      :id="control.name"
                      v-model="control.value"
                      switch
                      :disabled="!isEditing || (control.flags && control.flags.includes('inactive'))"
                    />
                    <!-- Select for Menu type -->
                    <CFormSelect
                      v-if="control.type === 'menu'"
                      :id="control.name"
                      v-model="control.value"
                      :disabled="!isEditing || (control.flags && control.flags.includes('inactive'))"
                      size="sm"
                    >
                      <option v-for="option in control.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </CFormSelect>
                  </CCol>
                </CRow>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton, CForm, CFormLabel, CFormSelect, CFormRange, CFormCheck } from '@coreui/vue';
import axios from 'axios';

export default {
  name: 'CameraSettings',
  components: {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CForm,
    CFormLabel,
    CFormSelect,
    CFormRange,
    CFormCheck,
  },
  data() {
    return {
      isEditing: false,
      cameraError: null,
      controls: [],
      originalControls: [], // To store default values for reset
      cameras: [],
      selectedCamera: '',
      previousSelectedCamera: '',
      allSettings: {},
      isDirty: false,
    };
  },
  watch: {
    selectedCamera() {
      this.fetchAllSettings();
    },
    controls: {
      handler() {
        this.isDirty = true;
      },
      deep: true,
    },
  },
  methods: {
    editSettings() {
      this.isEditing = true;
    },
    async initializeCamera() {
      // Clean up any existing stream
      this.stopCameraStream();

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
    async fetchCameraList() {
      try {
        const response = await axios.get('/api/camera/list');
        this.cameras = response.data;
        if (this.cameras.length > 0) {
          this.selectedCamera = this.cameras[0];
          this.previousSelectedCamera = this.cameras[0];
          await this.fetchAllSettings();
        }
      } catch (error) {
        console.error('Error fetching camera list:', error);
      }
    },
    async fetchAllSettings() {
        try {
            const response = await axios.get('/api/camera/settings');
            this.allSettings = response.data;
            this.loadCameraSettings();
        } catch (error) {
            console.error('Error fetching all settings:', error);
        }
    },
    loadCameraSettings() {
        const settings = this.allSettings[this.selectedCamera];
        if (!settings) {
            console.error('No settings found for camera:', this.selectedCamera);
            this.controls = [];
            this.originalControls = [];
            return;
        }

        const cameraControlsData = [
            { name: 'brightness', type: 'int', min: 0, max: 255, step: 1, default: 128, value: settings.brightness },
            { name: 'contrast', type: 'int', min: 0, max: 255, step: 1, default: 128, value: settings.contrast },
            { name: 'saturation', type: 'int', min: 0, max: 255, step: 1, default: 128, value: settings.saturation },
            { name: 'white_balance_automatic', type: 'bool', default: true, value: settings.white_balance_automatic },
            { name: 'gain', type: 'int', min: 0, max: 255, step: 1, default: 0, value: settings.gain },
            { name: 'power_line_frequency', type: 'menu', min: 0, max: 2, default: 2, value: settings.power_line_frequency, options: [
                { value: 0, label: 'Disabled' },
                { value: 1, label: '50 Hz' },
                { value: 2, label: '60 Hz' },
            ]},
            { name: 'white_balance_temperature', type: 'int', min: 2000, max: 7500, step: 10, default: 4000, value: settings.white_balance_temperature, flags: 'inactive' },
            { name: 'sharpness', type: 'int', min: 0, max: 255, step: 1, default: 128, value: settings.sharpness },
            { name: 'backlight_compensation', type: 'int', min: 0, max: 1, step: 1, default: 1, value: settings.backlight_compensation },
            { name: 'auto_exposure', type: 'menu', min: 0, max: 3, default: 3, value: settings.auto_exposure, options: [
                { value: 0, label: 'Manual Mode' },
                { value: 1, label: 'Auto Mode' },
                { value: 2, label: 'Shutter Priority Mode' },
                { value: 3, label: 'Aperture Priority Mode' },
            ]},
            { name: 'exposure_time_absolute', type: 'int', min: 3, max: 2047, step: 1, default: 250, value: settings.exposure_time_absolute, flags: 'inactive' },
            { name: 'exposure_dynamic_framerate', type: 'bool', default: false, value: settings.exposure_dynamic_framerate },
            { name: 'pan_absolute', type: 'int', min: -36000, max: 36000, step: 3600, default: 0, value: settings.pan_absolute },
            { name: 'tilt_absolute', type: 'int', min: -36000, max: 36000, step: 3600, default: 0, value: settings.tilt_absolute },
            { name: 'focus_absolute', type: 'int', min: 0, max: 255, step: 5, default: 0, value: settings.focus_absolute, flags: 'inactive' },
            { name: 'focus_automatic_continuous', type: 'bool', default: true, value: settings.focus_automatic_continuous },
            { name: 'zoom_absolute', type: 'int', min: 100, max: 500, step: 1, default: 100, value: settings.zoom_absolute },
      ];

      const processedControls = cameraControlsData.map(control => {
        if (control.type === 'bool') {
          control.value = !!control.value;
          control.default = !!control.default;
        }
        if (control.type === 'int' || control.type === 'menu') {
          control.value = Number(control.value);
          control.default = Number(control.default);
        }
        if(control.type === 'int') {
           control.min = Number(control.min);
           control.max = Number(control.max);
           control.step = Number(control.step);
        }
        return control;
      });
      
      this.$nextTick(() => {
        this.controls = JSON.parse(JSON.stringify(processedControls));
        this.originalControls = JSON.parse(JSON.stringify(processedControls));
        this.isDirty = false;
      });
    },
    async saveSettings() {
        const cameraToSave = this.selectedCamera;
        console.log('Saving settings...');
        const settingsToSave = this.controls.reduce((acc, control) => {
            if (control.type === 'int' || control.type === 'menu') {
              acc[control.name] = Number(control.value);
            } else {
              acc[control.name] = control.value;
            }
            return acc;
        }, {});
        console.log('Settings to save:', settingsToSave);

        try {
            await axios.post('/api/camera/settings', {
                camera: cameraToSave,
                settings: settingsToSave,
            });
            // Swal.fire('Saved!', 'Your settings have been saved.', 'success');
            await this.fetchAllSettings(); // Refresh settings
            this.isDirty = false;
            this.isEditing = false;
        } catch (error) {
            console.error('Error saving settings:', error);
            // Swal.fire('Error!', 'Failed to save settings.', 'error');
        }
    },
    resetToDefaults() {
      console.log('Resetting controls to default values.');
      this.controls = JSON.parse(JSON.stringify(this.originalControls));
      this.isDirty = false;
      this.isEditing = false;
    },
    handleCameraChange() {
      console.log('Camera changed to:', this.selectedCamera);
      this.previousSelectedCamera = this.selectedCamera;
      this.loadCameraSettings();
      this.isEditing = false;
    },
  },
  mounted() {
    this.fetchCameraList();
    this.initializeCamera();
  },
  beforeUnmount() {
    this.stopCameraStream();
  },
};
</script>

<style scoped>
.camera-feed {
  width: 100%;
  height: auto;
  background-color: #000;
  border-radius: var(--cui-card-inner-border-radius);
}
.settings-body {
  max-height: 500px; /* Adjust as needed */
  overflow-y: auto;
}
.text-capitalize {
  text-transform: capitalize;
}
</style>
