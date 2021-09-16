<template>
  <div>
    <auth-top-bar
      class="pt-7"
      :onLightBg="!$vuetify.theme.dark"
    />
    <v-row justify="center" class="py-0">
      <div class="maxWidth700">
        <v-row justify="center" class="mt-16 mb-8">
          <img
            height="120px"
            width="120px"
            :src="$vuetify.theme.dark ? require('@/assets/images/logo-dinamo-simbolo-white.png') : require('@/assets/images/logo-dinamo-simbolo-dark.png')"
          >
        </v-row>
        <v-row justify="center" class="mb-4">
          <p id="EmailSentPage_title" class="text-h3 font-weight-bold text-center mb-0">
            {{ $tc('email_sent_title') }}
          </p>
        </v-row>
        <v-row justify="center">
          <p class="text-h5 text-center my-4 pa-0">
            {{ $tc('email_sent_subtitle') }}
            <strong class="hide-in-percy">{{ email }}</strong>
          </p>
        </v-row>
        <v-row justify="center">
          <span class="text-h5 mb-2 text-center">
            {{ $tc('email_sent_subtitle2') }}
          </span>
        </v-row>
        <v-row justify="center" class="my-4">
          <span class="text-subtitle-1">{{ $tc('email_sent_resend_msg') }}</span>
        </v-row>
        <v-row justify="center">
          <template v-if="loading">
            <v-progress-circular indeterminate />
          </template>
          <template v-else>
            <a class="link--text text-subtitle-1 font-weight-medium" @click="startEmailSending">{{ $tc('resend_email') }}</a>
          </template>
        </v-row>
      </div>
    </v-row>
    <recaptcha-modal
      :open="showRecaptcha"
      @canceled="recaptchaCanceled"
      @verified="resendEmail"
    />
  </div>
</template>

<script>
import RecaptchaModal from '@/components/RecaptchaModal'
import AuthTopBar from '@/components/AppTopBar/AuthTopBar'
export default {
  mounted () {
    const query = this.$route.query
    if (query.email) {
      this.email = query.email
    }
  },
  components: { RecaptchaModal, AuthTopBar },
  data: () => {
    return {
      email: null,
      loading: false,
      showRecaptcha: false
    }
  },
  computed: {
    needsRecaptcha () {
      return !this.$store.getters['ui/GET_API_BASE_IS_LOCAL']
    }
  },
  methods: {
    startEmailSending () {
      if (this.needsRecaptcha) this.showRecaptcha = true
      else this.resendEmail()
    },
    recaptchaCanceled () {
      this.showRecaptcha = false
    },
    // eslint-disable-next-line no-unused-vars
    resendEmail(recaptchaToken) {
      this.showRecaptcha = false
      // TODO: sent token to server validation
      this.loading = true
      this.$store.dispatch('signup/doSendVerifyLink', { email: this.email })
        .then(() => {
          this.$notify.success({ message: this.$tc('email_resent') })
        })
        .catch(error => {
          console.log(error)
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>