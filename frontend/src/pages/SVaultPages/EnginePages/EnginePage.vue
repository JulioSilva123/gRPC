<template>
  <div class="pt-4 pb-6">
    <default-page-template
      page-name="EnginePage"
      :title="$tc('engine', 2)"
    >
      <template v-slot:actions>
        <template v-if="engineItems.length">
          <v-tooltip v-if="engineItems.length" top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="showCreateModal = true"
                id="EnginePage_add_engine"
                v-on="on"
                icon
              >
                <v-icon>
                  add
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('create_engine') }}</span>
          </v-tooltip>
          
          <v-tooltip top>
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
        </template>
      </template>
      
      <template v-slot:body>
        <service-readiness-check
          v-if="loading || !readyToUse"
          :loading="loading"
          :mandatoryOccurrenceTypes="occurrenceTypes"
          service-alias="LGPD Anonimização"
          parent-name="EnginePage"
          @ready="setReady"
        />

        <template v-else-if="engineItems.length">
          <objects-card-view
            v-if="viewMode === 0"
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
          <basic-data-table
            v-else
            :items="engineItems"
            @details="updatePathId"
            @delete="askToRemoveEngine"
          />
          
        </template>

        <no-data-card
          v-else
          icon="settings"
          :title="$tc('no_engine_title')"
          :subtitle="$tc('no_engine_subtitle')"
          :button-title="`${$tc('create')} ${$tc('engine')}`"
          buttonId="EnginePage_noDataBtn"
          @action="showCreateModal = true"
        />
      </template>
    </default-page-template>

    <engine-detail-modal
      :open="showDetailModal"
      :engine-id="selectedEngine"
      @close="closeDetailModal"
    />
    <create-engine-modal
      :open="showCreateModal"
      @saved="newEngineSaved"
      @close="showCreateModal = false"
    />

    <confirm-modal
      id="confirm_modal"
      :open="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :title-subject="selectedEngine"
      :body-subject="confirmSubject"
      @negative="closeConfirmModal"
      @positive="removeEngine"
    />

  </div>
</template>

<script>
import BasicResourceCard from '@/components/BasicResourceCard'
import ObjectsCardView from '@/components/ObjectsCardView'
import BasicDataTable from '@/components/BasicDataTable'
import CreateEngineModal from './modals/CreateEngineModal'
import EngineDetailModal from './modals/EngineDetailModal'
import ConfirmModal from '@/components/ConfirmModal'
import NoDataCard from '@/components/NoDataCard'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import ServiceReadinessCheck from '@/components/ServiceReadinessCheck'
import { SVAULT_TOKEN_OC_TYPE, SVAULT_SECRET_OC_TYPE } from '@/plugins/globals.plugin'

export default {
  components: {
    BasicResourceCard,
    ObjectsCardView,
    BasicDataTable,
    CreateEngineModal,
    EngineDetailModal,
    ConfirmModal,
    NoDataCard,
    DefaultPageTemplate,
    ServiceReadinessCheck
  },
  props: {
    id: String
  },
  data: () => ({
    selectedEngine: null,
    showConfirmModal: false,
    confirmTitle: null,
    confirmMessage: null,
    confirmSubject: null,
    loading: false,
    showCreateModal: false,
    showDetailModal: false,
    readyToUse: false
  }),
  computed: {
    occurrenceTypes () {
      return [SVAULT_TOKEN_OC_TYPE, SVAULT_SECRET_OC_TYPE]
    },
    engineItems () {
      return this.$store.getters['svault/GET_ENGINE_LIST']
    },
    viewMode: {
      get () {
        return this.$store.state.ui.prefEngViewMode
      },
      set (val) {
        this.$store.commit('ui/SET_ENG_VIEW_MODE', val)
      }
    },
  },
  methods: {
    toggleViewMode () {
      this.viewMode = (this.viewMode + 1) % 2
    },
    // DETAIL
    updatePathId ({ id }) {
      this.$router.replace({ name: 'engine', params: { id } })
    },
    showObjectDetail (id) {
      const engine = this.engineItems.find(item => item.id === id)
      if (engine) {
        this.openDetailModal(engine.id)
      } else {
        this.$notify.error({ message: this.$t('resource_not_found') })
        this.$router.replace({ name: 'engine' })
      }
    },
    openDetailModal (id) {
      this.selectedEngine = id
      this.showDetailModal = true
    },
    closeDetailModal () {
      this.$router.replace({ name: 'engine' })
      this.selectedEngine = null
      this.showDetailModal = false
    },
    //DELETE
    askToRemoveEngine ({ id, label }) {
      this.confirmTitle = this.$tc('remove')
      this.confirmMessage = this.$tc('confirm_remove')
      this.confirmSubject = label
      this.selectedEngine = id
      this.showConfirmModal = true
    },
    closeConfirmModal () {
      this.confirmTitle = null
      this.confirmMessage = null
      this.selectedEngine = null
      this.showConfirmModal = false
    },
    removeEngine () {
      this.$store.dispatch('svault/doDeleteEngine', { id: this.selectedEngine })
        .then(() => {
          this.$notify.success({})
          this.closeConfirmModal()
          this.loadEngineList()
        })
        .catch(error => {
          this.closeConfirmModal()
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    newEngineSaved () {
      this.showCreateModal = false
      this.loadEngineList()
    },
    loadEngineList () {
      this.loading = true
      return this.$store.dispatch('svault/doGetEngineList')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadResources () {
      return Promise.all([
        this.$store.dispatch('svault/doGetCksOptions'),
        this.$store.dispatch('svault/doGetStorageOptions'),
        this.$store.dispatch('svault/doGetVformatOptions'),
        this.loadEngineList()
      ])
    },
    setReady (isReady) {
      this.readyToUse = isReady
      if (this.readyToUse) {
        this.loadResources()
          .then(() => {
            if (this.id) this.showObjectDetail(this.id)
          })
      }
    }
  },
  watch: {
    $route () {
      if (this.id) this.showObjectDetail(this.id)
    }
  }
}
</script>