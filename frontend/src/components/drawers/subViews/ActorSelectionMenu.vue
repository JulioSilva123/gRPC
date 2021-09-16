<template>
  <v-menu nudge-width="304px" :nudge-left="50">
    <template v-slot:activator="{ on: menu }">
      <v-sheet
        v-on="menu"
        class="cursor-pointer"
        color="appTopBar"
        height="64px"
      >
        <v-row no-gutters class="dados">
          <v-col cols="3" align-self="center" class="pa-2">
            <v-avatar>
              <img
                v-if="accountAvatar"
                height="40px"
                width="40px"
                :src="accountAvatar"
              >
              <v-icon v-else large>account_circle</v-icon>

            </v-avatar>              
          </v-col>
          <v-col cols="7" align-self="center" class="pa-2">
            <span class="text-h6 font-weight-light">
              {{ accountName }}
            </span>
          </v-col>
          <v-col cols="2" align-self="center" class="pa-2">
            <v-icon>arrow_drop_down</v-icon>
          </v-col>
        </v-row>
      </v-sheet>
      <v-divider />
    </template>
    <v-card id="frfr" class="rounded-lg" width="304px">
      <!-- <v-row no-gutters>
        <v-subheader>
          {{ $tc('your_organizations') }}
        </v-subheader>
      </v-row> -->
      <v-list class="py-0">
        <!-- <v-list-item-group v-model="actor" no-action>
          <template v-for="act in actorsOptions">
            <v-list-item :key="act.name">
              <v-list-item-avatar>
                <v-img v-if="act.avatar" :src="act.avatar" />
                <v-icon v-else large>{{ act.avatar }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ act.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon large>add_circle_outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="$tc('add_organization')"/>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group> -->

        <v-divider />
        <v-subheader>
          {{ `${$tc('your', 2)} ${$tc('account')}` }}
        </v-subheader>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon large>account_circle</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="accountName" />
              <v-list-item-subtitle v-text="accountEmail" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title class="pl-1">
              {{ $t('logout') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  beforeMount () {
    this.$store.dispatch('account/doGetUserInfo')
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
  },
  data: function () {
    return {
      actor: 0
    }
  },
  computed: {
    accountAvatar () {
      return require('@/assets/images/avatar.jpg')
    },
    accountEmail () {
      return this.$store.getters['account/GET_USER_INFO'].email
    },
    accountName () {
      return this.$store.getters['account/GET_USER_INFO'].name
    },
    actorsOptions () {
      return [
        { name: 'Personal Org', avatar: require('@/assets/images/logo-dinamo-simbolo-dark.png') },
        { name: 'Dinamo LTDA', avatar: require('@/assets/images/logo-dinamo-simbolo-white.png') }
      ]
    }
  },
  methods: {
    setActor () {
      console.log('TODO: SET ACTOR')
    },
    logout () {
      this.$store.dispatch('auth/doLogout')
    }
  }
}
</script>

<style>

</style>