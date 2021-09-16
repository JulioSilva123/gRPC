<template>
  <modal
    parent-name="NewSecretModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('create_secret') }}
    </template>

    <template v-slot:text>
      <v-form @submit.prevent="submit" class="mt-4">
        <v-text-field
          id="NewSecretModal_tag"
          outlined
          autocomplete="off"
          :label="$tc('label')"
          v-model="label"
        />

        <v-row no-gutters>
          <v-btn
            id="NewSecretModal_submit"
            type="submit"
            :disabled="$v.$invalid"
            :dark="!$v.$invalid"
            block
            :loading="loading"
          >
            {{ $tc('create') }}
          </v-btn>
        </v-row>
      </v-form>
    </template>
  </modal>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import { Modal } from '@dinamonetworks/gui-comps-lib';
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  components: { Modal },
  data () {
    return {
      dialog: false,
      loading: false,
      label: null,
    }
  },
  computed: {
    // ERRORS
    labelErrors () {
      const errors = []
      if (!this.$v.label.$dirty) return errors
      !this.$v.label.required && errors.push(this.$t('$validation.required'))
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
      maxLength: maxLength(255),
    }
    return validations
  },
  methods: {
    clearData () {
      this.label = null
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.loading = true
      this.$store.dispatch('resources/doCreateSecret', { id: this.objectId, label: this.label })
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