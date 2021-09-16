<template>
  <options-summary-card v-bind="titles">
    <v-list class="py-0">
      <item-template>
        <template v-slot:name>
          {{ $tc('theme') }}
        </template>
        <template v-slot:detail>
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
        </template>
      </item-template>

      <v-divider />

      <item-template>
        <template v-slot:name>
          {{ $tc('language') }}
        </template>
        <template v-slot:detail>
          <v-radio-group class="mt-0" v-model="locale" hide-details row>
            <v-radio
              v-for="loc in locales"
              :key="loc"
              :label="$t(`i18n.${loc}`)"
              :value="loc"
            />
          </v-radio-group>
        </template>
      </item-template>

      <v-divider />

      <item-template>
        <template v-slot:name>
          {{ $tc('account_timezone') }}
        </template>
        <template v-slot:detail>
          {{ (new Date()).toTimeString().slice(9, 18) }}
        </template>
      </item-template>

      <v-divider />

      <item-template>
        <template v-slot:name>
          {{ $tc('record_session') }}
        </template>
        <template v-slot:detail>
          <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              class="ml-n2"
              :color="sessionIsRecording ? 'red' : ''"
              @click="toggleSessionIdentify"
            >
            <v-icon large>mdi-record-rec</v-icon>
            </v-btn>
          </template>
          <span>{{ sessionIsRecording ? $t('recording') : $t('recording_stopped') }}</span>
        </v-tooltip>
        </template>
      </item-template>
    </v-list>
  </options-summary-card>
</template>

<script>
import ItemTemplate from '@/components/managementViews/items/ItemTemplate'
import OptionsSummaryCard from '@/components/managementViews/OptionsSummaryCard'
export default {
  components: {
    OptionsSummaryCard, ItemTemplate
  },
  mounted () {
    this.getInfo()
  },
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
    },
    titles () {
      return {
        title: this.$tc('preferences'),
      }
    },
    userInfo () {
      return this.$store.getters['account/GET_USER_INFO']
    },
    sessionIsRecording () {
      return this.$store.state.error.isSessionTracked
    }
  },
  methods: {
    getInfo () {
      // this.$store.dispatch('account/doGetUserInfo')
    },
    toggleSessionIdentify () {
      if (this.sessionIsRecording) {
        this.$store.dispatch('error/unidentifyLogRocket')
      } else {
        this.$store.dispatch('error/identifyLogRocket')
      }
    }
  }
}
</script>

<style>

</style>