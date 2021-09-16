<template>
  <modal
    parent-name="CSRModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('emit_csr') }}
    </template>
    <template v-slot:text>
      <template v-if="!csrMaterial">
        <v-form @submit.prevent="submit">
          <v-text-field
            id="CSRModal_commomName"
            :label="$tc('common_name')"
            v-model="commomName"
            :error-messages="commomNameErrors"
            @input="onCNSelected"
            @blur="$v.commomName.$touch()"
          />
          <v-text-field
            id="CSRModal_organization"
            :label="$tc('csr_organization')"
            v-model="organization"
            :error-messages="organizationErrors"
            @input="$v.organization.$touch()"
            @blur="$v.organization.$touch()"
          />

          <v-text-field
            id="CSRModal_organizationUnit"
            :label="$tc('organization_unit')"
            v-model="organizationUnit"
            :error-messages="organizationUnitErrors"
            @input="$v.organizationUnit.$touch()"
            @blur="$v.organizationUnit.$touch()"
          />

          <v-text-field
            id="CSRModal_locality"
            :label="$tc('locality')"
            v-model="locality"
            :error-messages="localityErrors"
            @input="$v.locality.$touch()"
            @blur="$v.locality.$touch()"
          />

          <v-text-field
            id="CSRModal_stateValue"
            :label="$tc('state_label')"
            v-model="stateValue"
            :error-messages="stateValueErrors"
            @input="$v.stateValue.$touch()"
            @blur="$v.stateValue.$touch()"
          />

          <v-text-field
            id="CSRModal_country"
            :label="$tc('country')"
            v-model="country"
            :error-messages="countryErrors"
            @input="$v.country.$touch()"
            @blur="$v.country.$touch()"
          />

          <v-text-field
            id="CSRModal_email"
            label="Email (E)"
            v-model="email"
          />

          <center>
            <strong class="text-uppercase">{{ $t('or') }}</strong>
          </center>
            
          <v-textarea
            id="CSRModal_distiguishName"
            auto-grow
            row="1"
            row-height="15"
            v-model="distiguishName"
            :error-messages="distiguishNameErrors"
            @input="onDNSelected()"
            @blur="$v.distiguishName.$touch()"
            :label="$tc('distiguish_name')"
          />

          <v-row no-gutters justify="end">
            <v-btn
              type="submit"
              :disabled="$v.$invalid"
              :dark="!$v.$invalid"
              :loading="loading"
            >
              {{ $tc('emit') }}
            </v-btn>
          </v-row>
        </v-form>
      </template>
      <template v-else>
        <v-textarea
          id="CSRModal_csrMaterial"
          :label="$tc('csr_material')"
          class="monospaceTextarea"
          auto-grow
          row="6"
          row-height="25"
          readonly
          v-model="csrMaterial"
        />

        <v-row no-gutters justify="end" class="my-1">
          <content-copy-buttons
            copy-id="CSRModal_material_clipboard"
            copy-selector="CSRModal_csrMaterial"
            save-id="CSRModal_material_save"
            :saved-content="csrMaterial"
            :file-name="`${keyId}.csr`"
          />
        </v-row>
      </template>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
