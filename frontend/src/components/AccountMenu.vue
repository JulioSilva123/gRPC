<template>
  <v-menu nudge-width="304px" :nudge-left="50">
    <template v-slot:activator="{ on: menu }">
      <v-sheet
        v-on="menu"
        class="cursor-pointer"
        :color="color"
        height="64px"
        id="AccountMenu"
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
              <v-icon :dark="dark" v-else large v-text="'account_circle'" />
            </v-avatar>
          </v-col>
          <v-col cols="7" align-self="center" class="pa-2">
            <span
              class="text-h6 font-weight-light"
              :class="{ 'white--text': dark }"
            >
              {{ username }}
            </span>
          </v-col>
          <v-col cols="2" align-self="center" class="pa-2">
            <v-icon :dark="dark" v-text="'arrow_drop_down'" />
          </v-col>
        </v-row>
      </v-sheet>
      <v-divider />
    </template>
    <v-card class="rounded-lg" width="304px">
      <slot name="prepend" />

      <v-list-item>
        <v-list-item-avatar>
          <v-icon large v-text="'account_circle'" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="username" />
          <v-list-item-subtitle v-if="subtitle" v-text="subtitle" />
        </v-list-item-content>
      </v-list-item>
      <v-divider />

      <v-card-text class="pt-1 px-0 pb-0">
        <slot />

        <slot name="append" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn id="logout" text @click="logout" v-text="$t('logout')" />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      required: false,
      default: true
    },
    username: String,
    subtitle: String,
    picture: String,
    color: {
      type: String,
      require: false,
      default: ''
    }
  },
  data: function () {
    return {
      actor: 0
    }
  },
  computed: {
    accountAvatar () {
      return this.picture ? require(this.picture) : null
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/doLogout')
    }
  }
}
</script>

<style>

</style>