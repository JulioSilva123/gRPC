<template>
  <div>
    <div class="top_content pt-8">
      <auth-top-bar/>
      <v-row no-gutters>
        <v-col cols="10" sm="5" class="pl-16 pl-sm-10 mt-8 mt-md-12 mb-4">
          <login-card
            @goterror="handleError"
          >
            <template v-slot:bottom>
              <error-card
                class="my-2"
                id="login_error_card"
                :email="$store.state.auth.email"
                :error="error"
                @close="error = null"
              />
            </template>
          </login-card>
        </v-col>
      </v-row>
    </div>

    <public-services
      class="mx-4"
      @service-click="scrollWindow"
    />
    <copyrights />
  </div>
</template>

<script>
import errorCard from '@/components/forms/AuthFormErrorCard'
import LoginCard from './LoginCard'
import Copyrights from '@/components/Copyrights'
import AuthTopBar from '@/components/AppTopBar/AuthTopBar'
import PublicServices from '@/components/PublicServices'

export default {
  components: {
    errorCard,
    LoginCard,
    AuthTopBar,
    Copyrights,
    PublicServices
  },
  mounted () {
    this.$store.commit('auth/RESET_INPUT')
  },
  data: () => ({
    error: null,
  }),
  methods: {
    scrollWindow () {
      window.scrollTo(0, 0)
    },
    handleError (error) {
      this.error = error
    },
    goToSignUp () {
      this.$router.push({ name: 'join' })
    }
  }
}
</script>