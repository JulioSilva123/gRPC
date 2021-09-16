<template>
  <div>
    <options-summary-card collapsible critical v-bind="titles">
      <v-list class="py-0">
        <item-template :hasIconBtn="false">
          <template v-slot:name>
            {{ $tc('delete_account') }}
          </template>
          <template v-slot:detail>
            <v-row no-gutters>
              <v-spacer />
              <v-btn
                block 
                max-width="254"
                color="darkRed"
                class="white--text"
                @click="showAccountDeleteConfirmModal"
              >
                {{ $tc('delete_account') }}
              </v-btn>
            </v-row>
          </template>
        </item-template>
      </v-list>
    </options-summary-card>

    <credential-confirmation-modal
      :modalTitle="confModalTitle"
      :alertColor="confModalAlertColor"
      :alertMsg="confModalAlertMsg"
      :btnTitle="confModalBtnTitle"
      :open="showCredentConfirmModal"
      @authenticated="confModalSuccCB"
      @close="showCredentConfirmModal = false"
    >
      <!-- <template v-slot:second-text>
        <p class="my-2 mx-1">
          {{ $tc('self_delete_modal_disclaimer_1') }}
          <a class="link--text">{{ $tc('terms_of_service') }}</a>
          {{ $tc('self_delete_modal_disclaimer_2') }}
        </p>
      </template> -->
    </credential-confirmation-modal>

  </div>
</template>

<script>
import ItemTemplate from '@/components/managementViews/items/ItemTemplate'
import OptionsSummaryCard from '@/components/managementViews/OptionsSummaryCard'
import CredentialConfirmationModal from './modals/CredentialConfirmationModal'
export default {
  components: {
    OptionsSummaryCard,
    ItemTemplate,
    CredentialConfirmationModal,
  },
  data () {
    return {
      showCredentConfirmModal: false,
      confModalTitle: null,
      confModalAlertColor: null,
      confModalAlertMsg: null,
      confModalBtnTitle: null,
      confModalSuccCB: () => {},
    }
  },
  mounted () {
    this.getInfo()
  },
  computed: {
    titles () {
      return {
        title: this.$tc('critical_area'),
      }
    },
    userInfo () {
      return this.$store.getters['account/GET_USER_INFO']
    }
  },
  methods: {
    getInfo () {
      // this.$store.dispatch('account/doGetUserInfo')
    },
    showAccountDeleteConfirmModal () {
      this.confModalTitle = this.$t('self_delete_modal_title')
      this.confModalAlertColor = 'error'
      this.confModalAlertMsg = this.$t('self_delete_modal_warning')
      this.confModalBtnTitle = this.$t('self_delete_button')
      this.confModalSuccCB = this.deleteAccount
      this.showCredentConfirmModal = true
    },
    deleteAccount () {
      this.$store.dispatch('account/selfDeleteAccount')
        .then(() => {
          this.$store.dispatch('auth/doLogout')
          this.$store.dispatch('ui/showSnackbar', { message: this.$t('account_deleted'), position: 1 })
        })
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    }
  }
}
</script>

<style>

</style>