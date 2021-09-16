const getDefaultState = () => {
  return {
    logOccReq: null,
    counter: 0,
    occLogs: []
  }
}

const state = {
  logOccReq: null,
  counter: 0,
  occLogs: []
}

const getters = {
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  PUSH_TO_OCC_LOGS (state, payload = null) {
    const maxTicks = 20
    if (state.occLogs.length === maxTicks) {
      state.occLogs.pop()
    }
    const occLogItem = {
      time: Date.now(),
      data: payload
    }
    state.occLogs.unshift(occLogItem)
  },
  SET_OCC_LOG_REQ (state, payload = null) {
    state.logOccReq = payload
  },
  RESET_OCC_LOGS (state) {
    state.occLogs = []
    state.counter = 0
  },
  RESET_OCC_REQ (state) {
    state.logOccReq = null
  },
}

const actions = {
  // USED FOR TESTING: 
  // stopOcc ({ state, commit }) {
  //   clearInterval(state.logOccReq)
  //   commit('RESET_OCC_REQ')    
  // },
  // startOcc ({ commit }, { time = 1000 }) {
  //   commit('RESET_OCC_LOGS')
  //   function getRandomInt(max) {
  //     return Math.floor(Math.random() * max);
  //   }
  //   const timer = setInterval(() => {
  //     const data = [
  //       { T: 1, C: getRandomInt(100) },
  //       { T: 2, C: getRandomInt(100) },
  //       { T: 3, C: getRandomInt(100) },
  //       { T: 20, C: getRandomInt(100) },
  //       { T: 21, C: getRandomInt(100) }
  //     ]
  //     commit('PUSH_TO_OCC_LOGS', data)

  //   }, time)
  //   commit('SET_OCC_LOG_REQ', timer)
  // },
  stopOcc ({ state, commit }) {
    if (state.logOccReq !== null) {
      try {
        state.logOccReq.close()
        commit('RESET_OCC_REQ')
      } catch (e) {
        console.log('error on stop occ')
      }
    }
  },
  startOcc ({ state, commit, dispatch, rootState }) {
    const url = process.env.VUE_APP_API_WSS + '/hsm'
    const socket = new WebSocket(url);
    socket.binaryType = "arraybuffer"
    commit('SET_OCC_LOG_REQ', socket)
    commit('RESET_OCC_LOGS')

    socket.addEventListener('open', function () {
      const body = { type: 'o', id: rootState.account.id }
      const firstMessage = JSON.stringify(body)
      socket.send(firstMessage)
    })

    socket.addEventListener('message', function (event) {
      const timeout = 3000
      try {
        const textData = Buffer.from(event.data).toString()
        const data = JSON.parse(textData)
        commit('INC_COUNTER')
        commit('PUSH_TO_OCC_LOGS', data)

        // Start timer
        setTimeout((lastCounter) => {
          if (lastCounter === state.counter) commit('PUSH_TO_OCC_LOGS', [])
        }, timeout, state.counter)
      } catch (e) {
        console.log(e)
      }
    })

    socket.addEventListener('close', function () {
      console.log('close occ')
      dispatch('stopOcc')
    });
  },
  doResetState ({ commit }) {
    commit('resetState')
  }
}

export { state, getters, mutations, actions }
