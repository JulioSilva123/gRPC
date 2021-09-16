import Vue from 'vue'
import { getMonthLastDay, getMonthFirstDay } from '../../plugins/globals.plugin'
const request = require('superagent')
const minLogLines = 50
const batchesPerRequest = 3
const getDefaultState = () => {
  return {
    dateRangeOption: {
      id: 'this_month',
      title: 'this_month',
      range: {
        start: getMonthFirstDay(),
        end: getMonthLastDay()
      }
    },
    startDate: getMonthFirstDay(),
    endDate: getMonthLastDay(),
    certsUsageList: [],
  }
}
 const getPromiseForLogDetail = ({ reportItem, logIds }) => {
  const url = getUsageDetailUrl(reportItem, logIds)
  return new Promise((resolve, reject) => {
    let headers = { Authorization: `${sessionStorage.getItem('authToken')}` }
    request
      .get(url)
      .set(headers)
      .end(async (err, res) => {
        if (err) return reject(err)
        else return resolve(res)
      })
  })
}
const getLogIdsForCertUsageItem = ({ state, index, lineAmount }) => {
  const slice = state.certsUsageList[index].unloadedBatches.slice(lineAmount * (-1))

  const len = state.certsUsageList[index].unloadedBatches.length - slice.length
  const remaining = state.certsUsageList[index].unloadedBatches.slice(0, len)
  state.certsUsageList[index].unloadedBatches
  return { slice, remaining }
}
const getUsageDetailUrl = (reportItem, logIds) => {
  let url = process.env.VUE_APP_API_BASE + `/billing/logdetails`
  let queryData = {}
  let queryParams = []
  if (reportItem.md) queryData.md = reportItem.md
  if (logIds) queryData.logs = logIds

  Object.entries(queryData).forEach(([key, prop]) => {
    let paramValue = prop.toString()
    queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
  })
  const paramUrlSlice = queryParams.join('&')
  if (paramUrlSlice) {
    url += `?${paramUrlSlice}`
  }
  return url
}
const formatLogLine = (certsUsageDetail, rootState) => {
  let logEvents = []
  const occurrenceTypes = rootState.occurrences.occurrenceTypes
  Object.entries(certsUsageDetail).forEach(([key, prop]) => {
    prop.forEach(item => {
      let occurrenceType = occurrenceTypes[item.Evt]
      const hsm =  rootState.hsm.hsmList.find(hsm => hsm.id === key)
      let hsmName = hsm ? hsm.name : null

      const utcOffset = new Date().getTimezoneOffset() * 60000
      const parsedDate = Date.parse(item.Ldt) - utcOffset
      
      const detailItem = {
        usedBy: item.Usr,
        usedAt: parsedDate,
        keyName: item.Obj,
        eventType: occurrenceType.toUpperCase(),
        hsmId: key,
        hsmName,
        index: logEvents.length
      }
      logEvents.push(detailItem)
    })
  })
  return logEvents
}
const getFormattedLogLines = ({ state, rootState, certsUsageDetail, index }) => {
  let usageListAux = state.certsUsageList.slice()
  let logEvents = usageListAux[index].logEvents ? usageListAux[index].logEvents.slice() : []
  logEvents.push(...formatLogLine(certsUsageDetail, rootState))
  logEvents.sort((a, b) => a.usedAt - b.usedAt)

  return logEvents
}

const state = {
  dateRangeOption: null,
  startDate: null,
  endDate: null,
  certsUsageList: [],
}

const getters = {
  GET_CERT_USAGE_LIST: (state) => {
    return state.certsUsageList
  },
  getMinLogLines: () => {
    return minLogLines
  },
  getDateRangeOptions: () => {
    let today = new Date()

    let monthBack = new Date()
    monthBack.setMonth(monthBack.getMonth() - 1)

    let weekBack = new Date()
    weekBack.setDate(weekBack.getDate() - 7)

    let sixtyDaysBack = new Date()
    sixtyDaysBack.setDate(weekBack.getDate() - 60)

    let ninetyDaysBack = new Date()
    ninetyDaysBack.setDate(weekBack.getDate() - 90)

    return [
      {
        id: 'this_month',
        title: 'this_month',
        range: {
          start: getMonthFirstDay(),
          end: getMonthLastDay()
        }
      },
      {
        id: 'last_month',
        title: 'last_month',
        range: {
          start: getMonthFirstDay(monthBack),
          end: getMonthLastDay({ aDate: monthBack })
        }
      },
      {
        id: 'last_7_days',
        title: 'last_7_days',
        range: {
          start: weekBack,
          end: today
        }
      },
      {
        id: 'more_options',
        title: 'more_options',
        children: [
          {
            id: 'last_60_days',
            title: 'last_60_days',
            range: {
              start: sixtyDaysBack,
              end: today
            }
          },
          {
            id: 'last_90_days',
            title: 'last_90_days',
            range: {
              start: ninetyDaysBack,
              end: today
            }
          }
        ]
      },
      {
        id: 'custom',
        title: 'custom',
        action: true
      }
    ]
  },
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_RANGE_OPTION (state, payload) {
    state.dateRangeOption = payload
  },
  SET_START_DATE (state, payload) {
    state.startDate = payload
  },
  SET_END_DATE (state, payload) {
    state.endDate = payload
  },
  SET_CERTS_USAGE (state, payload) {
    state.certsUsageList = payload
  },
  ADD_CERT_USAGE_ITEM_PROP_REACTIVELY (state, { index, props }) {
    for (const [key, value] of Object.entries(props)) {
      // state.certsUsageList[index][key] = value
      Vue.set(state.certsUsageList[index], key, value)
    }
  }
}

