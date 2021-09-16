<template>
  <div>
    <options-menu
      v-model="showMenu"
      :items="options"
      :title="title"
      :subtitle="subtitle"
      @option-selected="dateOptionSelected"
      @action-selected="dateActionSelected"
    >
      <template v-slot:activator="{ on }">
        <v-card
          flat
          :ripple="false"
          max-width="160px"
          id="dateRangeCombo"
          v-on="on"
          class="cursor-pointer"
          :class="transparent ? 'no-bg' : 'bg-gray'"
        > 
          <v-row no-gutters class="mx-2">
            <p class="mt-2 mb-3">{{ $t(selectedOption.title) }}</p>
            <v-icon>arrow_drop_down</v-icon>
          </v-row>
        </v-card>
      </template>
    </options-menu>

    <!-- TODO: turn in to component -->
    <v-menu
      ref="calendarMenu"
      v-model="showCalendar"
      transition="scale-transition"
      offset-y
      min-width="290px"
      :activator="getQuerySelector('dateRangeCombo')"
      :open-on-click="false"
      :close-on-content-click="false"
    >
      <v-card>
        <v-date-picker
          ref="customRangePicker"
          v-model="calendarSelectorDateRange"
          no-title
          scrollable
          range
          @change="fullRangeIsSelected = true"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            class="text--secondary"
            @click="showCalendar = false"
          >
            {{ $t('cancel') }}
          </v-btn>

          <v-btn
            :disabled="!fullRangeIsSelected"
            text
            @click="setCustomDateRange"
          >
            {{ $t('apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import OptionsMenu from '@/components/OptionsMenu'
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    },
    options: {
      type: Array,
      required: true
    },
    selectedOption: {
      type: Object,
      required: true
    },
    transparent: Boolean
  },
  components: { OptionsMenu },
  data () {
    return {
      showMenu: false,
      showCalendar: false,
      fullRangeIsSelected: false,
      calendarSelectorDateRange: [
        this.selectedOption.range.start.toISOString().substr(0, 10),
        this.selectedOption.range.end.toISOString().substr(0, 10)
      ],
    }
  },
  computed: {
    title () {
      return this.selectedOption.title
    },
    subtitle () {
      const locale = this.$store.state.locale.locale
      const start = this.selectedOption.range.start.toLocaleDateString(locale).substr(0, 10)
      const end = this.selectedOption.range.end.toLocaleDateString(locale).substr(0, 10)
      return `${start} - ${end}`
    }
  },
  methods: {
    closeMenus () {
      this.showMenu = false
      this.showCalendar = false
    },
    getQuerySelector (id) {
      const selector = document.querySelector(`#${id}`)
      return selector
    },
    // TODO: change func name to non event like
    dateOptionSelected (option) {
      this.$emit('date-selected', option)
    },
    dateActionSelected (option) {
      if (option.id === 'custom') {
        this.fullRangeIsSelected = false
        this.showCalendar = true
      }
    },
    setCustomDateRange () {
      const startDate = new Date(this.calendarSelectorDateRange[0])
      const endDate = new Date(this.calendarSelectorDateRange[1])

      // Ofset needed because the Date constructor uses UTC when the input is isoString
      const localOffset = new Date().getTimezoneOffset()
      startDate.setMinutes(startDate.getMinutes() + localOffset)
      endDate.setMinutes(endDate.getMinutes() + localOffset)
      
      const customOption = {
        id: 'custom',
        title: 'custom',
        action: true,
        range: {
          start: startDate,
          end: endDate
        }
      }
      this.$emit('date-selected', customOption)
      this.showCalendar = false
    },
  },
  watch: {
    open (val) {
      if (!val) this.closeMenus()
      else this.showMenu = true
    }
  }
}
</script>

<style>

</style>