const request = require('superagent')

const OFFERS_SDK = [
  {
    state: 'offersList',
    stateDefault: [],
        mutation: 'SET_OFFERS_LIST',
    method: 'GET',
    route: '/offer',
    action: 'getOffersList',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/offer',
    actionParams: { name: '', alias: '', logo: '' },
    action: 'createOffer'
  },
  {
    method: 'PUT',
    route: '/offer/%id%',
    actionParams: {  id: '' },
    routeParams: { '%id%': 'id', },
    action: 'updateOffer',
  },
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    route: '/offer/%id%',
    actionParams: { id: '' },
    routeParams: { '%id%': 'id', },
    action: 'getOffer',
  },
  {
    method: 'DELETE',
    route: '/offer/%id%',
    actionParams: { id: '' },
    routeParams: { '%id%': 'id', },
    action: 'deleteOffer',
  },
  // PICTURE
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/offer/%id%',
    actionParams: { id: '', name: '', value: '' },
    routeParams: { '%id%': 'id', },
    action: 'createOfferPicture'
  },
  {
    method: 'PUT',
    route: '/offer/%id%/%picture_id%',
    actionParams: {  id: '', picture_id: '', name: '', value: '' },
    routeParams: { '%id%': 'id', '%picture_id%': 'picture_id' },
    action: 'updateOfferPicture',
  },
  {
    method: 'DELETE',
    route: '/offer/%id%/%picture_id%',
    actionParams: { id: '', picture_id: '' },
    routeParams: { '%id%': 'id', '%picture_id%': 'picture_id' },
    action: 'deleteOfferPicture',
  },
  // RANGE
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'POST',
    route: '/offer/%id%/range',
    actionParams: { id: '', vlr_inferior: '', vlr_superior: '' },
    routeParams: { '%id%': 'id' },
    action: 'createOfferRange'
  },
  {
    method: 'PUT',
    route: '/offer/%id%/range/%id_range%',
    actionParams: {  id: '', id_range: '', vlr_inferior: '', vlr_superior: '' },
    routeParams: { '%id%': 'id', '%id_range%': 'id_range' },
    action: 'updateOfferRange',
  },
  {
    method: 'DELETE',
    route: '/offer/%id%/range/%id_range%',
    actionParams: { id: '', id_range: '' },
    routeParams: { '%id%': 'id', '%id_range%': 'id_range' },
    action: 'deleteOfferRange',
  },
  // Contract
  {
    state: 'hiredOffersList',
    stateDefault: [],
    mutation: 'SET_HIRED_OFFERS_LIST',
    method: 'GET',
    route: '/contract',
    action: 'getHiredOffersList',
  },
  {
    method: 'POST',
    route: '/contract/%offer_id%',
    actionParams: {  offer_id: '' },
    routeParams: { '%offer_id%': 'offer_id' },
    action: 'hireOffer',
  },
  {
    method: 'DELETE',
    route: '/contract/%contract_id%',
    actionParams: { contract_id: '' },
    routeParams: { '%contract_id%': 'contract_id' },
    action: 'unhireOffer',
  }
]

const getDefaultState = () => {
  return {
    offersList: [],
  }
}

const state = {
  offersList: [],
}

const getters = {
  GET_FORMATTED_DESCRIPTION: () => (description) => {
    let formattedDescription = []
    description.split('\n').forEach(element => {
      const prefix = element.slice(0, 2)
      if (prefix === '- ') {
        formattedDescription.push([element.slice(2)])
      } else if (prefix === '* ') {
        formattedDescription.push({ 'bold': element.slice(2) })
      } else {
        formattedDescription.push(element)
      }
    })
    return formattedDescription
  },
  GET_FREE_OFFERS: () => {
    if (!process.env.VUE_APP_FREE_OFFERS) return []
    const freeOffers = process.env.VUE_APP_FREE_OFFERS.split(',')
    return freeOffers
  },
  GET_SUBSCRIBED_CONTRACTS: (state) => {
    return state.hiredOffersList.map(contract => {
      const offer = state.offersList.find(offer => offer.id === contract.offerId)
      return {
        ...contract,
        offer
      }
    })
  },
  GET_OFFERS_LIST: (state, getters) => {
    return state.offersList.map(item => {
      return getters.getOfferInfo(item.id)
    })
  },
  getOfferInfo: (state) => offerId => {
    const offerDetail = state.offersList.find(offer => offer.id === offerId)
    if (!offerDetail) return
    let contract = state.hiredOffersList.find(
      hiredOffer => hiredOffer.offerId === offerDetail.id
    )
    let offerInfo = {
      id: offerDetail.id,
      alias: offerDetail.alias,
      name: offerDetail.name,
      description: offerDetail.description,
      logo: offerDetail.logo || '',
      pictures: offerDetail.pictures || [],
      ranges: offerDetail.ranges || [],
      summary: offerDetail.summary,
      fixedValue: offerDetail.fixedValue,
      variableValue: offerDetail.variableValue,
      contract: null
    }
    if (contract) {
      offerInfo.contract = { ...contract }
      offerInfo.contract.start = Date.parse(contract.start)
      offerInfo.contract.end = contract.end ? Date.parse(contract.end) : null  
    }
    if (offerDetail.items) {
      offerInfo.items = offerDetail.items
    }
    return offerInfo
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setOfferFromOffersList (state, offerInfo) {
    let offerIndex = state.offersList.findIndex(offer => offer.id === offerInfo.id)

    if (offerIndex < 0) state.offersList.push(offerInfo)
    else state.offersList[offerIndex] = offerInfo
  }
}

const actions = {
  doResetState ({ commit }) {
    commit('resetState')
  }
}

OFFERS_SDK.forEach(item => {
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
                  urlQueryParams.push(`${key}=${queryParamValue}`)
                delete actionParams[key]
              })

              const paramUrlSlice = urlQueryParams.join('&')
              if (paramUrlSlice) url = `${url}?${paramUrlSlice}`
            }
          }

          const body = actionParams
          let headers = {}
          if (sessionStorage.getItem('authToken')) {
            headers.Authorization = `${sessionStorage.getItem('authToken')}`
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