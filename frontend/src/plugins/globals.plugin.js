import Vue from 'vue'
import {
  getTime,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears
} from 'date-fns'
import i18n from './i18n.plugin'
import Vuetify from './vuetify.plugin'
/**
 * Global Variables
 */
export const PK_TOUCH_OC_TYPE             = 1
export const RSA_TOUCH_OC_TYPE            = 2
export const ECC_TOUCH_OC_TYPE            = 3
export const ECX_TOUCH_OC_TYPE            = 4
export const XML_SIGN_OC_TYPE             = 5
export const XML_VERIFY_OC_TYPE           = 6
export const PIX_SIGN_OC_TYPE             = 7
export const PIX_VERIFY_OC_TYPE           = 8
export const PIX_DICT_SIGN_OC_TYPE        = 9
export const PIX_DICT_VERIFY_OC_TYPE      = 10
export const PIX_JWS_GEN_OC_TYPE          = 11
export const PIX_JWS_CHECK_OC_TYPE        = 12
export const P10_SIGN_OC_TYPE             = 13
export const SPB_ENCODE_OC_TYPE           = 14
export const SPB_DECODE_OC_TYPE           = 15
export const ANY_SPB_ENCODE_OC_TYPE       = 16
export const ANY_SPB_DECODE_OC_TYP        = 17
export const CIP1_ENCODE_OC_TYPE          = 18
export const CIP1_DECODE_OC_TYPE          = 19
export const SVAULT_TOKEN_OC_TYPE         = 20
export const SVAULT_SECRET_OC_TYPE        = 21
export const SMS_TRACKS_SECRET_OC_TYPE    = 22
export const WA_TRACKS_SECRET_OC_TYPE     = 23
export const EMAIL_TRACK_SECRET_OC_TYPE   = 24

export const CRIPT_OFFER                  = 1
export const ARQ_SEGURO_OFFER             = 2
export const CARTAO_EFT_OFFER             = 3
export const ALERT_SMS_OFFER              = 4
export const ALERT_EMAIL_OFFER            = 5
export const ALERT_WA_OFFER               = 6
export const PIX_OFFER                    = 7
export const XML_OFFER                    = 8
export const SPB_OFFER                    = 9
export const LGPD_OFFER                   = 10

export const occurToOfferMap = {
  [CRIPT_OFFER]: PK_TOUCH_OC_TYPE,
  [ARQ_SEGURO_OFFER]: null,
  [CARTAO_EFT_OFFER]: null,
  [ALERT_SMS_OFFER]: SMS_TRACKS_SECRET_OC_TYPE,
  [ALERT_EMAIL_OFFER]: EMAIL_TRACK_SECRET_OC_TYPE,
  [ALERT_WA_OFFER]: WA_TRACKS_SECRET_OC_TYPE,
  [PIX_OFFER]: PIX_SIGN_OC_TYPE,
  [XML_OFFER]: XML_SIGN_OC_TYPE,
  [SPB_OFFER]: SPB_ENCODE_OC_TYPE,
  [LGPD_OFFER]: SVAULT_TOKEN_OC_TYPE
}

export const getOccColorHex = (occurrenceTypeId) => {
  const colors = Vuetify.framework.theme.themes[Vuetify.framework.theme.dark ? 'dark' : 'light']
  const occurColor = colors[`occur_${occurrenceTypeId}`]
  return occurColor ? occurColor : colors['other']
  
}

// The gui-id is used to reference the offer without using their guid nor name
// The argument is the id of the first occurrence type listed on offer.items
// E.g: Criptografia offer has the occurrence type 1, and LPPD offer has the 20
const findGuiId = (offerFirstOcc) => {
  const entry = Object.entries(occurToOfferMap).find((entry) => entry[1] === offerFirstOcc)
  return entry[0]
}

