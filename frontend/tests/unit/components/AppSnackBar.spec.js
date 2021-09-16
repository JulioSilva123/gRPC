import Vuex from "vuex"
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import AppSnackbar from '@/components/AppSnackbar.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

const store = new Vuex.Store({
  state: {
    ui: {
      snackbarPosition: 3,
      snackbarMessage: 'Copiado'
    }
  }
})

describe('AppSnackbar', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders correct text correctly on the snackbar', () => {
    const wrapper = shallowMount(AppSnackbar, {
      store, 
      localVue,
      vuetify
    })

    // see if the message renders
    expect(wrapper.find('#AppSnackbar').text()).toEqual('Copiado')

  })

  it("renders the snackbar on the correct position", () => {
    const localThis = { position: 3 }
    expect(AppSnackbar.computed.top.call(localThis)).toBeFalsy()
    expect(AppSnackbar.computed.bottom.call(localThis)).toBeTruthy()
    expect(AppSnackbar.computed.right.call(localThis)).toBeFalsy()
    expect(AppSnackbar.computed.left.call(localThis)).toBeTruthy()
  })
})