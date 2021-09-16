import i18n from '../../plugins/i18n.plugin'
const request = require('superagent')
import { dateSort } from '@/plugins/globals.plugin'
const KEYS_SDK = [
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/key/generate',
    actionParams: { label: '', type: ''},
    action: 'doCreateKey',
  },
  {
    state: 'keysList',
    stateDefault: [],
    mutation: 'SET_KEYS_LIST',
    method: 'GET',
    route: '/api/key',
    action: 'doGetKeysList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/key/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteKey',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/api/key/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetKey',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'PUT',
    route: '/api/key/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { label: '', id: '' },
    action: 'doUpdateKey',
  },
  // CSR
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    responseRoot: 'file',
    route: '/api/key/%id%/csr',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '', dn: '', hash: 'sha256' },
    action: 'doGetCSR',
  },
  // IMPORT
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/key/import',
    actionParams: { label: '', type: '', id: '' },
    action: 'doImportKey',
  },
  // OPTIONS
  {
    state: 'keyTypeOptions',
    stateDefault: [],
    mutation: 'SET_KEY_OPTIONS',
    method: 'GET',
    route: '/api/data/keytype',
    action: 'doGetKeyOptions',
  },
  // CERTIFICATES
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/certificate/import',
    actionParams: { file: '', certLabel: '' },
    action: 'doImportCert',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    responseRoot: 'file',
    route: '/api/certificate/%id%/export',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doExportCert',
  },
  {
    state: 'certList',
    stateDefault: [],
    mutation: 'SET_CERT_LIST',
    method: 'GET',
    route: '/api/certificate',
    action: 'doGetCertList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/certificate/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteCert',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/api/certificate/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetCert',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/api/certificatebymd',
    routeParams: { md: 'md' },
    actionParams: { md: '' },
    action: 'doGetCertByMd',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'PUT',
    route: '/api/certificate/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { label: '', id: '' },
    action: 'doUpdateCert',
  },
  // doGetHsmsForBlockedCert is used for listing HSM where the cert is blocked on
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/certificate/%certId%/block/%hsmId%',
    routeParams: { '%certId%': 'certId', '%hsmId%': 'hsmId' },
    actionParams: { certId: '', hsmId: '' },
    action: 'doBlockCertInHsm',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/certificate/%certId%/unblock/%hsmId%',
    routeParams: { '%certId%': 'certId', '%hsmId%': 'hsmId' },
    actionParams: { certId: '', hsmId: '' },
    action: 'doUnblockCert',
  },
  // CHAIN
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/chain/import',
    actionParams: { file: '', chainlabel: '' },
    action: 'doImportChain',
  },
  {
    state: 'chainList',
    stateDefault: [],
    mutation: 'SET_CHAIN_LIST',
    method: 'GET',
    route: '/api/chain',
    action: 'doGetChainList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/chain/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteChain',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/api/chain/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doGetChain',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'PUT',
    route: '/api/chain/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { label: '', id: '' },
    action: 'doUpdateChain',
  },
  // SECRET FILE ENCRYPT
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/secret',
    actionParams: { label: '' },
    action: 'doCreateSecret',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/secret/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteSecret',
  },
  {
    state: 'secretList',
    stateDefault: [],
    mutation: 'SET_SECRET_LIST',
    method: 'GET',
    route: '/api/secret',
    action: 'doGetSecretList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'PUT',
    route: '/api/secret/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { label: '', id: '' },
    action: 'doUpdateSecret',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/api/secret/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doExportSecret',
  },
  // TRACKERS
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/api/track/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '', email: '', type: ''},
    action: 'doTrackCert',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'DELETE',
    route: '/api/track/%id%',
    routeParams: { '%id%': 'id' },
    actionParams: { id: '' },
    action: 'doDeleteTrackerFromCert',
  },
  {
    state: 'trackerTypeOptions',
    stateDefault: [],
    mutation: 'SET_TRACKER_OPTIONS',
    method: 'GET',
    route: '/api/data/typetracker',
    action: 'doGetTrackerOptions',
  },
]

const getDefaultState = () => {
  return {
    keyTypeOptions: [],
    keysList: [],
  }
}

const state = {
  keyTypeOptions: [],
  keysList: [],
}

