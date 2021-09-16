<template>
  <div>
    <div class="pt-1">
      <v-select
        outlined
        id="ParamSelectionStep_engine_selection"
        data-cy='ParamSelectionStep_engine_selection'
        :items="engineItems"
        :label="$t('select_engine')"
        :error-messages="engineErrors"
        @input="$v.engine.$touch()"
        @blur="$v.engine.$touch()"
        @change="engineChange"
        v-model="engine"
      />

      <template v-if="loading">
        <v-card flat min-height="200px">
          <v-row align="center" justify="center" class="h-20v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </v-card>
      </template>
      <content-area
        v-else-if="selectedEngineInfo"
        :items="selectedEngineInfo"
        class="px-1"
      />

      <!-- <p class="subtitle-2 mb-0 px-2 pt-2">{{ $t('encode_storage') }}</p>
      <v-radio-group
        row
        v-model="storageOption"
        :hint="$t('encode_persist_tip')"
        persistent-hint
      >
        <v-radio
          v-for="opt in storageOptions"
          :key="opt.value"
          :ripple="false"
          :value="opt.value"
          :label="opt.label"
        />
      </v-radio-group> -->

      <v-row no-gutters justify="end" class="pt-4">
        <v-btn
          id="ParamSelectionStep_submit"
          :disabled="engineDetail === null || engineDetail === undefined"
          :dark="!$v.$invalid"
          color="secondary"
          :class="{ 'black--text': $vuetify.theme.dark }"
          @click="engineSet"
        >
          {{ $tc('next') }}
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import ContentArea from '@/components/ContentArea'
import { required } from 'vuelidate/lib/validators'
export default {
  props: {
    bus: Object,
    open: Boolean
  },
  components: { ContentArea },
  mounted () {
    this.bus.$on('cleardata', this.clearData)
    if (!this.engineItems.length) {
      this.useEngine = false
    }
  },
  data () {
    return {
      dialog: false,
      engine: null,
      //TODO remove storageOption
      storageOption: null,
      loading: false,
      engineDetail: null,
      selectedEngineInfo: null
    }
  },
  computed: {
    storageOptions () {
      return [
        {
          label: this.$t('internal_storage'),
          value: 'internal'
        },
        {
          label: this.$t('external_storage'),
          value: 'external'
        }
      ]
    },
    engineItems () {
      return this.$store.getters['svault/GET_ENGINE_COMPACT_LIST']
    },
    // ERRORS
    engineErrors () {
      const errors = []
      if (!this.$v.engine.$dirty) return errors
      !this.$v.engine.required && errors.push(this.$t('$validation.required'))
      return errors
    },
  },
  validations () {
    const validations = {}
    validations.engine = {
      required
    }
    return validations
  },
  methods: {
    engineChange () {
      this.loading =  true
      this.$store.dispatch('svault/doGetEngineDetail', { id: this.engine })
        .then(detail => {
          delete detail.label
          delete detail.id
          delete detail.created
          this.engineDetail = detail
          this.selectedEngineInfo = this.$store.getters['svault/GET_CONDENSED_INFO'](detail)
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading =  false
        })
    },
    clearData () {
      this.engine = null
      this.storageOption = null
      this.engineDetail = null
      this.selectedEngineInfo = null
      this.$v.$reset()
    },
    closeModal () {
      this.$emit('close')
    },
    customParam () {
      // TODO delete engine fields not relevant for enconding
      // delete actionParams[paramName]
      // this.$emit('params-set', )
    },
    engineSet () {
      const persist = this.storageOption === 'internal'
      this.$emit('engine-set', { engineDetail: this.engineDetail })
      this.$emit('params-set', { engine: this.engine, persist })
    }
  },
}
</script>

<style>

</style>