<template>
  <v-dialog
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="600px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        <slot name="modal-title">
          {{ modalTitle }}
        </slot>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="closeModal()" v-on="on">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-alert
            class="my-4"
            color="error"
            icon="warning"
          >
            <slot name="alert-text">
              {{ alertMsg }}
            </slot>
          </v-alert>

          <slot name="second-text">
            {{ secondMsg }}
          </slot>

          <p>
            {{ $t('self_delete_modal_require_msg') }}
          </p>

          <v-text-field
            id="PasswordCheckCard_password"
            outlined
            :label="$tc('password')"
            autocomplete="current-password"
            :type="showPwd ? 'text' : 'password'"
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPwd = !showPwd"
            v-model="password"
            :error-messages="passwordErrors"
            @input="clearPasswordErrors()"
            @blur="clearPasswordErrors()"
          />
          <v-btn
            id="CredentialConfirmationModal_submit"
            type="submit"
            block
            color="secondary"
            :disabled="$v.$invalid"
            :dark="!$v.$invalid"
            :class="{ 'black--text': $vuetify.theme.dark }"
          >
            {{ btnTitle }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    modalTitle: String,
    alertMsg: String,
    secondMsg: String,
    btnTitle: String

  },
  data () {
    return {
      dialog: false,
      password: null,
      showPwd: false,
      postRequestError: []
    }
  },
  computed: {
    // ERRORS
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
    clearData () {
      this.password = null
      this.postRequestError = []
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.$v.$touch()
      this.$store.dispatch('auth/doVerifyPassword', { password: this.password })
        .then(() => {
          this.$emit('authenticated')
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    }
  },
  validations () {
    const validations = {}
    validations.password = {
      required
    }
    return validations
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      }
    }
  }
}
</script>

<style>

</style>