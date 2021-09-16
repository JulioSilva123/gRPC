<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="$tc('api_key', 2)"
      page-name="ApiKeysPage"
    >

      <template v-slot:actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              id="ApiKeysPage_add"
              v-on="on"
              icon
              @click="showApiKeyModal = true"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('create_api_key') }}</span>
        </v-tooltip>
      </template>

      <template v-slot:body>
        <v-row no-gutters>
          <v-col cols="12">
            <template v-if="loading">
              <v-row align="center" justify="center" class="h-70v">
                <v-progress-circular indeterminate :size="50" />
              </v-row>
            </template>

            <template v-else>
              <template v-if="apiKeyItems.length">
                <api-keys-table
                  :api-key-items="apiKeyItems"
                  @delete="askToRemoveApiKey"
                  @detail="editItem"
                />

              </template>

              <template v-else>
                 <!-- API KEY -->
                <no-data-card
                  :title="$tc('no_api_key_title')"
                  :subtitle="$tc('no_api_key_subtitle')"
                >
                  <template v-slot:action>
                    <v-btn
                      id="ApiKeysPage_no_apikey_button"
                      color="primary"
                      :class="{ 'black--text': $vuetify.theme.dark }"
                      @click="showApiKeyModal = true"
                    >
                      {{ $tc('create') }}
                    </v-btn>
                  </template>
                  <template v-slot:icon>
                    <v-icon size="120">mdi-key-wireless</v-icon>
                  </template>
                </no-data-card>
              </template>
            </template>
          </v-col>
        </v-row>
      </template>
    </default-page-template>

    <api-key-modal 
      :open="showApiKeyModal"
      :api-key-id="selectedItemId"
      @close="closeApiKeyModal"
    />
    <confirm-modal
      :open="showConfirmModal"
      :title="`${$tc('delete')} ${$tc('key')}`"
      :message="$tc('confirm_delete')"
      :title-subject="getSelectItemShortId()"
      :body-subject="selectedItemName"
      @negative="showConfirmModal = false"
      @positive="deleteApiKey"
    />
  </div>
</template>

<script>
import NoDataCard from '@/components/NoDataCard'
import ApiKeysTable from './ApiKeysTable'
import ApiKeyModal from './ApiKeyModal'
import ConfirmModal from '@/components/ConfirmModal'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
export default {
  components: {
    NoDataCard,
    ApiKeysTable,
    ApiKeyModal,
    ConfirmModal,
    DefaultPageTemplate
  },
  mounted () {
    this.loadApiKeyList()
    this.$store.dispatch('account/doGetUserInfo')
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
  },
  data () {
    return {
      showApiKeyModal: false,
      showConfirmModal: false,
      selectedItemId: null,
      selectedItemName: null,
      loading: false
    }
  },
  computed: {
    apiKeyItems () {
      return this.$store.getters['account/GET_API_KEY_LIST']
    }
  },
  methods: {
    getSelectItemShortId () {
      return this.selectedItemId ? this.selectedItemId.slice(0, 10) : null
    },
    loadApiKeyList () {
      this.loading = true
      this.$store.dispatch('account/getApiKeyList')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // Edit
    editItem ({ id }) {
      this.selectedItemId = id
      this.showApiKeyModal = true
    },
    closeApiKeyModal ({ keyCreated }) {
      if (keyCreated) {
        this.loading = true
        this.$store.dispatch('account/getApiKeyList')
          .then(() => {
            this.loading = false
          })
          .catch(error => {
            this.$store.dispatch('error/showErrorNotification', error)
          })
      }
      this.showApiKeyModal = false
      this.selectedItemId = null
    },
    // Delete
    closeConfirmModal () {
      this.showConfirmModal = false
      this.selectedItemName = null
      this.selectedItemId = null
    },
    askToRemoveApiKey ({ label, id }) {
      this.selectedItemName = label
      this.selectedItemId = id
      this.showConfirmModal = true
    },
    deleteApiKey () {
      this.$store.dispatch('account/deleteApiKey', { id: this.selectedItemId })
        .then(() => {
          this.$notify.success({ message: this.$tc('api_key_deleted') })
          this.loadApiKeyList()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.closeConfirmModal()
        })
    }
  }
}
</script>

<style>

</style>