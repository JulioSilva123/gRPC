import i18n from '../../plugins/i18n.plugin'
const request = require('superagent')
import { getDateString } from '../../plugins/globals.plugin'
import { dateSort } from '@/plugins/globals.plugin'
const SVAULT_SDK = [
  // VAULT
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/svault',
    actionParams: { label: '' },
    action: 'doCreateVault',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/svault/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteVault',
  },
  {
    state: 'vaultList',
    stateDefault: [],
    mutation: 'SET_VAULT_LIST',
    method: 'GET',
    route: '/api/svault',
    action: 'doGetVaultList',
  },
  // ENGINE
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/svault/engine',
    actionParams: {
      label: '',
      format: '',
      storage: '',
      checksum: '',
    },
    action: 'doCreateEngine',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/svault/engine/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteEngine',
  },
  {
    state: 'engineList',
    stateDefault: [],
    mutation: 'SET_ENGINE_LIST',
    method: 'GET',
    route: '/api/svault/engine',
    action: 'doGetEngineList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/api/svault/engine/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetEngineDetail',
  },
  // TOKEN
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/svault/token/%vaultId%',
    responseRoot: 'decoded_value',
    routeParams: { '%vaultId%': 'vaultId' },
    actionParams: { vaultId: '', token: '', mask: '' },
    action: 'doDecodeToken',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/svault/encode/%vault%/%engine%',
    routeParams: { '%vault%': 'vault', '%engine%': 'engine' },
    actionParams: { vault: '', engine: '', value: '' },
    action: 'doEncode',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/svault/token/%vaultId%',
    routeParams: { '%vaultId%': 'vaultId' },
    actionParams: { token: '' },
    action: 'doDeleteToken',
  },
  {
    state: 'tokenList',
    stateDefault: [],
    mutation: 'SET_TOKEN_LIST',
    method: 'GET',
    route: '/api/svault/token/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetTokenList',
  },
  // For tokens stored with us
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    responseRoot: 'encoded_value',
    route: '/api/svault/decode/%value%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '', idToken: '' },
    action: 'doRetrieveSecret',
  },
  // For tokens stored externally
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/svault/decode/%vaultId%',
    responseRoot: 'decoded_value',
    routeParams: { '%vaultId%': 'vaultId' },
    actionParams: { vaultId: '', mask: '', encoded_value: '' },
    action: 'doDecode',
  },
  // OPTIONS
  {
    state: 'cksOptions',
    stateDefault: [],
    mutation: 'SET_CKS_OPTIONS',
    method: 'GET',
    route: '/api/data/checksum',
    action: 'doGetCksOptions',
  },
  {
    state: 'storageOptions',
    stateDefault: [],
    mutation: 'SET_STORAGE_OPTIONS',
    method: 'GET',
    route: '/api/data/storagetype',
    action: 'doGetStorageOptions',
  },
  {
    state: 'vformatOptions',
    stateDefault: [],
    mutation: 'SET_VFORMAT_OPTIONS',
    method: 'GET',
    route: '/api/data/vformat',
    action: 'doGetVformatOptions',
  },
]

const getDefaultState = () => {
  return {
    cksOptions: [],
    storageOptions: [],
    vformatOptions: [],
  }
}

const state = {
  cksOptions: [],
  storageOptions: [],
  vformatOptions: [],
}

