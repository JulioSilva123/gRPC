<template>
  <v-card
    @click="$emit('click', item)"
    class="flex-grow-1 box_servico link_servico w-inline-block rounded-xl"
  >
    <v-row justify="end" no-gutters>
      <v-card flat height="24px">
        <v-tooltip bottom v-if="item.contract">
          <template v-slot:activator="{ on }">
            <v-icon color="green" v-on="on">
              check_circle_outline
            </v-icon>
          </template>
          <span>{{ $tc('hired') }} </span>
        </v-tooltip>
      </v-card>
    </v-row>

    <v-img
      class="ico_servico_interno"
      :src="logoData"
    />
    <div class="tit_base">dinamo</div>
    <div class="tit_servico">{{ item.alias }}</div>
    <div class="desc_servico">{{ item.summary }}</div>
  </v-card>
</template>

<script>
import {
  fromBase64,
} from 'pvutils'
export default {
  props: {
    item: Object
  },
  computed: {
    darkMode () {
      // return this.$store.getters['ui/GET_IS_DARK_MODE_ACTIVE']
      return false
    },
    logoData () {
      if (this.darkMode) {
        return fromBase64(this.item.logoDark)
      } else return fromBase64(this.item.logo)
    },
  }
}
</script>

<style scoped>
  img {
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
  }
</style>