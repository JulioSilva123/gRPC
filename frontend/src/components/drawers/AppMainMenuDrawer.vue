<template>
  <div class="pt-2">
    <v-list nav expand>
      <template v-for="item in menuItems">
        <template v-if="item.subItems">
          <v-list-group
            no-action
            :key="item.title"
            color="white"
          >
            <template v-slot:prependIcon>
              <img
                :src="item.icon"
                class="menu_icon"
              >
            </template>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" class="menu_link"/>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="child in item.subItems"
              :key="child.title"
              :to="child.url"
              class="menu_subitem"
            >
              <v-list-item-icon>
                <img
                  :src="child.icon"
                  class="menu_icon"
                >
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="child.title"
                  class="menu_link"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-item
            :key="item.title"
            :to="item.url"
            exact
            class="menu_item"
          >
            <v-list-item-icon>
              <img
                :src="item.icon"
                class="menu_icon"
              >
            </v-list-item-icon>

            <v-list-item-content class="pr-4">
              <v-list-item-title exact class="menu_link">
                {{ item.title }}
              </v-list-item-title>
              <v-badge v-if="item.badgeCnt" color="blue" :content="item.badgeCnt" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
      <v-tooltip v-if="$vuetify.breakpoint.mdAndUp" top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="drawerIsMini = !drawerIsMini">
            <v-icon>
              {{ drawerIsMini ? 'chevron_right' : 'chevron_left' }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ drawerIsMini ? $tc('expand') : $tc('collapse') }}</span>
      </v-tooltip>
    </v-list>

  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('hsm/doGetHSMList')
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
  },
  computed: {
    drawerIsMini: {
      get () {
        return this.$store.state.drawers.mainIsInMiniVariant
      },
      set () {
        this.$store.commit('drawers/toggleMiniVariantOnMain')
      }
    },
    menuItems () {
      if (this.drawerIsMini) return this.miniItems
      else return this.items
    },
    miniItems () {
      let miniItems = []
      this.items.forEach(item => {
        if (item.subItems) {
          item.subItems.forEach(subItem => { miniItems.push(subItem) })
        } else miniItems.push(item)
      })
      return miniItems
    },
    items () {
      let items = []
      items.push({ title: this.$tc('dashboard'), icon: require('@/assets/images/drawer_icons/dashboard_painel_controle.svg'), url: { name: 'home' } })
      items.push({ title: this.$tc('service', 2), icon: require('@/assets/images/drawer_icons/dashboard_servicos.svg'), url: { name: 'services' } })
      items.push({
        title: this.$tc('svault'),
        icon: require('@/assets/images/drawer_icons/dashboard_svault.svg'),
        url: { name: 'account' },
        subItems: [
          {
            title: `${this.$tc('tokenize')} / ${this.$tc('retrieve')}`,
            url: { name: 'lgpd-get-started' },
            icon: require('@/assets/images/drawer_icons/menu-demonstracao.svg'),
          },
          {
            title: this.$tc('vault', 2),
            url: { name: 'vault' },
            icon: require('@/assets/images/drawer_icons/dashboard_vaults.svg'),
          },
          {
            title: this.$tc('engine', 2),
            url: { name: 'engine' },
            icon: require('@/assets/images/drawer_icons/dashboard_mecanismos.svg'),
          },
        ]
      })


        //items.push({ title: `${this.$tc('certificate', 2)} ${this.$tc('and')} ${this.$tc('key', 2)}`, icon: require('@/assets/images/drawer_icons/menu-recursos.svg'), url: { name: 'certs-keys' } })
        items.push({ title: `${this.$tc('key_management')}`, icon: require('@/assets/images/drawer_icons/menu-recursos.svg'), url: { name: 'certs-keys' } })
      items.push({ title: `${this.$tc('certificates_usage_report')}`, icon: require('@/assets/images/drawer_icons/dashboard_relatorios.svg'), url: { name: 'certs-report' } })
      items.push({ title: this.$tc('hsm_lan'), url: { name: 'hsm-lan' }, icon: require('@/assets/images/drawer_icons/dashboard_hsm_lan.svg')})
      let accountItem = {
        title: this.$tc('account'),
        icon: require('@/assets/images/drawer_icons/dashboard_conta.svg'),
        url: { name: 'account' },
        subItems: [
          {
            title: this.$tc('settings'),
            url: { name: 'settings' },
            icon: require('@/assets/images/drawer_icons/dashboard_configuracoes.svg'),
          },
          {
            title: this.$tc('api_key', 2),
            url: { name: 'api-keys' },
            icon: require('@/assets/images/drawer_icons/dashboard_chaves_api.svg'),
          },
          {
            title: this.$tc('billing'),
            url: { name: 'billing' },
            icon: require('@/assets/images/drawer_icons/dashboard_faturamento.svg'),
          }
        ]
      }
      items.push(accountItem)

      if (this.$store.state.auth.file_encryption_treatment) {
        items.splice(2, 0, {
          title: `${this.$tc('file_encryption')}`,
          icon: require('@/assets/images/drawer_icons/dashboard_criptografia.svg'),
          url: { name: 'file-encryption' },
        })
      }
      return items
    },
    userInfo () {
      return this.$store.getters['account/GET_USER_INFO']
    }
  }
}
</script>