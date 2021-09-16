export const state = {
  locale: 'pt-BR',
  locales: ['pt-BR', 'en-US'],
  flags: {
    'pt-BR': require('@/assets/images/flags/pt-BR.svg'),
    'en-US': require('@/assets/images/flags/en-US.svg')
  },
  // TODO: remove
  currency: 'R$'
}

export const getters = {
  getLocaleCurrency: (state) => (value, digits = 2) => {
    const minimumFractionDigits = digits
    const valueString = new Intl.NumberFormat(state.locale, { minimumFractionDigits }).format(value)
    const localizedString = `${state.currency} ${valueString}`
    return localizedString
  }
}
export const mutations = {
  SET_LOCALE (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
      window.localStorage.setItem('locale', locale)
    }
  }
}

export const actions = {
  init ({ commit }) {
    const locale = window.localStorage.getItem('locale')
    locale && commit('SET_LOCALE', locale)
  }
}
