<template>
  <div class="pt-4 pb-6">
    <default-page-template
      v-if="!$route.params.id"
      :title="$tc('vault', 2)"
      page-name="VaultPage"
    >
      <template v-slot:actions>
        <v-tooltip v-if="vaultItems && vaultItems.length" top>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="showCreateVaultModal = true"
              id="VaultPage_add_vault"
              v-on="on"
              icon
            >
              <v-icon>
                add
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('create_vault') }}</span>
        </v-tooltip>
      </template>
      
      <template v-slot:body>
        <v-row no-gutters>
          <v-col cols="12">
            <service-readiness-check
              v-if="loading || !readyToUse"
              :loading="loading"
              :mandatoryOccurrenceTypes="occurrenceTypes"
              service-alias="LGPD Anonimização"
              parent-name="VaultPage"
              @ready="setReady"
            />
            <vault-table
              v-else-if="vaultItems && vaultItems.length"
              :fetching="loading"
              :items="vaultItems"
              @open-vault="openVault"
              @delete="askToRemoveVault"
              @encode="openCreateTokenModal"
              @decode="openDecodeModal"
            />
            <no-data-card
              v-else
              icon="mdi-safe"
              :title="$tc('no_vault_title')"
              :subtitle="$tc('no_vault_subtitle')"
              :button-title="$tc('create')"
              buttonId="VaultPage_noDataBtn"
              @action="showCreateVaultModal = true"
            />
          </v-col>
        </v-row>
      </template>
    </default-page-template>

    <token-page
      v-else
      :vaultId="$route.params.id"
      @createtoken="openCreateTokenModal"
    />

    <create-vault-modal
      :open="showCreateVaultModal"
      @saved="newVaultSaved"
      @close="showCreateVaultModal = false"
    />

    <create-token-modal
      :open="showCreateTokenModal"
      :vaultId="selectedVaultId"
      @close="closeCreateTokenModal"
    />

    <decode-token-modal
      :open="showDecodeModal"
      :vaultId="selectedVaultId"
      @close="closeDecodeModal()"
    />

    <confirm-modal
      id="confirm_modal"
      confirm
      critical
      :open="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :submessage="$t('vault_deletion_warning')"
      :title-subject="selectedVault"
      :body-subject="confirmSubject"
      @negative="closeConfirmModal"
      @positive="removeVault"
    />
    <attention-modal
      :open="showAttentionModal"
      :title="attModalTitle"
      :body="attModalBody"
      :action="attModalAction"
      :btnTitle="attModalBtnTitle"
      :btnId="attModalBtnId"
      @close="showAttentionModal = false"
    />
  </div>
</template>

<script>
import AttentionModal from '@/components/AttentionModal'
import VaultTable from './VaultDataTable'
import ConfirmModal from '@/components/ConfirmModal'
import CreateVaultModal from './modals/CreateVaultModal'
import DecodeTokenModal from './modals/DecodeTokenModal'
import CreateTokenModal from './modals/CreateTokenModal/CreateTokenModal'
import ServiceReadinessCheck from '@/components/ServiceReadinessCheck'
import NoDataCard from '@/components/NoDataCard'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import TokenPage from '../TokenPages/TokenPage.vue'
import attentionModalMixin from '@/mixins/attentionModal.js'
import { SVAULT_TOKEN_OC_TYPE, SVAULT_SECRET_OC_TYPE } from '@/plugins/globals.plugin'

export default {
  mixins: [attentionModalMixin],
  components: {
    AttentionModal,
    CreateVaultModal,
    CreateTokenModal,
    DecodeTokenModal,
    VaultTable,
    ConfirmModal,
    NoDataCard,
    ServiceReadinessCheck,
    DefaultPageTemplate,
    TokenPage
  },
  data: () => ({
    selectedVault: null,
    showCreateVaultModal: false,
    showCreateTokenModal: false,
    showDecodeModal: false,
    showConfirmModal: false,
    showAttentionModal: false,
    selectedVaultId: null,
    confirmTitle: null,
    confirmMessage: null,
    confirmSubject: null,
    noDataCardParams: null,
    loading: false,
    readyToUse: false
  }),
  computed: {
    vaultItems () {
      return this.$store.getters['svault/GET_VAULT_LIST']
    },
    hasAnyEngine () {
      return this.$store.getters['svault/GET_ENGINE_LIST'].length > 0
    },
    occurrenceTypes () {
      return [SVAULT_TOKEN_OC_TYPE, SVAULT_SECRET_OC_TYPE]
    },
  },
  methods: {
    openVault (id) {
      this.$router.push({ name: 'vault', params: { id }})
    },
    // ENCODE
    openCreateTokenModal (id) {
      if (this.hasAnyEngine) {
        this.selectedVaultId = id
        this.showCreateTokenModal = true
      } else {
        this.attModalTitle = this.$t('no_engine_title')
        this.attModalBody = this.$t('no_engine_subtitle')
        this.attModalBtnTitle = this.$t('manage_engines')
        this.attModalBtnId = 'VaultPage_go_to_engine'
        this.attModalAction = () => { this.$router.push({ name: 'engine' }) }
        this.showAttentionModal = true
      }
    },
    closeCreateTokenModal () {
      this.selectedVaultId = null
      this.showCreateTokenModal = false
    },
    // DECODE
    openDecodeModal (id) {
      this.selectedVaultId = id
      this.showDecodeModal = true
    },
    closeDecodeModal () {
      this.selectedVaultId = null
      this.showDecodeModal = false
    },
    // DELETE
    askToRemoveVault ({ id, label }) {
      this.confirmTitle = this.$tc('remove')
      this.confirmMessage = this.$tc('confirm_remove')
      this.confirmSubject = label
      this.selectedVault = id
      this.showConfirmModal = true
    },
    closeConfirmModal () {
      this.confirmTitle = null
      this.confirmMessage = null
      this.selectedVault = null
      this.showConfirmModal = false
    },
    removeVault () {
      this.$store.dispatch('svault/doDeleteVault', { id: this.selectedVault })
        .then(() => {
          this.$notify.success({})
          this.closeConfirmModal()
          this.loadVaultList()
        })
        .catch(error => {
          this.closeConfirmModal()
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    newVaultSaved () {
      this.showCreateVaultModal = false
      this.loadVaultList()
    },
    loadVaultList () {
      this.loading = true
      return this.$store.dispatch('svault/doGetVaultList')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadResources () {
      this.loading = true
      Promise.all([
        this.loadVaultList(),
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
  },
  watch: {
  }
}
</script>