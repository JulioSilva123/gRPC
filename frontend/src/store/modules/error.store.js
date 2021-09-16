import { error } from '@/plugins/notifications.plugin'
import i18n from '../../plugins/i18n.plugin'
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser'
export const state = {
  list: [],
  isSessionTracked: false
}

const initLogrocket = function () {
  LogRocket.init('dinamo-networks/dinamo-services', {
    shouldCaptureIP: false,
    network: {
      responseSanitizer: response => {
        const sensitiveResUrls = [
          '/account/api_key',
        ]
        const baseUrlStartIndex = response.url.toLowerCase().indexOf(process.env.VUE_APP_API_BASE)
        const baseUrlEndIndex = baseUrlStartIndex + process.env.VUE_APP_API_BASE.length
        const reqPath = response.url.toLowerCase().slice(baseUrlEndIndex)
        if (sensitiveResUrls.includes(reqPath)) {
          response.body = null
        }
        return response
      },
      requestSanitizer: request => {
        const baseUrlStartIndex = request.url.toLowerCase().indexOf(process.env.VUE_APP_API_BASE)
        if (baseUrlStartIndex === -1) {
          // ignore the request not direct to DS API
          return null
        } else {
          const baseUrlLength = process.env.VUE_APP_API_BASE.length
          const baseUrlEndIndex = baseUrlStartIndex + baseUrlLength
          const ignoredReqResPair = [
            '/account/login'
          ]
          const sensitiveReqUrls = [
            '/account/api_key',
            //keys reqs
          ]
          const reqPath = request.url.toLowerCase().slice(baseUrlEndIndex)
          if (ignoredReqResPair.includes(reqPath)) {
            return null
          } else if (sensitiveReqUrls.includes(reqPath)) {
            request.body = null
          }
        }
        
        // otherwise log the request normally
        return request;
      },
    },
  })
}

export const getters = {
  getErrorObj: () => (err) => {
    return { detail: err }
  },
  getErrorDetaili18nKey: () => (detail) => {
   const i18nKey = detail.trim().toLowerCase().replace(/\s+/g, '_').slice(0, 24)
    if (i18n.te(`error.${i18nKey}`)) {
      return `error.${i18nKey}`
    }
    else null
  }
}

export const mutations = {
  SET_ITEM_IN_LIST (state, payload = {}) {
    state.list.unshift(payload)
  },
  CLEAR (state) {
    state.list = []
  },
  SET_IS_SESSION_TRACKED (state, payload = false) {
    state.isSessionTracked = payload
  }
}

export const actions = {
  showErrorNotification ({ rootGetters }, err) {
    const { status, detail } = err
    let shownErrorMsg
    const showDetailedError = rootGetters['ui/GET_API_BASE_IS_LOCAL'] || rootGetters['ui/GET_API_BASE_IS_STAGING']
    if (status === 401) return
    // Not anticipated errors
    if (!detail && !status) {
      if (showDetailedError) {
        shownErrorMsg = err
        console.log(err)
      } else shownErrorMsg = i18n.t('error.internal_error')
    }
    else {
      const i18nKey = rootGetters['error/getErrorDetaili18nKey'](detail ? detail : status.toString())
      if (i18nKey) {
        shownErrorMsg = i18n.t(i18nKey)
      } else {
        if (showDetailedError) {
          shownErrorMsg = detail
        } else shownErrorMsg = i18n.t('error.internal_error')
      }
    }
    error({ message: shownErrorMsg })
  },
  // Handle API error
  setError ({ dispatch, rootState }, { err }) {
    try {
      if (err.crossDomain) return { detail: 'server_unreachable' }
      const apiError = err.response.body
      if (apiError.status === 401) {
        if (rootState.auth.isLogged) {
          dispatch('ui/showSnackbar', { message: i18n.t('error.session_timeout'), position: 1, color: 'error' }, { root: true })
          dispatch('auth/doLogout', {}, { root: true }).then(() => {})
        }
      }
      return apiError
    } catch (error) {
      return err
    }
  },
  clearError ({ commit }) {
    commit('CLEAR')
  },
  unidentifyLogRocket ({ commit }) {
    commit('SET_IS_SESSION_TRACKED')
    LogRocket.startNewSession()
  },
  identifyLogRocket ({ commit, rootState }) {
    initLogrocket()
    commit('SET_IS_SESSION_TRACKED', true)
    LogRocket.identify(rootState.account.id, {
      email: rootState.account.email,
      version: rootState.ui.version
    })
    LogRocket.getSessionURL(sessionURL => {
      Sentry.configureScope(scope => {
        scope.setExtra("sessionURL", sessionURL);
      });
    });
  },
}
