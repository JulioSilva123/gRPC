<template>
  <modal
    parent-name="CertImportModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('import_cert') }}
    </template>

    <template v-slot:text>
      <v-form @submit.prevent="submit">
        <v-text-field
          id="CertImportModal_certLabel"
          outlined
          autocomplete="off"
          :label="$tc('label')"
          :error-messages="labelErrors"
          @input="$v.label.$touch()"
          @blur="$v.label.$touch()"
          v-model="label"
        />
        <drag-and-drop ref="upload" @file="addFile" :accepted-files="acceptedFiles" />
        <v-row no-gutters class="pt-6">
          <v-btn
            id="CertImportModal_submit"
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
import * as asn1js from 'asn1js'
import {
  toBase64,
  arrayBufferToString,
} from 'pvutils'

export default {
  components: {
    DragAndDrop,
    Modal
  },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data () {
    return {
      dialog: false,
      loading: false,
      label: null,
      material: null,
    }
  },
  computed: {
    acceptedFiles () {
      return ['.cer', '.crt']
    },
    // ERRORS
    labelErrors () {
      const errors = []
      if (!this.$v.label.$dirty) return errors
      !this.$v.label.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.label.$params.maxLength.max
          })
        )
      return errors
    }
  },
  validations () {
    const validations = {}
    validations.label = {
      maxLength: maxLength(255),
    }
    return validations
  },
  methods: {
    clearData () {
      this.loading = false
      this.label = null
      this.material = null
      this.$refs.upload.refresh()
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.loading = true
      this.$store.dispatch('resources/doImportCert', { file: this.material, certLabel: this.label })
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
    },
    // FILE HANDLING
    isDER (buffer) {
      let isDer
      const asn1 = asn1js.fromBER(buffer)
      if (asn1.offset === (-1)) isDer = false
      else isDer = true
      return isDer
    },
    covertPEMtoSingleLineMaterial (pemString) {
      // removing header and footer from PEM
      if (pemString[0] !== '-') return pemString
      let lines = pemString.split('\r\n')
      if (lines.length === 1) lines = pemString.split('\n')
      const beginIndex = lines.indexOf('-----BEGIN CERTIFICATE-----')
      const endIndex = lines.indexOf('-----END CERTIFICATE-----')
      lines = lines.slice(beginIndex + 1, endIndex)
      let noHeaderOrFooter = lines.join('')
      return noHeaderOrFooter
    },
    handleTextFile (e) {
      const text = e.target.result
      this.material = this.covertPEMtoSingleLineMaterial(text)
    },
    handleBinFile (e) {
      const buffer = e.target.result
      this.material = toBase64(arrayBufferToString(buffer))
    },
    addFile (file) {
      var reader = new FileReader()
      let self = this
      reader.onload = function () {
      const isDER = self.isDER(reader.result)
      const secondReader = new FileReader()
      // secondReader.onloadstart = () => {
      //   self.isReadingFile = true
      // }
      if (isDER) {
        // console.log('is ambiguos and Binary')
        secondReader.onload = self.handleBinFile
        secondReader.readAsArrayBuffer(file)
      } else {
        // console.log('is ambiguos and Text')
        secondReader.onload = self.handleTextFile
        secondReader.readAsText(file)
      }
    }
    reader.readAsArrayBuffer(file)
    },
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