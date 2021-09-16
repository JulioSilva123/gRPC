<template>
  <v-card outlined>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <!-- otp -->
          <v-row no-gutters justify="start">
            <v-col>
              <v-row justify="start" class="ml-0">
                <strong>{{ $tc('otp') }}</strong>
              </v-row>
            </v-col>
          </v-row>
          <v-text-field
            outlined
            v-model="otp"
            :error-messages="otpErrors"
            @input="$v.otp.$touch()"
            @blur="$v.otp.$touch()"
          />
          <v-btn
            block
            type="submit"
            color="secondary"
            :disabled="$v.$invalid"
            :dark="!$v.$invalid"
            :class="{ 'black--text': $vuetify.theme.dark }"
          >
            {{ $tc('signin') }}
          </v-btn>
        </v-form>
      </v-card-text>
  </v-card>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  computed: {
    otp: {
      get () {
        return this.$store.state.auth.otp
      },
      set (val) {
        return this.$store.commit('auth/SET_OTP', val)
      }
    },
    // ERRORS
    otpErrors () {
      const errors = []
      if (!this.$v.otp.$dirty) return errors
      !this.$v.otp.required && errors.push(this.$t('$validation.required'))
      !this.$v.otp.minLength &&
        errors.push(
          this.$t('$validation.min_length', {
            num: this.$v.otp.$params.minLength.min
          })
        )
      !this.$v.otp.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.otp.$params.maxLength.max
          })
        )
      return errors
    }
  },
  methods: {
    submit () {
      const isValid = !this.$v.$invalid
      if (isValid) this.$emit('login')
    }
  },
  validations: {
    otp: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(8)
    }
  },
}
</script>