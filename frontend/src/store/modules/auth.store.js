import * as Sentry from '@sentry/browser';
const request = require('superagent')

const getDefaultState = () => {
  return {
    email: sessionStorage.getItem('email'),
    password: null,
    otp: null,
    recaptchaToken: null,
    faliedLoginAttempts: 0,
    isLogged: !!sessionStorage.getItem('authToken'),
    file_encryption_treatment: false,
    google_oauth_treatment: false,
    dashboard_tlm_treatment: false
  }
}

const state = {
  email: sessionStorage.getItem('email'),
  password: null,
  otp: null,
  recaptchaToken: null,
  faliedLoginAttempts: 0,
  isLogged: !!sessionStorage.getItem('authToken'),
  file_encryption_treatment: false,
  google_oauth_treatment: false,
  dashboard_tlm_treatment: false
}

const getters = {
}

const mutations = {
  SET_USER_EMAIL (state, payload = null) {
    state.email = payload
  },
  SET_USER_RECAPTCHA (state, payload = null) {
    state.recaptchaToken = payload
  },
  INC_FAIL_LOGIN_ATTEMPTS (state) {
    state.faliedLoginAttempts++
  },
  SET_PASSWORD (state, payload = null) {
    state.password = payload
  },
  SET_OTP (state, payload = null) {
    state.otp = payload
  },
  // *
  SET_LOGGED_USER (state, { authToken, accountId, email }) {
    if (authToken) sessionStorage.setItem('authToken', authToken)
    if (accountId) sessionStorage.setItem('accountId', accountId)
    if (email) sessionStorage.setItem('email', email)
  },
  SET_SPLIT_TREATMENT (state, { splitName, splitTreatment }) {
    state[splitName] = splitTreatment
  },
  CLEAR_SESSION_STORAGE () {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('accountId')
    sessionStorage.removeItem('email')
  },
  CLEAR_LOGIN_FAILED (state) {
    state.password = null
    state.recaptchaToken = null
  },
  CLEAR_AFTER_LOGIN (state) {
    state.password = null
    state.faliedLoginAttempts = 0
    state.recaptchaToken = null
  },
  SET_IS_LOGGED (state, payload = false) {
    state.isLogged = payload
  },
  // *
  RESET_INPUT (state) {
    state.password = null
  },
  RESET_STORAGE () {
    sessionStorage.removeItem('authToken')
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  startProdTools ({ commit, rootState }) {
    // Split
    var SplitFactory = require('@splitsoftware/splitio').SplitFactory;
    var factory = SplitFactory({
      core: {
        authorizationKey: process.env.VUE_APP_SPLT_AUTH_KEY,
        // the split key cannot be null or empty
        key: rootState.account.email || 'd'
      }
    });
    const client = factory.client();
    client.on(client.Event.SDK_READY, function () {

      const splits = ['file_encryption', 'google_oauth', 'dashboard_tlm']
      splits.forEach(split => {
        const splitTreatment = client.getTreatment(split) === 'on'
        const splitName = split + '_treatment'
        commit('SET_SPLIT_TREATMENT', { splitName, splitTreatment })
      })
    })
  },
  init ({ dispatch }) {
    dispatch('startProdTools')
  },
  async doLogin ({ dispatch, state, commit }) {
    const body = {
      email: state.email,
      password: state.password
    }
    const url = process.env.VUE_APP_API_BASE + '/account/login'
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(body)
        .end(async (err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              if (error.status === 403) {
                commit('CLEAR_LOGIN_FAILED')
                commit('INC_FAIL_LOGIN_ATTEMPTS')
              }
              return reject(error)
            })
          } else {
            const response = JSON.parse(res.text)
            const authToken = response.token
            commit('SET_IS_LOGGED', true)
            commit('SET_LOGGED_USER', {
              authToken,
              email: state.email,
              accountId: response.id
            })
            Sentry.setUser({ email: state.email });
            dispatch('account/init', {}, { root: true })
            dispatch('startProdTools')

            return resolve(res.body)
          }
        })
    })
  },
  async doLogout ({ state, commit, dispatch }) {
    if (!state.isLogged) {
      return
    }
    commit('SET_IS_LOGGED', false)
    commit('CLEAR_SESSION_STORAGE')
    commit('resetState')
    dispatch('resources/doResetState', {}, { root: true })
    dispatch('hsm/doResetState', {}, { root: true })
    dispatch('account/doResetState', {}, { root: true })
    dispatch('billing/doResetState', {}, { root: true })
    dispatch('report/doResetState', {}, { root: true })
    dispatch('charts/doResetState', {}, { root: true })
    dispatch('offers/doResetState', {}, { root: true })
    dispatch('resources/doResetState', {}, { root: true })
    dispatch('logMon/doResetState', {}, { root: true })
    dispatch('liveOccur/doResetState', {}, { root: true })
    dispatch('svault/doResetState', {}, { root: true })
    dispatch('resourceModal/doResetState', {}, { root: true })
    dispatch('fileEncryption/doResetState', {}, { root: true })
    Sentry.configureScope(scope => scope.setUser(null));
  },
  async doVerifyPassword ({ rootGetters, dispatch }, { password }) {
    const url = process.env.VUE_APP_API_BASE + '/account/login'
    const body = {
      email: rootGetters['account/GET_USER_INFO'].email,
      password: password
    }
    return new Promise((resolve, reject) => {
      let headers = { Authorization: `${sessionStorage.getItem('authToken')}` }
      request
        .post(url)
        .set(headers)
        .send(body)
        .end((err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              return reject(error)
            })
          } else return resolve(res.body)
        })
    })
  },
  async doChangePassword ({ dispatch }, { password, newPassword }) {
    const url = process.env.VUE_APP_API_BASE + '/account/change_password'
    const body = {
      oldpass: password,
      newpass: newPassword
    }
    return new Promise((resolve, reject) => {
      let headers = { Authorization: `${sessionStorage.getItem('authToken')}` }
      request
        .post(url)
        .set(headers)
        .send(body)
        .end((err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              return reject(error)
            })
          } else return resolve(res.body)
        })
    })
  },
  async doLoginPartner ({ commit }, { b64Credentials }) {
    const body = {
      b64Credentials: b64Credentials
    }
    const url = process.env.VUE_APP_API_BASE + '/account/login/partner'
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(body)
        .end(async (err, res) => {
          if (err) {
            return reject(err)
          }
          commit('SET_IS_LOGGED', true)
          commit('SET_LOGGED_USER', {
            authToken: res.body.token,
          })
          return resolve(res.body)
        })
    })
  },
  doResetState ({ commit }) {
    commit('resetState')
  },
}

export { state, getters, mutations, actions }