const actions = {
  init ({ commit }) {
    commit('resetState')
  },
  doResetState ({ commit }) {
    commit('resetState')
  },
  setDateOption ({ commit }, option) {
    return new Promise((resolve) => {
      commit('SET_RANGE_OPTION', option)
      return resolve()
    })
  },
  setDateRange ({ commit }, { startDate, endDate }) {
    return new Promise((resolve) => {
      commit('SET_START_DATE', startDate)
      commit('SET_END_DATE', endDate)
      return resolve()
    })
  },
  // Get possible occurrences for each cert, without any usage detail
  getBriefCertsUsage ({ dispatch, commit }, { startDate, endDate }) {
    let url = process.env.VUE_APP_API_BASE + '/billing/ocurrencebycertificate'
    let queryData = {}
    let queryParams = []
    if (startDate) queryData.start = startDate
    if (endDate) queryData.end = endDate
    Object.entries(queryData).forEach(([key, prop]) => {
      queryParams.push(`${key}=${prop}`)
    })
    const paramUrlSlice = queryParams.join('&')
    if (paramUrlSlice) {
      url += `?${paramUrlSlice}`
    }
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
            // CERTS USAGE DATA
            let certsUsageResult = JSON.parse(res.text)
            if (!certsUsageResult) {
              commit('SET_CERTS_USAGE', [])
              return resolve()
            }

            // Aggregate total and cert info
            certsUsageResult = certsUsageResult.map(item => {
              let usageSum = 0
              item.occurrencies.forEach(item => {
                usageSum += item.value
              })

              return {
                md: item.md,
                occurrencies: item.occurrencies,
                subjectName: item.sn || '',
                certId: item.certid,
                notAfter: Date.parse(item.notAfter),
                usageSum
              }
            })

            // Sort usage items by subjectName
            certsUsageResult.sort(function(a, b) {
              const dif = a.subjectName.localeCompare(b.subjectName)
              return dif
            })

            commit('SET_CERTS_USAGE', certsUsageResult)
            resolve(certsUsageResult)
          }
        })
    })
  },
  getInitialCertUsageDetail ({ dispatch, commit }, { reportItem, index }) {
    const allLogIds = reportItem.occurrencies.map(item => item.logid)
    allLogIds.reverse()

    commit('ADD_CERT_USAGE_ITEM_PROP_REACTIVELY', { index, props: { unloadedBatches: allLogIds }})
    return dispatch('getMoreCertUsageDetail', { reportItem, index })
  },
  getMoreCertUsageDetail ({ state, dispatch, commit, rootState }, { reportItem, index }) {
    const { slice, remaining } = getLogIdsForCertUsageItem({ state, index, lineAmount: batchesPerRequest })
    return dispatch('getCertUsageDetail', { reportItem, index, logIds: slice })
      .then((certsUsageDetail) => {
        // Remove successfully loaded batches from unloadedBatches prop
        commit('ADD_CERT_USAGE_ITEM_PROP_REACTIVELY', { index, props: { unloadedBatches: remaining }})

        // insert new logLines
        const updatedLogLines = getFormattedLogLines({ state, rootState, certsUsageDetail, index })
        commit('ADD_CERT_USAGE_ITEM_PROP_REACTIVELY', { index, props: { logEvents: updatedLogLines } })
      })
  },
  getCertUsageDetail ({ dispatch }, { reportItem, logIds }) {
    return new Promise((resolve, reject) => {
      return getPromiseForLogDetail({ reportItem, logIds })
        .then(res => {
          resolve(JSON.parse(res.text).Hsm)
        })
        .catch(err => {
          dispatch('error/setError', { err }, { root: true }).then((error) => {
            reject(error)
          })
        })
    })
  }
}

export { state, getters, mutations, actions }