const getters = {
  // certDetail
  GET_CERT_TRACKER_LIST: () => (certDetail) => {
  
    if (certDetail.tracked) return certDetail.trackers
    else return []
  },
  GET_TRACKING_CHANNEL_OPTION_DETAIL: state => (code) => {
    return state.trackerTypeOptions[code]
  },
  GET_TRACKING_CHANNEL_OPTIONS: state => {
    let options = []
    let optionsIcons = {
      watracker: 'mdi-whatsapp',
      smstracker: 'sms',
      emailtracker: 'email'
    }
    Object.entries(state.trackerTypeOptions).forEach(([key]) => {
      // TODO: enable whatsapp again
      if (key === 'watracker') return
      options.push({
        title: i18n.t(key),
        icon: optionsIcons[key],
        value: key,
        id: key
      })
    })
    return options
  },
  CHECK_IF_RESOURCE_EXISTS: state => ({ resourceType, id }) => {
    let list = []
    if (resourceType === 'key') {
      list = state.keysList
    } else if (resourceType === 'x509') {
      list = state.certList
    } else if (resourceType === 'secret') {
      list = state.secretList
    }
    return list.find(item => item.id === id)
  },
  GET_KEY_TYPE_NAME: state => (type) => {
    if (!Object.prototype.hasOwnProperty.call(state.keyTypeOptions, type)) {
      return type
    }
    return state.keyTypeOptions[type]
  },
  GET_KEY_INFO: (state, getters) => (keyDetail) => {
    const info = {
      id: keyDetail.id,
      label: keyDetail.label,
      icon: 'vpn_key',
      type: keyDetail.type
    }
    if (keyDetail.code) {
      info.family = { 
        text: getters.GET_KEY_TYPE_NAME(keyDetail.code),
        value: keyDetail.code
      }
    }
    if (keyDetail.created) {
      info.created = Date.parse(keyDetail.created)
    } 
    if (keyDetail.cert) {
      info.linkedResource = keyDetail.cert
    }
    if (keyDetail.certs) {
      info.linkedResourceArray = keyDetail.certs.map(item => {
        return getters.GET_CERT_INFO(item)
      })
    }
    return info
  },
  GET_CERT_INFO: (state, getters) => (certDetail) => {
    const info = {
      id: certDetail.id,
      label: certDetail.label,
      icon: 'card_membership',
      type: certDetail.type,
      tracked: certDetail.tracked
    }
    if (certDetail.created) {
      info.created = Date.parse(certDetail.created)
    }
    if (certDetail.data) {
      info.data = {
        notBefore: Date.parse(certDetail.data.NotBefore),
        notAfter: Date.parse(certDetail.data.NotAfter),
        subjectName: certDetail.data.Subject.Name,
        subjectOrg: certDetail.data.Subject.Organization,
        issuerName: certDetail.data.Issuer.Name,
        issuerOrg: certDetail.data.Issuer.Organization,
        keyUsage: certDetail.data.KeyUsage,
        version: certDetail.data.Version,
        serialNumber: certDetail.data.SerialNumber,
        signatureAlgorithm: certDetail.data.SignatureAlgorithm
      }
    }
    if (certDetail.keys) {
      info.linkedResourceArray = certDetail.keys.map(item => {
        return getters.GET_KEY_INFO(item)
      })
    }
    info.hsmBlockedList = certDetail.hsmBlockedList || []
    return info
  },
  GET_IS_CERT_BLOCKED: () => (cert) => {
    return cert.hsmBlockedList.some((item) => item.isBlockedIn)
  },
  GET_CHAIN_INFO: () => (chainDetail) => {
    const info = {
      id: chainDetail.id,
      label: chainDetail.label,
      type: chainDetail.type,
      created: Date.parse(chainDetail.created),
      icon: 'mdi-set-all'
    }
    return info
  },
  GET_SECRET_INFO: () => (secretDetail) => {
    const info = {
      id: secretDetail.id,
      label: secretDetail.label,
      icon: 'mdi-cloud-lock-outline',
      type: secretDetail.type,
      created: Date.parse(secretDetail.created),
    }
    if (secretDetail.data) info.data = secretDetail.data
    return info
  },
  GET_CREATION_OPTIONS: state => {
    let options = []
    Object.entries(state.keyTypeOptions).forEach(([key, prop]) => {
      options.push({
        text: prop,
        value: key
      })
    })
    return options
  },
  GET_KEYS: (state, getters) => {
    if (!state.keysList) return []
    return state.keysList.map(item => {
      return getters.GET_KEY_INFO(item)
    })
  },
  GET_CERTS: (state, getters) => {
    if (!state.certList) return []
    return state.certList.map(item => {
      return getters.GET_CERT_INFO(item)
    })
  },
  GET_CHAINS: (state, getters) => {
    if (!state.chainList) return []
    return state.chainList.map(item => {
      return getters.GET_CHAIN_INFO(item)
    })
  },
  GET_SECRET_LIST: (state, getters) => {
    return state.secretList.map(item => getters.GET_SECRET_INFO(item))
  },
  CAN_EMIT_CSR: () => (family) => {
    const csrEnabledFamily = ['bpp256r1','rsa2048','rsa3072','secp256r1']
    return csrEnabledFamily.includes(family)
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_CERT_LIST (state, payload) {
    if (!payload) return
    state.certList = payload.sort(dateSort)
  },
  SET_KEYS_LIST (state, payload) {
    if (!payload) return
    state.keysList = payload.sort(dateSort)
  },
  SET_CHAIN_LIST (state, payload) {
    if (!payload) return
    state.chainList = payload.sort(dateSort)
  },
  SET_SECRET_LIST (state, payload) {
    if (!payload) return
    state.secretList = payload.sort(dateSort)
  },
}

const actions = {
  doResetState ({ commit }) {
    commit('resetState')
  },
  doGetHsmsForBlockedCert ({ dispatch, rootState }, { id }) {
    let url = `${process.env.VUE_APP_API_BASE}/api/certificate/${id}/block`
    return new Promise((resolve, reject) => {
      let headers = { Authorization: `${sessionStorage.getItem('authToken')}` }
      request
        .get(url)
        .set(headers)
        .end(async (err, res) => {
          if (err) {
            dispatch('error/setError', { err }, { root: true }).then((error) => {
              return reject(error)
            })
          } else {
            const hsmBlockedList = JSON.parse(res.text) || []
            const hsmList = rootState.hsm.hsmList.map(item => {
              return {
                id: item.id,
                name: item.name,
                isBlockedIn: false
              }
            })

            hsmList.forEach((hsm) => {
              const hsmIsBloqued = hsmBlockedList.some(hsmBlocked => hsmBlocked.id === hsm.id)
              hsm.isBlockedIn = hsmIsBloqued
            })
            return resolve({ hsmBlockedList: hsmList })
          }
        })
    })    
  },
  doBlockNewCertInHsm ({ dispatch }, { file, certLabel, hsmId }) {
    return new Promise((resolve, reject) => {
      dispatch('doImportCert', { file, certLabel })
        .then((res) => {
          if (res.id) {
            dispatch('doBlockCertInHsm', { certId: res.id, hsmId })
              .then(() => {
                resolve()
              })
          } else {
            reject('unable_to_block')
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateHsmBlockStateInList ({ dispatch }, { certId, hsmList }) {
    let promiseArray = []
      hsmList.forEach(item => {
        if (item.isBlockedIn) {
          promiseArray.push(
            dispatch('doBlockCertInHsm', { certId: certId, hsmId: item.id })
          )
        } else {
          promiseArray.push(
            dispatch('doUnblockCert', { certId: certId, hsmId: item.id })
          )
        }
      })
      return Promise.all(promiseArray)
        .catch(err => {
          dispatch('error/setError', { err }, { root: true }).then((error) => {
            console.log(error)
          })
        })
  },
}

KEYS_SDK.forEach(item => {
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

            // Query params
            if (item.method === 'GET') {
              let urlQueryParams = []
              Object.entries(item.routeParams).forEach(([key, prop]) => {
                const queryParamValue = actionParams[prop]
                if (queryParamValue)
                  urlQueryParams.push(`${key}=${encodeURIComponent(queryParamValue)}`)
                delete actionParams[key]
              })

              const paramUrlSlice = urlQueryParams.join('&')
              if (paramUrlSlice) url = `${url}?${paramUrlSlice}`
            }
          }

          const body = actionParams
          const headers = {
            Authorization: `${sessionStorage.getItem('authToken')}`
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