export const getOfferColorName = (offerFirstOcc) => {
  const guiId = findGuiId(offerFirstOcc)
  const colorName = `offer_${guiId}`
  return colorName ? colorName : 'other'
}

// Sort resources that have the 'created' prop
// ISO String dates and Numeric unix dates are valid
export const dateSort = (a, b) =>  (a.created > b.created) ? 1 : ((b.created > a.created) ? -1 : 0)
Vue.prototype.$dateSort = dateSort
/**
 * Global Functions
 */

// Receives a string representing a month period, e.g, "202105"
// Returns 'month'-'year', e.g, 05-2021
export const getTitleForDateRef = ({ dateRef }) => {
  const year = dateRef.slice(0, 4)
  const month = dateRef.slice(4)
  return `${month}-${year}`
  // const locale = i18n.locale === 'pt-BR' ? pt : en
  // return format(new Date(year, parseInt(month) - 1, 0), 'LLLL', { locale  })
}
Vue.prototype.$getTitleForDateRef = getTitleForDateRef


// https://stackoverflow.com/questions/222309/calculate-last-day-of-month-in-javascript
export const getMonthLastDay = ({ isoDateString, aDate } = { isoDateString: null, aDate: null }) => {
  let dateObj
  if (isoDateString) {
    const [year, month] = isoDateString.split('-')
    dateObj = new Date(year, month, 0)
  } else if (aDate) {
    dateObj = aDate
  }
  else dateObj = new Date()
  return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0)
}
Vue.prototype.$getMonthLastDay = getMonthLastDay

export const getMonthFirstDay = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
Vue.prototype.$getMonthFirstDay = getMonthFirstDay

export const getSafe = (fn, defaultVal) => {
  try {
    return fn()
  } catch (e) {
    return defaultVal
  }
}
Vue.prototype.$getSafe = getSafe

export const getElapsedTimeString = ({ dateValue }) => {
  const date = new Date(dateValue)
  const elapsed = getElapsedTime({ date })
  if (elapsed.unit === 'second') {
    return i18n.t('just_now')
  }
  return `${Math.floor(elapsed.value)} ${i18n.tc(elapsed.unit, Math.floor(elapsed.value))} ${i18n.t('time_ago')}`

}
Vue.prototype.$getElapsedTimeString = getElapsedTimeString

export const getElapsedTime = ({ date, dateBase }) => {
  const yearSeconds = 3600 * 24 * 30 * 12
  const monthSeconds = 3600 * 24 * 30
  const daySeconds = 3600 * 24

  let base
  if (!dateBase) base = new Date()
  else base = dateBase

  const secondsDiff = (base.getTime() - date.getTime()) /1000
  if (secondsDiff >= yearSeconds) {
    return { unit: 'year', value: differenceInYears(base, date) }
  }
  else if (secondsDiff >= monthSeconds) {
    return { unit: 'month', value: differenceInMonths(base, date) }
  }
  else if (secondsDiff >= daySeconds) {
    return { unit: 'day', value: differenceInDays(base, date) }
  }
  else if (secondsDiff >= 3600) {
    return { unit: 'hour', value: differenceInHours(base, date) }
  }
  else if (secondsDiff >= 60) {
    return { unit: 'minute', value: differenceInMinutes(base, date) }
  } else return { unit: 'second', value: secondsDiff }
}
Vue.prototype.$getElapsedTime = getElapsedTime

export const getDateString = ({ date, needOffset = false, timeDetailLevel = 1 }) => {
  if (!date) return date
  date = getTime(date)

  if (date.toString().length < 13) {
    date = date * 1000
  }

  if (needOffset) {
    const utcOffset = new Date().getTimezoneOffset() * 60000
    date = date - utcOffset
  }
  // if (showTime) return format(date, 'YYYY-MM-DD')
  // return format(date, 'YYYY-MM-DD HH:mm:ss [GMT]Z')
  switch (timeDetailLevel) {
    case 0:
      return i18n.d(date, 'date')
    case 1:
      return i18n.d(date, 'minute')
    case 2:
      return i18n.d(date, 'second')
    default:
      return i18n.d(date, 'date')
  }
}
Vue.prototype.$getDateString = getDateString

