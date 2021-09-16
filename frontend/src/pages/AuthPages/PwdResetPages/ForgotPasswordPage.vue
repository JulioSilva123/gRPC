<template>
  <div>
    <auth-top-bar
      class="pt-7"
      :onLightBg="!$vuetify.theme.dark"
    />
    <v-container>
      <v-row justify="center" class="mt-8 px-2">
        <v-card outlined width="620px">
          <v-card-title v-text="$tc('recover_account')"/>
          <v-card-text>
            <template v-if="emailSent">
              <span id="ForgotPasswordPage_emailSentMessage" class="text-subtitle-1 text--primary hide-in-percy">
                {{ $tc('reset_pwd_sent_message') }}
              </span>
            </template>
            <template v-else>
              <span class="text-subtitle-1 text--primary">
                {{ $tc('reset_pwd_message') }}
              </span>
              <error-card
                id="ForgotPasswordPage_error_card"
                :email="email"
                :error="error"
                @close="error = null"
              />
              <v-form @submit.prevent="submit" class="pt-4">
                <v-text-field
                  id="ForgotPasswordPage_email"
                  v-model="email"
                  outlined
                  :class="$vuetify.theme.dark ? 'autofill-fix-dark' : 'autofill-fix'"
                  class="hide-in-percy"
                  :placeholder="$tc('email')"
                  :error-messages="emailErrors"
                />
                <div class="input-group">
                  <v-row justify="center">
                    <vue-recaptcha
                      v-if="showRecaptcha"
                      ref="recaptcha"
                      id="ForgotPasswordPage_recaptcha"
                      @verify="onCaptchaVerified"
                      @expired="onCaptchaExpired"
                      :language="locale"
                      :loadRecaptchaScript="true"
                      :theme="$vuetify.theme.dark ? 'dark' : 'light'"
                      :sitekey="recaptchaSiteKey"
                    />
                  </v-row>
                  <v-row class="mt-4" no-gutters justify="start" >
                    <v-btn
                      id="ForgotPasswordPage_submit"
                      dark
                      :loading="loading"
                      color="secondary"
                      type="submit"
                      :class="{ 'black--text': $vuetify.theme.dark }"
                    >
                      {{ $tc('send_email') }}
                    </v-btn>
                  </v-row>
                </div>
              </v-form>
            </template>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AuthTopBar from '@/components/AppTopBar/AuthTopBar'
import errorCard from '@/components/forms/AuthFormErrorCard'
import { required } from 'vuelidate/lib/validators'
import VueRecaptcha from 'vue-recaptcha';
export default {
  data () {
    return {
      email: null,
      error: null,
      emailSent: false,
      loading: false
    }
  },
  components: { errorCard, VueRecaptcha, AuthTopBar },
  computed: {
    recaptchaToken: {
      get () {
        return this.$store.state.auth.recaptchaToken
      },
      set (val) {
        return this.$store.commit('auth/SET_USER_RECAPTCHA', val)
      }
    },
    locale () {
      return this.$store.state.locale.locale
    },
    recaptchaSiteKey () {
      return this.$store.state.ui.recaptchaSiteKey
    },
    showRecaptcha () {
      return this.$store.getters['ui/GET_NEEDS_RECATCHA']
    },
    // ERRORS
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push(this.$t('$validation.required'))
      return errors
    }
  },
  validations: {
    email: {
      required,
    }
  },
  methods: {
    clearRecaptcha () {
      this.$refs.recaptcha.reset();
      this.recaptchaToken = null
    },
    onCaptchaVerified (recaptchaToken) {
      this.recaptchaToken = recaptchaToken
    },
    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
    },
    submit () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      if (isValid && (!this.showRecaptcha || this.recaptchaToken !== null)) {
        this.doRequest()
      } else if (isValid && this.showRecaptcha && this.recaptchaToken === null) {
        this.error = this.$store.getters['error/getErrorObj']('missing_recaptcha')
      }
    },
    doRequest() {
      this.loading = true
      this.$store.dispatch('signup/doRequestPasswordReset', { email: this.email })
        .then(() => {
          this.error = null
          this.emailSent = true
          if (this.showRecaptcha) this.clearRecaptcha()
        })
        .catch(error => {
          this.error = error
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>