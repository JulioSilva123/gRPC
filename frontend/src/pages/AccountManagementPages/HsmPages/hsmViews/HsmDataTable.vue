<template>
  <div>
    <v-card outlined class="mt-3">
      <v-text-field
        id="HsmDataTable_search"
        v-model="search"
        clearable
        solo
        flat
        autocomplete="off"
        background-color="soloTxtFldBg"
        :readonly="loading"
        append-icon="search"
        :label="$tc('search')"
        class="px-4 mt-4 pt-6 mb-0"
      />
      <!-- items_per_page_all -->
      <template v-if="items.length">
        <v-data-table
          :headers="headers"
          :items="items"
          mobile-breakpoint=""
          :search="search"
        >
          <template
            v-slot:body="{ items }"
          >
            <tbody>
              <tr v-for="item in items" :key="item.id" class="cursor-pointer" @click="showDetail(item)">
                <td>
                  <v-avatar>
                    <v-icon>dns</v-icon>
                  </v-avatar>
                  <v-chip outlined v-if="item.label">
                    {{ item.label }}
                  </v-chip>
                </td>

                <td>
                  <v-list-item-title class="hide-in-percy">{{ item.id }}</v-list-item-title>
                </td>

                <td style="min-width:140px">
                  <v-row no-gutters justify="end">
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                      <v-tooltip bottom v-for="option in itemActionOptions(item)" :key="option.id">
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :id="`HsmDataTable_${item.label}_${option.id}`"
                            icon
                            v-on="on"
                            @click.stop="option.action(item)"
                          >
                            <v-icon>{{ option.icon }}</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ option.title }} </span>
                      </v-tooltip>
                    </template>
                    <template v-else>
                      <v-spacer/>
                      <v-menu>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            v-on="on"
                            icon
                          >
                            <v-icon>more_vert</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <!-- Waiting for HID on request payload -->
                          <v-list-item
                            @click="option.action(item)"
                            v-for="option in itemActionOptions(item)"
                            :key="option.id"
                            :disabled="option.disabled"
                            :id="`HsmDataTable_${item.label}_${option.id}`"
                          >
                            <v-list-item-icon>
                              <v-icon>{{ option.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>{{ option.title }}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </template>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    fetching: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      search: null,
      selectedItem: null,
    }
  },
  computed: {
    headers () {
      let headers = [
        {
          text: this.$tc('label'),
          align: 'start',
          sortable: true,
          value: 'label'
        },
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: this.$tc('actions'), align: 'end', value: 'action', sortable: false },
      ]
      return headers
    },
    loading () {
      return this.fetching
    }
  },
  methods: {
    itemActionOptions () {
      const self = this
      let options = [
        {
          title: this.$tc('view_details'),
          id: "info",
          icon: 'info_outline',
          action: (item) => {
            self.showDetail(item)
          }
        },
        {
          title: this.$tc('remove'),
          id: "delete",
          icon: 'delete',
          action: (item) => {
            self.deleteHsm(item)
          }
        },
        {
          title: this.$tc('block_certs'),
          id: "cert_manag",
          icon: 'track_changes',
          action: (item) => {
            self.openCertManagement(item)
          }
        },
        {
          title: this.$tc('log_monitor'),
          id: "telemetry",
          icon: 'format_align_left',
          action: (item) => {
            self.goToTelemetryPage(item)
          }
        }
      ]
      return options
    },
    showDetail (item) {
      this.$emit('detail', item.id)
    },
    goToTelemetryPage (item) {
      this.$emit('logmon', item.id)
    },
    deleteHsm (item) {
      this.$emit('delete', { id: item.id, label: item.label })
    },
    openCertManagement (item) {
      this.$emit('cert-management', item.id)
    }
  }
}
</script>