<template>
  <div>
    <v-card
      class="mt-3"
      outlined
    >
      <!-- TODO: change name to label -->
      <v-data-table
        sort-by="created"
        :headers="headers"
        :items="apiKeyItems"
        mobile-breakpoint=""
      >
        <template
          v-if="apiKeyItems.length"
          v-slot:body="{ items }"
        >
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              class="cursor-pointer"
              @click.stop="$emit('detail', item)"
              :id="`ApiKeysTable_${item.label}`"
            >
              <td>
                <v-chip
                  outlined
                  v-if="item.label"
                >
                  {{ item.label }}
                </v-chip>
              </td>
              <td v-if="$vuetify.breakpoint.mdAndUp" class="hide-in-percy">
                {{ $getElapsedTimeString({ dateValue: item.created }) }}
              </td>
              <td>
                <v-list-item class="pl-0">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.id.slice(0, 10)" class="hide-in-percy" />
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>
                <v-row no-gutters justify="end">
                  <template v-if="$vuetify.breakpoint.mdAndUp">
                    <v-tooltip bottom v-for="option in actionOptions" :key="option.id">
                      <template v-slot:activator="{ on }">
                        <v-btn
                          :id="`ApiKeysTable_${item.label}_${option.id}`"
                          icon
                          @click.stop="option.action(item)"
                          v-on="on"
                        >
                          <v-icon>{{ option.icon }}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ option.title }}</span>
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
                          v-for="option in actionOptions"
                          :key="option.id"
                          :disabled="option.disabled"
                          :id="`ApiKeysTable_${item.label}_${option.id}`"
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
    </v-card>    
  </div>
</template>

<script>
export default {
  props: {
    apiKeyItems: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    headers () {
      const headers = [
        {
          text: this.$tc('label'),
          align: 'start',
          sortable: true,
          value: 'label',
        },
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { 
          text: this.$tc('actions'),
          align: 'end',
          value: null,
          sortable: false
        },
      ]
      const creationHeader = {
        text: this.$tc('creation'),
        align: 'start',
        sortable: true,
        value: 'created'
      }
      if (this.$vuetify.breakpoint.mdAndUp) {
        headers.splice(1, 0, creationHeader)
      }
      return headers
    },
    actionOptions () {
      const self = this
      return [
        {
          title: this.$tc('view_details'),
          id: "detail",
          icon: 'info_outline',
          action: (item) => {
            self.$emit('detail', item)
          }
        },
        {
          title: this.$tc('remove'),
          id: "delete",
          icon: 'delete',
          action: (item) => {
            self.$emit('delete', item)
          }
        }
      ]
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
  }
}
</script>

<style>

</style>