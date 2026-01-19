<template>
  <div>
    <CFormInput
      :value="displayValue"
      :placeholder="placeholder"
      readonly
      @click="openModal"
      class="modal-select-input"
      :disabled="disabled"
    />
    <CButton
      color="secondary"
      variant="outline"
      size="sm"
      @click="openModal"
      :disabled="disabled"
      class="ms-2"
    >
      <CIcon icon="cilMagnifyingGlass" />
    </CButton>

    <CModal
      :visible="showModal"
      @close="closeModal"
      size="lg"
      aria-labelledby="modalSelectLabel"
    >
      <CModalHeader>
        <CModalTitle id="modalSelectLabel">{{ title || 'Select Items' }}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CRow class="mb-3">
          <CCol>
            <CFormInput
              v-model="searchQuery"
              placeholder="Search items..."
              @input="onSearch"
            />
          </CCol>
        </CRow>

        <div v-if="loading" class="text-center py-4">
          <CSpinner color="primary" />
          <div class="mt-2">Loading...</div>
        </div>

        <div v-else-if="filteredOptions.length === 0" class="text-center py-4">
          <div class="text-muted">No items found</div>
        </div>

        <div v-else class="modal-select-options" style="max-height: 400px; overflow-y: auto;">
          <div
            v-for="option in filteredOptions"
            :key="option.id"
            class="modal-select-option"
            :class="{ 'selected': isSelected(option) }"
            @click="toggleSelection(option)"
          >
            <div class="d-flex align-items-center">
              <CFormCheck
                :checked="isSelected(option)"
                :disabled="true"
                class="me-3"
              />
              <div class="flex-grow-1">
                <div class="fw-bold">{{ option.label }}</div>
                <div v-if="option.description" class="text-muted small">
                  {{ option.description }}
                </div>
                <div v-if="option.material_number" class="text-muted small">
                  Material: {{ option.material_number }}
                </div>
                <div v-if="option.stock !== undefined" class="text-muted small">
                  Stock: {{ option.stock }} {{ option.uom }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CModalBody>

      <CModalFooter>
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="text-muted">
            {{ selectedItems.length }} item{{ selectedItems.length !== 1 ? 's' : '' }} selected
          </div>
          <div>
            <CButton color="secondary" @click="closeModal" class="me-2">
              Cancel
            </CButton>
            <CButton color="primary" @click="confirmSelection">
              Select
            </CButton>
          </div>
        </div>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ModalSelect',
  props: {
    modelValue: {
      type: [String, Number, Object, Array],
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Select items...',
    },
    title: {
      type: String,
      default: 'Select Items',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    valueKey: {
      type: String,
      default: 'id',
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    descriptionKey: {
      type: String,
      default: 'description',
    },
  },
  emits: ['update:modelValue', 'change', 'search'],
  setup(props, { emit }) {
    const showModal = ref(false)
    const searchQuery = ref('')
    const selectedItems = ref([])
    const loading = ref(false)

    // Initialize selected items based on modelValue
    const initializeSelection = () => {
      if (props.multiple) {
        if (Array.isArray(props.modelValue)) {
          selectedItems.value = props.modelValue.map(item => {
            if (typeof item === 'object') return item
            return props.options.find(opt => opt[props.valueKey] === item)
          }).filter(Boolean)
        } else {
          selectedItems.value = []
        }
      } else {
        if (props.modelValue && typeof props.modelValue === 'object') {
          selectedItems.value = [props.modelValue]
        } else if (props.modelValue) {
          const found = props.options.find(opt => opt[props.valueKey] === props.modelValue)
          selectedItems.value = found ? [found] : []
        } else {
          selectedItems.value = []
        }
      }
    }

    // Computed properties
    const filteredOptions = computed(() => {
      if (!searchQuery.value) return props.options
      const query = searchQuery.value.toLowerCase()
      return props.options.filter(option => {
        const label = (option[props.labelKey] || '').toLowerCase()
        const description = (option[props.descriptionKey] || '').toLowerCase()
        const materialNumber = (option.material_number || '').toLowerCase()
        return label.includes(query) || description.includes(query) || materialNumber.includes(query)
      })
    })

    const displayValue = computed(() => {
      if (selectedItems.value.length === 0) return ''
      if (selectedItems.value.length === 1) {
        return selectedItems.value[0][props.labelKey] || selectedItems.value[0].label
      }
      return `${selectedItems.value.length} items selected`
    })

    // Methods
    const openModal = () => {
      if (props.disabled) return
      initializeSelection()
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      searchQuery.value = ''
    }

    const isSelected = (option) => {
      return selectedItems.value.some(item => item[props.valueKey] === option[props.valueKey])
    }

    const toggleSelection = (option) => {
      if (props.multiple) {
        const index = selectedItems.value.findIndex(item => item[props.valueKey] === option[props.valueKey])
        if (index > -1) {
          selectedItems.value.splice(index, 1)
        } else {
          selectedItems.value.push(option)
        }
      } else {
        selectedItems.value = [option]
      }
    }

    const confirmSelection = () => {
      if (props.multiple) {
        const values = selectedItems.value.map(item => item[props.valueKey])
        emit('update:modelValue', values)
        emit('change', selectedItems.value)
      } else {
        const selected = selectedItems.value[0] || null
        emit('update:modelValue', selected ? selected[props.valueKey] : null)
        emit('change', selected)
      }
      closeModal()
    }

    const onSearch = (event) => {
      searchQuery.value = event.target.value
      emit('search', searchQuery.value)
    }

    // Watch for external changes to modelValue
    watch(() => props.modelValue, () => {
      initializeSelection()
    })

    // Watch for changes to options
    watch(() => props.options, () => {
      initializeSelection()
    })

    return {
      showModal,
      searchQuery,
      selectedItems,
      loading,
      filteredOptions,
      displayValue,
      openModal,
      closeModal,
      isSelected,
      toggleSelection,
      confirmSelection,
      onSearch,
    }
  },
}
</script>

<style scoped>
.modal-select-input {
  cursor: pointer;
}

.modal-select-input:disabled {
  cursor: not-allowed;
  background-color: #e9ecef;
}

.modal-select-options {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.modal-select-option {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.modal-select-option:last-child {
  border-bottom: none;
}

.modal-select-option:hover {
  background-color: #f8f9fa;
}

.modal-select-option.selected {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.status-circle {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-approved {
  background-color: #2eb85c;
}

.status-rejected {
  background-color: #e55353;
}

.status-pending {
  background-color: #ffc107;
}

.status-comment {
  background-color: #f9ca24;
}

.status-delay {
  background-color: #e55353;
}
</style>
