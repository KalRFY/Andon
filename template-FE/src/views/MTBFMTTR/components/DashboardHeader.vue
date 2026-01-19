<template>
  <CCard class="mb-4 header-card">
    <CCardHeader class="text-white">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h3 class="m-0">MTBF/MTTR DASHBOARD</h3>
        </div>
        <div class="d-flex align-items-center">
          <span class="me-3">{{ currentDate }}</span>
          <div class="live-indicator d-flex align-items-center">
            <span class="live-dot"></span>
          </div>
          <div class="ms-3 user-info">
            <span><User size="16" class="me-1" /> {{ username }}</span>
          </div>
        </div>
      </div>
    </CCardHeader>
  </CCard>
</template>

<script>
import { CCard, CCardHeader } from '@coreui/vue'
import { User } from 'lucide-vue-next'

export default {
  name: 'DashboardHeader',
  components: {
    CCard,
    CCardHeader,
    User,
  },
  props: {
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
  },
}
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
