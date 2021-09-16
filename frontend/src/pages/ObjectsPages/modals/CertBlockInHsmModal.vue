<template>
  <modal
    parent-name="CertBlockInHsmModal"
    v-bind="$props"
    @close="closeModal"
  > 
    <template v-slot:title>
      {{ $tc('block_cert') }}
    </template>

    <template v-slot:text>
      <v-card v-if="loading" flat min-height="200px">
        <v-row align="center" justify="center" class="h-20v">
          <v-progress-circular indeterminate :size="50" />
        </v-row>
      </v-card>
      <template v-else>
        <v-checkbox
          v-for="hsm in hsmList"
          :id="`CertBlockInHsmModal_${hsm.id}`"
          :key="hsm.id"
          :label="`${hsm.id} - ${hsm.name}`"
          v-model="hsm.isBlockedIn"
        />
      </template>
    </template>

    <template v-slot:actions>
      <v-spacer />
      <v-btn
        id="CertBlockInHsmModal_cancel"
        text
        class="text--secondary"
        @click="closeModal"
      >
        {{ $t('cancel') }}
      </v-btn>

      <v-btn
        id="CertBlockInHsmModal_apply"
        text
        @click="submit"
        :loading="saving"
      >
        {{ $t('apply') }}
      </v-btn>
    </template>
  </modal>
</template>

<script>
import { Modal } from '@dinamonetworks/gui-comps-lib';
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    certId: String,
    maxWidth: {
      type: String,
      required: false,
      default: '350px'
    },
  },
  components: { Modal },
  data () {
    return {
      dialog: false,
      hsmList: null,
      loading: false,
      saving: false
    }
  },
  methods: {
    getHsmList () {
      this.loading = true
      this.$store.dispatch('resources/doGetHsmsForBlockedCert', { id: this.certId })
        .then(({ hsmBlockedList }) => {
          this.hsmList = hsmBlockedList
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    clearData () {
      this.hsmList = null
    },
    closeModal () {
      this.$emit('close')
    },
    submit () {
      this.saving = true
      this.$store.dispatch('resources/updateHsmBlockStateInList', { certId: this.certId, hsmList: this.hsmList })
        .then(() => {
          this.$notify.success({})
          this.$emit('saved')
        })
        .finally(() => {
          this.saving = false
        })
    }
  },
  watch: {
    open (val) {
      this.dialog = val
      if (!val) {
        this.clearData()
      } else {
        this.getHsmList()
      }
    }
  }
}
</script>

<style>

</style>