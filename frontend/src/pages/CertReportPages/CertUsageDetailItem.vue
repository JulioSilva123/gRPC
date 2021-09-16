<template>
  <v-list-item class="py-1 mx-n6 body-2" :class="{ 'bg-gray': index % 2 === 0 }">
    <v-row class="pr-10">
      <v-col cols="2" class="pa-1 py-0" align-self="center">
        <p class="mb-0 ml-2">
          {{ $getDateString({ date: source.usedAt, timeDetailLevel: 2 }) }}
        </p>
      </v-col>

      <v-col cols="3" class="pa-1 py-0" align-self="center">
        <p class="mb-0 ml-1">{{ `${source.usedBy}` }}</p>
      </v-col>

      <v-col cols="2" class="pa-1 py-0" align-self="center">
        <p class="mb-0 ml-1">{{ `${source.eventType}` }}</p>
      </v-col>

      <v-col cols="3" class="pa-1 py-0" align-self="center">
        <p v-if="source.hsmName" class="mb-0">{{ `${source.keyName}` }}</p>
        <resource-chip
          v-else
          compact
          resource-type="key"
          :text="source.keyName"
          hideFromPercy
          @click.stop="openResourceDetail({ id: source.keyName, type: 'key' })"
        />
      </v-col>

      <v-col cols="2" class="pa-1 py-0" align-self="center">
        <v-row no-gutters justify="end">
          <resource-chip
            compact
            v-if="source.hsmName"
            :text="source.hsmId"
            :tooltip="source.hsmName"
            hideFromPercy
            @click.stop="goToHsmDetail(source.hsmId)"
          />
          <p v-else class="mb-0 text-end">{{ `HSM DS` }}</p>
        </v-row>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script>
import ResourceChip from '@/components/ResourceChip'
import resourceModal from '@/mixins/resourceModal.js'
export default {
  mixins: [resourceModal],
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: { ResourceChip }

}
</script>

<style>

</style>