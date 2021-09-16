<template>
  <v-dialog
    id="CreateTokenModal"
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="690px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        {{ $tc('tokenize_data') }}
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
            <v-stepper-step :complete="curStep > 1" step="1">{{ $tc('param_selection') }}</v-stepper-step>

            <v-divider/>
            <v-stepper-step :complete="curStep > 2" step="2">{{ $tc('data_entry') }}</v-stepper-step>

            <v-divider/>
            <v-stepper-step :complete="curStep > 3" step="3">{{ $tc('get_token') }}</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <param-selection-step
                :bus="bus"
                :open="open"
                @params-set="setParams"
                @engine-set="setEngine"
              />
            </v-stepper-content>

            <v-stepper-content step="2">
              <secret-entry-step
                :bus="bus"
                :engine-detail="selectedEngineDetail"
                :loading="encoding"
                @step-back="curStep--"
                @secret-set="doEncode"
              />
            </v-stepper-content>

            <v-stepper-content step="3">
              <token-blob-output-step
                :bus="bus"
                :token="vaultToken"
                :blob="vaultTokenBlob"
                @step-back="curStep--"
              />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import SecretEntryStep from './SecretEntryStep'
import ParamSelectionStep from './ParamSelectionStep/ParamSelectionStep'
import TokenBlobOutputStep from './TokenBlobOutputStep'
export default {
  components: {
    ParamSelectionStep, SecretEntryStep, TokenBlobOutputStep
  },
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    vaultId: String,
  },
  data () {
    return {
      dialog: false,
      curStep: 1,
      selectedEngine: null,
      persist: null,
      encoding: false,
      vaultToken: null,
      vaultTokenBlob: null,
      selectedEngineDetail: null,
      bus: new Vue(),
    }
  },
  methods: {
    closeModal () {
      this.$emit('close')
    },
    clearData () {
      this.curStep = 1
      // step 1
      this.selectedEngine = null
      this.selectedEngineDetail = null
      // step 2
      // none
      // step 3
      this.vaultToken = null
      this.vaultTokenBlob = null
      this.bus.$emit('cleardata')
    },
    // step 1
    setEngine ({ engineDetail }) {
      this.selectedEngineDetail = engineDetail
    },
    setParams ({ engine, persist }) {
      this.selectedEngine = engine
      this.persist = persist
      this.curStep++
    },
    // step 2
    doEncode ({ secret }) {
      this.encoding = true
      this.$store.dispatch('svault/doEncode', {
                                                vault: this.vaultId,
                                                engine: this.selectedEngine,
                                                persist: this.persist,
                                                value: secret })
        .then(res => {
          this.$notify.success({})
          this.vaultToken = res.token
          this.vaultTokenBlob = res.encoded_value
          this.curStep++
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.encoding = false
        })
    },
    // TODO: remove tokenCreated
    // step 3
    tokenCreated ({ token, blob }) {
      this.vaultToken = token
      this.vaultTokenBlob = blob
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