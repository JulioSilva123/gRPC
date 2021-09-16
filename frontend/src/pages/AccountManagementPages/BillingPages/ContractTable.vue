<template>
  <v-card
      class="mt-3"
      flat
      outlined
    >
      <!-- TODO: change name to label -->
      <v-data-table
        sort-by="created"
        :headers="headers"
        :items="contracts"
        mobile-breakpoint=""
      >
        <template
          v-if="contracts.length"
          v-slot:body="{ items }"
        >
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              @click.stop="$emit('detail', item)"
              :id="`ContractTable_${item.label}`"
            >
              <td>
                <v-list-item class="pl-0">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.id" class="hide-in-percy" />
                  </v-list-item-content>
                </v-list-item>
              </td>
              <td>
                <a
                  class="link--text"
                  @click="$router.push({ name: 'service', params: { id: item.offer.id }})"
                >
                  {{ `${item.offer.name}` }}
                </a>
              </td>
              <td class="hide-in-percy">
                {{ $getDateString({ date: new Date(item.start), timeDetailLevel: 0 }) }}
              </td>
              <td class="hide-in-percy">
                <template v-if="item.end">
                  {{ $getDateString({ date: new Date(item.end), timeDetailLevel: 0 }) }}
                </template>
                <b v-else>-</b>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    contracts: {
      type: Array,
      required: false
    }
  },
  computed: {
    headers () {
      const headers = [
        {
          text: 'ID',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: this.$tc('service'),
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: this.$tc('start'),
          align: 'start',
          sortable: true,
          value: 'created'
        },
        {
          text: this.$tc('end'),
          align: 'start',
          sortable: true,
          value: 'created'
        }
      ]
      return headers
    },
  }
}
</script>

<style>

</style>