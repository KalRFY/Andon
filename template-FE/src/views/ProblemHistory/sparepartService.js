import axios from 'vue3-treeselect'

export const sparepartService = {
  // Fetch spareparts by problem ID
  async getSparepartsByProblemId(problemId) {
    try {
      const response = await axios.get(`/api/smartandon/spareparts/problem/${problemId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching spareparts:', error)
      return []
    }
  },

  // Fetch all spareparts from history
  async getAllSparepartsFromHistory() {
    try {
      const response = await axios.get('/api/smartandon/spareparts/history')
      return response.data
    } catch (error) {
      console.error('Error fetching spareparts history:', error)
      return []
    }
  },

  // Format sparepart for Treeselect
  formatSparepartsForTreeselect(spareparts) {
    if (!Array.isArray(spareparts)) return []
    
    return spareparts.map((sparepart) => ({
      id: sparepart.sparepart_id || sparepart.id,
      label: sparepart.sparepart_nm || sparepart.name || sparepart.label,
      children: null
    }))
  }
}
