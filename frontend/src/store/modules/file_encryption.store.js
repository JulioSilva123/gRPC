import i18n from '../../plugins/i18n.plugin'
const request = require('superagent')
const SVAULT_SDK = [
]
const getDefaultState = () => {
  return {
  }
}
const state = {
}

const getters = {
  // Options
  GET_SECRET_SELECTION_LIST: (state, getters, rootState) => {
    let options = rootState.resources.secretList.map(secret => {
      return {
        text: [secret.label, secret.id],
        value: {
          id: secret.id,
          value: secret.value
        }
      }
    })
    options.push({
      text: [i18n.t('custom_secret_option')],
      value: {
        id: 'custom',
        value: undefined
      }
    })
    return options
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  doResetState ({ commit }) {
    commit('resetState')
  }
}

SVAULT_SDK.forEach(item => {
  if (item.state) state[item.state] = item.stateDefault

  if (item.mutation) {
    if (!mutations[item.mutation]) {
      mutations[item.mutation] = function (state, payload) {
        state[item.state] = payload
      }
    }
  }

  if (item.action) {
    actions[item.action] = function (
      { commit, dispatch },
      params = item.actionParams || {}
    ) {
      return new Promise((resolve, reject) => {
        const readResponseRoot = function(res, item) {
          const body = JSON.parse(res.text)
          if (body && item.responseRoot) return body[item.responseRoot]
          else return body
        }
        const mountRequest = function (item, actionParams) {
          let url = process.env.VUE_APP_API_BASE + item.route
          
          if (item.routeParams) {
            url = url.replace(/%\w+%/g, function(routeParam) {
              const paramName = item.routeParams[routeParam]
              const paramValue = actionParams[paramName]
              delete actionParams[paramName]
              return paramValue
            });
          }

          const body = actionParams
          const headers = {
            Authorization: `${sessionStorage.getItem('authToken')}`,
          }
          switch (item.method) {
            case 'GET':
              return request
                .get(url)
                .set(headers)
            case 'POST':
              return request
                .post(url)
                .set(headers)
                .send(body)
            case 'PUT':
              return request
                .put(url)
                .set(headers)
                .send(body)
            case 'DELETE':
              return request
                .delete(url)
                .set(headers)
                .send(body)
          }
        }
        const theRequest = mountRequest(item, params)
        theRequest
          .end((err, res) => {
            if (err) {
              dispatch('error/setError', { err }, { root: true }).then((error) => {
                return reject(error)
              })
            } else {
              let result = readResponseRoot(res, item)
              if (item.mutation) {
                commit(`${item.mutation}`, result)
              }
              return resolve(result)
            }
          })
      })
    }
  }
})

export { state, getters, mutations, actions }