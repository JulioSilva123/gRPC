<template>
  <v-card color="transparent" flat class="dash_content">
    <v-row v-if="items.length">
      <v-col class="d-flex" :cols="cardColunmWidth" v-for="(item, index) in items" :key="index">
        <service-card
          :id="`service_card_${item.alias.replace(/\s/g, '_')}`"
          :item="item"
          @click="itemClicked(item)"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import ServiceCard from './ServiceCard'
export default {
  props: {
    items: Array,
  },
  components: {
    ServiceCard
  },
  computed: {
    cardColunmWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12
        case 'sm': return 4
        case 'md': return 4
        case 'lg':
        case 'xl': return 3
        default: return 4
      }
    }
  },
  methods: {
    itemClicked (item) {
      this.$router.push({ name: 'service',
        params: {
          id: item.id
        }
      })
    }
  }

}
</script>

<style>

</style>