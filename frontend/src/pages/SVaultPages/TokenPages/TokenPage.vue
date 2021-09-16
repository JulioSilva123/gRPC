<template>
  <div class="pt-0 pb-6">
    <default-page-template
      page-name="TokenPage"
      :is-child-page="true"
    >
      <template v-slot:pretitle>
        <v-row no-gutters>
          <v-btn
            id="TokenPage_back_btn"
            icon
            exact
            :to="{ name: 'vault' }"
          >
            <v-icon>arrow_back</v-icon>
          </v-btn>
        </v-row>
      </template>
      <template v-slot:title>
        <div class="barra_titulo">
          <div id="TokenPage_title" class="tit_area">{{ $tc('cloud_tokens') }}</div>
          <span class="pl-1">{{ `Vault ID: `  }}</span>
          <v-chip small outlined class="hide-in-percy">
            {{ vaultId }}
          </v-chip>
        </div>
      </template>
      
      <template v-slot:body>
        <v-row no-gutters>
          <v-col cols="12">
            <template v-if="loading">
              <v-row align="center" justify="center" class="h-70v">
                <v-progress-circular indeterminate :size="50" />
              </v-row>
            </template>
            <template v-else-if="tokenItems.length">
              <token-table
                :fetching="loading"
                :items="tokenItems"
                @delete="askToRemoveToken"
                @decode="openDecodeModal"
              />
              </template>
            <template v-else>
              <no-data-card
                icon="lock"
                :title="$tc('no_token_title')"
                :subtitle="$tc('no_token_subtitle')"
              />
            </template>
          </v-col>
        </v-row>
      </template>
    </default-page-template>

    <confirm-modal
      id="confirm_modal"
      confirm
      critical
      :open="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :title-subject="selectedToken"
      :body-subject="confirmSubject"
      @negative="closeConfirmModal"
      @positive="removeToken"
    />

    <decode-token-modal
      :token="selectedToken"
      :open="showDecodeModal"
      :vaultId="vaultId"
      @close="closeDecodeModal()"
    />
  </div>
</template>

<script>
import TokenTable from './TokenDataTable'
import DecodeTokenModal from '@/pages/SVaultPages/VaultPages/modals/DecodeTokenModal'
import ConfirmModal from '@/components/ConfirmModal'
import NoDataCard from '@/components/NoDataCard'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
export default {
  components: {
    TokenTable,
    ConfirmModal,
    NoDataCard,
    DefaultPageTemplate,
    DecodeTokenModal
  },
  props: {
    vaultId: String
  },
  mounted () {
    this.loadTokenList()
  },
  data: () => ({
    selectedToken: null,
    showConfirmModal: false,
    confirmTitle: null,
    confirmMessage: null,
    confirmSubject: null,
    loading: false,
    showDecodeModal: false
  }),
  computed: {
    tokenItems () {
      return this.$store.getters['svault/GET_TOKEN_LIST']
    },
  },
  methods: {
    // DECODE
    openDecodeModal (id) {
      this.selectedToken = id
      this.showDecodeModal = true
    },
    closeDecodeModal () {
      this.selectedToken = null
      this.showDecodeModal = false
    },
    //DELETE
    askToRemoveToken (token) {
      this.confirmTitle = this.$tc('remove')
      this.confirmMessage = this.$tc('confirm_remove')
      this.confirmSubject = token
      this.selectedToken = token
      this.showConfirmModal = true
    },
    closeConfirmModal () {
      this.confirmTitle = null
      this.confirmMessage = null
      this.selectedToken = null
      this.showConfirmModal = false
    },
    removeToken () {
      this.$store.dispatch('svault/doDeleteToken', { vaultId: this.vaultId, token: this.selectedToken })
        .then(() => {
          this.$notify.success({})
          this.closeConfirmModal()
          this.loadTokenList()
        })
        .catch(error => {
          this.closeConfirmModal()
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    newTokenSaved () {
      this.loadTokenList()
    },
    loadTokenList () {
      this.loading = true
      return this.$store.dispatch('svault/doGetTokenList', { id: this.vaultId })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  watch: {
  }
}
</script>