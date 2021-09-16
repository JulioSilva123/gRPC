<template>
  <modal
    parent-name="FastTokenization"
    v-bind="$props"
    @close="close"
  >
    <template v-slot:title>
      {{ $t('tokenize_data') }}
    </template>
    <template v-slot:text>
      <v-stepper v-model="curStep">
        <v-stepper-header>
          <v-stepper-step :complete="curStep > 1" step="1">{{ $tc('data_entry') }}</v-stepper-step>

          <v-divider/>
          <v-stepper-step :complete="curStep > 2" step="2">{{ $tc('get_token') }}</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form @submit.prevent="submit">
              <v-select
                id="FastTokenization_fastOption"
                data-cy='FastTokenization_fastOption_select'
                persistent-hint
                class="mt-2"
                :label="$tc('engine_checksum')"
                outlined
                autocomplete="off"
                :items="fastOptions"
                :hint="$t('vault_cks_hint')"
                :error-messages="fastOptionErrors"
                @input="$v.fastOption.$touch()"
                @blur="$v.fastOption.$touch()"
                v-model="fastOption"
              />
              <v-textarea
                id="FastTokenization_secret"
                :label="$tc('original_data')"
                row="3"
                row-height="20"
                auto-grow
                outlined
                autocomplete="off"
                :hint="$t('vault_data_hint')"
                :error-messages="secretErrors"
                @input="$v.secret.$touch()"
                @blur="$v.secret.$touch()"
                class="pt-1"
                :counter="secretCounter"
                data-private
                v-model="secret"
              />
              <v-row no-gutters justify="end" class="pt-6">
                <v-btn
                  id="FastTokenization_submit"
                  type="submit"
                  :disabled="$v.$invalid"
                  :dark="!$v.$invalid"
                  block
                  :loading="loading"
                >
                  {{ $tc('tokenize') }}
                </v-btn>
              </v-row>
            </v-form>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-textarea
              id="FastTokenization_token"
              :label="$tc('token')"
              outlined
              autocomplete="off"
              :hint="$t('token_output_hint')"
              class="mt-1"
              readonly
              row="3"
              row-height="20"
              auto-grow
              persistent-hint
              :value="token"
            >
              <template v-slot:append>
                <append-inner-button
                  icon="content_copy"
                  tooltip="copy"
                  :action="doCopy"
                  :actionArg="`FastTokenization_token`"
                />
              </template>
            </v-textarea>

            <v-row no-gutters justify="end" class="mt-2">
              <v-btn
                id="FastTokenization_back"
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
import { validCPF, validCNPJ } from '@/plugins/globals.plugin.js'
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
import { required, maxLength, minLength, numeric } from 'vuelidate/lib/validators'
import { Modal } from '@dinamonetworks/gui-comps-lib';
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
      secret: null,
      cpfMaxLen: 11,
      cnpjMaxLen: 14,
      panMaxLen: 16,
      fastOption: null,
      loading: false,
      token: null,
      curStep: 1,
    }
  },
  computed: {
    engineItems () {
      return this.$store.getters['svault/GET_ENGINE_LIST']
    },
    vaultItems () {
      return this.$store.getters['svault/GET_VAULT_LIST']
    },
    fastOptions () {
      return this.$store.getters['svault/FAST_OPTIONS']
    },
    secretCounter () {
      if (!this.fastOption) return undefined
      return this.$data[`${this.fastOption.checksum}MaxLen`]
    },
    secretErrors () {
      const errors = []
      if (!this.$v.secret.$dirty) return errors
      !this.$v.secret.required && errors.push(this.$t('$validation.required'))

      if (this.fastOption) { 
        !this.$v.secret.maxLength && errors.push(this.$t('$validation.max_length', {
          num: this.$v.secret.$params.maxLength.max
        }))

        !this.$v.secret.minLength && errors.push(this.$t('$validation.min_length', {
          num: this.$v.secret.$params.minLength.min
        }))
        this.$v.secret.validCPF === false && errors.push(this.$t('$validation.invalid', { field: 'CPF'}))
        this.$v.secret.validCNPJ === false && errors.push(this.$t('$validation.invalid', { field: 'CNPJ'}))
      }
      return errors
    },
    fastOptionErrors () {
      const errors = []
      if (!this.$v.fastOption.$dirty) return errors
      !this.$v.fastOption.required && errors.push(this.$t('$validation.required'))
      return errors
    },
  },
  validations () {
    const validations = {}
    const condensedValidations = {
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
      pan: {
        numeric,
        maxLength: maxLength(this.panMaxLen),
        minLength: minLength(this.panMaxLen)
      },
    }
    validations.secret = {
      required,
    }
    if (this.fastOption) {
      validations.secret = {
        ...validations.secret,
        ...condensedValidations[this.fastOption.checksum]
      }      
    }
    validations.fastOption = {
      required
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
      this.curStep = 1
      this.token = null
      this.fastOption = null
      this.secret = null
      this.$v.$reset()
    },
    close () {
      this.clearData()
      this.$emit('close')
    },
    submit () {
      let createdEngine
      let vaultId
      // find vault or create it
      const vaultPromise = new Promise((resolve) => {
        const found = this.vaultItems.find(vault => {
          return vault.label === demoVaultLabel
        })
        if (!found) {
          resolve(this.$store.dispatch('svault/doCreateVault', { label: demoVaultLabel }))
        } else {
          resolve(found)
        }
      })

      const enginePromise = new Promise((resolve) => {
        const found = this.engineItems.find(engine => {
          return engine.label === `enigine_${this.fastOption.checksum}_lgpd_automatic`
        })
        if (!found) {
          const body = {
            label: `enigine_${this.fastOption.checksum}_lgpd_automatic`,
            format: this.fastOption.format,
            checksum: this.fastOption.checksum,
            storage: 'internal'
          }          
          resolve(this.$store.dispatch('svault/doCreateEngine', body))
        } else {
          resolve(found)
        }
      })

      this.loading = true
      vaultPromise
        .then(vault => {
          vaultId = vault.id
          return enginePromise
        })
        .then((res) => {
          createdEngine = res.id
          return this.$store.dispatch('svault/doEncode', {
                                                    vault: vaultId,
                                                    engine: createdEngine,
                                                    value: this.secret
                                                  })
        })
        .then(res => {
          this.token = res.token
          this.curStep++
          this.$notify.success({})
          this.$store.dispatch('svault/doGetVaultList'),
          this.$store.dispatch('svault/doGetEngineList')
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
      }
    }
  }
}
</script>

<style>

</style>