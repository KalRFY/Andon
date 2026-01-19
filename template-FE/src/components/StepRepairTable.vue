<template>
  <CCard>
    <CCardBody>
      <CRow>
        <CCol>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <label class="form-label fw-bold mb-0">{{ title }}</label>
            <CButton
              v-if="items.length < maxItems"
              color="success"
              size="sm"
              @click="addItem"
              :disabled="isAdding"
            >
              <CIcon icon="cil-plus" class="me-1" />
              Add {{ title }}
            </CButton>
          </div>

          <CTable bordered hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style="width: 50px">No</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell style="width: 120px">Actual Time (Min)</CTableHeaderCell>
                <CTableHeaderCell style="width: 120px">Ideal Time (Min)</CTableHeaderCell>
                <CTableHeaderCell style="width: 200px">Q6 Category</CTableHeaderCell>
                <CTableHeaderCell style="width: 120px">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow
                v-for="(item, index) in items"
                :key="item.id"
                :class="{ 'table-active': editingItems[item.id] }"
              >
                <CTableDataCell>
                  <span class="fw-bold">{{ index + 1 }}</span>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    type="text"
                    v-model="item.stepDesc"
                    :placeholder="`Enter step ${index + 1} description`"
                    :disabled="!editingItems[item.id]"
                    :invalid="!!validationErrors[item.id]?.stepDesc"
                    aria-label="Step description"
                    aria-describedby="step-desc-help"
                  />
                  <CFormFeedback
                    v-if="validationErrors[item.id]?.stepDesc"
                    invalid
                    id="step-desc-help"
                  >
                    {{ validationErrors[item.id].stepDesc }}
                  </CFormFeedback>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    type="number"
                    v-model.number="item.actualTime"
                    placeholder="0"
                    :disabled="!editingItems[item.id]"
                    :invalid="!!validationErrors[item.id]?.actualTime"
                    min="0"
                    step="0.1"
                    aria-label="Actual time in minutes"
                    aria-describedby="actual-time-help"
                  />
                  <CFormFeedback
                    v-if="validationErrors[item.id]?.actualTime"
                    invalid
                    id="actual-time-help"
                  >
                    {{ validationErrors[item.id].actualTime }}
                  </CFormFeedback>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    type="number"
                    v-model.number="item.idealTime"
                    placeholder="0"
                    :disabled="!editingItems[item.id]"
                    :invalid="!!validationErrors[item.id]?.idealTime"
                    min="0"
                    step="0.1"
                    aria-label="Ideal time in minutes"
                    aria-describedby="ideal-time-help"
                  />
                  <CFormFeedback
                    v-if="validationErrors[item.id]?.idealTime"
                    invalid
                    id="ideal-time-help"
                  >
                    {{ validationErrors[item.id].idealTime }}
                  </CFormFeedback>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormSelect
                    v-model="item.quick6"
                    :disabled="!editingItems[item.id]"
                    :invalid="!!validationErrors[item.id]?.quick6"
                    aria-label="Q6 Category selection"
                    aria-describedby="q6-category-help"
                  >
                    <option value="">Choose Q6 Category...</option>
                    <option value="Q1">
                      Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))
                    </option>
                    <option value="Q2">
                      Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)
                    </option>
                    <option value="Q3">
                      Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)
                    </option>
                    <option value="Q4">
                      Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)
                    </option>
                    <option value="Q5">
                      Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))
                    </option>
                    <option value="Q6">
                      Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)
                    </option>
                  </CFormSelect>
                  <CFormFeedback
                    v-if="validationErrors[item.id]?.quick6"
                    invalid
                    id="q6-category-help"
                  >
                    {{ validationErrors[item.id].quick6 }}
                  </CFormFeedback>
                </CTableDataCell>
                <CTableDataCell>
                  <div class="d-flex gap-1">
                    <CButton
                      color="primary"
                      size="sm"
                      @click="toggleEditMode(item.id)"
                      :disabled="isProcessing"
                      :aria-label="editingItems[item.id] ? 'Save changes' : 'Edit item'"
                    >
                      <CIcon
                        :icon="editingItems[item.id] ? 'cil-paper-plane' : 'cil-pencil'"
                      />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      @click="deleteItem(index)"
                      :disabled="isProcessing"
                      aria-label="Delete item"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>

              <!-- Empty state -->
              <CTableRow v-if="items.length === 0">
                <CTableDataCell colspan="6" class="text-center text-muted py-4">
                  <CIcon icon="cil-info" class="me-2" />
                  No items added yet. Click "Add {{ title }}" to get started.
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>

          <!-- Summary information -->
          <div v-if="items.length > 0" class="mt-3 p-3 bg-light rounded">
            <CRow>
              <CCol md="3">
                <small class="text-muted">Total Items</small>
                <div class="fw-bold">{{ items.length }}</div>
              </CCol>
              <CCol md="3">
                <small class="text-muted">Total Actual Time</small>
                <div class="fw-bold">{{ totalActualTime.toFixed(1) }} min</div>
              </CCol>
              <CCol md="3">
                <small class="text-muted">Total Ideal Time</small>
                <div class="fw-bold">{{ totalIdealTime.toFixed(1) }} min</div>
              </CCol>
              <CCol md="3">
                <small class="text-muted">Efficiency</small>
                <div class="fw-bold" :class="efficiencyClass">
                  {{ efficiency.toFixed(1) }}%
                </div>
              </CCol>
            </CRow>
          </div>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
