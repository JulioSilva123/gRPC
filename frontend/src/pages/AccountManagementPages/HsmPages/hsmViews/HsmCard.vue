<template>
  <v-hover
    v-slot:default="{ hover }"
  >
    <v-card
      @click="showDetail"
      class="flex-grow-1"
      :elevation="hover ? 3 : 0"
      :class="{ 'border-color-tertiary': !$vuetify.theme.dark, 'flex-direction': true }"
      outlined
      :ripple="false"
    >
      <v-card-text class="pa-0 ma-0">
        <v-row class="px-4 py-2">
          <v-col cols="12" class="pb-1 text-truncate">
            <v-icon>dns</v-icon>
            <span class="pl-4 text-h6 text--secondary hide-in-percy">{{ item.id }}</span>
          </v-col>
          
          <v-col class="py-1" cols="12">
            <v-chip outlined v-if="item.label">
              {{ item.label }}
            </v-chip>
          </v-col>

        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <selection-menu
          :options="actionOptions"
          :tooltip="$t('options')"
          icon="more_vert"
          offset-y
          offset-x
        />
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import SelectionMenu from '@/components/SelectionMenu'
export default {
  components: { SelectionMenu },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    actionOptions () {
      const self = this
      let options = [
        {
          title: this.$tc('view_details'),
          id: "info",
          icon: 'info_outline',
          action: () => {
            self.showDetail()
          }
        },
        {
          title: this.$tc('remove'),
          id: "delete",
          icon: 'delete',
          action: () => {
            self.deleteHsm()
          }
        },
        {
          title: this.$tc('block_certs'),
          id: "cert_manag",
          icon: 'track_changes',
          action: () => {
            self.openCertManagement()
          }
        },
        {
            title: this.$tc('log_monitor'),
            id: "telemetry",
            icon: 'format_align_left',
            action: () => {
              self.goToTelemetryPage()
            }
          }
      ]
      return options
    }
  },
  methods: {
    showDetail () {
      this.$emit('detail', this.item.id)
    },
    goToTelemetryPage () {
      this.$emit('logmon', this.item.id)
    },
    deleteHsm () {
      this.$emit('delete', { id: this.item.id, label: this.item.label })
    },
    openCertManagement () {
      this.$emit('cert-management', this.item.id)
    }
  }
}
</script>