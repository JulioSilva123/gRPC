<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="`${this.$tc('key_management')}`"
      page-name="ObjectsPage"
    >
      <template v-slot:actions>
        <v-tooltip top v-if="hasAnyObjects">
          <template v-slot:activator="{ on }">
            <v-btn
              @click="toggleViewMode"
              id="ObjectsPage_viewMode"
              v-on="on"
              icon
            >
              <v-icon>
                {{ viewMode ? 'mdi-view-module' : 'mdi-view-list' }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ viewMode ? $t('grid_view') : $t('list_view') }}</span>
        </v-tooltip>

        <selection-menu
          :options="menuOptions"
          icon="add"
          :tooltip="$t('add_object')"
          parent-name="ObjectsPage"
        />
      </template>

      <template v-slot:body>
        <service-readiness-check
          v-if="loading || !readyToUse"
          :optionalOccurrenceTypes="occurrenceTypes"
          :loading="loading !== 0"
          parent-name="ObjectsPage"
          service-alias="Criptografia"
          @ready="setReady"
        />
        <template v-else>
          <v-tabs
            :ripple="false"
            v-model="tab"
            background-color="transparent"
            centered
          >
            <v-tab
              v-for="tab in tabs"
              :id="`tab_${tab.id}`"
              v-text="tab.title"
              :key="`tab-${tab.id}`"
            />
          </v-tabs>
          
          <v-tabs-items v-model="tab">
            <!-- Certs -->
            <v-tab-item class="mt-4">
              <template v-if="certItems.length">
                <template v-if="viewMode === 0">
                  <objects-card-view
                    :items="certItems"
                    v-slot="{ item }"
                  >
                    <certificate-card
                      :item="item"
                      @encrypt-file="openEncryptPage"
                      @click="updatePathId"
                      @export="openExportModal"
                      @block="blockObj"
                      @details="updatePathId"
                      @delete="askToDeleteObj"
                      @add-tracker="openTrackersModal"
                      @remove-tracker="askForTrackingRemoval"
                    />
                  </objects-card-view>
                </template>
                <template v-else>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <certs-data-table
                        :items="certItems"
                        @linked="updatePathId"
                        @encrypt-file="openEncryptPage"
                        @export="openExportModal"
                        @block="blockObj"
                        @details="updatePathId"
                        @delete="askToDeleteObj"
                        @add-tracker="openTrackersModal"
                        @remove-tracker="askForTrackingRemoval"
                      />
                    </v-col>
                  </v-row>
                </template>
              </template>
              <template v-else>
                <v-row no-gutters class="mt-4">
                  <v-col cols="12">
                    <no-data-card
                      icon="card_membership"
                      :title="$tc('no_cert_title')"
                      :subtitle="$t('no_resource_tip')"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-tab-item>

            <!-- Keys -->
            <v-tab-item class="mt-4">
              <template v-if="keyItems.length">
                <template v-if="viewMode === 0">
                  <objects-card-view
                    :items="keyItems"
                    v-slot="{ item }"
                  >
                    <key-card
                      :item="item"
                      @encrypt-file="openEncryptPage"
                      @csr="openCSRModal"
                      @click="updatePathId"
                      @export="openExportModal"
                      @block="blockObj"
                      @details="updatePathId"
                      @delete="askToDeleteObj"
                    />
                  </objects-card-view>
                </template>
                <template v-else>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <keys-data-table
                        :items="keyItems"
                        @linked="updatePathId"
                        @encrypt-file="openEncryptPage"
                        @csr="openCSRModal"
                        @export="openExportModal"
                        @block="blockObj"
                        @details="updatePathId"
                        @delete="askToDeleteObj"
                      />
                    </v-col>
                  </v-row>
                </template>
              </template>

              <template v-else>
                <v-row no-gutters class="mt-4">
                  <v-col cols="12">
                    <no-data-card
                      icon="vpn_key"
                      :title="$tc('no_key_title')"
                      :subtitle="$t('no_resource_tip')"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-tab-item>

            <!-- Secrets -->
            <v-tab-item class="mt-4">
              <template v-if="secretItems.length">
                <template v-if="viewMode === 0">
                  <objects-card-view
                    :items="secretItems"
                    v-slot="{ item }"
                  >
                    <basic-resource-card
                      :item="item"
                      @encrypt-file="openEncryptPage"
                      @details="updatePathId"
                      @delete="askToDeleteObj"
                    />
                  </objects-card-view>
                </template>
                <template v-else>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <basic-data-table
                        :items="secretItems"
                        @encrypt-file="openEncryptPage"
                        @details="updatePathId"
                        @delete="askToDeleteObj"
                      />
                    </v-col>
                  </v-row>
                </template>
              </template>

              <template v-else>
                <v-row no-gutters class="mt-4">
                  <v-col cols="12">
                    <no-data-card
                      icon="mdi-cloud-lock-outline"
                      :title="$tc('no_secret_title')"
                      :subtitle="$t('no_resource_tip')"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-tab-item>

            <!-- Chains -->
            <v-tab-item v-if="chainItems.length" class="mt-4">
              <template v-if="viewMode === 0">
                <objects-card-view
                  :items="chainItems"
                  v-slot="{ item }"
                >
                  <basic-resource-card
                    :item="item"
                    @click="updatePathId"
                    @details="updatePathId"
                    @delete="askToDeleteObj"
                  />
                </objects-card-view>
              </template>
              <template v-else>
                <v-row no-gutters>
                  <v-col cols="12">
                    <basic-data-table
                      :items="chainItems"
                      @details="updatePathId"
                      @delete="askToDeleteObj"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-tab-item>
          </v-tabs-items>
        </template>
      </template>
    </default-page-template>

    <create-key-modal
      :open="showCreateModal"
      @close="closeCreateModal"
      @saved="keySaved"
      @linked="updatePathId"
      :selected-obj-id="selectedObj"
    />

    <p12-import-modal
      :open="showImportModal"
      @close="closeImportModal"
      @saved="objImported"
    />

    <cert-import-modal
      :open="showCertImportModal"
      @close="closeCertImportModal"
      @saved="certImported"
    />

    <cert-block-in-hsm-modal
      :open="showCertBlockModal"
      :cert-id="selectedObj"
      @saved="closeCertBlockModal"
      @close="closeCertBlockModal"
    />

    <chain-import-modal
      :open="showChainImportModal"
      @close="closeChainImportModal"
      @saved="chainImported"
    />

    <csr-modal
      :open="showCSRModal"
      :key-id="selectedObj"
      @close="closeCSRModal"
    />

    <!-- REMOVE RESOURCE -->
    <confirm-modal
      :confirm="operationIsCritical"
      :critical="operationIsCritical"
      :open="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :submessage="confirmSubmessage"
      :title-subject="selectedObj"
      :subject-id="selectedObj"
      :body-subject="confirmSubject"
      @negative="closeConfirmModal"
      @positive="deleteObject"
    />

    <!-- REMOVE TRACKER -->
    <confirm-modal
      :open="showDeleteTrackerModal"
      :title="confirmTitle"
      :message="confirmMessage"
      @negative="closeDeleteTrackerModal"
      @positive="deleteTracker"
    />

    <cert-detail-modal
      :open="showCertDetailModal"
      :object-id="selectedObj"
      @saved="certUpdated"
      @linked="updatePathId"
      @close="closeCertDetailModal"
      @remove-tracker="askForTrackingRemoval"
    />
    
    <chain-detail-modal
      :open="showChainDetailModal"
      :object-id="selectedObj"
      @saved="chainUpdated"
      @close="closeChainDetailModal"
    />

    <export-modal
      :open="showExportModal"
      :object-id="selectedObj"
      :object-type="selectedObjType"
      @close="closeExportModal"
    />

    <secret-modal
      :open="showSecretDetailModal"
      :object-id="selectedObj"
      @saved="secretUpdated"
      @close="closeSecretDetailModal"
    />

    <new-secret-modal
      :open="showNewSecretModal"
      @saved="secretCreated"
      @close="showNewSecretModal = false"
    />
    <cert-trackers-modal
      :open="showCertTrackingModal"
      :object-id="selectedObj"
      @saved="certTrackerUpdated"
      @close="closeTrackersModal"
      @tracker-type-needs-contract="(occurType) => {
        attentionModalAction = () => { this.goToServicePage(occurType) }
        showAttentionModal = true
      }"
    />
    <attention-modal
      :open="showAttentionModal"
      :title="$t('subscribe')"
      :body="$t('contract_service_to_use')"
      :btnTitle="$t('check_service')"
      btnId="ObjectsPage_subscribe_needed"
      :action="attentionModalAction"
      @close="showAttentionModal = false"
    />
  </div>