import { ref, computed, watch } from 'vue'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CFormSelect,
  CFormFeedback,
  CButton,
  CIcon
} from '@coreui/vue'

export default {
  name: 'StepRepairTable',
  components: {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CFormInput,
    CFormSelect,
    CFormFeedback,
    CButton,
    CIcon
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Step Repair'
    },
    maxItems: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'validation-change'],

  setup(props, { emit }) {
    console.log('StepRepairTable setup - initial modelValue:', props.modelValue)
    console.log('StepRepairTable setup - props:', JSON.stringify(props, null, 2))
    const items = ref([...props.modelValue])
    const editingItems = ref({})
    const validationErrors = ref({})
    const isProcessing = ref(false)
    const isAdding = ref(false)

    // Computed properties
    const totalActualTime = computed(() => {
      return items.value.reduce((sum, item) => sum + (Number(item.actualTime) || 0), 0)
    })

    const totalIdealTime = computed(() => {
      return items.value.reduce((sum, item) => sum + (Number(item.idealTime) || 0), 0)
    })

    const efficiency = computed(() => {
      if (totalActualTime.value === 0) return 0
      return (totalIdealTime.value / totalActualTime.value) * 100
    })

    const efficiencyClass = computed(() => {
      if (efficiency.value >= 100) return 'text-success'
      if (efficiency.value >= 80) return 'text-warning'
      return 'text-danger'
    })

    // Validation function
    const validateItem = (item) => {
      const errors = {}

      if (!item.stepDesc || item.stepDesc.trim().length === 0) {
        errors.stepDesc = 'Description is required'
      }

      if (item.actualTime !== undefined && (isNaN(item.actualTime) || item.actualTime < 0)) {
        errors.actualTime = 'Actual time must be a positive number'
      }

      if (item.idealTime !== undefined && (isNaN(item.idealTime) || item.idealTime < 0)) {
        errors.idealTime = 'Ideal time must be a positive number'
      }

      // Q6 Category is now optional - removed validation requirement

      return errors
    }

    // Methods
    const addItem = async () => {
      if (isAdding.value || items.value.length >= props.maxItems) return

      isAdding.value = true
      try {
        const newId = items.value.length > 0
          ? Math.max(...items.value.map(item => item.id)) + 1
          : 1

        const newItem = {
          id: newId,
          stepDesc: '',
          actualTime: 0,
          idealTime: 0,
          quick6: '',
          result: null
        }

        items.value.push(newItem)
        editingItems.value[newId] = true
        updateModelValue()
      } finally {
        isAdding.value = false
      }
    }

    const deleteItem = (index) => {
      if (isProcessing.value) return

      const item = items.value[index]
      if (item) {
        items.value.splice(index, 1)
        delete editingItems.value[item.id]
        delete validationErrors.value[item.id]
        updateModelValue()
      }
    }

    const toggleEditMode = (itemId) => {
      if (isProcessing.value) return

      const isEditing = editingItems.value[itemId]

      if (isEditing) {
        // Save mode - validate before saving
        const item = items.value.find(item => item.id === itemId)
        if (item) {
          const errors = validateItem(item)
          validationErrors.value[itemId] = errors

          if (Object.keys(errors).length === 0) {
            editingItems.value[itemId] = false
            updateModelValue()
          }
        }
      } else {
        // Edit mode
        editingItems.value[itemId] = true
        // Clear any existing validation errors when entering edit mode
        delete validationErrors.value[itemId]
      }
    }

    const updateModelValue = () => {
      // Filter out empty items before sending to backend, but keep items in editing mode
      const nonEmptyItems = items.value.filter(item => {
        const isEditing = editingItems.value[item.id]
        // Consider an item non-empty if it has meaningful data or is in editing mode
        const hasDescription = item.stepDesc && item.stepDesc.trim().length > 0
        const hasActualTime = item.actualTime > 0
        const hasIdealTime = item.idealTime > 0
        const hasQ6Category = item.quick6 && item.quick6.trim().length > 0

        // Keep item if it's in editing mode or has any meaningful data
        return isEditing || hasDescription || hasActualTime || hasIdealTime || hasQ6Category
      })

      emit('update:modelValue', [...nonEmptyItems])
      emit('validation-change', {
        isValid: Object.keys(validationErrors.value).length === 0,
        errors: validationErrors.value
      })
    }

    // Watch for external changes
    watch(() => props.modelValue, (newValue) => {
      console.log('StepRepairTable - modelValue changed:', newValue)
      console.log('StepRepairTable - modelValue type:', typeof newValue)
      console.log('StepRepairTable - modelValue isArray:', Array.isArray(newValue))
      items.value = [...newValue]
      console.log('StepRepairTable - items updated:', items.value)
    }, { deep: true })

    // Initialize editing states
    watch(items, (newItems) => {
      const editingState = { ...editingItems.value } // Preserve existing edit states

      newItems.forEach(item => {
        // Only auto-enable edit mode for items that don't have an explicit edit state
        if (editingState[item.id] === undefined) {
          // Auto-enable edit mode for empty items (newly added items)
          editingState[item.id] = !item.stepDesc || item.stepDesc.trim() === ''
        }
      })

      editingItems.value = editingState
    }, { immediate: true, deep: true })

    return {
      items,
      editingItems,
      validationErrors,
      isProcessing,
      isAdding,
      totalActualTime,
      totalIdealTime,
      efficiency,
      efficiencyClass,
      addItem,
      deleteItem,
      toggleEditMode,
      validateItem
    }
  }
}
</script>

