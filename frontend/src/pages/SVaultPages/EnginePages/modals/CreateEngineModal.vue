<template>
  <v-dialog
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="600px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        {{ $tc('create_engine') }}
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
        <v-form @submit.prevent="submit">
          <v-text-field
            id="CreateEngineModal_tag"
            persistent-hint
            class="mt-2"
            :label="$tc('label')"
            outlined
            autocomplete="off"
            :hint="$t('engine_tag_hint')"
            :error-messages="tagErrors"
            @input="$v.tag.$touch()"
            @blur="$v.tag.$touch()"
            v-model="tag"
          />
          <v-select
            id="CreateEngineModal_condensedOption"
            data-cy='CreateEngineModal_condensedOption_select'
            persistent-hint
            class="mt-2"
            :label="$tc('engine_checksum')"
            outlined
            autocomplete="off"
            :items="condensedOptions"
            :hint="$t('vault_cks_hint')"
            :error-messages="condensedOptionErrors"
            @input="$v.condensedOption.$touch()"
            @blur="$v.condensedOption.$touch()"
            v-model="condensedOption"
          />
          <v-radio-group
            row
            v-model="storageOption"
            :hint="$t('engine_pref_storage')"
            persistent-hint
          >
            <v-radio
              v-for="opt in storageOptions"
              :id="opt.id"
              :key="opt.value"
              :ripple="false"
              :value="opt.value"
              :label="opt.label"
            />
          </v-radio-group>

          <p class="text-body-2 mt-6">{{ $t('engine_explanation') }}</p>
          <v-row no-gutters justify="end" class="pt-4">
            <v-btn
              id="CreateEngineModal_submit"
              :disabled="$v.$invalid"
              :dark="!$v.$invalid"
              type="submit"
              color="secondary"
              :loading="loading"
              :class="{ 'black--text': $vuetify.theme.dark }"
            >
              {{ $tc('create') }}
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { maxLength, required } from 'vuelidate/lib/validators'
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      dialog: false,
      loading: false,
      //
      tag: null,
      condensedOption: null,
      storageOption: 'internal'
      //
    }
  },
  computed: {
    storageOptions () {
      return [
        {
          label: this.$t('internal_storage'),
          value: 'internal',
          id: 'storage_internal'
        },
        {
          label: this.$t('external_storage'),
          value: 'external',
          id: 'storage_external'
        }
      ]
    },
    // Includes format and checksum
    condensedOptions () {
      return this.$store.getters['svault/GET_CONDENSED_OPTIONS']
    },
    // ERRORS
    tagErrors () {
      const errors = []
      if (!this.$v.tag.$dirty) return errors
      !this.$v.tag.required && errors.push(this.$t('$validation.required'))
      !this.$v.tag.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.tag.$params.maxLength.max
          })
        )
      return errors
    },
    condensedOptionErrors () {
      const errors = []
      if (!this.$v.condensedOption.$dirty) return errors
      !this.$v.condensedOption.required && errors.push(this.$t('$validation.required'))
      return errors
    },
  },
  validations () {
    const validations = {}
    validations.tag = {
      required,
      maxLength: maxLength(255),
    }
    validations.condensedOption = {
      required
    }
    return validations
  },
  methods: {
    clearData () {
      this.tag = null
      this.condensedOption = null
      this.storageOption = 'internal'
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      const body = {
        label: this.tag,
        format: this.condensedOption.format,
        checksum: this.condensedOption.checksum,
        storage: this.storageOption
      }
      this.$store.dispatch('svault/doCreateEngine', body)
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