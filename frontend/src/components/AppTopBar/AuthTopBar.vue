<template>
  <div>
    <v-row class="px-10">
      <router-link :to="{name: 'welcome'}" class="d-flex router-link-active">
        <img
          :height="$vuetify.breakpoint.xsOnly ? '41.5px' : '54px'"
          :src="onLightBg ? require('@/assets/images/logo/supercloud_normal.png') : require('@/assets/images/logo/supercloud_white.png')"
        />
      </router-link>

      <v-spacer />

      <template v-if="isStaging || isLocal">
        <v-card
          v-if="$vuetify.breakpoint.smAndUp"
          flat
          :color="isStaging ? 'red' : 'orange'"
        >
          <v-card-text class="white--text">
            {{ isStaging ? 'DEV' : 'COMPOSE' }}
          </v-card-text>
        </v-card>

        <v-badge
          v-else
          :color="isStaging ? 'red' : 'orange'"
        />
      </template>
        
      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-hover v-slot:default="{ hover }">
          <a
            href="https://www.dinamonetworks.com"
            target="_blank"
            class="menu_mkt_item_login w-nav-link text-uppercase"
            :class="hover ? 'title_blue--text' : buttonsTxtColor"
          >
            {{ $t('meet_dinamo') }}
          </a>
        </v-hover>
        
        <span
          v-if="$route.name && $route.name !== 'login'"
          class="ml-5 loginbt_page w-nav-link cursor-pointer"
          :class="onLightBg ? 'colorBlack' : ''"
          @click="$router.push({ name: 'login'})"
        >
          {{ $tc('signin') }}
        </span>

        <span
          v-if="($route.name && $route.name !== 'join')"
          class="mx-3 w-nav-link cadastre_bt_login cursor-pointer"
          @click="$router.push({ name: 'join'})"
        >
          {{ $tc('sign_up') }}
        </span>
      </template>

      <template v-else>
        <v-btn
          icon
          :dark="!onLightBg"
          @click="openAuthMenu = !openAuthMenu"
        >
          <v-icon>menu</v-icon>
        </v-btn>
      </template>
    </v-row>
    <auth-menu class="mt-2" v-if="openAuthMenu" />
  </div>
</template>

<script>
import AuthMenu from '@/components/AppTopBar/AuthMenu'
export default {
  components: { AuthMenu },
  props: {
    onLightBg: {
      default: false
    }
  },
  data () {
    return {
      openAuthMenu: false
    }
  },
  computed: {
    buttonsTxtColor () {
      return this.onLightBg ? 'primary--text' : 'white--text'
    },
    isStaging () {
      return this.$store.getters['ui/GET_API_BASE_IS_STAGING']
    },
    isLocal () {
      return this.$store.getters['ui/GET_API_BASE_IS_LOCAL']
    },
  }
}
</script>

<style>

</style>