<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      :id="`CertificateCard_${item.id}`"
      @click="detailsEvent"
      class="flex-grow-1"
      :elevation="hover ? 3 : 0"
      :class="getClassesForExpirationDate(item)"
      outlined
      :ripple="false"
    >
      <v-card-text class="pa-0 ma-0">
        <v-row class="px-4 py-2">
          <v-col cols="12" class="pb-1 text-truncate">
            <v-icon v-if="item.type === 'x509'" :color="item.tracked ? 'dinamo' : ''">{{ getCertBlockedState(item) ? 'block' : item.icon }}</v-icon>
            <v-icon v-else>{{ item.icon }}</v-icon>
            <span class="pl-4 text-h6 text--secondary hide-in-percy">
              {{ item.id }}
            </span>
          </v-col>

          <v-col class="py-1" cols="12">
            <v-chip outlined v-if="item.label">
              {{ item.label }}
            </v-chip>
          </v-col>

          <v-col class="pt-0" cols="12">
            <div class="pl-1">
              <span v-if="item.type === 'x509' && item.data">{{ item.data.subjectName }}</span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-menu left>
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
              @click="option.action"
              v-for="option in getItemOptions(item)"
              :key="option.id"
              :disabled="option.disabled"
              :id="`CertificateCard_${item.id}_${option.id}`"
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
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import resourceItem from '@/mixins/resourceItem'
import { getLabelDecorationForExpiration } from '@/plugins/globals.plugin.js'

export default {
  mixins: [resourceItem],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getCertBlockedState (cert) {
      return this.$store.getters['resources/GET_IS_CERT_BLOCKED'](cert)
    },
    getClassesForExpirationDate (item) {
      if (!item.data || !item.data.notAfter) return ['border-color-tertiary']
      const status = getLabelDecorationForExpiration(new Date(item.data.notAfter))
      let classes = []
      if (status?.condition) classes.push(`border-color-${status.condition}`)
      else classes.push('border-color-tertiary')
      return classes
    },
    encryptEvent () {
      this.$emit('encrypt-file', this.item)
    },
    csrEvent () {
      this.$emit('csr', this.item)
    },
    deleteEvent () {
      this.$emit('delete', this.item)
    },
    blockEvent () {
      this.$emit('block', this.item)
    },
    detailsEvent () {
      this.$emit('details', this.item)
    },
    exportEvent () {
      this.$emit('export', this.item)
    },
    removeTrackerEvent (item) {
      this.$emit('remove-tracker', { tracker: item.tracked[0]})
    },
    addTrackerEvent (item) {
      this.$emit('add-tracker', item)
    }
  }
}
</script>