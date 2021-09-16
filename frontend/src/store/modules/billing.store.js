import {Decimal} from 'decimal.js';
import { getTitleForDateRef } from '../../plugins/globals.plugin'
const request = require('superagent')

const BILLING_SDK = [
  {
    state: 'signsByDay',
    stateDefault: null,
    mutation: 'SET_DAY_SIGNS',
    method: 'GET',
    routeParams: { 'start': 'startDate', 'end': 'endDate' },
    route: '/billing/signlast',
    actionParams: { startDate: '', endDate: '' },
    action: 'doGetSignsByDay'
  },
  {
    state: 'signsByType',
    stateDefault: null,
    mutation: 'SET_TYPE_SIGNS',
    method: 'GET',
    route: '/billing/signbytype',
    routeParams: { 'start': 'startDate', 'end': 'endDate' },
    actionParams: { startDate: '', endDate: '' },
    action: 'doGetSignsByType'
  },
  {
    state: 'objCount',
    stateDefault: 0,
    responseRoot: 'value',
    mutation: 'SET_OBJ_COUNT',
    method: 'GET',
    route: '/billing/objectcount',
    action: 'doGetObjectsCount',
  },
  {
    state: 'objLength',
    stateDefault: 0,
    responseRoot: 'value',
    mutation: 'SET_OBJ_LENGTH',
    method: 'GET',
    route: '/billing/objectlength',
    action: 'doGetObjectLength',
  },
  {
    mutation: 'SET_TOTAL_SIGNS',
    method: 'GET',
    route: '/billing/signbytype',
    action: 'doGetTotalSigns',
  },
  //
  {
    state: 'invoiceList',
    method: 'GET',
    mutation: 'SET_INVOICE_LIST',
    route: '/contract/list-invoice',
    routeParams: { 'contractid': 'contractId' },
    actionParams: { contractId: '' },
    action: 'doGetInvoiceList',
  },
  {
    state: 'selectedMonthBillingDetail',
    mutation: 'SET_SELECTED_MONTH_BILLING_DETAIL',
    method: 'GET',
    route: '/contract/detail-invoice/%dateref%',
    routeParams: { '%dateref%': 'dateRef', 'contractid': 'contractId' },
    actionParams: { contractId: '', dateRef: '' },
    action: 'doGetMonthBillingDetail',
  },
]

const getDefaultState = () => {
  return {
    signsByDay: null,
    signsByType: null,
    objCount: 0,
    objLength: 0,
    totalSigns: 0,
    invoiceList: [],
    selectedBillingMonth: null,
    selectedMonthBillingDetail: []
  }
}

const state = {
  totalSigns: 0,
  selectedBillingMonth: null,
  selectedMonthBillingDetail: []
}

const getters = {
  GET_INVOICE_LIST: state => {
    return state.invoiceList
  },
  GET_LAST_INVOICE_VALUE: () => {
    return 0
  },
  GET_BILLING_DAY: (state, getters, rootState) => {
    return rootState.account.billingDay
  },
  GET_HAS_CHARGEABLE_CONTRACT: (state, getters, rootState) => {
    return rootState.offers.hiredOffersList.length || state.invoiceList.length
  },  
  GET_TOTAL_SUM: () => (invoices) => {
    let sum = new Decimal(0)
    invoices.forEach(invoice => {
      sum = sum.plus(invoice.total)
    })
    return sum
  },
  GET_INVOICE_MONTHS: (state) => {
    let monthArray = []
    state.invoiceList.forEach(item => {
      if (!monthArray.includes(item.reference)) monthArray.push(item.reference)
    })
    
    const sortNumericDesc = function (a, b) {
      if (a < b) return 1
      if (a > b) return -1
      return 0
    }
    monthArray.sort(sortNumericDesc)
    let monthOptions = monthArray.map((reference) => {
      return {
        id: reference,
        title: getTitleForDateRef({ dateRef: reference }),
        dateRef: reference,
      }
    })
    return monthOptions
  },
  GET_MONTH_BILLING_DETAIL: (state, getters, rootState) => (selectedMonthBillingDetail) => {
    return selectedMonthBillingDetail.map(invoice => {
      invoice.startDate = Date.parse(invoice.start_date)
      invoice.endDate = Date.parse(invoice.end_date)
      delete invoice.end_date
      delete invoice.start_date

      let contract = { ...invoice.contract }
      contract.start = Date.parse(contract.start)
      contract.end = contract.end ? Date.parse(contract.end) : null

      contract.isActive = contract.end > Date.now() || contract.end === null

      let newItems = invoice.items.map(item => {
        let newItem = {
          ...item,
          variableValue: item.variable_value,
          fixedValue: item.fixed_value,
          type: rootState.occurrences.occurrenceTypes[item.type]
        }
        delete newItem.fixed_value
        delete newItem.variable_value
        return newItem
      })
      return { ...invoice, items: newItems, contract }
    })
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_TOTAL_SIGNS (state, payload) {
    let sum = 0
    if (!payload) return state.totalSigns = 0
    payload.forEach(item => {
      item.signs.forEach(sign => {
        sum += sign.value
      })
    })
    state.totalSigns = sum
  },
  SET_INVOICE_LIST (state, payload) {
    state.invoiceList = payload
  },
  SET_SELECTED_BILLING_MONTH (state, payload) {
    state.selectedBillingMonth = payload
  }
}

const actions = {
  doResetState ({ commit }) {
    commit('resetState')
  },
  init ({ commit }) {
    commit('resetState')
  },
}

BILLING_SDK.forEach(item => {
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