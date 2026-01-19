import axios from 'axios'

const state = {
  lines: [],
}

const getters = {
  getLinesOpts: (state) =>
    state.lines.map((line) => ({
      value: line.line_id || line.id,
      text: line.line_nm || line.name,
    })),
}

const actions = {
  async storeGetLines({ commit }) {
    try {
      const res = await axios.get('https://mt-system.id/v2/lines')
      commit('SET_LINES', res.data?.data || [])
    } catch (err) {
      console.error('storeGetLines error:', err)
    }
  },
}

const mutations = {
  SET_LINES(state, payload) {
    state.lines = payload
  },
}

export default { state, getters, actions, mutations }
