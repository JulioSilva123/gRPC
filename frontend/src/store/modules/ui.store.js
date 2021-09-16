import i18n from '../../plugins/i18n.plugin'
import version from 'raw-loader!@/version.txt'
export const state = {
  layout: 'blank-layout',
  version: version.split('\n')[0],
  versionDate: version.split('\n')[1],
  env: process.env.NODE_ENV,
  recaptchaSiteKey: process.env.VUE_APP_RECATCHA_SITE_KEY,
  intervals: {},
  loading: false,
  prefHsmViewMode: 1,
  prefObjViewMode: 1,
  prefEngViewMode: 1,
  themeOption: 0,
  snackbarMessage: null,
  snackbarPosition: null,
  snackbarColor: null,
  notifTitle: null,
  notifMessage: null,
  notifType: null
}

export const getters = {
  copyrightMessage: () => {
    const now = new Date()
    return `Copyright © ${now.getFullYear()}, DINAMO NETWORKS.`
  },
  GET_INTERVAL: state => ({ name }) => {
    return state.intervals[name]
  },
  GET_NEEDS_RECATCHA_LOGIN: (state, getters, rootState) => {
    const faliedLoginAttempts = rootState.auth.faliedLoginAttempts
    return faliedLoginAttempts >= 3
  },
  GET_NEEDS_RECATCHA: (state, getters) => {
    return !getters.GET_API_BASE_IS_LOCAL
  },
  GET_API_BASE_IS_STAGING: () => {
    return process.env.VUE_APP_API_BASE.indexOf('dev') > 0
  },
  GET_API_BASE_IS_LOCAL: () => {
    return process.env.VUE_APP_API_BASE.indexOf('local') > 0
  },
  GET_HEADER_ALERT: (state, getters, rootState) => {
    // TODO: add cases
    if (rootState.auth.foo) {
      return {
        message: i18n.t('foo'),
        action: {
          title: i18n.t('bar'),
          link: { name: 'change-password' }
        }
      }
    } else {
      return null
    }
  },
  GET_IS_DARK_MODE_ACTIVE: (state) => {
    let isDarkActive
    switch (state.themeOption) {
      case 0:
        isDarkActive = false
        break
      case 1:
        isDarkActive = true
        break
      case 2:
        isDarkActive = window.matchMedia('(prefers-color-scheme: dark)').matches
        break
      default:
        break;
    }
    return isDarkActive
  },
  GET_THEME_OPTIONS: () => {
    return [
      {
        title: 'light',
        value: 0
      },
      {
        title: 'dark',
        value: 1
      },
      {
        title: 'system',
        value: 2
      }
    ]
  }
}

export const mutations = {
  SET_LAYOUT (state, payload = 'default') {
    state.layout = `${payload}-layout`
  },
  SET_INTERVAL (state, { name, interval }) {
    state.intervals[name] = interval
  },
  CLEAR_INTERVAL (state, { name }) {
    const interval = state.intervals[name]
    clearInterval(interval)
    delete state.intervals[name]
  },
  CLEAR_ALL_INTERVALS (state) {
    for (let key in state.intervals) {
      clearInterval(state.intervals[key])
    }
    state.intervals = {}
  },
  SET_LOADING (state, payload = false) {
    state.loading = payload
  },
  // USER PREFS
  SET_OBJ_VIEW_MODE (state, payload) {
    state.prefObjViewMode = payload
  },
  SET_HSM_VIEW_MODE (state, payload) {
    state.prefHsmViewMode = payload
  },
  SET_ENG_VIEW_MODE (state, payload) {
    state.prefEngViewMode = payload
  },
  SET_THEME (state, payload) {
    state.themeOption = payload
    localStorage.setItem('theme', payload)
  },
  SET_SNACKBAR_MESSAGE (state, payload = null) {
    state.snackbarMessage = payload
  },
  SET_SNACKBAR_POSITION (state, payload = null) {
    state.snackbarPosition = payload
  },
  SET_SNACKBAR_COLOR (state, payload = null) {
    state.snackbarColor = payload
  }
}

export const actions = {
  showSnackbar ({ commit }, { message, position, color = null }) {
    commit('SET_SNACKBAR_POSITION', position)
    commit('SET_SNACKBAR_COLOR', color)
    commit('SET_SNACKBAR_MESSAGE', message)
  },
  setInterval ({ getters, dispatch, commit }, { store, action, time = 60000 }) {
    const exists = getters['GET_INTERVAL']({ action })
    if (!exists) {
      dispatch(`${store}/${action}`, {}, { root: true })
      commit('SET_INTERVAL', {
        action,
        interval: setInterval(() => {
          dispatch(`${store}/${action}`, {}, { root: true })
        }, time)
      })
    }
  },
  setPopup (context, { exists, url }) {
    if (!exists || (exists && exists.closed)) {
      const popup = window.open(
        url,
        '_blank'
      )
      return popup
    } else {
      exists.focus()
    }
  },
  init ({ commit }) {
    const theme = parseInt(localStorage.getItem('theme'))
    commit('SET_THEME', theme || 0)
  },
}
