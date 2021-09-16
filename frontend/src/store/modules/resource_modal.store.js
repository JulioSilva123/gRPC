const getDefaultState = () => {
  return {
    selectedResource: null,
  }
}

const state = {
  selectedResource: null,
}

const getters = {

}

const actions = {
  init ({ commit }) {
    commit('resetState')
  },
  doResetState ({ commit }) {
    commit('resetState')
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_SELECTED_RESOURCE (state, payload) {
    state.selectedResource = payload
  },
}
export { state, getters, mutations, actions }