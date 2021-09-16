<template>
  <div>
    <v-card max-width="530px" class="rounded-xl">
      <v-card-text class="pa-8">
        <div class="dinamo_tit">{{ $t('make_your') }}</div>
        <div class="tit_area text-uppercase mb-4">login</div>
        <v-form @submit.prevent="submit">
          <v-row no-gutters>
            <v-col cols="12">
              <input
                id="login_email"
                type="text"
                autocomplete="email"
                class="text_field_login w-input"
                :class="{
                  'autofill-fix-dark': $vuetify.theme.dark,
                  'autofill-fix': !$vuetify.theme.dark,
                  'mb-0': emailErrors.length
                }"
                :placeholder="$t('email')"
                v-model="email"
              />
            </v-col>

            <v-col cols="12">
              <p v-if="emailErrors.length" class="mb-0 ml-1 darkRed--text">{{ emailErrors[0] }}</p>
            </v-col>

            <v-col cols="12">          
              <input
                id="login_password"
                type="password"
                autocomplete="current-password"
                class="text_field_login w-input hide-in-percy"
                :class="{
                  'autofill-fix-dark': $vuetify.theme.dark,
                  'autofill-fix': !$vuetify.theme.dark,
                  'mb-0': passwordErrors.length
                }"
                :placeholder="$t('password')"
                v-model="password"
              />
              <p v-if="passwordErrors.length" class="mb-0 ml-1 darkRed--text">{{ passwordErrors[0] }}</p>
            </v-col>

            <v-col class="mb-2" cols="12">
              <a @click="forgotPwd">{{ $tc('forgot_pwd') }}</a>
            </v-col>

            <v-col cols="12">

              <v-row justify="center">
                <vue-recaptcha
                  v-if="showRecaptcha"
                  ref="recaptcha"
                  class="pt-3 pb-2"
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired"
                  :language="locale"
                  :loadRecaptchaScript="true"
                  :theme="$vuetify.theme.dark ? 'dark' : 'light'"
                  :sitekey="recaptchaSiteKey"
                />
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-btn
                id="login_submit"
                :loading="loading"
                type="submit"
                dark
                color="title_blue"
                class="rounded-lg mt-2"
                :class="{ 'black--text': $vuetify.theme.dark }"
              >
                {{ $tc('signin') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <slot name="bottom" />
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
import VueRecaptcha from 'vue-recaptcha';

export default {
  data () {
    return {
      loading: false
    }
  },
  components: { VueRecaptcha },
  computed: {
    email: {
      get () {
        return this.$store.state.auth.email
      },
      set (val) {
        return this.$store.commit('auth/SET_USER_EMAIL', val)
      }
    },
    password: {
      get () {
        return this.$store.state.auth.password
      },
      set (val) {
        return this.$store.commit('auth/SET_PASSWORD', val)
      }
    },
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
      return this.$store.getters['ui/GET_NEEDS_RECATCHA_LOGIN']
    },
    // ERRORS
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.required && errors.push(this.$t('$validation.required'))
      !this.$v.email.validEmail && errors.push(this.$t('$validation.invalid_email'))
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push(this.$t('$validation.required'))
      return errors
    }
  },
  validations () {
    const validations = {}
    
    const validEmail = value => {
      if (!value) return true
      let expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return expression.test(value)
    }
    validations.email = {
      required,
      validEmail
    },
    validations.password = {
      required
    }
    return validations
  },
  methods: {
    clearRecaptcha () {
      this.$refs.recaptcha.reset();
    },
    async submit () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      if (isValid && !this.showRecaptcha || isValid && this.recaptchaToken !== null) {
        if (this.showRecaptcha) this.clearRecaptcha()
        this.doLogin()
      }
    },
    doLogin () {
      this.loading= true
      this.$store.dispatch('auth/doLogin')
        .then(() => {
          this.error = null
          this.$router.push({ name: 'home' })
          this.$store.commit('auth/CLEAR_AFTER_LOGIN')
        })
        .catch(error => {
          this.$emit('goterror', error)
        })
        .finally(() => {
          this.loading = false
          this.$v.$reset()
        })
    },
    onCaptchaVerified (recaptchaToken) {
      this.recaptchaToken = recaptchaToken
    },
    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
    },
    forgotPwd () {
      this.$router.push({ name: 'forgot-password' })
    }
  }
}
</script>