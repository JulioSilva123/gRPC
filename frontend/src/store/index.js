import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import LogRocket from 'logrocket';
import createPlugin from 'logrocket-vuex';

Vue.use(Vuex)
const logrocketPlugin = createPlugin(LogRocket, function(mutation) {
  const ignoredMutations = [
    'auth/SET_PASSWORD'
  ]
  if (ignoredMutations.includes(mutation.type)) {
    return null
  }
  return mutation
})
const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [logrocketPlugin]
})

// Automatically run the `init` action for every module,
// if one exists.
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions && modules[moduleName].actions.init) {
    store.dispatch(`${moduleName}/init`)
  }
}

export default store