const getters = {
  // Options
  GET_CKS_OPTIONS: state => {
    let options = []
    Object.entries(state.cksOptions).forEach(([key]) => {
      options.push({
        text: i18n.t(`checksum.${key}`),
        value: key
      })
    })
    return options
  },
  GET_STORAGE_OPTIONS: state => {
    let options = []
    Object.entries(state.storageOptions).forEach(([key, prop]) => {
      options.push({
        text: prop,
        value: key
      })
    })
    return options
  },
  GET_VFORMAT_OPTIONS: state => {
    let options = []
    Object.entries(state.vformatOptions).forEach(([key]) => {
      options.push({
        text: i18n.t(`vformat.${key}`),
        value: key
      })
    })
    return options    
  },
  FAST_OPTIONS: () => {
    let options = [
      {
        text: i18n.t('checksum.cpf'),
        value: {
          format: 'base10',
          checksum: 'cpf'
        }
      },
      {
        text: i18n.t('checksum.cnpj'),
        value: {
          format: 'base10',
          checksum: 'cnpj'
        }
      },
      {
        text: i18n.t('checksum.pan'),
        value: {
          format: 'base10',
          checksum: 'pan'
        }
      },
     ]
     return options
  },
  GET_CONDENSED_OPTIONS: () => {
    let options = [
      {
        text: i18n.t('checksum.cpf'),
        value: {
          format: 'base10',
          checksum: 'cpf'
        }
      },
      {
        text: i18n.t('checksum.cnpj'),
        value: {
          format: 'base10',
          checksum: 'cnpj'
        }
      },
      {
        text: i18n.t('checksum.iel'),
        value: {
          format: 'base10',
          checksum: 'iel'
        }
      },
      {
        text: i18n.t('checksum.pan'),
        value: {
          format: 'base10',
          checksum: 'pan'
        }
      },
      {
        text: i18n.t('vformat.base10'),
        value: {
          format: 'base10',
          checksum: 'nocheck'
        }
      },
      {
        text: i18n.t('vformat.base62'),
        value: {
          format: 'base62',
          checksum: 'nocheck'
        }
      },
    ]
    
    return options    
  },

  GET_TOKEN_LIST: state => {
    if (!state.tokenList) return []
    return state.tokenList.map(item => {
      return {
        token: item.token,
        // createdAt: Date.parse(item.CreatedAt),
      }
    })
  },
  GET_VAULT_LIST: () => {
    if (!state.vaultList) return []
    else return state.vaultList.map(item => {
      return {
        ...item,
        icon: 'mdi-safe'
      }
    })
  },
  GET_ENGINE_LIST: (state) => {
    if (!state.engineList) return []
    else return state.engineList.map(item => {
      return {
        ...item,
        icon: 'settings'
      }
    })
  },
  GET_ENGINE_COMPACT_LIST: (state) => {
    if (!state.engineList) return []
    return state.engineList.map(item => {
      return {
        text: `${item.id} - ${item.label}`,
        value: item.id
      }
    })
  },

  GET_CONDENSED_INFO: () => (engineDetail) => {
    let items = []
    if (engineDetail.id) {
      items.push(
        {
          title: 'ID',
          data: engineDetail.id
        }
      )
    }
    if (engineDetail.label) {
      items.push(
        {
          title: i18n.t(`label`),
          data: engineDetail.label
        }
      )
    }
    if (engineDetail.format && engineDetail.checksum) {
      let infoItem = { title: i18n.t(`engine_checksum`) }

      if (engineDetail.format === 'base10') {
        if (engineDetail.checksum === 'nocheck') {
          infoItem.data = i18n.t('vformat.base10')
        } else {
          infoItem.data = i18n.t(`checksum.${engineDetail.checksum}`)
        }
      } else if (engineDetail.format === 'base62') {
        infoItem.data = i18n.t('vformat.base62')
      }
      items.push(infoItem)
    }
    if (engineDetail.storage) {
      items.push(
        {
          title: i18n.t(`engine_storage`),
          data: engineDetail.storage === 'external' ? i18n.t('external_storage') : i18n.t('internal_storage')
        }
      )
    }
    if (engineDetail.created) {
      items.push(
        {
          title: i18n.t(`engine_created`),
          data: getDateString({ date: Date.parse(engineDetail.created) })
        }
      )
    }

    return items
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN_LIST (state, payload) {
    if (!payload) return
    state.tokenList = payload.sort(dateSort)
  },
  SET_VAULT_LIST (state, payload) {
    if (!payload) return
    state.vaultList = payload.sort(dateSort)
  },
  SET_ENGINE_LIST (state, payload) {
    if (!payload) return
    state.engineList = payload.sort(dateSort)
  },  
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