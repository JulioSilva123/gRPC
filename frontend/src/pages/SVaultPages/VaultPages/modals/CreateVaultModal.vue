<template>
  <v-dialog
    @keydown.esc="closeModal"
    v-model="dialog"
    max-width="690px"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title>
        {{ $tc('create_vault') }}
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
            id="CreateVaultModal_tag"
            :label="$tc('label')"
            :hint="$t('create_vault_hint')"
            outlined
            autocomplete="off"
            class="mt-1"
            v-model="tag"
          />
          <v-row no-gutters justify="end">
            <v-btn
              id="CreateVaultModal_submit"
              type="submit"
              :disabled="$v.$invalid"
              :dark="!$v.$invalid"
              :loading="loading"
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
import { maxLength } from 'vuelidate/lib/validators'
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
      tag: null,
    }
  },
  computed: {
    // ERRORS
    tagErrors () {
      const errors = []
      if (!this.$v.tag.$dirty) return errors
      !this.$v.tag.maxLength &&
        errors.push(
          this.$t('$validation.max_length', {
            num: this.$v.tag.$params.maxLength.max
          })
        )
      return errors
    }
  },
  validations () {
    const validations = {}
    validations.tag = {
      maxLength: maxLength(255),
    }
    return validations
  },
  methods: {
    clearData () {
      this.tag = null
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.loading = true
      this.$store.dispatch('svault/doCreateVault', { label: this.tag })
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