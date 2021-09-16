import Vue from 'vue';
import i18n from './i18n.plugin'
import Vuetify, { colors } from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

const opts = {
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        dinamo: '#C4A932',
        application: colors.blueGrey.lighten5,
        appTopBar: colors.blueGrey.darken3,
        primary: colors.blueGrey.darken3,
        secondary: colors.blueGrey.darken3,
        tertiary: colors.blueGrey.lighten3,
        error: colors.red.lighten1,
        //
        link: colors.blue.base,
        accentPositive: colors.green.base,
        accentNegative: colors.orange.darken1,
        lightRed: '#FDF3F2',
        darkRed: colors.red.darken4,
        soloTxtFldBg: '#F0F0F0',
        contrasty: '#e8eaed',

        hsm0_signatures: '#ffd54f',
        hsm1_signatures: '#ffb74d',
        hsm2_signatures: '#ff8a65',
        hsm3_signatures: '#81c784',
        hsm4_signatures: '#78909c',
        hsm5_signatures: '#1de9b6',

        // PIX_OFFER
        offer_7: colors.blue.accent1,
        occur_7: colors.purple.base,
        occur_8: colors.deepPurple.base,
        occur_9: colors.indigo.base,
        occur_10: colors.cyan.base,
        occur_11: colors.lightBlue.base,
        occur_12: colors.blue.base,
        
        // CRIPT_OFFER
        offer_1: colors.green.accent1,
        occur_1: colors.teal.base,
        occur_2: colors.lightGreen.base,
        occur_3: colors.green.base,
        occur_4: colors.lime.base,
        occur_13: colors.green.darken3,
        
        // LGPD_OFFER
        offer_10: colors.orange.accent1,
        occur_20: colors.orange.base,
        occur_21: colors.deepOrange.base,

        // XML_OFFER
        offer_8: colors.lime.accent1,
        occur_5: colors.yellow.base,
        occur_6: colors.amber.base,
        // CARTAO_EFT_OFFER
        offer_3: colors.brown.accent1,
        // ARQ_SEGURO_OFFER
        offer_2: colors.blue.accent1,
        
        // ALERT_WA_OFFER
        offer_6: colors.teal.accent1,
        occur_23: colors.teal.accent1,
        // ALERT_EMAIL_OFFER
        offer_5: colors.amber.accent1,
        occur_24: colors.amber.accent1,
        // ALERT_SMS_OFFER
        offer_4: colors.red.accent1,
        occur_22: colors.red.accent1,
        //
        other: '#e8c3b9',
        disk: colors.blue.base,
        page_title: '#354041',
        //new
        title_blue: '#00aeef',
        card_disabled: colors.grey.darken4,
        white_btn_hover: colors.grey.lighten2,
      },
      dark: {
        dinamo: '#C4A932',
        application: '#25292E',
        appTopBar: colors.blueGrey.darken3,
        primary: colors.blueGrey.lighten3,
        secondary: colors.blueGrey.lighten3,
        tertiary: colors.blueGrey.lighten3,
        error: colors.red.lighten2,
        //
        link: colors.blue.base,
        accentPositive: colors.green.darken3,
        accentNegative: colors.orange.darken4,
        lightRed: '#FDF3F2',
        darkRed: colors.red.darken4,
        soloTxtFldBg: '#424242',
        contrasty: '#FFFFFF',
        
        hsm0_signatures: '#ffd54f',
        hsm1_signatures: '#ffb74d',
        hsm2_signatures: '#ff8a65',
        hsm3_signatures: '#81c784',
        hsm4_signatures: '#78909c',
        hsm5_signatures: '#1de9b6',

        // PIX_OFFER
        offer_7: colors.blue.accent1,
        occur_7: colors.purple.base,
        occur_8: colors.deepPurple.base,
        occur_9: colors.indigo.base,
        occur_10: colors.cyan.base,
        occur_11: colors.lightBlue.base,
        occur_12: colors.blue.base,
        
        // CRIPT_OFFER
        offer_1: colors.green.accent1,
        occur_1: colors.teal.base,
        occur_2: colors.lightGreen.base,
        occur_3: colors.green.base,
        occur_4: colors.lime.base,
        occur_13: colors.green.darken3,
        
        // LGPD_OFFER
        offer_10: colors.orange.accent1,
        occur_20: colors.orange.base,
        occur_21: colors.deepOrange.base,

        // XML_OFFER
        offer_8: colors.lime.accent1,
        occur_5: colors.yellow.base,
        occur_6: colors.amber.base,
        // CARTAO_EFT_OFFER
        offer_3: colors.brown.accent1,
        // ARQ_SEGURO_OFFER
        offer_2: colors.blue.accent1,
        
        // ALERT_WA_OFFER
        offer_6: colors.teal.accent1,
        occur_23: colors.teal.accent1,
        // ALERT_EMAIL_OFFER
        offer_5: colors.amber.accent1,
        occur_24: colors.amber.accent1,
        // ALERT_SMS_OFFER
        offer_4: colors.red.accent1,
        occur_22: colors.red.accent1,
        //
        other: '#e8c3b9',
        disk: colors.blue.base,
        page_title: colors.blueGrey.lighten5,
        //new
        title_blue: '#00aeef',
        card_disabled: colors.grey.darken4,
        white_btn_hover: colors.grey.lighten2,
      },
    }
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
};
export default new Vuetify(opts)