export const getUnixDateMs = ({ date }) => {
  return getTime(date)
}
Vue.prototype.$getUnixDateMs = getUnixDateMs

export const validCPF = (strCPF) => {
  // https://www.devmedia.com.br/validar-cpf-com-javascript/23916
  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF == null ||
      strCPF == "00000000000" ||
      strCPF == "11111111111" ||
      strCPF == "22222222222" ||
      strCPF == "33333333333" ||
      strCPF == "44444444444" ||
      strCPF == "55555555555" ||
      strCPF == "66666666666" ||
      strCPF == "55555555555" ||
      strCPF == "66666666666" ||
      strCPF == "77777777777" ||
      strCPF == "88888888888" ||
      strCPF == "99999999999" ||
      strCPF.length !== 11
    ) {
        return false
  }
  for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i)
  Resto = (Soma * 10) % 11

  if ((Resto == 10) || (Resto == 11))  Resto = 0
  if (Resto != parseInt(strCPF.substring(9, 10)) ) return false

  Soma = 0;
  for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
  Resto = (Soma * 10) % 11

  if ((Resto == 10) || (Resto == 11))  Resto = 0
  if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false
  return true
}

export const validCNPJ = (strCNPJ) => {
  if (!strCNPJ || strCNPJ.length < 14) return false
  // Guarda um array com todos os dígitos do valor
  const match = strCNPJ.match(/\d/g)
  const numbers = Array.isArray(match) ? match.map(Number) : []

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false
  
  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  // Cálculo validador
  const calc = (x) => {
    const slice = numbers.slice(0, x)
    let factor = x - 7
    let sum = 0

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i]
      sum += n * factor--
      if (factor < 2) factor = 9
    }

    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12)
  
  // Valida 1o. dígito verificador
  const digit0 = calc(12)
  if (digit0 !== digits[0]) return false

  // Valida 2o. dígito verificador
  const digit1 = calc(13)
  return digit1 === digits[1]
}

export const hexDump = (buffer) => {
  const length = buffer.byteLength
  const my = new Uint8Array(buffer)
  var hex = ''
  for (var i = 0; i < length; i++) {
    let byteHexString = my[i].toString(16)
    if (byteHexString.length < 2) byteHexString = '0' + byteHexString
    hex += byteHexString
  }
  return hex
}

export const covertToCamelCase = (string) => {
  // convert string to words
  const toWords = (input) => {
    const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
    return input.match(regex);
  }

  // convert the input array to camel case
  function toCamelCase(inputArray) {

  let result = ""
  for(let i = 0 , len = inputArray.length; i < len; i++) {
    let currentStr = inputArray[i]
    let tempStr = currentStr.toLowerCase()
    if (i != 0) {
      // convert first letter to upper case (the word is in lowercase) 
      tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
    }    
    result +=tempStr;
  }

  return result;
  }

  return toCamelCase(toWords(string))
}

export const getResourceIcon = (type) => {
  switch (type) {
    case 'x509':
      return 'card_membership'
    case 'key':
      return 'vpn_key'
    case 'secret':
      return 'mdi-cloud-lock-outline'
    default:
      return 'ufo'
  }
}
Vue.prototype.$getResourceIcon = getResourceIcon

// Used do indicate the critical level of the expiration date from 
// a certificate
export const getLabelDecorationForExpiration = (date) => {
  const daysEllapsed = differenceInDays(date, new Date())
  if (daysEllapsed < 0) return { condition: 'red', expired: true }
  else if (daysEllapsed < 30) return { condition: 'red' }
  else if (daysEllapsed < 45) return { condition: 'orange' }
  else if (daysEllapsed < 60) return { condition: 'blue' }
  else return null
}