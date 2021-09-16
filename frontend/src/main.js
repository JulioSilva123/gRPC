import Vue from 'vue'
import App from './App.vue'
import plugins from './plugins';
import router from './router';
import store from './store';
import layouts from './layouts'
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: 'https://de524f418cb44e1ab9d05b336aa71420@o381709.ingest.sentry.io/5209426',
        integrations: [new VueIntegration({ Vue, attachProps: true, logErrors: true })],
        release: 'dinamo_services@' + process.env.VUE_APP_VERSION
    });
}

Vue.config.productionTip = false

const appConf = {
    router,
    store,
    layouts,
    render: h => h(App)
}

Object.assign(appConf, plugins)

new Vue(appConf).$mount('#app')
