import * as types from './mutation-types'

const mutations = {
  [types.SET_TERMINAL] (state, terminal) {
    state.terminal = terminal
  },
  [types.SET_ACTIVECOMPONENT] (state, activeComponent) {
    state.activeComponent = activeComponent
  },
  [types.SET_COMPONENTSDATA] (state, componentsData) {
    state.componentsData = componentsData
  },
  [types.SET_TYPEID] (state, typeId) {
    state.typeId = typeId
  }
}

export default mutations
