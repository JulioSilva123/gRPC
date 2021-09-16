<template>
  <div>
    <auth-top-bar
      class="pt-7"
      :onLightBg="!$vuetify.theme.dark"
    />
    <v-container>
      <v-row justify="center" class="mt-8 px-2">
        <v-col cols="12" sm="8" md="6" lg="4">
          <edit-card :loading="loading" transition="slide-x-reverse-transition">
            <template v-slot:title>
              {{ $tc('enter_new_password') }}
            </template>
            <v-form class="pa-4" @submit.prevent="submit">
              <!-- new password -->
              <v-text-field
                id="ChangePassword_newPassword"
                :label="$tc('new_password')"
                autocomplete="new-password"
                :type="showPwd ? 'text' : 'password'"
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPwd = !showPwd"
                v-model="newPassword"
                :error-messages="newPasswordErrors"
                @input="$v.newPassword.$touch()"
                @blur="$v.newPassword.$touch()"
              />
              <v-text-field
                id="ChangePassword_repeatPassword"
                :label="$tc('confirm_password')"
                :type="showConfirm ? 'text' : 'password'"
                :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showConfirm = !showConfirm"
                v-model="repeatPassword"
                :error-messages="repeatPasswordErrors"
                @input="$v.repeatPassword.$touch()"
                @blur="$v.repeatPassword.$touch()"
              />
              <v-btn
                id="ChangePassword_submit"
                type="submit"
                color="secondary"
                :disabled="$v.$invalid"
                :dark="!$v.$invalid"
                :class="{ 'black--text': $vuetify.theme.dark }"
              >
                {{ $tc('change_password') }}
              </v-btn>
            </v-form>
          </edit-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AuthTopBar from '@/components/AppTopBar/AuthTopBar'
import { required, sameAs } from 'vuelidate/lib/validators'
import EditCard from '@/components/managementViews/AccountInfoEditCard'
export default {
  created () {
    const params = this.$route.params
    if (params.token) {
      this.token = params.token
    }
  },
  components: {
    EditCard,
    AuthTopBar
  },
  data () {
    return {
      loading: false,
      newPassword: null,
      repeatPassword: null,
      showPwd: false,
      showConfirm: false
    }
  },

  computed: {
    newPasswordErrors () {
      const errors = []
      if (!this.$v.newPassword.$dirty) return errors
      !this.$v.newPassword.required &&
        errors.push(this.$t('$validation.required'))
      return errors
    },
    repeatPasswordErrors () {
      const errors = []
      if (!this.$v.repeatPassword.$dirty) return errors
      !this.$v.repeatPassword.sameAs &&
        errors.push(this.$t('$validation.same_as'))
      !this.$v.repeatPassword.required &&
        errors.push(this.$t('$validation.required'))
      return errors
    }
  },
  validations: {
    newPassword: {
      required,
    },
    repeatPassword: {
      required,
      sameAs: sameAs('newPassword')
    }
  },
  methods: {
    submit () {
      this.loading = true
      console.log(this.token)
      this.$store.dispatch('signup/doResetPassword', { token: this.token, newpass: this.newPassword })
        .then(() => {
          this.$router.push({ name: 'login' })
          this.$notify.success({})
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>

</style>