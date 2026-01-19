const store = {
    namespaced: true,
    state: {
      open: [],
    },
    getters: {
      active: (state) => (state.open.length > 0 ? state.open[0] : null),
      allOpen: (state) => state.open
    },
    mutations: {
      OPEN: (state, name) => state.open.unshift(name),
      CLOSE: (state, name) => (state.open = state.open.filter((e) => e !== name)),
    },
    actions: {
      open: ({ commit }, name) => commit('OPEN', name),
      close: ({ commit }, name) => commit('CLOSE', name),
    }
  };
  
  export default store;
  