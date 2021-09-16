<template>
  <div>
    <span class="text-button text--secondary pl-4">{{ $tc('account_tlm') }}</span>
    <v-card outlined class="rounded-xl">
      <v-card-text class="pt-4">
        <v-row class="pb-2" no-gutters>
          <v-spacer />
          
          <!-- renew -->
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

          <!-- start -->
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

          <!-- pause -->
          <template v-else>
            <v-tooltip :disabled="$vuetify.breakpoint.xsOnly" bottom>
              <template v-slot:activator="{ on }">
                <v-btn id="Logmon_play" icon v-on="on" @click="startLogs">
                  <v-icon outline>
                    play_arrow
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $tc('to_start') }}</span>
            </v-tooltip>
          </template>
        </v-row>

        <v-row
          v-if="logItems.length <= 0 && !isStarted"
          align="center"
          justify="center"
          class="h-40v"
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
          :items="logItems"
          :is-started="isStarted"
          @startLogs="startLogs"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import TelemetryList from '@/pages/TelemetryPages/TelemetryList'
export default {
  components: {
    TelemetryList
  },
  data () {
    return {
    }
  },
  mounted () {
    this.loading = true
    this.$store.dispatch('account/doGetUserInfo')
      .then(() => {
        const channelOptions = this.$store.getters['logMon/channelOptions']
        this.$store.commit('logMon/SET_CHANNEL', channelOptions[0])
      })
  },
  computed: {
    isStarted () {
      return this.$store.state.logMon.logMonReq !== null
    },
    logItems () {
      return this.$store.state.logMon.logs
    },
  },
  methods: {
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
  }
}
</script>

<style>

</style>