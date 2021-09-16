<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="`${$tc('file_encryption')}`"
      page-name="FileEncryptionPage"
    >
      <template v-slot:body>
        <template v-if="loading">
          <v-row align="center" justify="center" class="h-70v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </template>
        <v-card v-else outlined class="mt-4 pa-4 py-0">
          <span class="error--text pl-5 caption">{{ materialErrors[0] }}</span>
          <drag-and-drop ref="upload" @file="addFile" @file-removed="removeFile"/>

          <select-two-name-items
            data-cy="FileEncryptionPage_secret_select"
            class="mt-2"
            outlined
            :label="$tc('file_encrypt_secret_label')"
            :hint="$t('file_encrypt_secret_hint')"
            :items="secretOptions"
            :error-messages="secretErrors"
            @input="$v.secret.$touch()"
            @blur="$v.secret.$touch()"
            v-model="secret"
          >
            <template v-slot:append>
              <append-inner-button
                btn-id="FileEncryptionPage_add_secret"
                icon="add_circle"
                tooltip="create_secret"
                :action="() => { showNewSecretModal = true }"
              />
            </template>
          </select-two-name-items>

          <v-text-field
            v-if="needsPwd"
            id="FileEncryptionPage_password"
            :label="`${$t('file_password')}`"
            class="mt-6"
            outlined
            autocomplete="off"
            :class="{ 'mx-16': $vuetify.breakpoint.lgAndUp }"
            :type="showPwd ? 'text' : 'password'"
            :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPwd = !showPwd"
            :error-messages="passwordErrors"
            counter
            :placeholder="`${$t('password')} - ${$t('$validation.min_length', {
              num: $v.password.$params.minLength.min
            })}`"
            v-model="password"
          />
          <v-row>
            <v-col
              cols="6"
            >
              <v-btn
                id="FileEncryptionPage_encrypt"
                block
                color="primary"
                :loading="gettingSecret && operation === IS_ENCRYPT"
                @click="encrypt"
              >
                {{ $t('encrypt') }}
              </v-btn>
            </v-col>
            <v-col
              cols="6"
              class="pl-1"
            >
              <v-btn
                id="FileEncryptionPage_decrypt"
                block
                color="tertiary"
                :loading="gettingSecret && operation === IS_DECRYPT"
                @click="decrypt"
              >
                {{ $t('decrypt') }}
              </v-btn>
            </v-col>
          </v-row>
          
          <p class="text-caption text--secondary mx-1 mb-1 mt-4">
            {{ $t('file_encryption_details') }}
          </p>
        </v-card>
        <p class="text-caption text--secondary mt-6 mx-1">
          {{ $t('file_encryption_msg') }}
          <b class="text-uppercase">Dinamo</b>.
        </p>
      </template>
    </default-page-template>

    <new-secret-modal
      :open="showNewSecretModal"
      @saved="secretCreated"
      @close="showNewSecretModal = false"
    />
  </div>

</template>

<script>
import * as fet from '@/plugins/fet_core.js';
import { required, minLength } from 'vuelidate/lib/validators'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import DragAndDrop from '@/components/DragAndDrop'
import NewSecretModal from '@/pages/ObjectsPages/modals/NewSecretModal.vue';
import { AppendInnerButton } from '@dinamonetworks/gui-comps-lib';
import SelectTwoNameItems from '@/components/fields/SelectTwoNameItems'
export default {
  components: {
    DefaultPageTemplate,
    DragAndDrop,
    NewSecretModal,
    AppendInnerButton,
    SelectTwoNameItems
  },
  props: {
    secretId: String
  },
  data () {
    return {
      IS_ENCRYPT: 1,
      IS_DECRYPT: 2,
      secret: null,
      password: '',
      file_info: "-",
      op_info: "-",
      iv: [],
      salt: [],
      d: [],
      file_size: 0,
      file_name: '',
      opMode: 0,
      showPwd: false,
      encMode: 0,
      fileReader: null,
      material: null, // used only for validations
      loading: false,
      gettingSecret: false,
      operation: null,
      pwd: null,
      showNewSecretModal: false
    }
  },
  mounted () {
    this.loadSecrets()
      .then(() => {
        if (this.secretId) {
          const secretRef = this.secretOptions.find((item) => item.value.id === this.secretId)
          if (secretRef) this.secret = secretRef
        }
      })
    fet.set_progress(this.setProgress)
    fet.set_error(this.showError)
  },
  computed: {
    needsPwd () {
      return this.secret ? this.secret.id === 'custom' : false
    },
    secretOptions () {
      return this.$store.getters['fileEncryption/GET_SECRET_SELECTION_LIST']
    },
    // ERRORS
    secretErrors () {
      const errors = []
      if (!this.$v.secret.$dirty) return errors
      !this.$v.secret.required && errors.push(this.$t('$validation.required'))
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push(this.$t('$validation.required'))
      !this.$v.password.minLength &&
        errors.push(
          this.$t('$validation.min_length', {
            num: this.$v.password.$params.minLength.min
          })
        )
      return errors
    },
    materialErrors () {
      const errors = []
      if (!this.$v.material.$dirty) return errors
      !this.$v.material.required && errors.push(this.$t('$validation.required'))
      return errors
    }
  },
  validations () {
    const validations = {}
    validations.secret = {
      required,
    }
    if (this.needsPwd) {
      validations.password = {
        required,
        minLength: minLength(fet.MIN_PWD)
      }
    }
    validations.material = {
      required,
    }
    return validations
  },
  methods: {
    // Secret creation
    loadSecrets () {
      return this.$store.dispatch('resources/doGetSecretList')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    secretCreated () {
      this.showNewSecretModal = false
      this.loadSecrets()
    },
    // File Encryption
    removeFile () {
      this.material = null
    },
    showError (msg) {
      console.log(msg)
      this.$notify.error({ message: this.$t('file_encryption_error') })
    },
    setProgress (self, message, value) {
      if (value === 100) {
        this.clearForm()
      }
    },
    clearForm () {
      this.password = ''
      this.material = null
      this.fileReader = null
      this.file_size = 0
      this.file_name = ''
      this.$refs.upload.refresh()
      this.$v.$reset()
    },
    checkForm () {
      this.$v.password.$touch()
      this.$v.material.$touch()
    },
    setPwd () {
      if (!this.needsPwd) {
        this.gettingSecret = true
        return this.$store.dispatch('resources/doExportSecret', { id: this.secret.id })
          .then((res) => {
            const info = this.$store.getters['resources/GET_SECRET_INFO'](res)
            this.pwd = info.data
            return this.pwd
          })
          .catch(error => {
            this.$store.dispatch('error/showErrorNotification', error)
          })
          .finally(() => {
            this.gettingSecret = false
          })
      } else return new Promise((resolve) => {
        this.pwd = this.password
        resolve(this.pwd)
      })
    },
    encrypt () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      this.operation = this.IS_ENCRYPT
      this.setPwd()
        .then(() => {
          fet.encrypt(this, this.fileReader)
        })
    },
    decrypt  () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      this.operation = this.IS_DECRYPT
      this.setPwd()
        .then(() => {
          fet.decrypt(this, this.fileReader)
        })
    },
    addFile (file) {
      this.material = file // for validations

      this.fileReader = new FileReader()
      const self = this
      this.fileReader.onload = function() {
        self.file_name = file.name
        self.file_size = file.size
      }

      this.fileReader.readAsArrayBuffer(file);
    },
  },

}
</script>

<style>

</style>