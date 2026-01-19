<template>
  <CRow>
    <CCol>
      <h3>CM Follow-up</h3>
      <p>Post-problem countermeasure tracking</p>
    </CCol>
  </CRow>

  <SearchFilters 
    :filterStartDate="filters.start_date" 
    :filterFinishDate="filters.end_date"
    :selectedLine="filters.line" 
    :selectedMachineName="filters.machine" 
    :searchKeyword="filters.keyword"
    :selectedCategory="filters.category" 
    :selectedShift="filters.shift" 
    :lineOptions="lineOptions"
    :machineOptions="machineOptions" 
    :loading="loading"
    @update:filterStartDate="val => filters.start_date = val"
    @update:filterFinishDate="val => filters.end_date = val" 
    @update:selectedLine="val => filters.line = val"
    @update:selectedMachineName="val => filters.machine = val"
    @update:searchKeyword="val => filters.keyword = val"
    @update:selectedCategory="val => filters.category = val" 
    @update:selectedShift="val => filters.shift = val"
    @search="fetchCMFollowup" 
    @reset="resetFilters" 
  />

  <Container>
    <CRow>
      <CCol>
        <LoadingState v-if="loading" :progress="progress" :trigger="triggerKey" />
        <template v-else>
          <CMIndicator :data="filteredData" />
          <ProblemsTable :data="filteredData" :loading="loading" />
        </template>
      </CCol>
    </CRow>
  </Container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import api from '@/apis/CommonAPI'
import { getCMFollowup } from '@/apis/cmFollowup'

import SearchFilters from '@/views/CMFollowup/components/SearchFilters.vue'
import ProblemsTable from '@/views/CMFollowup/components/ProblemsTable.vue'
import CMIndicator from '@/views/CMFollowup/components/CMIndicator.vue'
import LoadingState from '@/views/CMFollowup/components/LoadingState.vue'

const filters = ref({
  line: null,
  machine: null,
  start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  end_date: dayjs().format('YYYY-MM-DD'),
  keyword: '',
  category: '',
  shift: ''
})

const loading = ref(false)
const progress = ref(0)
const triggerKey = ref(0)
const tableData = ref([])
const lineOptions = ref([])
const machineOptions = ref([])

const getLineLabel = id => lineOptions.value.find(l => l.id === id)?.label
const getMachineLabel = id => machineOptions.value.find(m => m.id === id)?.label

const filteredData = computed(() => {
  if (filters.value.category === "Thema") {
    return []
  }

  return tableData.value.filter(item => {
    const lineMatch = filters.value.line ? item.line === getLineLabel(filters.value.line) : true
    const machineMatch = filters.value.machine ? item.machine === getMachineLabel(filters.value.machine) : true

    const keyword = filters.value.keyword?.toLowerCase() || ''
    const searchMatch = !keyword || 
      item.machine.toLowerCase().includes(keyword) ||
      item.problem.toLowerCase().includes(keyword) ||
      item.countermeasure.toLowerCase().includes(keyword) ||
      item.pic.toLowerCase().includes(keyword)

      let categoryMatch = true
      if (filters.value.category === "Taskforce") {
        categoryMatch = item.problem?.toLowerCase().includes("taskforce")
      }

    return lineMatch && machineMatch && searchMatch && categoryMatch
  })
})

async function loadInitialData() {
  loading.value = true
  try {
    const [machineResponse, lineResponse] = await Promise.all([
      api.get('/smartandon/machine'),
      api.get('/smartandon/line')
    ])

    if (machineResponse.status !== 200 || lineResponse.status !== 200) {
      throw new Error('Failed to load line/machine data')
    }

    machineOptions.value = (machineResponse.data || []).map(m => ({
      id: m.fid,
      label: m.fmc_name
    }))
    lineOptions.value = (lineResponse.data || []).map(l => ({
      id: l.fid,
      label: l.fline
    }))
  } catch (error) {
    console.error('Failed to load line/machine data:', error)
  } finally {
    loading.value = false
  }
}

async function fetchCMFollowup() {
  loading.value = true
  triggerKey.value++
  progress.value = 0
  let internalProgress = 0
  const step = () => { 
    if (internalProgress < 100) { 
      internalProgress += 1; 
      progress.value = internalProgress; 
      setTimeout(step, 15) 
    } 
  }
  step()

  try {
    const apiFilters = { ...filters.value }
    const rawData = await getCMFollowup(apiFilters)

    if (filters.value.category === "Thema") {
      console.log("Filtering for Thema category")
      rawData = []
    }

    tableData.value = rawData
  } catch (err) {
    console.error('Error fetching CMFollowup data:', err)
    tableData.value = []
  } finally {
    await new Promise(resolve => {
      const check = () => {
        if (progress.value >= 100) resolve()
        else setTimeout(check, 30)
      }
      check()
    })
    loading.value = false
  }
}

function resetFilters() {
  filters.value = {
    line: null,
    machine: null,
    start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    category: '',
    shift: '',
  }
  fetchCMFollowup()
}

onMounted(() => {
  loadInitialData().then(fetchCMFollowup)
})
</script>