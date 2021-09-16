<template>
  <div>
    <v-form @submit.prevent="submit">
      <input
        id="signup_username"
        type="text"
        autocomplete="name"
        class="text_field_login w-input"
        :class="{
          'autofill-fix-dark': $vuetify.theme.dark,
          'autofill-fix': !$vuetify.theme.dark,
          'mb-0': usernameErrors.length
        }"
        :placeholder="$t('first_last_name')"
        v-model="username"
      />
      <p v-if="usernameErrors.length" class="mb-0 ml-1 darkRed--text">{{ usernameErrors[0] }}</p>
      
      <input
        id="signup_email"
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
      <p v-if="emailErrors.length" class="mb-0 ml-1 darkRed--text">{{ emailErrors[0] }}</p>

      <the-mask
        id="signup_cpfcnpj"
        type="tel"
        :mask="['###.###.###-##', '##.###.###/####-##']"
        autocomplete="off"
        class="text_field_login w-input"
        :class="{
          'autofill-fix-dark': $vuetify.theme.dark,
          'autofill-fix': !$vuetify.theme.dark,
          'mb-0': cpfcnpjErrors.length
        }"
        :placeholder="$t('pessoa_identifier')"
        v-model="cpfcnpj"
      />
      <p v-if="cpfcnpjErrors.length" class="mb-0 ml-1 darkRed--text">{{ cpfcnpjErrors[0] }}</p>

      <input
        id="signup_company"
        type="text"
        autocomplete="off"
        class="text_field_login w-input"
        :class="{
          'autofill-fix-dark': $vuetify.theme.dark,
          'autofill-fix': !$vuetify.theme.dark,
          'mb-0': companyErrors.length
        }"
        :placeholder="$t('company')"
        v-model="company"
      />
      <p v-if="companyErrors.length" class="mb-0 ml-1 darkRed--text">{{ companyErrors[0] }}</p>

      <the-mask
        id="signup_phone"
        type="tel"
        name="phone"
        :mask="['(##) ####-####', '(##) #####-####']"
        autocomplete="off"
        class="text_field_login w-input"
        :class="{
          'autofill-fix-dark': $vuetify.theme.dark,
          'autofill-fix': !$vuetify.theme.dark,
          'mb-0': phoneErrors.length
        }"
        :placeholder="$t('phone')"
        v-model="phone"
      />
      <p v-if="phoneErrors.length" class="mb-0 ml-1 darkRed--text">{{ phoneErrors[0] }}</p>
      
      <input
        id="signup_password"
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
      <div class="input-group">
        <!-- <v-row justify="center" class="mt-2">
          <vue-recaptcha
            v-if="showRecaptcha"
            ref="recaptcha"
            id="signup_recaptcha"
            @verify="onCaptchaVerified"
            @expired="onCaptchaExpired"
            :language="locale"
            :loadRecaptchaScript="true"
            :theme="$vuetify.theme.dark ? 'dark' : 'light'"
            :sitekey="recaptchaSiteKey"
          />
        </v-row> -->
        <error-card
          class="my-2"
          id="signup_error_card"
          :email="$store.state.signup.email"
          :error="error"
          @close="error = null"
        />
        <v-btn
          id="signup_submit"
          :loading="loading"
          type="submit"
          block
          dark
          color="title_blue"
          class="rounded-lg mt-4"
          :class="{ 'black--text': $vuetify.theme.dark }"
        >
          {{ `${$tc('sign_up')}`}}
        </v-btn>
      </div>
    </v-form>
    <recaptcha-modal
      :open="showRecaptchaModal"
      @canceled="showRecaptchaModal = false"
      @verified="recaptchaVerified"
    />
  </div>
</template>