</template>

<script>

import AttentionModal from '@/components/AttentionModal'
import SecretModal from './modals/SecretModal'
import ChainDetailModal from './modals/ChainDetailModal'
import CreateKeyModal from './modals/CreateKeyModal'
import CsrModal from './modals/CSRModal'
import P12ImportModal from './modals/P12ImportModal'
import CertImportModal from './modals/CertImportModal'
import ChainImportModal from './modals/ChainImportModal'
import SelectionMenu from '@/components/SelectionMenu'
import CertDetailModal from './modals/CertDetailModal'
import NoDataCard from '@/components/NoDataCard'
import CertsDataTable from './ItemTables/CertsDataTable'
import BasicDataTable from '@/components/BasicDataTable'
import KeysDataTable from './ItemTables/KeysDataTable'
import ObjectsCardView from '@/components/ObjectsCardView'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import CertBlockInHsmModal from './modals/CertBlockInHsmModal'
import ExportModal from '@/components/ExportModal'
import ServiceReadinessCheck from '@/components/ServiceReadinessCheck'
import functionalityAvailability from '@/mixins/functionalityAvailability.js'
import NewSecretModal from './modals/NewSecretModal'
import BasicResourceCard from '@/components/BasicResourceCard'
import KeyCard from './ItemCards/KeyCard'
import CertificateCard from './ItemCards/CertificateCard'
import CertTrackersModal from './modals/CertTrackersModal'
import { ConfirmModal } from '@dinamonetworks/gui-comps-lib'
import { P10_SIGN_OC_TYPE, SMS_TRACKS_SECRET_OC_TYPE, WA_TRACKS_SECRET_OC_TYPE, EMAIL_TRACK_SECRET_OC_TYPE } from '@/plugins/globals.plugin'

