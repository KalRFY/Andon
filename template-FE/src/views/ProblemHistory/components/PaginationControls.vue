<!-- PaginationControls.vue -->
<template>
  <CPagination aria-label="Page navigation example" class="mt-3">
    <CPaginationItem
      href="#"
      :disabled="currentPage === 1"
      @click.prevent="handlePageChange(1)"
      style="font-size: 0.8em;"
    >
      First
    </CPaginationItem>
    <CPaginationItem
      v-if="!isSmallScreen"
      href="#"
      :disabled="currentPage === 1"
      @click.prevent="handlePageChange(currentPage - 1)"
    >
      Previous
    </CPaginationItem>
    <CPaginationItem
      v-for="page in visiblePages"
      :key="page"
      href="#"
      :active="page === currentPage"
      @click.prevent="handlePageChange(page)"
    >
      {{ page }}
    </CPaginationItem>
    <CPaginationItem
      v-if="!isSmallScreen"
      href="#"
      :disabled="currentPage === totalPages"
      @click.prevent="handlePageChange(currentPage + 1)"
    >
      Next
    </CPaginationItem>
    <CPaginationItem
      href="#"
      :disabled="currentPage === totalPages"
      @click.prevent="handlePageChange(totalPages)"
      style="font-size: 0.8em;"
    >
      Last
    </CPaginationItem>
  </CPagination>
</template>

<script>
import { CPagination, CPaginationItem } from '@coreui/vue'

export default {
  name: 'PaginationControls',
  components: {
    CPagination,
    CPaginationItem,
  },

  props: {
    currentPage: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPages: {
      type: Number,
      required: true,
      default: 0,
    },
    visiblePages: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['goToPage'],

  data() {
    return {
      windowWidth: window.innerWidth,
    }
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowWidth)
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth)
  },

  computed: {
    isSmallScreen() {
      return this.windowWidth < 360
    },
  },

  methods: {
    handlePageChange(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.$emit('goToPage', page)
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth
    },
  },
}
</script>

<style scoped>
.pagination-info {
  font-size: 0.875rem;
}

.pagination-info span {
  font-weight: 500;
}
</style>