<script>
import { validCPF, validCNPJ } from '@/plugins/globals.plugin.js'
import RecaptchaModal from '@/components/RecaptchaModal'
import errorCard from '@/components/forms/AuthFormErrorCard'
import { required, maxLength, minLength, numeric } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    sendUpdates: false,
    password: null,
    loading: false,
    error: null,
    cpfcnpj: null,
    phone: null,
    company: null,
    showRecaptchaModal: false
  }),
  components: {
    // VueRecaptcha,
    errorCard,
    RecaptchaModal
  },
  computed: {
    email: {
      get () {
        return this.$store.state.signup.email
      },
      set (val) {
        return this.$store.commit('signup/SET_USER_EMAIL', val)
      }
    },
    username: {
      get () {
        return this.$store.state.signup.name
      },
      set (val) {
        return this.$store.commit('signup/SET_USER_NAME', val)
      }
    },
    locale () {
      return this.$store.state.locale.locale
    },
    showRecaptcha () {
      return this.$store.getters['ui/GET_NEEDS_RECATCHA']
    },
    recaptchaToken: {
      get () {
        return this.$store.state.auth.recaptchaToken
      },
      set (val) {
        return this.$store.commit('auth/SET_USER_RECAPTCHA', val)
      }
    },
    recaptchaSiteKey () {
      return this.$store.state.ui.recaptchaSiteKey
    },
    // ERRORS
    usernameErrors () {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push(this.$t('$validation.required'))
      return errors
    },
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
      !this.$v.password.minLength &&
        errors.push(
          this.$t('$validation.min_length', {
            num: this.$v.password.$params.minLength.min
          })
        )
      !this.$v.password.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.password.$params.maxLength.max
          })
        )
      return errors
    },
    cpfcnpjErrors () {
      const errors = []
      if (!this.$v.cpfcnpj.$dirty) return errors
      !this.$v.cpfcnpj.required && errors.push(this.$t('$validation.required'))
      !this.$v.cpfcnpj.cpfOrcnpj && errors.push(this.$t('$validation.invalid', { field: 'CPF/CNPJ'}))
      return errors
    },
    companyErrors () {
      const errors = []
      if (!this.$v.company.$dirty) return errors
      !this.$v.company.required && errors.push(this.$t('$validation.required'))
      !this.$v.company.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.company.$params.maxLength.max
          })
        )
      return errors
    },
    phoneErrors () {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.required && errors.push(this.$t('$validation.required'))
      !this.$v.phone.numeric && errors.push(this.$t('$validation.invalid_numeric'))
      !this.$v.phone.minLength &&
        errors.push(
          this.$t('$validation.min_length', {
            num: this.$v.phone.$params.minLength.min
          })
        )
      !this.$v.phone.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.phone.$params.maxLength.max
          })
        )

      return errors
    },

  },
  methods: {
    phoneMask (phone) {
      if (phone.length > 10) return '(##)#####-####'
      else return '(##)####-####'
    },
    //
    recaptchaVerified (recaptchaToken) {
      this.recaptchaToken = recaptchaToken
      this.showRecaptchaModal = false
      this.doRequest()
    },
    //
    clearRecaptcha () {
      this.recaptchaToken = null
      this.$refs.recaptcha.reset();
    },
    submit () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      if (isValid) {
        if (this.showRecaptcha) this.showRecaptchaModal = true
        else {
          this.recaptchaToken = 'none'
          this.doRequest()
        }
      }
    },
    doRequest() {
      this.loading = true
      this.$store.dispatch('signup/doSignUp', { 
        name: this.username,
        email: this.email,
        password: this.password,
        phone: `55${this.phone}`,
        company: this.company,
        taxPayer: this.cpfcnpj,
        recaptchaToken: this.recaptchaToken
      })
        .then(() => {
          this.error = null
          // if (this.showRecaptcha) this.clearRecaptcha()
          this.$router.push({ name: 'email-sent', query: { email: this.email } })
        })
        .catch(error => {
          this.error = error
        })
        .finally(() => {
          this.loading = false
        })
    },
    onCaptchaVerified (recaptchaToken) {
      this.recaptchaToken = recaptchaToken
    },
    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
    },
  },
  validations () {
    const validation = {}

    const validEmail = value => {
      if (!value) return true
      let expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return expression.test(value)
    }
    const cpfOrcnpj = value => {
      return validCPF(value) || validCNPJ(value)
    }

    validation.username = {
      required,
      // minLength: minLength(2),
      // maxLength: maxLength(150)
    }
    validation.email = {
      required,
      validEmail,
    }
    validation.cpfcnpj = {
      required,
      cpfOrcnpj
    }
    validation.phone = {
      required,
      numeric,
      minLength: minLength(10),
      maxLength: maxLength(11)
    }
    validation.company = {
      required,
      maxLength: maxLength(45)
    }
    validation.password = {
      required,
      maxLength: maxLength(16),
      minLength: minLength(8)
    }
    return validation
  }
}
</script>