export default {
  mixins: [functionalityAvailability],
  components: {
    SecretModal,
    ChainDetailModal,
    CreateKeyModal,
    ConfirmModal,
    CsrModal,
    P12ImportModal,
    CertImportModal,
    ChainImportModal,
    SelectionMenu,
    CertDetailModal,
    NoDataCard,
    CertsDataTable,
    BasicDataTable,
    KeysDataTable,
    ObjectsCardView,
    DefaultPageTemplate,
    CertBlockInHsmModal,
    ExportModal,
    ServiceReadinessCheck,
    NewSecretModal,
    BasicResourceCard,
    KeyCard,
    CertificateCard,
    CertTrackersModal,
    AttentionModal
  },
  props: {
    id: String
  },
  data () {
    return {
      showCreateModal: false,
      showConfirmModal: false,
      showExportModal: false,
      showImportModal: false,
      showCertImportModal: false,
      showCertDetailModal: false,
      showChainImportModal: false,
      showChainDetailModal: false,
      showCSRModal: false,
      showCertBlockModal: false,
      showSecretDetailModal: false,
      showNewSecretModal: false,
      showCertTrackingModal: false,
      showDeleteTrackerModal: false,
      showAttentionModal: false,
      attentionModalAction: null,
      selectedObj: null,
      confirmTitle: null,
      confirmMessage: null,
      confirmSubmessage: null,
      confirmSubject: null,
      loading: 0,
      tab: 0,
      readyToUse: false,
      viewingResourceType: 0,
      // TODO1: remove
      selectedObjType: null,
      operationIsCritical: false,
    }
  },
  computed: {
    occurrenceTypes () {
      return [P10_SIGN_OC_TYPE, SMS_TRACKS_SECRET_OC_TYPE, WA_TRACKS_SECRET_OC_TYPE, EMAIL_TRACK_SECRET_OC_TYPE]
    },
    tabs () {
      const tabs = [
        {
          title: this.$tc('certificate', 2),
          id: 'certs'
        },
        {
          title: this.$tc('key', 2),
          id: 'keys'
        },
        {
          title: this.$tc('secret', 2),
          id: 'secrets'
        }
      ]
      if (this.chainItems.length) {
        tabs.concat({
          title: this.$tc('chain', 2),
          id: 'chains'
        }) 
      }
      return tabs
    },
    objCount () {
      return this.$store.state.billing.objCount
    },
    objLength () {
      return this.$store.state.billing.objLength
    },
    viewMode: {
      get () {
        return this.$store.state.ui.prefObjViewMode
      },
      set (val) {
        this.$store.commit('ui/SET_OBJ_VIEW_MODE', val)
      }
    },
    menuOptions () {
      const self = this
      return [
        {
          title: this.$tc('create_key'),
          id: "ObjectsPage_createKey",
          action: () => {
            self.showCreateModal = true
          }
        },
        {
          title: this.$tc('create_secret'),
          id: "ObjectsPage_createSecret",
          action: () => {
            self.showNewSecretModal = true
          }
        },
        {
          title: this.$tc('import_p12'),
          id: "ObjectsPage_importKey",
          action: () => {
            self.showImportModal = true
          }
        },
        {
          title: this.$tc('import_cert'),
          id: "ObjectsPage_importCert",
          action: () => {
            self.showCertImportModal = true
          }
        },
        {
          title: this.$tc('import_chain'),
          id: "ObjectsPage_importChain",
          action: () => {
            self.showChainImportModal = true
          }
        }
      ]
    },
    hasAnyObjects () {
      return this.keyItems.length || this.certItems.length || this.secretItems.length || this.chainItems.length
    },
    keyItems () {
      return this.$store.getters['resources/GET_KEYS']
    },
    certItems () {
      return this.$store.getters['resources/GET_CERTS']
    },
    chainItems () {
      return this.$store.getters['resources/GET_CHAINS']
    },
    secretItems () {
      return this.$store.getters['resources/GET_SECRET_LIST']
    },
    allItems () {
      return this.keyItems.concat(this.certItems).concat(this.secretItems).concat(this.chainItems)
    }
  },
  methods: {
    setReady (isReady) {
      this.readyToUse = isReady
      if (this.readyToUse) this.loadResources()
    },
    loadResources () {
      this.reloadObjects()
        .then(() => {
          if (this.id) this.showObjectDetail(this.id)
        })
    },
    toggleViewMode () {
      this.viewMode = (this.viewMode + 1) % 2
    },
    keySaved () {
      this.showCreateModal = false
      this.selectedObj = null
      this.loadKeysList()
      this.$router.replace({ name: 'certs-keys' })
      
    },
    loadKeysList () {
      return Promise.all([
        this.loadCounter(),
        this.$store.dispatch('resources/doGetKeysList')
      ])
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    // DELETE
    askToDeleteObj ({ id, label, type, hsmBlockedList }) {
      this.confirmTitle = this.$tc('remove')
      if (type === 'x509') {
        const isBlockedSomewhere = this.$store.getters['resources/GET_IS_CERT_BLOCKED']({ hsmBlockedList })
        if (isBlockedSomewhere) {
          const hsmIds = hsmBlockedList.map(item => { return item.id }).join(', ')
          this.confirmMessage = 
            `${this.$tc('remove_blocked_cert_warning')}.`
          this.confirmSubmessage = `${this.$tc('affected_hsms')}:  ${hsmIds}`
        } else {
          this.confirmMessage = this.$tc('confirm_remove')
        }
      } else {
        if (type === 'key' || type === 'secret') this.operationIsCritical = true
        this.confirmMessage = this.$tc('confirm_remove')
      }
      this.confirmSubject = label
      this.selectedObj = id
      this.selectedObjType = type
      this.showConfirmModal = true
    },
    closeConfirmModal () {
      this.confirmTitle = null
      this.confirmMessage = null
      this.confirmSubmessage = null
      this.selectedObj = null
      this.selectedObjType = null
      this.operationIsCritical = false
      this.showConfirmModal = false
    },
    deleteObject () {
      let deletePromise
      let reloadPromise
      const type = this.selectedObjType
      if (type === 'x509') {
        deletePromise = this.$store.dispatch('resources/doDeleteCert', { id: this.selectedObj })
        reloadPromise = this.loadCertList()
      } else if (type === 'pkcs7') {
        deletePromise = this.$store.dispatch('resources/doDeleteChain', { id: this.selectedObj })
        reloadPromise = this.loadChainList()
      } else if (type === 'key') {
        deletePromise = this.$store.dispatch('resources/doDeleteKey', { id: this.selectedObj })
        reloadPromise = this.loadKeysList()
      } else if (type === 'secret') {
        deletePromise = this.$store.dispatch('resources/doDeleteSecret', { id: this.selectedObj })
        reloadPromise = this.loadSecretsList()
      }
      deletePromise
        .then(() => {
          this.$notify.success({})
          return reloadPromise
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.closeConfirmModal()
        })
    },
    // CSR
    openCSRModal ({ id }) {
      const hasOffer = this.$store.getters['occurrences/GET_IS_OCCUR_TYPE_AVAILABLE'](P10_SIGN_OC_TYPE)
      if (hasOffer) {
        this.selectedObj = id
        this.showCSRModal = true
      } else {
        this.attentionModalAction = () => { this.goToServicePage(P10_SIGN_OC_TYPE) }
        this.showAttentionModal = true
      }
    },
    closeCSRModal () {
      this.showCSRModal = false
      this.selectedObj = null
    },
    // EXPORT
    openExportModal ({ id, type }) {
      this.selectedObj = id
      this.selectedObjType = type
      this.showExportModal = true
    },
    closeExportModal () {
      this.showExportModal = false
      this.selectedObj = null
      this.selectedObjType = null
    },
    // BLOCK
    blockObj (resource) {
      if (resource.type === 'x509') {
        this.openCertBlockModal(resource)
      } else {
        console.log('block obj not implemented')
      }
    },
    // DETAIL
    updatePathId ({ id }) {
      this.$router.replace({ name: 'certs-keys', params: { id } })
    },
    showObjectDetail (id) {
      const resource = this.allItems.find(item => item.id === id)
      if (resource) {
        this.openDetailModal(resource)
      } else {
        this.$notify.error({ message: this.$t('resource_not_found') })
        this.$router.replace({ name: 'certs-keys' })
      }
    },
    openDetailModal ({ id, type }) {
      this.showCertDetailModal = false
      this.showCreateModal = false
      this.showChainDetailModal = false
      this.selectedObj = id
      // TODO: USE TYPE
      // certificate
      if (type === 'x509') {
        this.showCertDetailModal = true
      } else if (type === 'pkcs7') {
        this.showChainDetailModal = true
      } else if (type === 'key') {
        this.showCreateModal = true
      } else if (type === 'secret') {
        this.showSecretDetailModal = true
      }
    },
    closeCreateModal () {
      if (this.selectedObj) this.$router.replace({ name: 'certs-keys' })
      this.showCreateModal = false
      this.selectedObj = null
    },
    // TRACKERS
    closeDeleteTrackerModal () {
      this.confirmTitle = null
      this.confirmMessage = null
      this.confirmSubmessage = null
      this.selectedObj = null
      this.selectedObjType = null
      this.showDeleteTrackerModal = false
    },
    deleteTracker () {
      this.$store.dispatch('resources/doDeleteTrackerFromCert', { id: this.selectedObj })
        .then(() => {
          this.$notify.success({})
          return this.certTrackerUpdated()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.closeDeleteTrackerModal()
          this.closeCertDetailModal()
        })
    },
    askForTrackingRemoval ({ tracker }) {
      this.selectedObjType = 'tracker'
      this.selectedObj = tracker.id
      this.confirmTitle = this.$t('remove_alert')
      const channel = this.$store.getters['resources/GET_TRACKING_CHANNEL_OPTION_DETAIL'](tracker.type) || `'code_${tracker.type}'`
      this.confirmMessage = `${this.$t('remove_cert_tracking', { type: channel, recip: tracker.email })}`
      this.showDeleteTrackerModal = true
    },
    openTrackersModal ({ id }) {
      this.showCertTrackingModal = true
      this.selectedObj = id
    },
    closeTrackersModal () {
      this.showCertTrackingModal = false
      this.selectedObj = null
    },
    certTrackerUpdated () {
      this.loading++
      return this.getItemsDetail({
        listRef: { store: 'resources', state: 'certList' },
        action: 'resources/doGetCert',
        propList: ['data', 'keys', 'tracked'],
        mutation: 'resources/SET_CERT_LIST'
      })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading--
        })
    },
    // OPERATIONS
    // IMPORT
    closeImportModal () {
      this.showImportModal = false
    },
    objImported () {
      this.closeImportModal()
      this.loadKeysList()
      this.loadCertList()
    },
    // CERT
    loadCertList () {
      return Promise.all([
        this.$store.dispatch('resources/doGetCertList'),
        this.loadCounter()
      ])
        .then(() => {
          return this.getCertInfo()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    closeCertImportModal () {
      this.showCertImportModal = false
    },
    certImported () {
      this.closeCertImportModal()
      this.loadCertList()
    },
    closeCertDetailModal () {
      this.$router.replace({ name: 'certs-keys' })
      this.showCertDetailModal = false
      this.selectedObj = null
    },
    certUpdated () {
      this.closeCertDetailModal()
      this.loadCertList()
    },
    // BLOCK
    openCertBlockModal (resource) {
      this.selectedObj = resource.id
      this.showCertBlockModal = true
    },
    // CERT BLOCK
    closeCertBlockModal () {
      this.showCertBlockModal = false
      this.selectedObj = null
    },
    // CHAIN
    loadChainList () {
      return Promise.all([
        this.$store.dispatch('resources/doGetChainList'),
        this.loadCounter()
      ])
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    closeChainImportModal () {
      this.showChainImportModal = false
    },
    chainImported () {
      this.closeChainImportModal()
      this.loadChainList()
    },
    closeChainDetailModal () {
      this.$router.replace({ name: 'certs-keys' })
      this.showChainDetailModal = false
    },
    chainUpdated () {
      this.closeChainDetailModal()
      this.loadChainList()
    },
    // SECRET
    loadSecretsList () {
      return Promise.all([
        this.loadCounter(),
        this.$store.dispatch('resources/doGetSecretList')
      ])
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    secretCreated () {
      this.showNewSecretModal = false
      this.loadSecretsList()
    },
    openSecretModal ({ id, type }) {
      this.selectedObj = id
      this.selectedObjType = type
      this.showSecretDetailModal = true
    },
    openEncryptPage ({ id }) {
      this.selectedObj = id
      this.$router.push({ name: 'file-encryption', params: { secretId: id } })
    },
    closeSecretDetailModal () {
      this.$router.replace({ name: 'certs-keys' })
      this.showSecretDetailModal = false
    },
    secretUpdated () {
      this.closeSecretDetailModal()
      this.loadSecretsList()
    },
    // ALL OBJECTS
    loadCounter () {
      return Promise.all([
        this.$store.dispatch('billing/doGetObjectLength'),
        this.$store.dispatch('billing/doGetObjectsCount')
      ])
    },
    getItemsDetail ({ listRef, action, propList, mutation }) {
      let resourceArray = []
      let promiseArray = []
      this.$store.state[listRef.store][listRef.state].forEach(element => {
        promiseArray.push(this.$store.dispatch(action, { id: element.id }))
      })
      return Promise.all(promiseArray)
        .then((detailArray) => {
          // This way the list the most updated
          const currentResourceList = JSON.parse(JSON.stringify(this.$store.state[listRef.store][listRef.state]))
          detailArray.forEach((element, index) => {
            let newItem = currentResourceList[index]
            
            propList.forEach(prop => {
              newItem[prop] = element[prop]
            })

            resourceArray.push(newItem)
          })
          this.$store.commit(mutation, resourceArray)
        })
    },
    getCertInfo () {
      this.loading++
      return Promise.all([
        this.getItemsDetail({
          listRef: { store: 'resources', state: 'certList' },
          action: 'resources/doGetCert',
          propList: ['data', 'keys', 'tracked'],
          mutation: 'resources/SET_CERT_LIST'
        }),
        this.getItemsDetail({
          listRef: { store: 'resources', state: 'certList' },
          action: 'resources/doGetHsmsForBlockedCert',
          propList: ['hsmBlockedList'],
          mutation: 'resources/SET_CERT_LIST'
        })
      ])
        .then(() => {
          this.loading--
        })
    },
    reloadObjects () {
      this.loading++
      return Promise.all([
        this.$store.dispatch('resources/doGetKeyOptions'),
        // Keys
        this.$store.dispatch('resources/doGetKeysList'),
        // Certs
        this.$store.dispatch('resources/doGetCertList'),
        this.$store.dispatch('resources/doGetChainList'),
        // Secrets
        this.$store.dispatch('resources/doGetSecretList'),
        this.loadCounter()
      ])
        .then(() => {
          return this.getCertInfo()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading--
        })
    }
  },
  watch: {
    $route () {
      if (this.id) this.showObjectDetail(this.id)
    }
  }
}
</script>

<style>
.theme--light.v-tabs-items {
  background-color: transparent;
}
.theme--dark.v-tabs-items {
  background-color: transparent;
}
</style>