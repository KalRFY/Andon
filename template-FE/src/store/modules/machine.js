import axios from 'axios'

const state = {
  machines: [],
}

const getters = {
  getMachinesOpts: (state) =>
    state.machines.map((m) => ({
      value: m.machine_id || m.id,
      text: m.machine_nm || m.name,
    })),
}

const actions = {
  async storeGetMachines({ commit }, line_id) {
    try {
      const res = await axios.get('https://mt-system.id/v2/machines', {
        params: { line_id },
      })
      commit('SET_MACHINES', res.data?.data || [])
    } catch (err) {
      console.error('storeGetMachines error:', err)
    }
  },
}

const mutations = {
  SET_MACHINES(state, payload) {
    state.machines = payload
  },
}

export default { state, getters, actions, mutations }
