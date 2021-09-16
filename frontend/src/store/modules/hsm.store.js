const request = require('superagent')
import { dateSort } from '@/plugins/globals.plugin'

const HSM_SDK = [
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/hsm',
    actionParams: { name: '' },
    action: 'doCreateHSM',
  },
  {
    state: 'hsmList',
    stateDefault: [],
    mutation: 'SET_HSM_LIST',
    method: 'GET',
    route: '/hsm',
    action: 'doGetHSMList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/hsm/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteHSM',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/hsm/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetHSM',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'PUT',
    route: '/hsm/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { name: '', id: '' },
    action: 'doUpdateHSM',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/hsm/%id%/block',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetHSMBlockedList',
  },
]

const getDefaultState = () => {
  return {
    hsmList: [],
    hasBindedHSM: null
  }
}

const state = {
  hasBindedHSM: null
}

const getters = {
  GET_HSM_LIST: state => {
    return state.hsmList.map(item => {
      return {
        id: item.id,
        label: item.name,
        created: Date.parse(item.CreatedAt),
        updated: Date.parse(item.UpdatedAt),
        isConfigured: item.isConfigured
      }
    })
  },
  HSM_IS_BINDED: (state) => ({ id }) => {
    const hsmItem = state.hsmList.find((item) => {
      return item.id === id
    })
    return hsmItem && hsmItem.isConfigured
  },

  getHasBindedHSM: (state) => {
    // TODO: change condition for new field 'isLan'
    return state.hsmList.length !== 0
    // return state.hsmList.some(hsmItem => {
    //   hsmItem.isLan === true
    // })
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_HSM_LIST (state, payload) {
    if (!payload) return
    state.hsmList = payload.sort(dateSort)
  }, 
}

const actions = {
  doResetState ({ commit }) {
    commit('resetState')
  }
}

HSM_SDK.forEach(item => {
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