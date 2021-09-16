import {
  getMonthLastDay,
  getMonthFirstDay,
  getOccColorHex,
  getOfferColorName,
  occurToOfferMap,
  CRIPT_OFFER,
  PIX_OFFER,
  LGPD_OFFER,
  ALERT_SMS_OFFER,
  ALERT_EMAIL_OFFER,
  ALERT_WA_OFFER
} from '@/plugins/globals.plugin'
import Vuetify from '@/plugins/vuetify.plugin'

const getDefaultState = () => {
  return {
    dayChartScale: 'linear',
    chartsDateRangeOption: {
      id: 'this_month',
      title: 'this_month',
      range: {
        start: getMonthFirstDay(),
        end: getMonthLastDay()
      }
    },
    chartsStartDate: getMonthFirstDay(),
    chartsEndDate: getMonthLastDay(),
  }
}

const state = {
  dayChartScale: 'linear',
  chartsDateRangeOption: null,
  chartsStartDate: null,
  chartsEndDate: null,
}

const getters = {
  GET_ACT_CHARTABLE_OCCURS: () => (offersList) => {
    // Defines the custom order
    const offerResolution = [
      occurToOfferMap[CRIPT_OFFER],
      occurToOfferMap[PIX_OFFER],
      occurToOfferMap[LGPD_OFFER],
      occurToOfferMap[ALERT_SMS_OFFER],
      occurToOfferMap[ALERT_EMAIL_OFFER],
      occurToOfferMap[ALERT_WA_OFFER],
    ]
    let customOrderOffers = []
    for (const prop of offerResolution) {
      for (const offer of offersList) {
        if (offer.items.includes(prop)) {
          customOrderOffers.push(offer)
          break
        }
      }
    }
    const contractedOccurs = customOrderOffers.map(offer => {
      return offer.items
    })
    return contractedOccurs.flat()
  },
  GET_OCC_WORK_LOAD_CHART_DATA: (state, getters, rootState) => (actChartableOccurs) => {
    if (!rootState.liveOccur.occLogs.length) return []
    // The most recent message
    const currentLog = rootState.liveOccur.occLogs[0]
    
    return actChartableOccurs.map(occType => {
      const occLogItem = currentLog.data.find(item => item.T === occType)
      if (occLogItem) return occLogItem.C
      else return 0
    })
  },
  GET_OCCUR_TYPE_TIME_SERIE_DATA: (state, getters, rootState) => (occType) => {
    if (!rootState.liveOccur.occLogs.length) return []
    const data = rootState.liveOccur.occLogs.map(item => {
      const occLogItem = item.data.find(item => item.T === occType)
      if (occLogItem) return { x: item.time, y: occLogItem.C }
      else return { x: item.time, y: 0 }
    })
    return data
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

  GET_DAYLY_CHART_DATASETS: (state, getters, rootState) => {
    let datasets = {}

    const addSignToDataset = (hsmId, date, value) => {
      const parsedDate = Date.parse(date)
      const computedDayIndex = datasets[hsmId].data.findIndex(item => item.x === parsedDate)
      if (computedDayIndex >= 0) {
        const oldValue = datasets[hsmId].data[computedDayIndex].y
        const data = { x: parsedDate, y: oldValue + value }
        datasets[hsmId].data[computedDayIndex] = data
      } else {
        const data = { x: parsedDate, y: value }
        datasets[hsmId].data.push(data)
      }
    }
    rootState.billing.signsByDay.forEach(item => {
      item.signs.forEach(sign => {
        const hsmIdKey = (!sign.isLan && sign.hsmId !== '') ? 'HSM DS' : sign.hsmId
        if (!Object.prototype.hasOwnProperty.call(datasets, hsmIdKey)) {
          datasets[hsmIdKey] = {
            data: [],
            isLan: sign.isLan
          }
        }
        // To remove sign where value === 0 and other have been added
        if (item.signs.length > 1 && sign.value === 0) return
        addSignToDataset(hsmIdKey, item.date, sign.value)
      })
    })
    return datasets
  },
  GET_OCCUR_TYPE_BY_OFFER: (state, getters, rootState) => {
    const occurrenceTypes = rootState.occurrences.occurrenceTypes
    
    const occurInfo = rootState.billing.signsByType.map((item) => {
      let typeSum = 0

      item.signs.forEach(sign => {
        typeSum += sign.value
      })
      const occurId = parseInt(item.id)
      return {
        id: occurId,
        name: occurrenceTypes[occurId] ? occurrenceTypes[occurId] : item.name,
        color: getOccColorHex(occurId),
        value: typeSum
      }
    })

    let billableOffers = []
    rootState.offers.offersList.forEach(offer => {
      const freeOffers = process.env.VUE_APP_FREE_OFFERS.split(',')
      if (!offer.items.length || freeOffers.includes(offer.id)) return

      const colors = Vuetify.framework.theme.themes[Vuetify.framework.theme.dark ? 'dark' : 'light']
      const offerColorHex = colors[getOfferColorName(offer.items[0].type_id)]

      const offerOccursInfoArray = offer.items.map(occurType => {
        const info = occurInfo.find(singleOccurInfo => singleOccurInfo.id === occurType.type_id)

        if (info) return info
        else {
          // This means that there is an occurType that comes the signsByType endpoint
          // but doest belong to any offer
          console.log('an occurrence type has been used but has no offer associated currently')
        }
      })
      
      let offerTotal = 0
      offerOccursInfoArray.forEach(occur => {
        offerTotal += occur.value
      })
      billableOffers.push({
        ...offer,
        color: offerColorHex,
        items: offerOccursInfoArray,
        total: offerTotal
      })
      billableOffers.sort(function(a, b) {
        return a.alias.localeCompare(b.alias)
      })
    })
    return billableOffers
  },
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  TOGGLE_DAY_CHART_SCALE (state) {
    if (state.dayChartScale === 'linear') {
      state.dayChartScale = 'logarithmic'
    } else state.dayChartScale = 'linear'
  },
  SET_CHARTS_RANGE_OPTION (state, payload) {
    if (payload) state.chartsDateRangeOption = payload
    else {
      const rangeDefaultOption = {
        id: 'this_month',
        title: 'this_month',
        range: {
          start: getMonthFirstDay(),
          end: getMonthLastDay()
        }
      }
      state.chartsDateRangeOption = rangeDefaultOption
    }
  },
  SET_CHARTS_START_DATE (state, payload) {
    if (payload) state.chartsStartDate = payload
    else {
      state.chartsStartDate = getMonthFirstDay()
    }
  },
  SET_CHARTS_END_DATE (state, payload) {
    if (payload) state.chartsEndDate = payload
    else {
      state.chartsEndDate = getMonthLastDay()
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
  setChartsDateOption ({ commit }, option) {
    commit('SET_CHARTS_RANGE_OPTION', option)
  },
  setChartsDateRangeAndUpdate ({ dispatch, commit }, { startDate, endDate }) {
    commit('SET_CHARTS_START_DATE', startDate)
    commit('SET_CHARTS_END_DATE', endDate)

    const startIsoString = startDate.toISOString().substr(0, 10)
    const endIsoString = endDate.toISOString().substr(0, 10)
    dispatch('billing/doGetSignsByDay', { startDate: startIsoString, endDate: endIsoString }, { root: true })
    dispatch('billing/doGetSignsByType', { startDate: startIsoString, endDate: endIsoString }, { root: true })
  }
}

export { state, getters, mutations, actions }