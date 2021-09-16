<template>
  <v-card outlined flat>
    <v-progress-linear v-if="loading" indeterminate />
    <v-card-text>
      <!-- dinamo -->
      <v-row justify="center" class="my-2">
        <img
          height="50px"
          :src="$vuetify.theme.dark ? require('@/assets/images/logo_dinamo_high_light.png') : require('@/assets/images/logo_dinamo_high_dark.png')"
        >
      </v-row>
      <!-- email -->
      <v-row justify="center" class="my-6">
        <v-chip outlined>
          <v-avatar left>
            <v-icon>person</v-icon>
          </v-avatar>
          <span class="body-1 text--primary">{{ accountEmail }}</span>
        </v-chip>
      </v-row>
      <!-- message -->
      <span>
        {{ $tc('verify_identity_msg') }}
      </span>
      <!-- pwd form -->
      <v-form class="mt-4" @submit.prevent="submit">
        <v-text-field
          id="PasswordCheckCard_password"
          outlined
          :label="$tc('enter_your_password')"
          autocomplete="current-password"
          :type="showPwd ? 'text' : 'password'"
          :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPwd = !showPwd"
          v-model="password"
          :error-messages="passwordErrors"
          @input="clearPasswordErrors()"
          @blur="clearPasswordErrors()"
        />
        <v-row justify="end" no-gutters>
          <v-btn
            id="PasswordCheckCard_submit"
            type="submit"
            color="primary"
            :class="{ 'black--text': $vuetify.theme.dark }"
          >
            {{ $tc('next') }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      password: null,
      loading: false,
      postRequestError: [],
      showPwd: false
    }
  },
  mounted () {
    this.$store.dispatch('account/doGetUserInfo')
  },
  computed: {
    accountEmail () {
      return this.$store.getters['account/GET_USER_INFO'].email
    },
    preRequestErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push(this.$t('$validation.required'))
      return errors
    },
    passwordErrors () {
      let errors
      if (this.preRequestErrors.length <= 0) {
        errors = this.postRequestError
      } else {
        errors = this.preRequestErrors
      }
      return errors
    }
  },
  methods: {
    clearPasswordErrors () {
      this.postRequestError = []
      this.$v.password.$reset
    },
    submit () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      if (isValid) {
        this.loading = true
        this.$store.dispatch('auth/doVerifyPassword', { password: this.password })
          .then(() => {
            this.authFailed = true
            this.$emit('checked', { password: this.password})
          })
          .catch(err => {
            if (err.status === 403) {
              this.postRequestError.push(this.$t('$validation.wrong_password'))
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  },
  validations () {
    const validations = {}
    validations.password = {
      required
    }
    return validations
  }
}
</script>

<style>

</style>