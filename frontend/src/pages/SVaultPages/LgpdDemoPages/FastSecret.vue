<template>
  <modal
    parent-name="FastSecret"
    v-bind="$props"
    @close="close"
  >
    <template v-slot:title>
      {{ $t('retrieve_data') }}
    </template>
    <template v-slot:text>
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
                id="FastSecret_token"
                outlined
                v-model="token"
                :label="$tc('token')"
                @input="$v.token.$touch()"
                @blur="$v.token.$touch()"
              />
              <v-text-field
                id="FastSecret_mask"
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

              <v-row no-gutters class="pt-6">
                <v-spacer />
                <v-btn
                  id="FastSecret_submit"
                  type="submit"
                  :disabled="$v.$invalid"
                  :dark="!$v.$invalid"
                  :loading="loading"
                >
                  {{ $tc('retrieve') }}
                </v-btn>
              </v-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-textarea
              id="FastSecret_decodeSecret"
              :label="$tc('original_data')"
              row="3"
              row-height="20"
              auto-grow
              outlined
              hide-details
              readonly
              class="mt-1"
              data-private
              v-model="secret"
            >
              <template v-slot:append>
                <append-inner-button
                  icon="content_copy"
                  tooltip="copy"
                  :action="doCopy"
                  actionArg="FastSecret_decodeSecret"
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
    </template>
  </modal>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { Modal } from '@dinamonetworks/gui-comps-lib';
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
const demoVaultLabel = 'vault_lgpd_automatic'
export default {
  components: { Modal, AppendInnerButton },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data () {
    return {
      showMaskHelp: false,
      secret: null,
      loading: false,
      token: null,
      curStep: 1,
      maskMaxLen: 255,
      mask: null,
      vaultId: null
    }
  },
  computed: {
    vaultItems () {
      return this.$store.getters['svault/GET_VAULT_LIST']
    },
    // ERRORS
    tokenErrors () {
      const errors = []
      if (!this.$v.token.$dirty) return errors
      !this.$v.token.required && errors.push(this.$t('$validation.required'))
      return errors
    },
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
    let validations = {}
    validations.token = { required }
    const validMasks = value => {
      if (!value) return true
      const expression = /^[*_]*$/g
      return expression.test(value)
    }

    validations.mask = {
      maxLength: maxLength(this.maskMaxLen),
      validMasks
    }
    validations.token = { required }
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
      this.curStep = 1
      this.token = null
      this.secret = null
      this.showMaskHelp = false
      this.loading = false
      this.$v.$reset()
    },
    close () {
      this.clearData()
      this.$emit('close')
    },
    findVault () {
      const found = this.vaultItems.find(vault => {
        return vault.label === demoVaultLabel
      })
        if (found) {
          this.vaultId = found.id
        }
    },
    submit () {
      this.loading = true
      this.$store.dispatch('svault/doDecodeToken', {
                                              vaultId: this.vaultId,
                                              token: this.token,
                                              mask: this.mask
                                            })
        .then((res) => {
          this.secret = res
          this.curStep++
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
      if (!val) {
        this.clearData()
      } else {
        this.findVault()
      }
    }
  }

}
</script>

<style>

</style>
Modal