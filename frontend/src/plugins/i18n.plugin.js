import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.yml$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default new VueI18n({
  locale:
    localStorage.getItem('locale') ||
    process.env.VUE_APP_I18N_LOCALE ||
    'pt-BR',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'pt-BR',
  messages: loadLocaleMessages(),
  dateTimeFormats: {
    'en-US': {
      date: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      minute: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
      second: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
    },
    'pt-BR': {
      date: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      minute: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
      second: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
    }
  },
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'BRL'
      }
    },
    'pt-BR': {
      currency: {
        style: 'currency',
        currency: 'BRL',
      }
    }
  },
})
