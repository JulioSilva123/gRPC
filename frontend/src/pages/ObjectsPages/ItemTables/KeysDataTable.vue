<template>
  <div>
    <v-card outlined class="mt-3">
      <v-text-field
        v-model="search"
        clearable
        solo
        flat
        autocomplete="off"
        background-color="soloTxtFldBg"
        append-icon="search"
        :label="$tc('search')"
        class="px-4 mt-4 pt-6 mb-0"
      />
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
              <tr v-for="item in items" :key="item.id" class="cursor-pointer" @click="detailsEvent(item)">
                <td>
                  <v-avatar>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-avatar>
                  <v-chip outlined v-if="item.label">
                    {{ item.label }}
                  </v-chip>
                </td>
                <td>
                  {{ item.family.text }}
                </td>
                <td>
                  <v-list-item-title class="hide-in-percy">{{ item.id }}</v-list-item-title>
                </td>
                <td>
                  <v-row no-gutters justify="end">
                    <template>
                      <v-spacer/>
                      <v-menu>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            :id="`${item.id}_optionsActivator`"
                            v-on="on"
                            icon
                          >
                            <v-icon>more_vert</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item
                            @click="option.action(item)"
                            v-for="option in actionOptions(item)"
                            :key="option.id"
                            :disabled="option.disabled"
                            :id="`${item.id}_${option.id}`"
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
import resourceItem from '@/mixins/resourceItem'
export default {
  mixins: [resourceItem],
  props: {
    items: {
      type: Array,
      required: true
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
      return [
        {
          text: this.$tc('label'),
          align: 'start',
          sortable: true,
          value: 'label',
        },
        {
          text: this.$t('type'),
          align: 'start',
          sortable: true,
          value: 'family',
        },
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: this.$tc('actions'), align: 'end', value: 'action', sortable: false }
      ]
    }
  },
  methods: {
    actionOptions (item) {
      return this.getItemOptions(item)
    },
    encryptEvent (arg) {
      this.$emit('encrypt-file', arg)
    },
    csrEvent (item) {
      this.$emit('csr', item)
    },
    deleteEvent (item) {
      this.$emit('delete', item)
    },
    blockEvent (item) {
      this.$emit('block', item)
    },
    detailsEvent (item) {
      this.$emit('details', item)
    },
    exportEvent (item) {
      this.$emit('export', item)
    }
  }
}
</script>