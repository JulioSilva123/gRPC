<template>
  <v-form @submit.prevent="submit">
    <template v-if="engineDetail">
      <content-area
        :items="engineInfo"
        class="px-1"
      />
      <v-textarea
        id="SecretEntryStep_secret"
        :label="$tc('original_data')"
        row="3"
        row-height="20"
        auto-grow
        outlined
        autocomplete="off"
        :hint="$t('vault_data_hint')"
        :error-messages="secretErrors"
        @input="secretHasChanged"
        @blur="$v.secret.$touch()"
        class="pt-1"
        :counter="secretCounter"
        data-private
        v-model="secret"
      />
    </template>
    <v-row no-gutters justify="end" class="mt-2">
      <v-btn
        id="TokenParamStep_back"
        dark
        outlined
        color="secondary"
        @click="$emit('step-back')"
        class="mr-2"
        :class="{ 'black--text': $vuetify.theme.dark }"
      >
        {{ $tc('back') }}
      </v-btn>
      <v-btn
        id="TokenParamStep_submit"
        dark
        type="submit"
        color="secondary"
        :loading="loading"
        :class="{ 'black--text': $vuetify.theme.dark }"
      >
        {{ $tc('next') }}
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { validCPF, validCNPJ } from '@/plugins/globals.plugin.js'
import { required, maxLength, minLength, alphaNum, numeric } from 'vuelidate/lib/validators'
import ContentArea from '@/components/ContentArea'
export default {
  components: { ContentArea },
  props: {
    loading: Boolean,
    bus: Object,
    engineDetail: Object
  },
  data () {
    return {
      secret: null,
      cpfMaxLen: 11,
      cnpjMaxLen: 14,
      ielMaxLen: 14,
      panMaxLen: 16,
      nocheckMaxLen: 255,
      nocheckMinLen: 6,
      hasSubmited: false

    }
  },
  mounted() {
    this.bus.$on('cleardata', this.clearData)
  },
  computed: {
    secretCounter () {
      if (this.secretType === 'alphanum' || this.secretType === 'num') return this.nocheckMaxLen
      return this.$data[`${this.secretType}MaxLen`]
    },
    secretType () {
        
       if (this.engineDetail && this.engineDetail.format === 'base10') {
        if (this.engineDetail.checksum === 'nocheck') return 'num'
        else return this.engineDetail.checksum
       } else return 'alphanum'
    },
    engineInfo () {
      return this.$store.getters['svault/GET_CONDENSED_INFO'](this.engineDetail)
    },
    // ERRORS
    secretErrors () {
      const errors = []
      if (!this.$v.secret.$dirty) return errors
      if (this.hasSubmited) {
        !this.$v.secret.minLength && errors.push(this.$t('$validation.min_length', {
          num: this.$v.secret.$params.minLength.min
        }))
      }
      !this.$v.secret.required && errors.push(this.$t('$validation.required'))

      !this.$v.secret.maxLength && errors.push(this.$t('$validation.max_length', {
        num: this.$v.secret.$params.maxLength.max
      }))
      if (this.engineDetail && this.secretType === 'alphanum' &&
          !this.$v.secret.alphaNum
      ) {
        errors.push(this.$t('$validation.invalid_alpha_numeric'))
      
      } else if (this.secretType === 'cpf') {
        this.$v.secret.validCPF === false && errors.push(this.$t('$validation.invalid', { field: 'CPF'}))
      
      } else if (this.secretType === 'cnpj') {
        this.$v.secret.validCNPJ === false && errors.push(this.$t('$validation.invalid', { field: 'CNPJ'}))
      
      } else if (this.engineDetail && (
        this.secretType === 'num'  ||
        this.secretType === 'iel'  ||
        this.secretType === 'pan') &&
        !this.$v.secret.numeric
      ) {
        errors.push(this.$t('$validation.invalid_numeric'))
      }
      return errors
    },
  },
  validations () {
    const validations = {}
    
    //Base
    validations.secret = {
      required
    }
    if (this.engineDetail) {
      const condensedValidations = {
        num: {
          numeric,
          maxLength: maxLength(this.nocheckMaxLen),
          minLength: minLength(this.nocheckMinLen)
        },
        alphanum: {
          alphaNum,
          maxLength: maxLength(this.nocheckMaxLen),
          minLength: minLength(this.nocheckMinLen)
        },
        cpf: {
          validCPF,
          maxLength: maxLength(this.cpfMaxLen),
          minLength: minLength(this.cpfMaxLen)
        },
        cnpj: {
          validCNPJ,
          maxLength: maxLength(this.cnpjMaxLen),
          minLength: minLength(this.cnpjMaxLen)
        },
        iel: {
          numeric,
          maxLength: maxLength(this.ielMaxLen),
        },
        pan: {
          numeric,
          maxLength: maxLength(this.panMaxLen),
          minLength: minLength(this.panMaxLen)
        },
      }
      validations.secret = {
        ...validations.secret,
        ...condensedValidations[this.secretType]
      }
    }
    return validations
  },
  methods: {
    clearData () {
      this.secret = null
      this.$v.$reset()
    },
    submit () {
      this.hasSubmited = true
      if (!this.$v.$invalid) this.$emit('secret-set', { secret: this.secret })
    },
    secretHasChanged () {
      this.$v.secret.$touch()
      this.hasSubmited = false
    }
  }
}
</script>

<style>

</style>