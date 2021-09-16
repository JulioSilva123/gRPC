import Vue from 'vue'
import i18n from './i18n.plugin'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import 'vue-snotify/styles/material.css'

const options = {
  toast: {
    position: SnotifyPosition.rightTop,
    titleMaxLength: 100,
    bodyMaxLength: 100
  }
}

Vue.use(Snotify, options)
const s = new Vue()

/**
 * How to use ?
 *
 * Ex: this.$notify.success({}) // Default params
 * Ex: this.$notify.success({title: "hi", message: "hi again"})
 */
export const success = function ({ title, message }) {
  message = message || i18n.t('success')

  s.$snotify.success(message, title, {
    timeout: 2000,
    showProgressBar: false,
    maxOnScreen: 1
  })
}

/**
 * How to use ?
 *
 * Ex: this.notifyError({title: "hi", message: "hi again"})
 *
 * Ex: // Using callback
 * this.notifyError({title: "hi", message: "hi again"}, function () {
 *    // calback is called when user confirms
 *    console.log("callback called!")
 * })
 */
export const error = function ({ title, message }) {
  title = title || ''
  s.$snotify.error(message, title, {
    timeout: 5000,
    showProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    icon: false,
  })
}

export const info = function ({title, message}) {
  s.$snotify.info(message, title, {
    timeout: 2000,
    showProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    icon: false
  })
}

/**
 * How to use ?
 *
 * Ex: this.notifyConfirm({title: "hi", message: "hi again"})
 *
 * Ex: // Using callback
 * this.notifyConfirm({title: "hi", message: "hi again"}, function () {
 *    // calback is called when user confirms
 *    console.log("callback called!")
 * })
 */
export const confirm = function ({ title, message }, cb) {
  s.$snotify.warning(message, title, {
    closeOnClick: false,
    showProgressBar: false,
    timeout: 60000,
    // backdrop: 0.5,
    position: 'centerCenter',
    buttons: [
      {
        text: i18n.t('confirm'),
        action: (toast) => {
          cb()
          s.$snotify.remove(toast.id)
        }
      },
      {
        text: i18n.t('cancel'),
        action: (toast) => {
          s.$snotify.remove(toast.id)
        }
      }
    ]
  })
}

Vue.prototype.$notify = {
  success,
  error,
  info,
  confirm
}
