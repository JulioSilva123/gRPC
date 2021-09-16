<template>
  <div>
    <v-card
      v-if="!loading"
      outlined
      class="mt-3"
    >
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
                  <v-tooltip v-if="item.type === 'x509'" right :disabled="!item.tracked">
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" :color="item.tracked ? 'dinamo' : ''">{{ getCertBlockedState(item) ? 'block' : item.icon }}</v-icon>
                    </template>
                    <span>{{ $t('alert_configured') }}</span>
                  </v-tooltip>
                  <v-icon v-else>{{ item.icon }}</v-icon>
                </v-avatar>
                <v-chip outlined v-if="item.label">
                  {{ item.label }}
                </v-chip>
              </td>
              <td>
                <span v-if="item.type === 'x509' && item.data">
                  {{ item.data.subjectName }}
                </span>
              </td>
              <td>
                <span
                  v-if="item.type === 'x509' && item.data"
                  :class="getClassesForExpirationDate(item.data.notAfter)">
                  {{ $getDateString({ date: item.data.notAfter, timeDetailLevel: 0 }) }}
                </span>
              </td>
              <td>
                <template v-if="item.linkedResourceArray">
                  <resource-chip
                    :resource-type="item.linkedResourceArray[0].type"
                    :text="item.linkedResourceArray[0].id"
                    @click.stop="openLinkedResource(item.linkedResourceArray[0])"
                  />
                </template>
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
    </v-card>
  </div>
</template>

<script>
import ResourceChip from '@/components/ResourceChip'
import resourceItem from '@/mixins/resourceItem'
import { getLabelDecorationForExpiration } from '@/plugins/globals.plugin.js'
export default {
  mixins: [resourceItem],
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  components: { ResourceChip },
  data () {
    return {
      search: null,
      loading: false
    }
  },
  computed: {
    headers () {
      return [
        {
          text: this.$tc('label'),
          align: 'start',
          sortable: true,
          filterable: true,
          value: 'label',
        },
        {
          text: this.$t('common_name'),
          align: 'start',
          sortable: false,
          filterable: true,
          value: 'data.subjectName',
        },
        {
          text: this.$t('not_valid_after'),
          align: 'start',
          sortable: true,
          filterable: false,
          value: 'data.notAfter',
        },
        {
          text: this.$tc('key'),
          align: 'start',
          sortable: false,
          filterable: false,
          value: 'data.linkedResourceArray',
        },
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          filterable: true,
          value: 'id',
        },
        { text: this.$tc('actions'), align: 'end', value: 'action', sortable: false }
      ]
    },
  },
  methods: {
    actionOptions (item) {
      return this.getItemOptions(item)
    },
    getCertBlockedState (cert) {
      return this.$store.getters['resources/GET_IS_CERT_BLOCKED'](cert)
    },
    getClassesForExpirationDate (expiration) {
      const status = getLabelDecorationForExpiration(new Date(expiration))
      let classes = []
      if (status?.expired) classes.push('striked')
      if (status?.condition) classes.push(`${status.condition}--text`)
      return classes
    },
    openLinkedResource (resource) {
      this.$emit('linked', resource)
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
    },
    removeTrackerEvent (item) {
      this.$emit('remove-tracker', { tracker: item.tracked[0]})
    },
    addTrackerEvent (item) {
      this.$emit('add-tracker', item)
    }
  },
}
</script>