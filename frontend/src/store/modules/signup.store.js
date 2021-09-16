const request = require('superagent')

export const state = {
  name: null,
  email: null,
  resendEmailCounter: 0
}

export const mutations = {
  SET_USER_EMAIL (state, payload = null) {
    state.email = payload
  },
  SET_USER_NAME (state, payload = null) {
    state.name = payload
  },
  INC_RESEND_EMAIL_COUNTER (state) {
    state.resendEmailCounter++
  },
  RESET (state) {
    state.name = null
    state.email = null
  }
}

export const actions = {
  setErrors ({ commit }, { email, username }) {
    commit('SET_HAVE_ERRORS', true)
    commit('SET_USER_EMAIL', email)
    commit('SET_USER_NAME', username)
  },
  async doSignUp ({ dispatch }, { name, email, password, phone, company, taxPayer, recaptchaToken }) {
    const url = process.env.VUE_APP_API_BASE + '/account/sign_up'
    const body = {
      username: name,
      email,
      password,
      phone,
      company,
      tax_payer: taxPayer,
      recaptchaToken
    }
    console.log
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(body)
        .end((err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              return reject(error)
            })
          } else {
            return resolve(JSON.parse(res.text))
          }
        })
    })
  },
  async doSendVerifyLink ({ dispatch }, { email }) {
    const url = process.env.VUE_APP_API_BASE + '/account/resend_link'
    const body = {
      email
    }
    return new Promise((resolve, reject) => {
      request
        .post(url)
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
  async doVerifyEmail ({ dispatch }, { activation_token }) {
    const url = `${process.env.VUE_APP_API_BASE}/account/verify_email/${activation_token}`
    console.log(url)
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              return reject(error)
            })
          } else return resolve(JSON.parse(res.text))
        })
    })
  },
  // RESET PWD STEPS
  async doRequestPasswordReset ({ dispatch }, { email }) {
    const url = process.env.VUE_APP_API_BASE + '/account/request_reset_password'
    const body = {
      email
    }
    return new Promise((resolve, reject) => {
      request
        .post(url)
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
  async doResetPassword ({ dispatch }, { token, newpass }) {
    const url = process.env.VUE_APP_API_BASE + '/account/reset_password'
    const body = {
      token,
      newpass
    }
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(body)
        .end((err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              return reject(error)
            })
          } else return resolve(res.body)
        })
    })
  }
}
