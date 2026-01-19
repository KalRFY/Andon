<template>
  <CRow class="mb-4">
    <CCol>
      <CCard class="control-card">
        <CCardBody>
          <CRow>
            <CCol class="d-flex justify-content-center">
              <div class="chart-toggle-container">
                <CButtonGroup role="group" aria-label="Chart Type">
                  <CButton
                    :color="
                      chartViewMode === 'mtbf' ? 'primary' : 'outline-primary'
                    "
                    @click="$emit('update:chartViewMode', 'mtbf')"
                  >
                    <Clock size="16" class="me-1" /> MTBF
                  </CButton>
                  <CButton
                    :color="
                      chartViewMode === 'mttr' ? 'primary' : 'outline-primary'
                    "
                    @click="$emit('update:chartViewMode', 'mttr')"
                  >
                    <Tool size="16" class="me-1" /> MTTR
                  </CButton>
                  <CButton
                    :color="
                      chartViewMode === 'comparison'
                        ? 'primary'
                        : 'outline-primary'
                    "
                    @click="$emit('update:chartViewMode', 'comparison')"
                  >
                    <BarChart2 size="16" class="me-1" /> Comparison
                  </CButton>
                </CButtonGroup>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButtonGroup,
  CButton,
} from '@coreui/vue'
import { Clock, Tool, BarChart2 } from 'lucide-vue-next'

export default {
  name: 'ViewControls',
  components: {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CButtonGroup,
    CButton,
    Clock,
    Tool,
    BarChart2,
  },
  props: {
    chartViewMode: {
      type: String,
      required: true,
    },
  },
  emits: ['update:chartViewMode'],
}
</script>

<style scoped>
.control-card {
  border: 1px solid #ebedef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.chart-toggle-container {
  margin: 10px 0;
}
</style>
