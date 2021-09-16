<template>
  <div @mouseover="mouseOver" @mouseleave="mouseLeave">
    <v-navigation-drawer color="appTopBar" dark v-model="drawer" v-bind="$props">
      <v-container pa-0>
        <v-row>
          <v-col class="py-0">
            <component :is="component" />
          </v-col>
        </v-row>
      </v-container>
      <template v-if="name === 'mainMenu'" v-slot:prepend>
        <account-menu
          :mini-variant="miniVariant"
          :username="accountName"
          :subtitle="accountEmail"
          color="secondary"
        />
      </template>
      <template v-slot:append>
        <component :is="appendComponent" />
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { AccountMenu } from '@dinamonetworks/gui-comps-lib'
export default {
  components: { AccountMenu },
  props: {
    name: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 310
    },
    app: {
      type: Boolean,
      default: () => false
    },
    clipped: {
      type: Boolean,
      default: () => false
    },
    right: {
      type: Boolean,
      default: () => false
    },
    temporary: {
      type: Boolean,
      default: () => false
    },
    fixed: {
      type: Boolean,
      default: () => false
    },
    absolute: {
      type: Boolean,
      default: () => false
    },
    permanent: {
      type: Boolean,
      default: () => false
    },
    scroll: {
      type: Boolean,
      default: () => true
    },
    disableMainScroll: {
      type: Boolean,
      default: () => true
    },
    simpleFooter: {
      type: Boolean
    },
    miniVariant: {
      type: Boolean,
      default: () => false
    },
  },
  data () {
    return {
      component: null
    }
  },
  beforeMount () {
    this.$store.dispatch('account/doGetUserInfo')
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
  },
  mounted () {
    this.loader()
      .then(() => {
        this.component = () => this.loader()
      })
      .catch(() => {
        this.component = () => import('./AppDefaultDrawer')
      })
  },
  computed: {
    drawer: {
      get () {
        return this.$store.state.drawers[this.name]
      },
      set (val) {
        if (!val) {
          const mutation = this.$store.getters['drawers/getMutation'](this.name)
          this.$store.commit(`drawers/${mutation}`, false)
        }
      }
    },
    loader () {
      if (!this.name) return null

      const component = this.$store.getters['drawers/getComponent'](this.name)
      return () => import(`./${component}`)
    },
    accountEmail () {
      return this.$store.getters['account/GET_USER_INFO'].email
    },
    accountName () {
      return this.$store.getters['account/GET_USER_INFO'].name
    },
    appendComponent () {
      if (this.simpleFooter) {
        return () => import(`./subViews/SimpleFooter`)
      } else {
        return ''
      }
    }
  },
  methods: {
    setNoScrollbar () {
      const el = document.querySelector('html')
      el.classList.add('no-scrollbar')
    },
    removeNoScrollbar () {
      const el = document.querySelector('html')
      el.classList.remove('no-scrollbar')
    },
    doDisableMainScroll () {
      if (this.drawer === true) {
        if (this.disableMainScroll === true) {
          return this.setNoScrollbar()
        }
      } else {
        return this.removeNoScrollbar()
      }
    },
    mouseOver () {
      // console.log('over')
      // this.setNoScrollbar()
    },
    mouseLeave () {
      // console.log('leave')
      // if (this.disableMainScroll === false) {
      //   console.log('remove')
      //   this.removeNoScrollbar()
      // }
    }
  },
  watch: {
    drawer () {
      // this.doDisableMainScroll()
    }
  }
}
</script>
