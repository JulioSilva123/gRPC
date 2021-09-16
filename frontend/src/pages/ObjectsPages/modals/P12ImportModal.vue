<template>
  <modal
    parent-name="P12ImportModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('import_p12') }}
    </template>
    <template v-slot:text>
      <v-form @submit.prevent="submit">
        <v-text-field
          id="P12ImportModal_certLabel"
          outlined
          autocomplete="off"
          :label="$tc('cert_label')"
          :error-messages="labelCertErrors"
          @input="$v.labelCert.$touch()"
          @blur="$v.labelCert.$touch()"
          v-model="labelCert"
        />
        <v-text-field
          id="P12ImportModal_keyLabel"
          outlined
          autocomplete="off"
          :label="$tc('key_label')"
          :error-messages="labelKeyErrors"
          @input="$v.labelKey.$touch()"
          @blur="$v.labelKey.$touch()"
          v-model="labelKey"
        />
        <v-text-field
          outlined
          id="P12ImportModal_password"
          autocomplete="new-password"
          :label="$tc('password')"
          :error-messages="passwordErrors"
          :type="showPwd ? 'text' : 'password'"
          :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPwd = !showPwd"
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          v-model="password"
        />
        <drag-and-drop ref="upload" @file="addFile" :accepted-files="acceptedFiles" />
        <v-row no-gutters class="pt-6">
          <v-btn
            id="P12ImportModal_submit"
            type="submit"
            :disabled="$v.$invalid || !material"
            :dark="!$v.$invalid && material !== null"
            block
            :loading="loading"
          >
            {{ $tc('import') }}
          </v-btn>
        </v-row>
      </v-form>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
import { maxLength } from 'vuelidate/lib/validators'
import DragAndDrop from '@/components/DragAndDrop'
import {
  toBase64,
  arrayBufferToString,
} from 'pvutils'
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    maxWidth: {
      type: String,
      required: false,
      default: '690px'
    },
  },
  components: {
    DragAndDrop,
    Modal
  },
  data () {
    return {
      dialog: false,
      showPwd: false,
      password: null,
      loading: false,
      labelCert: null,
      labelKey: null,
      material: null,
    }
  },
  computed: {
    acceptedFiles () {
      return ['.pfx', '.p12', 'pkcs12']
    },
    // ERRORS
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.password.$params.maxLength.max
          })
        )
      return errors
    },
    labelCertErrors () {
      const errors = []
      if (!this.$v.labelCert.$dirty) return errors
      !this.$v.labelCert.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.labelCert.$params.maxLength.max
          })
        )
      return errors
    },
    labelKeyErrors () {
      const errors = []
      if (!this.$v.labelKey.$dirty) return errors
      !this.$v.labelKey.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.labelKey.$params.maxLength.max
          })
        )
      return errors
    },
  },
  validations () {
    const validations = {}
    validations.password = {
      maxLength: maxLength(16)
    }
    validations.labelCert = {
      maxLength: maxLength(255),
    }
    validations.labelKey = {
      maxLength: maxLength(255),
    }
    return validations
  },
  methods: {
    handleBinFile (e) {
      const buffer = e.target.result
      this.material = toBase64(arrayBufferToString(buffer))
    },
    addFile (file) {
      var reader = new FileReader()
      reader.onload = this.handleBinFile
      reader.readAsArrayBuffer(file)
    },
    clearData () {
      this.material = null
      this.password = null
      this.labelCert = null
      this.labelKey = null
      this.$refs.upload.refresh()
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.loading = true
      const body = {
        file: this.material,
        keylabel: this.labelKey,
        certlabel: this.labelCert,
        password: this.password,
      }
      this.$store.dispatch('resources/doImportKey', body)
        .then(() => {
          this.$notify.success({})
          this.$emit('saved')
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