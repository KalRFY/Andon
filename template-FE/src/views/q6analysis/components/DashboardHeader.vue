<template>
    <CCard class="mb-4 header-card">
        <CCardHeader class="text-white">
            <CRow class="align-items-center d-flex">
                <CCol class="">
                <h3 class="m-0">Q6 ANALYSIS DASHBOARD</h3>
                </CCol>
                <CCol class="text-end">
                <CContainer fluid class="d-flex justify-content-center align-items-center gap-5 p-0">
                    <span class="w-50">{{ currentDate }}</span>
                    <CContainer fluid class="live-indicator align-items-center p-0">
                    <span class="live-dot"></span>
                    <span class="ms-1">{{ currentTime }}</span>
                    </CContainer>
                </CContainer>
                </CCol>
            </CRow>
        </CCardHeader>
    </CCard>
</template>

<script setup>
import { CCard, CCardHeader, CRow, CCol, CContainer } from '@coreui/vue'
import { User } from 'lucide-vue-next'

defineProps({
  username: {
    type: String,
    required: true,
  },
  currentDate: {
    type: String,
    required: true,
  },
  currentTime: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.header-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

.header-card .card-header {
  background-color: #3c4b64;
  border-bottom: none;
}

.live-indicator {
  display: flex;
  align-items: center;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: #20c997;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.user-info {
  font-size: 0.9rem;
  color: #e9ecef;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(32, 201, 151, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0);
  }
}
</style>