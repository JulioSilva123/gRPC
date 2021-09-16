<template>
  <div class="pb-6">
    <default-page-template
      :title="$tc('block_certs')"
      page-name="CertManagementPage"
      :bread-crumb-items="breadCrumbItems"
    >
      <template v-slot:actions>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="showBlockNewCertModal = true"
              id="add_blocked_cert"
              v-on="on"
              icon
            >
              <v-icon>
                add
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('block_cert') }}</span>
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
            <template v-else-if="blockedCerts.length">
              <cert-management-table
                :items="blockedCerts"
                @unblock="unblock"
                @cert-detail="viewDetail"
              />
            </template>
            <template v-else>
              <no-data-card
                icon="track_changes"
                :title="$tc('no_blocked_cert_title')"
                :subtitle="$tc('no_blocked_cert_subtitle')"
              />
            </template>
          </v-col>
        </v-row>
      </template>
    </default-page-template>
    <block-new-cert-modal
      :open="showBlockNewCertModal"
      :hsm-id="id"
      @close="closeBlockNewCertModal"
      @saved="certBlocked"
    />
  </div>
</template>

<script>
import NoDataCard from '@/components/NoDataCard'
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import CertManagementTable from './CertManagementTable'
import BlockNewCertModal from './BlockNewCertModal'
export default {
  components: {
    DefaultPageTemplate,
    CertManagementTable,
    NoDataCard,
    BlockNewCertModal,
  },
  props: {
    id: String
  },
  mounted () {
    this.refresh()
  },
  data () {
    return {
      loading: false,
      showBlockNewCertModal: false,
      blockedCerts: [],
    }
  },
  computed: {
    breadCrumbItems () {
      return [
        {
          text: 'HSMs',
          disabled: false,
          exact: true,
          to: { name: 'hsm-lan' },
        },
        {
          text: this.id,
          exact: true
        },
      ]
    }
  },
  methods: {
    refresh () {
      this.loading = true
      Promise.all([
        this.getBlockedCertsList(),
        this.$store.dispatch('resources/doGetCertList')
      ])
        .finally(() => {
          this.loading = false
        })
    },
    getBlockedCertsList () {
      return this.$store.dispatch('hsm/doGetHSMBlockedList', { id: this.id })
        .then(res => {
          this.blockedCerts = res
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    unblock (certId) {
      this.loading = true
      this.$store.dispatch('resources/doUnblockCert', { hsmId: this.id, certId })
        .then(() => {
          this.$notify.success({})
          this.refresh()
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    viewDetail (id) {
      this.$store.commit('resourceModal/SET_SELECTED_RESOURCE', { id, objType: 'x509' })
    },
    closeBlockNewCertModal () {
      this.showBlockNewCertModal = false
    },
    certBlocked () {
      this.closeBlockNewCertModal()
      this.refresh()
    }
  }
}
</script>

<style>

</style>