<style scoped>
.table-active {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.gap-1 > * + * {
  margin-left: 0.25rem;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.text-success {
  color: #198754 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.fw-bold {
  font-weight: 600 !important;
}

.small {
  font-size: 0.875em;
}

.text-muted {
  color: #6c757d;
}

.rounded {
  border-radius: 0.375rem !important;
}

.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.p-3 {
  padding: 1rem !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.me-1 {
  margin-right: 0.25rem !important;
}

.me-2 {
  margin-right: 0.5rem !important;
}

.d-flex {
  display: flex !important;
}

.justify-content-between {
  justify-content: space-between !important;
}

.justify-content-center {
  justify-content: center !important;
}

.align-items-center {
  align-items: center !important;
}

.text-center {
  text-align: center !important;
}

.w-100 {
  width: 100% !important;
}

/* Mobile responsive adjustments for table columns */
@media (max-width: 768px) {
  .table th:nth-child(2),
  .table td:nth-child(2) {
    /* Description column */
    min-width: 300px;
  }

  .table th:nth-child(3),
  .table td:nth-child(3) {
    /* Actual Time column */
    min-width: 140px;
  }

  .table th:nth-child(4),
  .table td:nth-child(4) {
    /* Ideal Time column */
    min-width: 140px;
  }

  .table th:nth-child(5),
  .table td:nth-child(5) {
    /* Q6 Category column */
    min-width: 250px;
  }

  .table th:nth-child(6),
  .table td:nth-child(6) {
    /* Actions column */
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .table th:nth-child(2),
  .table td:nth-child(2) {
    /* Description column - even wider on very small screens */
    min-width: 220px;
  }

  .table th:nth-child(5),
  .table td:nth-child(5) {
    /* Q6 Category column - even wider on very small screens */
    min-width: 280px;
  }
}
</style>
