<template>
  <div>
    <focused-edit :title="$tc('password')">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <pwd-check-card v-if="!isPwdChecked" @checked="updateIsPwdChecked" transition="slide-x-transition"/>
          <edit-card v-else transition="slide-x-reverse-transition">
            <template v-slot:title>
              {{ $tc('enter_new_password') }}
            </template>
            <v-form class="pa-4 pt-0" @submit.prevent="submit">
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
    </focused-edit>
  </div>
</template>

<script>
import { required, sameAs } from 'vuelidate/lib/validators'
import FocusedEdit from '@/components/managementViews/FocusedEditPageTemplate'
import EditCard from '@/components/managementViews/AccountInfoEditCard'
import PwdCheckCard from '@/components/managementViews/PasswordCheckCard'
export default {
  components: { FocusedEdit, EditCard, PwdCheckCard },
  data () {
    return {
      error: null,
      curPassword: null,
      newPassword: null,
      repeatPassword: null,
      isPwdChecked: false,
      showPwd: false,
      showConfirm: false
    }
  },
  computed: {
    progress () {
      if (!this.newPassword) return 0
      return Math.min(100, this.newPassword.length * 10)
    },
    color () {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
    },
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
    updateIsPwdChecked ({ password }) {
      this.curPassword = password
      this.isPwdChecked = true
    },
    submit () {
      const isValid = true
      if (isValid) {
        this.$store.dispatch('auth/doChangePassword', { password: this.curPassword, newPassword: this.newPassword })
          .then(() => {
            this.$router.push({ name: 'settings' })
            this.$notify.success({})
          })
          .catch(error => {
            this.$store.dispatch('error/showErrorNotification', error)
          })
        }
    },
  },

}
</script>
