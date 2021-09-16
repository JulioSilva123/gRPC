<template>
  <transition name="slide-fade">
    <div v-if="offerList.length">
      <!-- OFFERS SECTION TITLE -->
      <div class="barra_titulo mt-16">
        <div class="dinamo_tit">DINAMO <strong>SUPER CLOUD</strong></div>
        <div class="tit_area">{{ $t('welcome_offer_section_title') }}</div>
      </div>
      <!-- CARDS -->
      <v-row>
        <v-col
          class="d-flex"
          :cols="cardColunmWidth"
          v-for="(item, index) in offerList" :key="index"
        >
          <v-menu
            open-on-hover
            auto
            transition="scroll-y-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-card
                class="flex-grow-1 default-pointer box_pub_servico rounded-xl"
                v-bind="attrs"
                v-on="on"
              >
                <v-img
                  v-if="item.logo"
                  class="ico_servico_interno"
                  :src="getLogo(item.logo)"
                />
                <div class="tit_base">dinamo</div>
                <div class="tit_servico">{{ item.alias }}</div>
              </v-card>
            </template>

            <v-card
              class="blueborder"
            >
              <v-card-text>
                <p>
                  {{ item.summary }}
                </p>
                <a
                  class="link--text"
                  @click="$emit('service-click')"
                >
                  {{ $t('do_sign_in') }}
                </a>
                {{ `${$t('to_know_our_services')}` }}
              </v-card-text>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </transition>
</template>

<script>
import {
  fromBase64,
} from 'pvutils'
export default {
  mounted () {
    this.$store.dispatch('offers/getOffersList')
      .then(res => {
        this.offerList = res
      })
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
  },
  data () {
    return {
      offerList: []
    }
  },
  computed: {
    cardColunmWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12
        case 'sm': return 6
        case 'md': return 3
        case 'lg':
        case 'xl':
        default: return 3
      }
    },
    darkMode () {
      // return this.$store.getters['ui/GET_IS_DARK_MODE_ACTIVE']
      return false
    },
  },
  methods: {
    getLogo (logoData) {
      if (this.darkMode) {
        return fromBase64(logoData)
      } else return fromBase64(logoData)
    },
  }
}
</script>

<style>

.blueborder {
  border: 3px solid #19acee !important;
}

</style>