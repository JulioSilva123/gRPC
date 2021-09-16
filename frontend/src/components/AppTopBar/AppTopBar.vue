<template>
  <v-app-bar
    app
    elevate-on-scroll
  >
    <v-app-bar-nav-icon
      v-if="isLogged && $vuetify.breakpoint.smAndDown && needsMainDrawer"
      @click.stop="toggleMainDrawer()"
    />

    <router-link :to="{name: 'welcome'}" class="d-flex router-link-active">
      <img
        height="38px"
        :src="$vuetify.theme.dark ? require('@/assets/images/logo/supercloud_white.png') : require('@/assets/images/logo/supercloud_normal.png')"
      />
    </router-link>

    <v-container v-if="isStaging || isLocal">
      <v-card
        flat
        :color="isStaging ? 'red' : 'orange'"
        class="white--text text-center"
      >
        {{ isStaging ? 'DEV' : 'COMPOSE' }}
      </v-card>
    </v-container>

    <template !isLogged>
      <v-spacer />
      
      <v-btn
        v-if="$route.name && $route.name !== 'login' && !isLogged"
        outlined
        @click="$router.push({ name: 'login'})"
      >
        {{ $tc('signin') }}
      </v-btn>

      <v-btn
        v-if="($route.name && $route.name !== 'join' && $route.name !== 'welcome') && !isLogged"
        outlined
        text
        @click="$router.push({ name: 'join'})"
        class="mx-2"
      >
        {{ $tc('sign_up') }}
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
export default {
  methods: {
    toggleMainDrawer () {
      this.$store.dispatch('drawers/toggle', { name: 'mainMenu' })
    }
  },
  computed: {
    isStaging () {
      return this.$store.getters['ui/GET_API_BASE_IS_STAGING']
    },
    isLocal () {
      return this.$store.getters['ui/GET_API_BASE_IS_LOCAL']
    },
    isLogged () {
      return this.$store.state.auth.isLogged
    },
    needsMainDrawer () {
      return this.$store.getters['drawers/getPathNeedsDrawer'](this.$route.name)
    }
  }
}
</script>
