<template>
  <div>
    <v-card outlined class="mt-3">
      <v-text-field
        id="TokenDataTable_search"
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
              <tr v-for="item in items" :key="item.id">
                <td class="ma-0 pa-0">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>lock</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title :id="`TokenDataTable_${item.token}_id`" class="hide-in-percy">{{ item.token }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>

                <!-- <td v-if="$vuetify.breakpoint.mdAndUp" class="hide-in-percy">
                  {{ $getElapsedTimeString({ dateValue: item.created }) }}
                </td> -->

                <td style="min-width:140px">
                  <v-row no-gutters justify="end">
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                      <v-tooltip bottom v-for="option in itemActionOptions(item)" :key="option.id">
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :id="`TokenDataTable_${item.token}_${option.id}`"
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
                          <v-list-item
                            @click="option.action(item)"
                            v-for="option in itemActionOptions(item)"
                            :key="option.id"
                            :disabled="option.disabled"
                            :id="`TokenDataTable_${item.label}_${option.id}`"
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
          text: 'Token',
          align: 'start',
          sortable: true,
          value: 'token',
        },
        { text: this.$tc('actions'), align: 'end', value: 'action', sortable: false },
      ]

      // const creationHeader = {
      //   text: this.$tc('creation'),
      //   align: 'start',
      //   sortable: true,
      //   value: 'created'
      // }
      // if (this.$vuetify.breakpoint.mdAndUp) {
      //   headers.splice(2, 0, creationHeader)
      // }
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
          title: `${self.$t('copy')} ID`,
          id: 'copy',
          icon: 'content_copy',
          action: (item) => {
            self.copyToken(`TokenDataTable_${item.token}_id`)
          }
        },
        {
          title: this.$tc('retrieve_data_cloud'),
          id: 'retrieve',
          icon: 'lock_open',
          action: (item) => {
            self.decodeToken(item)
          }
        },
        {
          title: this.$tc('remove'),
          id: "delete",
          icon: 'delete',
          action: (item) => {
            self.deleteToken(item)
          }
        }
      ]
      return options
    },
    copyToken (elementId) {
      let copyText = document.getElementById(elementId)
      let textArea = document.createElement("textarea")
      textArea.value = copyText.textContent.trim()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("Copy")
      textArea.remove()
      this.$store.dispatch('ui/showSnackbar', { message: this.$t('copied'), position: 3 })
    },
    deleteToken (item) {
      this.$emit('delete', item.token)
    },
    decodeToken (item) {
      this.$emit('decode', item.token)
    }
  }
}
</script>