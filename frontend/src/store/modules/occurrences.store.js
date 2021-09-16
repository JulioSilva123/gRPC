const request = require('superagent')

const OFFERS_SDK = [
  {
    state: null,
    stateDefault: null,
    mutation: null,
    method: 'GET',
    responseRoot: 'value',
    route: '/contract/type/%occurType%',
    routeParams: { '%occurType%': 'occurType' },
    action: 'isOccurHired',
  },
  {
    state: 'occurrenceTypes',
    mutation: 'SET_OCCUR_TYPES',
    method: 'GET',
    route: '/api/data/occurrencetype',
    action: 'doGetOccurrenceTypes',
  },
]

const getDefaultState = () => {
  return {
    occurrenceTypes: {},
    availableOccurTypes: Array(40).fill(false),
  }
}

const state = {
  occurrenceTypes: {},
  availableOccurTypes: Array(40).fill(false),
}

const getters = {
  GET_OCCURRENCE_TYPES: (state) => {
    return state.occurrenceTypes
  },
  GET_SERVICE_ID: (state, getters, rootState) => (occurType) => {
    const service = rootState.offers.offersList.find(offer => {
      for (const item of offer.items) {
        if (item.type_id === occurType) return true
      }
      return false
    })
    return service ? service.id : undefined
  },
  GET_IS_OCCUR_TYPE_AVAILABLE: (state) => (type) => {
    return state.availableOccurTypes[type]
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_AVAILABLE_OCCUR_TYPES (state, { type, value }) {
    state.availableOccurTypes[type] = value
  },
  SET_OCCUR_TYPES (state, payload) {
    let occurTypes = {}
    payload.forEach(item => {
      occurTypes[item.cod] = item.value
    })
    state.occurrenceTypes = occurTypes
  }
}

const actions = {
  doResetState ({ commit }) {
    commit('resetState')
  },
  checkOccurHiredAndSave ({ dispatch, commit }, { occurType }) {
    return dispatch('isOccurHired', { occurType })
      .then((value) => {
        commit('SET_AVAILABLE_OCCUR_TYPES', { type: occurType, value })
      })
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