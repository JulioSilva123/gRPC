<template>
  <div class="pt-4 pb-6" v-if="$route.name === 'hsm-lan'">
    <default-page-template
      :title="$tc('hsm_lan')"
      page-name="HsmPage"
    >
      <template v-slot:actions>
        <v-tooltip top v-if="hsmItems.length">
          <template v-slot:activator="{ on }">
            <v-btn
              @click="toggleViewMode"
              id="HsmPage_viewMode"
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

        <template v-if="userPermissions.add_hsm">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="showAddHsmModal = true"
                id="HsmPage_add"
                v-on="on"
                icon
              >
                <v-icon>
                  add
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('add_hsm') }}</span>
          </v-tooltip>
        </template>
      </template>
      
      <template v-slot:body>
        <v-row no-gutters>
          <v-col cols="12">
            <template v-if="loading">
              <v-row align="center" justify="center" class="h-70v">
                <v-progress-circular indeterminate :size="50" />
              </v-row>
            </template>
            <template v-else-if="hsmItems.length">
              <template v-if="viewMode === 0">
                <v-row>
                  <v-col class="d-flex" :cols="cardColunmWidth" v-for="(item, index) in hsmItems" :key="index">
                    <hsm-card
                      :id="`hsm_card_${index}`"
                      :item="item"
                      @detail="updatePathId"
                      @logmon="goToTelemetryPage"
                      @delete="askToRemoveHsm"
                      @cert-management="openCertManagPage"
                    />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <hsm-data-table
                  :fetching="loading"
                  :items="hsmItems"
                  @detail="updatePathId"
                  @logmon="goToTelemetryPage"
                  @delete="askToRemoveHsm"
                  @cert-management="openCertManagPage"
                />
              </template>
            </template>
            <template v-else>
              <no-data-card
                icon="dns"
                :title="$tc('no_hsm_title')"
                :subtitle="$tc('no_hsm_subtitle')"
                :button-title="$tc('create')"
                @action="showAddHsmModal = true"
              />
            </template>
          </v-col>
        </v-row>
      </template>
    </default-page-template>

    <add-hsm-modal
      id="add_hsm_modal"
      :open="showAddHsmModal"
      @saved="newHsmSaved"
      @close="showAddHsmModal = false"
    />
    <confirm-modal
      id="confirm_modal"
      :open="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      :title-subject="selectedHsm"
      :body-subject="confirmSubject"
      @negative="closeConfirmModal"
      @positive="removeHsm"
    />
    <hsm-detail-modal
      :open="showDetailModal"
      :id="selectedHsm"
      @close="closeDetailModal"
      @saved="updateHsmSaved"
    />
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import HsmDataTable from './hsmViews/HsmDataTable'
import ConfirmModal from '@/components/ConfirmModal'
import HsmCard from './hsmViews/HsmCard'
import AddHsmModal from './modals/AddHsmModal'
import HsmDetailModal from './modals/HsmDetailModal'
import NoDataCard from '@/components/NoDataCard'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import objectCard from '@/mixins/objectCard'
export default {
  mixins: [objectCard],
  components: {
    HsmCard,
    HsmDataTable,
    AddHsmModal,
    ConfirmModal,
    NoDataCard,
    HsmDetailModal,
    DefaultPageTemplate
  },
  props: {
    id: String
  },
  data: () => ({
    selectedHsm: null,
    showAddHsmModal: false,
    showDetailModal: false,
    showConfirmModal: false,
    confirmTitle: null,
    confirmMessage: null,
    confirmSubject: null,
    loading: false
  }),
  mounted () {
    this.loadHsmList()
      .then(() => {
        if (this.id) this.showHsmDetail(this.id)
      })
  },
  computed: {
    viewMode: {
      get () {
        return this.$store.state.ui.prefHsmViewMode
      },
      set (val) {
        this.$store.commit('ui/SET_HSM_VIEW_MODE', val)
      }
    },
    hsmItems () {
      return this.$store.getters['hsm/GET_HSM_LIST']
    },
    userPermissions () {
      // TODO: get from role store
      return { add_hsm: true }
    }
  },
  methods: {
    toggleViewMode () {
      this.viewMode = (this.viewMode + 1) % 2
    },
    // Logmon
    goToTelemetryPage (hsmId) {
      this.$router.push({ name: 'telemetry', query: { type: 'hsm', id: hsmId } })
    },
    // Remove HSM
    askToRemoveHsm ({ id, label }) {
      this.confirmTitle = this.$tc('remove')
      this.confirmMessage = this.$tc('confirm_remove')
      this.confirmSubject = label
      this.selectedHsm = id
      this.showConfirmModal = true
    },
    closeConfirmModal () {
      this.confirmTitle = null
      this.confirmMessage = null
      this.selectedHsm = null
      this.showConfirmModal = false
    },
    removeHsm () {
      this.$store.dispatch('hsm/doDeleteHSM', { id: this.selectedHsm })
        .then(() => {
          this.$notify.success({})
          this.closeConfirmModal()
          this.loadHsmList()
        })
        .catch(error => {
          this.closeConfirmModal()
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    updatePathId (id) {
      this.$router.replace({ name: 'hsm-lan', params: { id } })
    },
    showHsmDetail (id) {
      const found = this.hsmItems.find(item => item.id === id)
      if (found) {
        this.openDetailModal(id)
      } else {
        this.$notify.error({ message: this.$t('hsm_not_found') })
        this.$router.replace({ name: 'hsm-lan' })
      }
    },
    openDetailModal (id) {
      this.selectedHsm = id
      this.showDetailModal = true
    },
    closeDetailModal () {
      this.$router.replace({ name: 'hsm-lan' })
      this.selectedHsm = null
      this.showDetailModal = false
    },
    newHsmSaved () {
      this.showAddHsmModal = false
      this.loadHsmList()
    },
    updateHsmSaved () {
      this.closeDetailModal()
      this.loadHsmList()
    },
    loadHsmList () {
      this.loading = true
      return this.$store.dispatch('hsm/doGetHSMList')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    openCertManagPage (id) {
      this.$router.push({ name: 'cert-management', params: { id } })
    }

  },
  watch: {
    $route (val) {
      if (this.id && val.name === 'hsm-lan') {
        this.showHsmDetail(this.id)
      }
    }
  }
}
</script>