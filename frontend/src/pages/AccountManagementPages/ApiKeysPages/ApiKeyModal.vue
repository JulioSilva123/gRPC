<template>
  <v-dialog @keydown.esc="closeModal" v-model="dialog" persistent max-width="600px" >
    <v-card outlined >
      <v-card-title>
        {{ title }}
        <v-spacer />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn id="ApiKeyModal_close" icon @click="closeModal" v-on="on">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('close') }} </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text class="pa-0">
        <template v-if="loading">
          <v-card flat min-height="200px">
            <v-row align="center" justify="center" class="h-20v">
              <v-progress-circular indeterminate :size="50" />
            </v-row>
          </v-card>
        </template>
        <template v-else>
          <v-stepper v-model="step">
            <v-stepper-content step="0">
              <v-form class="mt-4" @submit.prevent="submit">
                <v-text-field
                  id="ApiKeyModal_tag"
                  outlined
                  autocomplete="off"
                  :label="$tc('label')"
                  :error-messages="labelErrors"
                  @change="$v.label.$touch()"
                  @blur="$v.label.$touch()"
                  v-model="label"
                />
                <content-area v-if="isEdit" :items="unmutableInfo" class="px-1" />
                <v-row no-gutters>
                  <v-btn
                    id="ApiKeyModal_submit"
                    type="submit"
                    :disabled="$v.$invalid"
                    :dark="!$v.$invalid"
                    block
                    :loading="saving"
                  >
                    {{ isEdit ? $tc('update') : $tc('get_key') }}
                  </v-btn>
                </v-row>
              </v-form>
            </v-stepper-content>
            <v-stepper-content flat step="1">
              <v-alert
                class="my-4"
                color="warning"
                icon="warning"
              >
                {{ $tc('api_key_created') }}
              </v-alert>
              <v-text-field
                id="ApiKeyModal_token"
                :label="$tc('api_key')"
                class="monospaceInput hide-in-percy"
                data-private
                outlined
                readonly
                v-model="token"
              >
                <template v-slot:append>
                  <append-inner-button
                    icon="content_copy"
                    tooltip="copy"
                    :action="doCopy"
                    actionArg="ApiKeyModal_token"
                  />
                </template>
              </v-text-field>
            </v-stepper-content>
          </v-stepper>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import ContentArea from '@/components/ContentArea'
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
export default {
  components: { ContentArea, AppendInnerButton },
  props: {
    open: {
      type: Boolean,
      required: false,
      default: false
    },
    apiKeyId: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      dialog: false,
      label: null,
      created: null,
      saving: false,
      loading: false,
      step: 0,
      token: null
    }
  },
  computed: {
    isEdit () {
      return this.apiKeyId !== null
    },
    title () {
      if (this.isEdit) {
        return this.$tc('edit_api_key') 
      }
      else return this.$tc('create_api_key')
    },
    unmutableInfo () {
      return [
        {
          title: this.$tc('created_at'),
          data: this.$getDateString({ date: this.created }),
          id: 'created'
        },
      ]
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
    },
  },
  validations () {
    const validations = {}
    validations.label = {
      required,
      maxLength: maxLength(45),
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
    getApiKeyInfo () {
      this.loading = true
      this.$store.dispatch('account/getApiKey', { id: this.apiKeyId })
        .then(res => {
          const apiKeyInfo = this.$store.getters['account/GET_API_KEY_INFO'](res)
          this.label = apiKeyInfo.label
          this.created = apiKeyInfo.created
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    submit () {
      if (this.isEdit) this.editApiKey()
      else this.createApiKey()
    },
    editApiKey () {
      this.saving = true
      this.$store.dispatch('account/updateApiKey',
        { id: this.apiKeyId, label: this.label })
        .then(() => {
          this.$notify.success({ message: this.$tc('api_key_updated') })
          this.$store.dispatch('account/getApiKeyList')
            .then(() => {
              this.closeModal()
            })
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.saving = false
        })
    },
    createApiKey () {
      this.saving = true
      this.$store.dispatch('account/createApiKey', { label: this.label })
        .then(({ token }) => {
          this.step = 1
          this.token = token
          this.$notify.success({})
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.saving = false
        })
    },
    closeModal () {
      this.$emit('close', { keyCreated: this.token !== null })
      this.clearData()
    },
    clearData () {
      this.label = null
      this.step = 0
      this.token = null
      this.$v.$reset()
    }
    
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        if (this.isEdit) {
          this.getApiKeyInfo()
        }
      }
    }
  }
}
</script>

<style>
.theme--light.v-stepper {
  -webkit-box-shadow: 0 0 0 0 !important;
}
.theme--dark.v-stepper {
  -webkit-box-shadow: 0 0 0 0 !important;
}
</style>