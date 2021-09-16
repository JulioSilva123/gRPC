<template>
  <div>
    <div class="top_content pt-8">
      <auth-top-bar/>
      <v-row no-gutters :justify="$vuetify.breakpoint.xs ? 'center' : null">
        <v-col cols="11" :sm="!showGoogleSignIn ? 6 : 7" :md="!showGoogleSignIn ? 5 : 8" class="pl-sm-10 mt-8 mb-4">
          <v-card max-width="650px" class="rounded-xl">
            <v-card-text class="pa-6">
              <v-row no-gutters>
                <v-col cols="12">
                  <div class="tit_area_menor text-uppercase mb-2">{{ $t('new_account') }}</div>
                </v-col>
                <v-col
                  :cols="$vuetify.breakpoint.smAndDown || !showGoogleSignIn ? 12 : 6"
                  :class="!$vuetify.breakpoint.smAndDown && showGoogleSignIn ? 'border-r pr-4' : ''"
                >
                  <sign-up-form />
                </v-col>

                <v-col
                  v-if="showGoogleSignIn"
                  :cols="$vuetify.breakpoint.smAndDown ? 12 : 6"
                  :align-self="!$vuetify.breakpoint.smAndDown ? 'center' : null"
                  :class="!$vuetify.breakpoint.smAndDown ? 'pl-4' : ''"
                >

                  <!-- DIVIDER -->
                  <v-row class="my-2" v-if="$vuetify.breakpoint.smAndDown">
                    <v-col align-self="center">
                      <v-row no-gutters align="center">
                        <v-divider />
                      </v-row>
                    </v-col>
                    <v-col cols="1">
                      <v-row no-gutters justify="center">
                        <strong class="text-uppercase">{{ $t('or') }}</strong>
                      </v-row>
                    </v-col>
                    <v-col align-self="center">
                      <v-row no-gutters align="center">
                        <v-divider />
                      </v-row>
                    </v-col>
                  </v-row>

                  <GoogleLogin
                    class="google-sign-in"
                    :params="params"
                    :onSuccess="onSuccess"
                    :onFailure="onFailure"
                  >
                    <span class="icon"></span>
                    <span class="buttonText text-uppercase">{{ $t('sign_up_with', {provider: 'google'}) }}</span>
                  </GoogleLogin>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
import SignUpForm from './SignUpForm'
import AuthTopBar from '@/components/AppTopBar/AuthTopBar'
import Copyrights from '@/components/Copyrights'
import PublicServices from '@/components/PublicServices'
import GoogleLogin from 'vue-google-login'

export default {
  mounted () {
    this.$store.commit('signup/SET_USER_EMAIL', this.$route.params.email)
  },
  props: {
    email: String
  },
  data: () => ({
    error: null,
    params: {
      client_id: "802779176873-a3112rhmrdk2butj1inr9c4m4st9v1lt.apps.googleusercontent.com"
    },
  }),
  components: {
    SignUpForm,
    AuthTopBar,
    Copyrights,
    PublicServices,
    GoogleLogin
  },
  computed: {
    copyrightMessage () {
      return this.$store.getters['ui/copyrightMessage']
    },
    showGoogleSignIn () {
      return this.$store.state.auth.google_oauth_treatment
    }
  },
  methods: {
    scrollWindow () {
      window.scrollTo(0, 0)
    },
    // Gooogle sign in
    onFailure (error){
      console.log(error)
    },
    onSuccess(googleUser) {
      this.$store.commit('signup/SET_USER_NAME', googleUser.getBasicProfile().getName())
      this.$store.commit('signup/SET_USER_EMAIL', googleUser.getBasicProfile().getEmail())
    }
  }
}
</script>

<style>
  .google-sign-in {
    border-radius: 8px;
    border: solid 1px ;
    border-color: var(--v-title_blue-base) !important;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    font-size: 0.875rem;
    display: block;
    width: 100%;
    height: 36px;
    padding-left: 8px;
    padding-right: 8px;
  }
  .google-sign-in:hover {
    background-color: var(--v-white_btn_hover-base);
  }

  

  span.icon {
    background: url('../../../assets/images/logo-google.svg') transparent 5px 50% no-repeat;
    display: inline-block;
    vertical-align: middle;
    width: 32px;
    height: 26px;
  }
  span.buttonText {
    display: inline-block;
    vertical-align: middle;
    padding-left: 24px;
    padding-right: 8px;
    font-size: 14px;
    font-weight: bold;
    /* Use the Roboto font that is loaded in the <head> */
    font-family: 'Roboto', sans-serif;
  }
</style>