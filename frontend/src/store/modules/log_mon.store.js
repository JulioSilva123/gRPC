import i18n from '../../plugins/i18n.plugin'
const zlib = require("zlib")
const { promisify } = require("util");
const inflate = promisify(zlib.inflate)

const getDefaultState = () => {
  return {
    logs: [],
    logMonReq: null,
    counter: 0,
    channel: null,
  }
}

const state = {
  logs: [],
  logMonReq: null,
  counter: 0,
  channel: null,
}

const getters = {
  channelOptions: (state, getters, rootState) => {
    let options = []
    options.push({
      text: [i18n.t('all_hsms')],
      value: {
        type: 'act',
        id: rootState.account.id
      }
    })
    rootState.hsm.hsmList.forEach((item) => {
      options.push({
        text: [item.name, item.id],
        value: {
          type: 'hsm',
          id: item.id
        }
      })
    })
    return options
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  SET_CHANNEL (state, payload = null) {
    state.channel = payload
  },
  PUSH_TO_LOG (state, payload = null) {    
    state.logs = Object.freeze([...payload.reverse(), ...state.logs]);
    const maxLines = 5000
    if (state.logs.length > maxLines) {
      const upperLimit = state.logs.length - maxLines
      state.logs = state.logs.slice(0, -upperLimit)
    }
  },
  SET_LOG_MON_REQ (state, payload = null) {
    state.logMonReq = payload
  },
  RESET_LOGS (state) {
    state.logs = []
    state.counter = 0
  },
  INC_COUNTER (state) {
    state.counter++
  },
}

const actions = {
  // USED FOR TESTING: 
  // start ({ state, commit }) {
    
  //   const time = 1000
  //   const timer = setInterval(() => {
  //     const newLinesArray = [
  //       'master called IP filter [21:0.0.0.0], c: 38|189.6.14.197 10.61.53.63:443 master'
  //     ]
  //     const newLines = newLinesArray.map((line) => {
  //       commit('INC_COUNTER')
  //       return { id: state.counter, content: line }
  //     })
  //     commit('PUSH_TO_LOG', newLines)

  //   }, time)
  //   commit('SET_LOG_MON_REQ', timer)
  //   console.log(state.logs)
  // },
  // pause ({ state, commit }) {
  //   console.log('PARE')
  //   clearInterval(state.logMonReq)
  //   commit('SET_LOG_MON_REQ', null)
  // },
  reload ({ commit}) {
    commit('RESET_LOGS')
  },
  start ({ state, dispatch, commit }) {
    if (!state.channel) return
    const url = process.env.VUE_APP_API_WSS + '/hsm'
    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer"
    commit('SET_LOG_MON_REQ', socket)

    socket.addEventListener('open', function () {
      // TODO add authToken to message
      // const authToken = sessionStorage.getItem('authToken')
      const body = { ...state.channel }
      const firstMessage = JSON.stringify(body)
      socket.send(firstMessage)
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      try {
        const buff = Buffer.from(event.data)
        inflate(buff).then((chunkBin) => {
          const chunkTxt = chunkBin.toString()
          const newLinesArray = chunkTxt.split('\n')
          newLinesArray.pop()
          const newLines = newLinesArray.map((line) => {
            commit('INC_COUNTER')
            return { id: state.counter, content: line }
          })
          commit('PUSH_TO_LOG', newLines)
        })
      } catch (e) {
        console.log(e)
      }
    });

    socket.addEventListener('close', function () {
      console.log('close')
      dispatch('pause')
    });
  },
  pause ({ state, commit }) {
    if (state.logMonReq !== null) {
      try {
        state.logMonReq.close()
        commit('SET_LOG_MON_REQ', null)
      } catch (e) {
        console.log('error on pause')
      }
    }
  },
  doResetState ({ commit }) {
    commit('resetState')
  }
}

export { state, getters, mutations, actions }
