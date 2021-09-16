<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      :id="`KeyCard_${item.id}`"
      @click="detailsEvent"
      class="flex-grow-1"
      :elevation="hover ? 3 : 0"
      :class="{ 'border-color-tertiary': !$vuetify.theme.dark, 'flex-direction': true }"
      outlined
      :ripple="false"
    >
      <v-card-text class="pa-0 ma-0">
        <v-row class="px-4 py-2">
          <v-col cols="12" class="pb-1 text-truncate">
            <v-icon>
              {{ item.icon }}
            </v-icon>
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
              {{ item.family.text }}
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
              :id="`KeyCard_${item.id}_${option.id}`"
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
export default {
  mixins: [resourceItem],
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
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
    }
  }
}
</script>