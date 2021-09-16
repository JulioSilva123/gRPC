const request = require('superagent')
const ACCOUNT_SDK = [
  {
    method: 'GET',
    state: null,
    stateDefault: null,
    mutation: 'SET_ACCOUNT_INFO',
    route: '/account/get_user_info',
    action: 'doGetUserInfo',
  },
  {
    method: 'PATCH',
    route: '/account/%id%/%field%',
    actionParams: { id: '', field: '', value: '' },
    action: 'updateAccountInfo',
  },
  {
    method: 'DELETE',
    route: '/account',
    action: 'selfDeleteAccount',
  },
  // API KEY
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/account/api_key',
    actionParams: { label: '' },
    action: 'createApiKey'
  },
  {
    state: 'apiKeyList',
    stateDefault: [],
    mutation: 'SET_API_KEY_LIST',
    method: 'GET',
    route: '/account/api_key',
    action: 'getApiKeyList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/account/api_key/%id%',
    actionParams: { id: '' },
    action: 'getApiKey',
  },
  {
    method: 'PUT',
    route: '/account/api_key/%id%',
    actionParams: {  id: '', label: '' },
    action: 'updateApiKey',
  },
  {
    method: 'DELETE',
    route: '/account/api_key/%id%',
    actionParams: { id: '' },
    action: 'deleteApiKey',
  },
]

const getDefaultState = () => {
  return {
    id: null,
    name: null,
    username: null,
    email: null,
    created: null,
    phone: null,
    company: null,
    taxPayer: null,
    billingDay: null,
    apiKeyList: []
  }
}

const state = {
  id: null,
  name: null,
  username: null,
  email: null,
  created: null,
  phone: null,
  company: null,
  taxPayer: null,
  billingDay: null,
  apiKeyList: []
}

const getters = {
  GET_USER_INFO: state => {
    const userInfo = {
      id: state.id,
      name: state.name,
      username: state.username,
      email: state.email,
      created: state.created,
      phone: state.phone ? state.phone.slice(2) : state.phone,
      taxPayer: state.taxPayer,
      company: state.company,
      billingDay: state.billingDay
    }
    return userInfo
  },
  GET_API_KEY_INFO: () => (apiKeyDetail) => {
    const newItem = {
      id: apiKeyDetail.id,
      label: apiKeyDetail.label,
      created: Date.parse(apiKeyDetail.created),
    }
    return newItem
  },
  GET_API_KEY_LIST: (state, getters) => {
    let apiKeyList = state.apiKeyList.map(item => {
      return getters.GET_API_KEY_INFO(item)
    })
    apiKeyList.sort((a, b) => {
      const dif = a.created - b.created
      if (dif < 0) return 1
      else if (dif > 0) return -1
      else return 0
    })
    
    return apiKeyList
  }
}

const mutations = {
  SET_ACCOUNT_INFO (state, { id, name, username, email, created, phone, tax_payer, company, billingday }) {
    state.id = id
    state.name = name
    state.username = username
    state.email = email
    state.created = created
    state.phone = phone
    state.taxPayer = tax_payer
    state.company = company
    state.billingDay = billingday
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  init ({ commit }) {
    commit('SET_ACCOUNT_INFO', { email: sessionStorage.getItem('email'),
                                 id: sessionStorage.getItem('accountId')
    })
  },
  doResetState ({ commit }) {
    commit('resetState')
  }
}

ACCOUNT_SDK.forEach(item => {
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
          
          url = url.replace(/%\w+%/g, function(routeParam) {
            const paramName = routeParam.slice(1, -1)
            const paramValue = actionParams[paramName]
            delete actionParams[paramName]
            return paramValue
          });

          const body = actionParams
          const headers = { Authorization: `${sessionStorage.getItem('authToken')}` }
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
            case 'PATCH':
              return request
                .patch(url)
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
