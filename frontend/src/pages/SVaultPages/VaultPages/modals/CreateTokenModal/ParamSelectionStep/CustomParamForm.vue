<template>
  <v-form @submit.prevent="submit">
    <v-select
      id="CustomParamForm_base"
      class="mt-2"
      :label="$tc('engine_format')"
      outlined
      autocomplete="off"
      :items="baseOptions"
      :hint="$t('vault_base_hint')"
      :error-messages="baseErrors"
      @input="$v.base.$touch()"
      @blur="$v.base.$touch()"
      v-model="base"
    />
    <v-select
      id="CustomParamForm_cks"
      class="mt-2"
      :label="$tc('cks')"
      outlined
      autocomplete="off"
      :items="cksOptions"
      :hint="$t('vault_cks_hint')"
      :error-messages="cksErrors"
      @input="$v.cks.$touch()"
      @blur="$v.cks.$touch()"
      v-model="cks"
    />
    <v-text-field
      id="CustomParamForm_mask"
      class="mt-2"
      :label="$tc('mask')"
      outlined
      autocomplete="off"
      :hint="$t('vault_mask_encode_hint')"
      :error-messages="maskErrors"
      @input="$v.mask.$touch()"
      @blur="$v.mask.$touch()"
      v-model="mask"
    />
    
    <v-row no-gutters justify="end" class="pt-4">
      <span v-if="!hasAnyEngine">{{ $t('no_engine_tip') }}</span>
      <v-spacer/>
      <v-btn
        id="CustomParamForm_submit"
        dark
        type="submit"
        color="secondary"
        :class="{ 'black--text': $vuetify.theme.dark }"
      >
        {{ $tc('next') }}
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { maxLength, required } from 'vuelidate/lib/validators'
export default {
  props: {
    bus: Object,
    hasAnyEngine: Boolean
  },
  mounted() {
    this.bus.$on('cleardata', this.clearData)
  },
  data () {
    return {
      //
      base: null,
      cks: null,
      mask: null,
      //
    }
  },
  computed: {
    cksOptions () {
      return this.$store.getters['svault/GET_CKS_OPTIONS']
    },
    baseOptions () {
      return this.$store.getters['svault/GET_VFORMAT_OPTIONS']
    },
    
    cksErrors () {
      const errors = []
      if (!this.$v.cks.$dirty) return errors
      !this.$v.cks.required && errors.push(this.$t('$validation.required'))
      return errors
    },
    baseErrors () {
      const errors = []
      if (!this.$v.base.$dirty) return errors
      !this.$v.base.required && errors.push(this.$t('$validation.required'))
      return errors
    },
    maskErrors () {
      const errors = []
      if (!this.$v.mask.$dirty) return errors
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
    validations.cks = {
      required
    }
    validations.base = {
      required
    }
    validations.mask = {
      maxLength: maxLength(255)
    }
    return validations
  },
  methods: {
    clearData () {
      this.cks = null
      this.base = null
      this.mask = null
    },
    // create token
    submit () {
      this.$emit('params', {
        cks: this.cks,
        base: this.base,
        mask: this.mask
      })
    }
  }
}
</script>

<style>

</style>