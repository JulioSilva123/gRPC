<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="$tc('event', 2)"
      page-name="TelemetryPage"
    >
      <template v-slot:actions>
        <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              id="Logmon_reload"
              :disabled="logItems.length <= 0"
              v-on="on"
              icon
              @click="reloadLogs"
            >
              <v-icon outline>
                autorenew
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('reload') }}</span>
        </v-tooltip>

        <template v-if="isStarted">
          <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
            <template v-slot:activator="{ on }">
              <v-btn id="Logmon_pause" v-on="on" icon @click="pauseLogs">
                <v-icon outline>
                  pause
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('stop') }}</span>
          </v-tooltip>
        </template>

        <template v-else>
          <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                id="Logmon_play"
                icon
                :disabled="$route.query && $route.query.type === 'hsm' && !chanelIsBindedHsm"
                v-on="on"
                @click="startLogs"
              >
                <v-icon outline>
                  play_arrow
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('to_start') }}</span>
          </v-tooltip>
        </template>
      </template>


      <template v-slot:body>
        <template v-if="loading">
          <v-row align="center" justify="center" class="h-70v">
            <v-progress-circular indeterminate :size="50" />
          </v-row>
        </template>

        <template v-else>
          <select-two-name-items
            label="HSM"
            :items="channelOptions"
            v-model="channel"
            :disabled="isStarted"
            @change="setPathForSelectedOption"
          />

          <no-data-card
            v-if="$route.query && $route.query.type === 'hsm' && !chanelIsBindedHsm"
            icon="dns"
            :title="$tc('selected_hsm_not_binded')"
          >
            <template v-slot:subtitle>
              <!-- TODO: add help menu -->
              <v-row no-gutters justify="center" class="my-2">
                <span class="text--secondary text-center">
                  {{ $tc('hsm_not_binded_tip') }}
                </span>
              </v-row>
            </template>
          </no-data-card>
          <v-row
            v-else-if="logItems.length <= 0 && !isStarted"
            align="center"
            justify="center"
            class="h-60v"
          >
            <v-btn
              @click="startLogs"
              icon width="120"
              height="120"
            >
              <v-icon
                color="timid"
                size="120"
              >
                play_circle_outline
              </v-icon>
            </v-btn>
          </v-row>

          <telemetry-list
            v-else
            :items="logItems"
            :is-started="isStarted"
            @startLogs="startLogs"
          />
        </template>
      </template>
    </default-page-template>
  </div>
</template>

<script>
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import TelemetryList from './TelemetryList'
import NoDataCard from '@/components/NoDataCard'
import SelectTwoNameItems from '@/components/fields/SelectTwoNameItems'
export default {
  components: {
    DefaultPageTemplate,
    TelemetryList,
    NoDataCard,
    SelectTwoNameItems
  },
  mounted () {
    this.loading = true
    Promise.all([
      this.$store.dispatch('hsm/doGetHSMList'),
      this.$store.dispatch('account/doGetUserInfo')
    ])
      .then(() => {
        this.channelOptions = this.$store.getters['logMon/channelOptions']
        this.setSelectedOption()
      }) 
      .catch(error => {
        this.$store.dispatch('error/showErrorNotification', error)
      })
      .finally(() => {
        this.loading = false
      })
  },
  data: () => {
    return {
      channelOptions: null,
      loading: false
    }
  },
  computed: {
    logItems () {
      return this.$store.state.logMon.logs
    },
    channel: {
      get () {
        return this.$store.state.logMon.channel
      },
      set (val) {
        this.reloadLogs()
        this.pauseLogs()
        return this.$store.commit('logMon/SET_CHANNEL', val)
      }
    },
    chanelIsBindedHsm () {
      return this.$route.query.type === 'hsm' &&
             this.$store.getters['hsm/HSM_IS_BINDED']({ id: this.$route.query.id })
    },
    isStarted () {
      return this.$store.state.logMon.logMonReq !== null
    },
  },
  methods: {
    setSelectedOption () {
      const query = this.$route.query
      if (query.type && query.id) {
         this.channelOptions.forEach(element => {
           if (query.type === element.value.type && element.value.id === query.id) {
             this.channel = element.value
             return
           }
         })
      } else {
        this.channel = this.channelOptions[0].value
      }
    },
    setPathForSelectedOption () {
      // console.log(this.channel)
      if (this.channel) {
        this.$router.push({ query: { type: this.channel.type, id: this.channel.id } })
      }
    },
    startLogs () {
      this.$store.dispatch('logMon/start')
        .catch(error => {
          console.log(error)
        })
    },
    pauseLogs () {
      this.$store.dispatch('logMon/pause')
    },
    reloadLogs () {
      this.$store.dispatch('logMon/reload')
    }
  },
  watch: {
    $route () {
      this.setSelectedOption()
    }
  }
}
</script>