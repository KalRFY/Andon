<template>
  <div>
    <label class="form-label">{{ label }}</label>
    <Treeselect
      v-model="selectedSparepart"
      :options="sparepartOptions"
      :searchable="true"
      :clearable="clearable"
      :multiple="multiple"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onChange"
    />
  </div>
</template>

<script>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default {
  name: 'SparepartSelector',
  components: {
    Treeselect,
  },
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: null,
    },
    label: {
      type: String,
      default: 'Select Sparepart',
    },
    placeholder: {
      type: String,
      default: 'Select sparepart...',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      sparepartOptions: [],
      loading: false,
    }
  },
  computed: {
    selectedSparepart: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  async mounted() {
    await this.fetchSpareparts()
  },
  methods: {
    async fetchSpareparts() {
      this.loading = true
      try {
        const response = await fetch('/api/smartandon/spareparts')
        const data = await response.json()
        
        // Handle both response formats
        const spareparts = data.data || data
        
        this.sparepartOptions = spareparts.map(sparepart => ({
          id: sparepart.sparepart_id,
          label: `${sparepart.sparepart_nm} (${sparepart.material_number})`,
          material_number: sparepart.material_number,
          stock: sparepart.stock,
        }))
      } catch (error) {
        console.error('Error fetching spareparts:', error)
        this.sparepartOptions = []
      } finally {
        this.loading = false
      }
    },
    onChange(value) {
      this.$emit('change', value)
    },
  },
}
</script>

<style scoped>
.form-label {
  font-size: medium;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
</style>
