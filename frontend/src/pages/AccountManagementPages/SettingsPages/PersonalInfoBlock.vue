<template>
  <div>
    <options-summary-card v-bind="profileCard">
      <v-list class="py-0">
        <template v-for="(item, index) in profileCardItems">
          <item-template
            :key="`item_${item.title}`"
            v-bind="item"
            @click="item.onClick(item.title)"
          >
            <template v-slot:name>
              {{ $te(item.title) ? $t(item.title) : item.title }}
            </template>
            <template v-slot:detail>
              <span data-private :id="`${item.title}_value`" no-gutters class="hide-in-percy">
                {{ item.value }}
              </span>
            </template>
            <template v-if="item.action" v-slot:action>
              <v-tooltip top :disabled="!item.action.tooltip">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                    @click.stop="item.action.onClick(item)"
                  >
                    <v-icon>{{ item.action.icon }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ $tc(item.action.tooltip) }}</span>
              </v-tooltip>
            </template>
          </item-template>
          <v-divider
            v-if="index < profileCardItems.length -1"
            :key="`${item.title}_divider`"
          />
        </template>
      </v-list>
    </options-summary-card>
    <info-edit-modal
      :open="showEditModal"
      :field-name="selectedFieldName"
      :field-value="selectedFieldValue"
      @close="closeEditModal"
    />
  </div>
</template>

<script>
import ItemTemplate from '@/components/managementViews/items/ItemTemplate'
import OptionsSummaryCard from '@/components/managementViews/OptionsSummaryCard'
import InfoEditModal from '@/pages/AccountManagementPages/InfoEditModal'
export default {
  components: {
    OptionsSummaryCard, ItemTemplate, InfoEditModal
  },
  mounted () {
    this.getInfo()
  },
  data () {
    return {
      showEditModal: false,
      selectedFieldName: null,
      selectedFieldValue: null
    }
  },
  computed: {
    profileCard () {
      return {
        title: this.$tc('profile')
      }
    },
    profileCardItems () {
      const self = this
      return [
        {
          title: 'name',
          value: this.userInfo.name,
          detail: true,
          clickable: true,
          onClick: function onClick (arg) {
            self.openEditModal(arg)
          }
        },
        {
          title: 'phone',
          value: this.userInfo.phone,
          detail: true,
          clickable: true,
          onClick: function onClick (arg) {
            self.openEditModal(arg)
          }
        },
        {
          title: 'company',
          value: this.userInfo.company,
          detail: true,
          clickable: true,
          onClick: function onClick (arg) {
            self.openEditModal(arg)
          }
        },
        {
          title: 'tax_payer',
          value: this.userInfo.taxPayer,
          detail: true,
          clickable: true,
          onClick: function onClick () {
            self.openEditModal('taxPayer', 'tax_payer')
          }
        },
        {
          title: 'email',
          value: this.userInfo.email,
          detail: true,
          clickable: false
        },
        {
          title: 'account_id',
          value: this.userInfo.id,
          detail: true,
          action: {
            icon: 'content_copy',
            tooltip: 'copy',
            onClick: function onClick (item) {
              self.doCopy(`${item.title}_value`)
            }
          }
        },
        {
          title: 'creation',
          value: this.$getDateString({ date: this.userInfo.created }),
          detail: true
        },
      ]
    },
    userInfo () {
      return this.$store.getters['account/GET_USER_INFO']
    }
  },
  methods: {
    doCopy (elementId) {
      let copyText = document.getElementById(elementId)
      let textArea = document.createElement("textarea")
      textArea.value = copyText.textContent.trim()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("Copy")
      textArea.remove()
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    closeEditModal () {
      this.showEditModal = false
      this.selectedFieldName = null
      this.selectedFieldValue = null
      this.$store.dispatch('account/doGetUserInfo')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    },
    openEditModal (fieldName, dataName) {
      this.selectedFieldName = dataName || fieldName
      this.selectedFieldValue = this.userInfo[fieldName]
      this.showEditModal = true
    },
    getInfo () {
      this.$store.dispatch('account/doGetUserInfo')
        .catch(error => {
          this.$store.dispatch('error/showErrorNotification', error)
        })
    }
  }
}
</script>

<style>

</style>