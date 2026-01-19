<template>
  <div class="d-flex justify-content-between align-items-center mt-3">
    <div class="pagination-info">
      <span class="text-muted">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
    </div>

    <CPagination v-if="totalPages > 1" :pages="totalPages" :active-page="currentPage"
      @update:active-page="handlePageChange" align="center" size="sm">
      <template #first>
        <CPaginationItem :disabled="currentPage === 1" @click="handlePageChange(1)">
          First
        </CPaginationItem>
      </template>

      <template #prev>
        <CPaginationItem :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">
          Previous
        </CPaginationItem>
      </template>

      <template #next>
        <CPaginationItem :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)">
          Next
        </CPaginationItem>
      </template>

      <template #last>
        <CPaginationItem :disabled="currentPage === totalPages" @click="handlePageChange(totalPages)">
          Last
        </CPaginationItem>
      </template>
    </CPagination>

    <div v-if="totalPages <= 1" class="text-muted">
      <small>No pagination needed</small>
    </div>
  </div>
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

  methods: {
    handlePageChange(page) {
      if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
        this.$emit('goToPage', page)
      }
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