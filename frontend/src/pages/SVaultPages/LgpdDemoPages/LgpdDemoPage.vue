<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="`${this.$tc('tokenize')} / ${this.$tc('retrieve')}`"
      page-name="FileEncryptionPage"
    >
      <template v-slot:body>
        <service-readiness-check
          v-if="loading || !readyToUse"
          :loading="loading"
          :mandatoryOccurrenceTypes="occurrenceTypes"
          service-alias="LGPD Anonimização"
          parent-name="LgpdDemoPage"
          @ready="setReady"
        />
        <v-card v-else outlined class="mt-4 pa-4">
          <v-row>
            <v-col :cols="demoVaultExists ? 6 : 12">
              <v-btn
                block
                height="350"
                @click="showTokenModal = true"
              >
                <v-row>
                  <v-col cols="12">
                    <v-icon size="150">lock_outline</v-icon>
                  </v-col>
                  <v-col cols="12">
                    {{ $t('tokenize_data') }}
                  </v-col>
                </v-row>
              </v-btn>
            </v-col>
            <v-col v-if="demoVaultExists" cols="6">
              <v-btn
                block
                height="350"
                @click="showRetrieveModal = true"
              >
                <v-row>
                  <v-col cols="12">
                    <v-icon size="150">lock_open</v-icon>
                  </v-col>
                  <v-col cols="12">
                    {{ $t('retrieve_data') }}
                  </v-col>
                </v-row>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </default-page-template>
    <fast-tokenization
      :open="showTokenModal"
      @close="showTokenModal = false"
    />
    <fast-secret
      :open="showRetrieveModal"
      @close="showRetrieveModal = false"
    />
  </div>
</template>

<script>
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import FastTokenization from './FastTokenization'
import FastSecret from './FastSecret'
import ServiceReadinessCheck from '@/components/ServiceReadinessCheck'
import { SVAULT_TOKEN_OC_TYPE, SVAULT_SECRET_OC_TYPE } from '@/plugins/globals.plugin'
const demoVaultLabel = 'vault_lgpd_automatic'
export default {
  components: {
    DefaultPageTemplate,
    FastTokenization,
    FastSecret,
    ServiceReadinessCheck,
  },
  data () {
    return {
      showRetrieveModal: false,
      showTokenModal: false,
      loading: false,
      readyToUse: false
    }
  },
  computed: {
    occurrenceTypes () {
      return [SVAULT_TOKEN_OC_TYPE, SVAULT_SECRET_OC_TYPE]
    },
    demoVaultExists () {
      const vaultItems = this.$store.getters['svault/GET_VAULT_LIST']
      return vaultItems.find(vault => {
        return vault.label === demoVaultLabel
      })
    },
  },
  methods: {
    loadResources () {
      this.loading = true
      Promise.all([
        this.$store.dispatch('svault/doGetVaultList'),
        this.$store.dispatch('svault/doGetEngineList')
      ])
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
      .finally(() => {
        this.loading = false
      })
    },
    setReady (isReady) {
      this.readyToUse = isReady
      if (this.readyToUse) this.loadResources()
    }
  }
}
</script>

<style>

</style>