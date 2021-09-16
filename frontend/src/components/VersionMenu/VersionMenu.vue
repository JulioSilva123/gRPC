<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        icon
      >
        <v-icon>info_outline</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ version }}</v-list-item-title>
          <v-list-item-subtitle>{{ versionDate }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <template>
        <v-list-item>
          <v-list-item-content>
            <!-- <v-row no-gutters> -->
            <v-radio-group
              v-model="themeOption"
              row
            >
              <v-radio
                v-for="option in themeOptions"
                :key="option.title"
                :label="$t(option.title)"
                :value="option.value"
              />
            </v-radio-group>
            <!-- </v-row> -->
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-radio-group v-model="locale" row>
              <v-radio
                v-for="loc in locales"
                :key="loc"
                :ripple="false"
                :label="$t(`i18n.${loc}`)"
                :value="loc"
              ></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  computed: {
    themeOptions () {
      return this.$store.getters['ui/GET_THEME_OPTIONS']
    },
    themeOption: {
      get () {
        return this.$store.state.ui.themeOption
      },
      set (val) {
        this.$store.commit('ui/SET_THEME', val)
      }
    },
    version () {
      return this.$store.state.ui.version
    },
    versionDate () {
      return this.$store.state.ui.versionDate
    },
    locale: {
      get () {
        return this.$store.state.locale.locale
      },
      set (val) {
        this.$store.commit('locale/SET_LOCALE', val)
      }
    },
    locales () {
      return this.$store.state.locale.locales
    }
  }
}
</script>

<style>

</style>