import { required, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'
import ContentCopyButtons from '@/components/ContentCopyButtons'
export default {
  components: { ContentCopyButtons, Modal },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    keyId: {
      type: String,
      required: false,
      default: ''
    },
    maxWidth: {
      type: String,
      required: false,
      default: '690px'
    },
  },
  data () {
    return {
      dialog: false,
      loading: false,
      //
      isUsingDN: true,
      organization: null,
      organizationUnit: null,
      commomName: null,
      locality: null,
      stateValue: null,
      country: null,
      email: null,
      distiguishName: null,
      csrMaterial: null,
    }
  },
  computed: {
    // ERRORS
    commomNameErrors () {
      const errors = []
      if (!this.$v.commomName.$dirty) return errors
      !this.$v.commomName.required &&
        errors.push(this.$t('$validation.required'))
      return errors
    },
    organizationErrors () {
      const errors = []
      if (!this.$v.organization.$dirty) return errors
      !this.$v.organization.alphaNum &&
        errors.push(this.$t('$validation.invalid_alpha_numeric'))
      return errors
    },
    organizationUnitErrors () {
      const errors = []
      if (!this.$v.organizationUnit.$dirty) return errors
      !this.$v.organizationUnit.alphaNum &&
        errors.push(this.$t('$validation.invalid_alpha_numeric'))
      return errors
    },
    localityErrors () {
      const errors = []
      if (!this.$v.locality.$dirty) return errors
      !this.$v.locality.alphaNum &&
        errors.push(this.$t('$validation.invalid_alpha_numeric'))
      return errors
    },
    stateValueErrors () {
      const errors = []
      if (!this.$v.stateValue.$dirty) return errors
      !this.$v.stateValue.alphaNum &&
        errors.push(this.$t('$validation.invalid_alpha_numeric'))
      return errors
    },
    countryErrors () {
      const errors = []
      !this.$v.country.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.country.$params.maxLength.max
          })
        )
      !this.$v.country.minLength &&
        errors.push(
          this.$t('$validation.min_length', {
            num: this.$v.country.$params.minLength.max
          })
        )
      return errors
    },
    shaValueErrors () {
      const errors = []
      if (!this.$v.shaValue.$dirty) return errors
      !this.$v.shaValue.required &&
        errors.push(this.$t('$validation.required'))
      return errors
    },
    distiguishNameErrors () {
      const errors = []
      if (!this.$v.distiguishName.$dirty) return errors
      !this.$v.distiguishName.required &&
        errors.push(this.$t('$validation.required'))
      return errors
    }
  },
  validations () {
    const validations = {}

    if (this.isUsingDN) {
      validations.distiguishName = {
        required
      }
      validations.commomName = {}
    } else {
      validations.distiguishName = {}
      validations.commomName = {
        required
      }
    }
    validations.country = {
      maxLength: maxLength(2),
      minLength: minLength(2)
    }
    validations.organization = {
      alphaNum
    }
    validations.organizationUnit = {
      alphaNum
    }
    validations.locality = {
      alphaNum
    }
    validations.stateValue = {
      alphaNum
    }
    return validations
  },
  methods: {
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    clearData () {
      this.loading = false
      this.isUsingDN = true
      this.organization = null
      this.organizationUnit = null
      this.commomName = null
      this.locality = null
      this.stateValue = null
      this.country = null
      this.email = null
      this.distiguishName = null
      this.csrMaterial = null
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    onCNSelected () {
      this.$v.$reset()
      this.$v.commomName.$touch()
      this.isUsingDN = false
      this.distiguishName = null
    },
    onDNSelected () {
      this.$v.$reset()
      this.$v.distiguishName.$touch()
      this.isUsingDN = true
      this.commomName = null
      this.organization = null
      this.organizationUnit = null
      this.locality = null
      this.stateValue = null
      this.country = null
      this.email = null
    },
    mountDNfromFields () {
      var dn = ''
      if (this.email) dn += '/E=' + this.email
      if (this.commomName) dn += '/CN=' + this.commomName
      if (this.organizationUnit) dn += '/OU=' + this.organizationUnit
      if (this.organization) dn += '/O=' + this.organization
      if (this.stateValue) dn += '/ST=' + this.stateValue
      if (this.locality) dn += '/L=' + this.locality
      if (this.country) dn += '/C=' + this.country
      return dn
    },
    submit () {
      this.loading = true
      const myDN = this.distiguishName !== null ? this.distiguishName : this.mountDNfromFields()
      this.$store.dispatch('resources/doGetCSR', { id: this.keyId, dn: myDN, hash: 'sha2256' })
        .then((res) => {
          this.$notify.success({})
          this.csrMaterial = res
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    }
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