<template>
  <v-dialog @keydown.esc="closeModal"
    v-model="dialog"
    max-width="500px"
    @click:outside="closeModal"
  >
    <edit-card :loading="loading">
      <template v-slot:title>
        {{ `${$tc('update')} ${i18nFieldName}` }}
        <v-spacer />
      </template>
      <v-form class="pa-4" @submit.prevent="submit">
        <v-text-field
          v-if="fieldName"
          v-model="editedValue"
          autocomplete="off"
          outlined
          v-mask="fieldMask"
          :label="i18nFieldName"
          :error-messages="fieldErrors"
          @input="$v.editedValue.$touch()"
          @blur="$v.editedValue.$touch()"
        />
        <v-row no-gutters justify="end">
          <v-btn
            id="InfoEditModal_submit"
            type="submit"
            color="secondary"
            :disabled="$v.$invalid"
            :dark="!$v.$invalid"
            :class="{ 'black--text': $vuetify.theme.dark }"
          >
            {{ $tc('update') }}
          </v-btn>
        </v-row>
      </v-form>
    </edit-card>
  </v-dialog>
</template>

<script>
import { validCPF, validCNPJ } from '@/plugins/globals.plugin.js'
import { required, maxLength, minLength } from 'vuelidate/lib/validators'
import EditCard from '@/components/managementViews/AccountInfoEditCard'
const maskTotalChars = 4
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    fieldName: {
      type: String
    },
    fieldValue: {
      type: String
    }
  },
  components: { EditCard },
  data () {
    return {
      dialog: false,
      editedValue: null,
      loading: false,
      name: null
    }
  },
  computed: {
    fieldMask () {
      if (this.fieldName === 'tax_payer') {
        return ['###.###.###-##', '##.###.###/####-##']
      } else if (this.fieldName === 'phone') {
        return ['(##) ####-####', '(##) #####-####']
      } else return null
    },
    i18nFieldName () {
      return this.$te(this.fieldName) ? this.$t(this.fieldName) : this.fieldName
    },
    accountId () {
      return this.$store.getters['account/GET_USER_INFO'].accountId
    },
    fieldErrors () {
      switch (this.fieldName) {
        case 'name':
          return this.nameErrors
        case 'phone':
          return this.phoneErrors
        case 'company':
          return this.companyErrors
        case 'tax_payer':
          return this.taxPayerErrors
        default:
          return []
      }
    },
    userInfo () {
      return this.$store.getters['account/GET_USER_INFO']
    },
    nameErrors () {
      const errors = []
      if (!this.$v.editedValue.$dirty) return errors
      !this.$v.editedValue.required && errors.push(this.$t('$validation.required'))
      return errors
    },
    phoneErrors () {
      const errors = []
      if (!this.$v.editedValue.$dirty) return errors
      !this.$v.editedValue.required && errors.push(this.$t('$validation.required'))
      !this.$v.editedValue.minLength &&
        errors.push(
          this.$t('$validation.min_length', {
            num: this.$v.editedValue.$params.minLength.min - maskTotalChars
          })
        )
      return errors
    },
    companyErrors () {
      const errors = []
      if (!this.$v.editedValue.$dirty) return errors
      !this.$v.editedValue.required && errors.push(this.$t('$validation.required'))
      !this.$v.editedValue.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.editedValue.$params.maxLength.max
          })
        )
      return errors
    },
    taxPayerErrors () {
      const errors = []
      if (!this.$v.editedValue.$dirty) return errors
      !this.$v.editedValue.required && errors.push(this.$t('$validation.required'))
      !this.$v.editedValue.cpfOrcnpj && errors.push(this.$t('$validation.invalid', { field: 'CPF/CNPJ'}))
      return errors
    },
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    getFieldRawValue (value) {
      let rawValue
      switch (this.fieldName) {
        case 'phone':
          rawValue = `55${value.replace(/[^0-9]+/g, '')}`
          break
        case 'tax_payer':
          rawValue = value.replace(/[^0-9]+/g, '')
          break
        default:
          rawValue = value
          break
      }
      return rawValue
    },
    submit () {
      this.$store.dispatch('account/updateAccountInfo', {
          id: this.userInfo.id,
          field: this.fieldName,
          value: this.getFieldRawValue(this.editedValue)
        })
        .then(() => {
          this.$notify.success({})
          this.closeModal()
        })
    },
    clearData () {
      this.value = null,
      this.editedValue = null
      this.loading = false
      this.$v.$reset()
    }
  },
  validations () {
    const cpfOrcnpj = value => {
      let rawValue = this.getFieldRawValue(value)
      return validCPF(rawValue) || validCNPJ(rawValue)
    }
    const validations = { editedValue: {} }
    switch (this.fieldName) {
      case 'name':
        validations.editedValue = {
          required,
        }
        break
      case 'phone':
        validations.editedValue = {
          required,
          // the calculation is used to account for the mask characters
          minLength: minLength(10 + maskTotalChars),
          maxLength: maxLength(11 + maskTotalChars)
        }
        break
      case 'company':
        validations.editedValue = {
          required,
          maxLength: maxLength(45)
        }
        break
      case 'tax_payer':
        validations.editedValue = {
          required,
          cpfOrcnpj
        }
        break
      default: break
    }
    return validations
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        this.editedValue = this.fieldValue
      }
    },
  }
}
</script>

<style>

</style>
