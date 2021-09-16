const TYPES = [
  {
    state: 'mainMenu',
    mutation: 'SET_MAIN_MENU',
    defaultVal: false,
    component: 'AppMainMenuDrawer'
  },
  // {
  //   state: 'notifications',
  //   mutation: 'SET_NOTIFICATIONS',
  //   defaultVal: false,
  //   component: 'AppNotificationsDrawer'
  // },
  // {
  //   state: 'eventsMonitor',
  //   mutation: 'SET_EVENTS_MONITOR',
  //   defaultVal: false,
  //   component: 'AppEventsMonitorDrawer'
  // },
  // {
  //   state: 'sessionsMonitor',
  //   mutation: 'SET_SESSIONS_MONITOR',
  //   defaultVal: false,
  //   component: 'AppSessionsMonitorDrawer'
  // }
]

const state = {
  mainIsInMiniVariant: false
}

const getters = {
  getPathNeedsDrawer: () => (path) => {
    const pathsWithNoMainDrawer = ['change-password']
    return !pathsWithNoMainDrawer.includes(path)
  },
  getComponent: () => name => {
    const item = TYPES.find(type => type.state === name)
  return item.component
  },
  getMutation: () => name => {
    const item = TYPES.find(type => type.state === name)
    return item.mutation
  },
  getAnyDrawerIsOpen: (state) => {
    for (let i in state) {
      if (state[i] === true) {
        return true
      }
    }
  }
}

const mutations = {
  toggleMiniVariantOnMain (state) {
    state.mainIsInMiniVariant = !state.mainIsInMiniVariant
  }
}

const actions = {
  toggle ({ state, commit }, { name }) {
    TYPES.forEach(type => {
      if (type.state === name) {
        commit(`${type.mutation}`, !state[type.state])
      }
      else commit(`${type.mutation}`, false)
    })
  }
}

TYPES.forEach(type => {
  if (type.state) state[type.state] = type.defaultVal

  if (type.mutation) {
    mutations[type.mutation] = function (state, payload = type.defaultVal) {
      state[type.state] = payload
    }
  }
})

export { state, getters, mutations, actions }
