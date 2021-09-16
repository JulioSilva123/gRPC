<template>
  <div>
    <v-card flat outlined class="my-1 py-2">
      <v-row class="px-6 pr-14 body-1">
        <v-col cols="3" class="px-1">
          <p class="text--secondary mb-0">{{ $t('offer_name') }}</p>
        </v-col>
        <v-col cols="3" class="px-1">
          <p class="text--secondary mb-0">{{ `${$tc('contract_id')}` }}</p>
        </v-col>
        <v-col cols="4" class="px-1">
          <p class="text--secondary mb-0">{{ $tc('charged_period') }}</p>
        </v-col>
        <v-col cols="2" class="px-1">
          <p class="text--secondary mb-0 text-end">{{ `${$tc('subtotal')}` }}</p>
        </v-col>
      </v-row>
    </v-card>
    <v-expansion-panels
      multiple
      v-model="openedPanels"
    >
      <v-expansion-panel
        v-for="(invoice, i) in items"
        :key="i"
        :id="`InvoiceExpansion_panel_container_${invoice.id}`"
      >
        <v-expansion-panel-header
          :id="`InvoiceExpansion_panel_header_${i}`"
          class="py-1"
        >
          <v-row class="pr-4 body-1" justify="space-between">
            <v-col cols="3" class="px-1" align-self="center">
              <a
                v-if="invoice.offer"
                class="link--text"
                @click="$router.push({ name: 'service', params: { id: invoice.offer.id }})"
              >
                {{ `${invoice.offer.name}` }}
              </a>
            </v-col>
            <v-col cols="3" class="px-1" align-self="center">
              <v-row no-gutters>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-if="!invoice.contract.isActive"
                      v-on="on"
                      color="warning"
                      small
                      class="mr-1"
                    >
                      mdi-alert-outline
                    </v-icon>
                  </template>
                  <span>
                    {{ `${$tc('contract_finished_on')} ${$getDateString({ date: invoice.contract.end })}` }}
                  </span>
                </v-tooltip>
                <p class="mb-0">{{ `${invoice.contract.id}` }}</p>
              </v-row>
            </v-col>
            <v-col cols="4" class="px-1" align-self="center">
              {{ `${$getDateString({ date: invoice.startDate, timeDetailLevel: 0 })}` }}
              <b>-</b>
              {{ `${$getDateString({ date: invoice.endDate, timeDetailLevel: 0 })}` }}
            </v-col>
            <v-col cols="2" class="px-1">
              <p class="text-end mb-0 text-end">{{ $n(invoice.total, 'currency') }}</p>
            </v-col>

            <v-col v-if="openedPanels.includes(i) && invoice.items.length" cols="12">
              <v-row class="mt-3 body-1" justify="space-between">
                <v-col cols="2" class="px-1">
                  <p class="text--secondary mb-0">{{ $tc('type') }}</p>
                </v-col>
                <v-col cols="2" class="px-1">
                  <p class="text-center text--secondary mb-0">{{ $tc('occurrence', 2) }}</p>
                </v-col>
                <v-col cols="2" class="px-1">
                  <p class="text-center text--secondary mb-0">{{ $tc('unit_price') }}</p>
                </v-col>
                <v-col cols="2" class="px-1">
                  <p class="text-center text--secondary mb-0">{{ $tc('coefficient') }}</p>
                </v-col>
                <v-col cols="3" class="px-1">
                  <p class="text--secondary mb-0">{{ $tc('subtotal') }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="invoice.items.length">
          <v-list-item
            v-for="(item, index) in invoice.items"
            :key="index"
            class="py-1 mx-n6 body-2"
            :class="{ 'bg-gray': index % 2 === 0 }"
          >
            <v-row class="pr-10" justify="space-between">
              <v-col cols="2" class="pa-1 py-0">
                <p class="mb-0 ml-2 text-uppercase">
                  {{ item.type }}
                </p>
              </v-col>

              <v-col cols="2" class="pa-1 py-0">
                <p class="mb-0 text-center">
                  {{ item.quantity }}
                </p>
              </v-col>

              <v-col cols="2" class="pa-1 py-0">
                <p class="mb-0 text-center">
                  
                  {{ $store.getters['locale/getLocaleCurrency']((item.variableValue / item.coeficient), 4) }}
                </p>
              </v-col>

              <v-col cols="2" class="pa-1 py-0">
                <p class="mb-0 text-center">
                  {{ item.coeficient }}
                </p>
              </v-col>

              <v-col cols="3" class="pa-1 py-0">
                <p class="mb-0">
                  {{ $n(item.subtotal, 'currency') }}
                </p>
              </v-col>

            </v-row>
          </v-list-item>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      openedPanels: []
    }
  }
}
</script>

<style>

</style>