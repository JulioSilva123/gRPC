<template>
  <div>
    <template v-if="loading">
      <v-progress-circular indeterminate />
    </template>
    <template v-else>
      <v-row justify="center" class="my-8">
        <img
          height="70px"
          width="70px"
          :src="$vuetify.theme.dark ? require('@/assets/images/logo-dinamo-simbolo-white.png') : require('@/assets/images/logo-dinamo-simbolo-dark.png')"
        >
      </v-row>
      <v-row justify="center">
        <p class="title mb-0">
          {{ $tc('partner_page_title') }}
          <strong>{{ email }}</strong>
        </p>
      </v-row>
      <v-row v-if="!$route.query.page" justify="center">
        <span class="title text-center">
          {{ $tc('partner_page_message') }}
        </span>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  mounted () {
    if (this.$route.query.authToken && this.$route.query.page) this.setUserToken()
    else if (this.$route.query.authToken) this.loginAsPartner()
  },
  data: () => {
    return {
      email: null,
      loading: false
    }
  },
  methods: {
    setUserToken () {
      this.$store.commit('auth/SET_LOGGED_USER', { authToken: this.$route.query.authToken })
      this.$store.commit('auth/SET_IS_LOGGED', true)
      this.$router.push({ name: this.$route.query.page })
    },
    loginAsPartner() {
      const query = this.$route.query
      console.log('QUERY==>', query)
      console.log('URL==>', process.env.VUE_APP_API_BASE + 'account/')
      this.loading = true
      this.$store.dispatch('auth/doLoginPartner', { b64Credentials: decodeURIComponent(this.$route.query.authToken) })
        .then(() => {
          console.log('success on doLoginPartner')
        })
        .catch(err => {
          this.$notify.error({ title: err.title, message: err.detail })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>