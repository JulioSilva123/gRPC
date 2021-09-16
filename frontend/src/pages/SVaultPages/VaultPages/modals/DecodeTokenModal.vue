<template>
  <v-dialog
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="690px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        {{ showTokenInput ? $tc('retrieve_data_external') : $tc('retrieve_data_cloud') }}
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
        <v-stepper v-model="curStep">
          <v-stepper-header>
            <v-stepper-step :complete="curStep > 1" step="1">{{ $tc('input', 2) }}</v-stepper-step>

            <v-divider/>
            <v-stepper-step :complete="curStep > 2" step="2">{{ $tc('retrieve_data') }}</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-form @submit.prevent="submit">
                <v-text-field
                  id="DecodeTokenModal_mask"
                  class="mt-2"
                  :label="$tc('mask')"
                  outlined
                  autocomplete="off"
                  :hint="$t('vault_mask_decode_hint')"
                  :error-messages="maskErrors"
                  @input="$v.mask.$touch()"
                  @blur="$v.mask.$touch()"
                  :counter="maskMaxLen"
                  v-model="mask"
                >
                  <template v-slot:append>
                    <append-inner-button
                      icon="help_outline"
                      tooltip="show_field_help"
                      @click="showMaskHelp = !showMaskHelp"
                    />
                  </template>
                </v-text-field>

                <p class="mb-6" v-if="showMaskHelp">{{ $t('help.mask') }}</p>

                <template v-if="showTokenInput">
                  <drag-and-drop
                    ref="upload"
                    @file="addFile"
                  />
                  <span class="caption">{{ $t('decode_file_input_hint') }}</span>
                </template>

                <v-row no-gutters class="pt-6">
                  <v-spacer />
                  <v-btn
                    id="DecodeTokenModal_submit"
                    type="submit"
                    :disabled="$v.$invalid || !encodeValue"
                    :dark="!$v.$invalid && encodeValue !== null"
                    :loading="loading"
                  >
                    {{ $tc('retrieve') }}
                  </v-btn>
                </v-row>
              </v-form>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-textarea
                id="DecodeTokenModal_decodeSecret"
                :label="$tc('original_data')"
                row="3"
                row-height="20"
                auto-grow
                outlined
                hide-details
                readonly
                :hint="$t('vault_data_hint')"
                class="mt-1"
                data-private
                v-model="decodeSecret"
              >
                <template v-slot:append>
                  <append-inner-button
                    icon="content_copy"
                    tooltip="copy"
                    :action="doCopy"
                    actionArg="DecodeTokenModal_decodeSecret"
                  />
                </template>
              </v-textarea>

              <v-row no-gutters justify="end" class="mt-2">
                <v-btn
                  id="TokenParamStep_back"
                  dark
                  outlined
                  color="secondary"
                  @click="curStep--"
                  :class="{ 'black--text': $vuetify.theme.dark }"
                >
                  {{ $tc('back') }}
                </v-btn>
              </v-row>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { maxLength } from 'vuelidate/lib/validators'
import DragAndDrop from '@/components/DragAndDrop'
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
import { toBase64, arrayBufferToString } from 'pvutils'
export default {
  props: {
    token: String,
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    vaultId: String,
  },
  components: { DragAndDrop, AppendInnerButton },
  data () {
    return {
      dialog: false,
      encodeValue: null,
      showMaskHelp: false,
      mask: null,
      curStep: 1,
      decodeSecret: null,
      loading: false,
      maskMaxLen: 255,
      showTokenInput: false
    }
  },
  computed: {
    // ERRORS
    maskErrors () {
      const errors = []
      if (!this.$v.mask.$dirty) return errors
      !this.$v.mask.validMasks && errors.push(this.$t('$validation.invalid_mask'))
      !this.$v.mask.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.mask.$params.maxLength.max
          })
        )
      return errors
    },
  },
  validations () {
    const validations = {}

    const validMasks = value => {
      if (!value) return true
      const expression = /^[*_]*$/g
      return expression.test(value)
    }

    validations.mask = {
      maxLength: maxLength(this.maskMaxLen),
      validMasks
    }
    return validations
  },
  methods: {
    clearData () {
      if (this.showTokenInput) this.$refs.upload.refresh()
      this.showMaskHelp = false
      this.encodeValue = null
      this.mask = null,
      this.curStep = 1
      this.decodeSecret = null
      this.loading = false
      this.$v.$reset()
    },
    handleBinFile (e) {
      const buffer = e.target.result
      this.encodeValue = toBase64(arrayBufferToString(buffer))
    },
    addFile (file) {
      var reader = new FileReader()
      reader.onload = this.handleBinFile
      reader.readAsArrayBuffer(file)
    },
    doCopy (elementId) {
      const ele = `#${elementId}`
      var copyText = document.querySelector(ele);
      copyText.select();
      document.execCommand("copy");
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.loading = true

      let decodeAction
      let actionsParams
      if (this.token) {
        decodeAction = 'svault/doDecodeToken'
        actionsParams = { vaultId: this.vaultId, token: this.token, mask: this.mask }
      } else {
        decodeAction = 'svault/doDecode'
        actionsParams = { vaultId: this.vaultId, encoded_value: this.encodeValue, mask: this.mask }
      }
      this.$store.dispatch(decodeAction, actionsParams)
        .then((res) => {
          this.decodeSecret = res
          this.curStep++
          this.$notify.success({})
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
      } else {
        this.showTokenInput = this.token === null || this.token === undefined
        if (this.token) {
          this.encodeValue = this.token
        }
      }
    }
  }
}
</script>

<style>

</style>