<template>
  <div>
    <div class="top_content pt-8">
      <auth-top-bar/>
      <v-row no-gutters>
        <v-col cols="10" sm="5" class="pl-10 mt-8 mt-md-12 mb-4">
          <p class="tit_slide_small text-uppercase mb-1">{{ $t('welcome_to') }}</p>
          <p class="tit_slide title_blue--text mb-2">DINAMO SUPER CLOUD</p>
          <p class="white--text" :class="{ 'text-center': $vuetify.breakpoint.xs }">{{ $t('welcome_top_message') }}</p>
        </v-col>
      </v-row>
    </div>

    <public-services
      class="mx-4"
      @service-click="$router.push({ name: 'login' })"
    />
    <copyrights />
  </div>
</template>

<script>
import AuthTopBar from '@/components/AppTopBar/AuthTopBar'
import Copyrights from '@/components/Copyrights'
import PublicServices from '@/components/PublicServices'
export default {
  components: { AuthTopBar, Copyrights, PublicServices },
  data () {
    return {
      email: null
    }
  },
  computed: {
    emailFieldCols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12
        case 'sm': return 8
        case 'md':
        case 'lg': return 4
        case 'xl': 
        default: return 4
      }
    },
    signUpBtnCols () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 12
        case 'sm': return 4
        case 'md':
        case 'lg': return 2
        case 'xl': 
        default: return 2
      }
    }
  },
  methods: {
    submit () {
      this.$router.push({ name: 'join', params: { email: this.email }})
    }
  }
}
</script>