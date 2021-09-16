<template>
  <v-menu
    ref="menu"
    v-model="menu"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="`${month.value + 1}/${year}`"
        :label="$tc(label)"
        prepend-icon="mdi-calendar"
        readonly
        hide-details
        v-bind="attrs"
        v-on="on"
        class="px-2"
      ></v-text-field>
    </template>
    <div>
      <v-row justify="space-between">
        <v-btn
          icon
          @click="year--"
        >
          <v-icon>navigate_before</v-icon>
        </v-btn>

        <span class="font-weight-bold">{{ month }}</span>

        <v-btn
          icon
          @click="year++"
        >
          <v-icon>navigate_next</v-icon>
        </v-btn>
      </v-row>

      <v-row>
        <v-col v-for="monthOption in monthOptions" cols="4" :key="monthOption.value">
          <v-card outlined>
            {{ monthOption.name }}
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-menu>
</template>

<script>
export default {
  props: {
    label: String,
    start: Object,
    end: Object
  },
  data () {
    return {
      menu: false,
      year: (new Date).getFullYear(),
      month: null,
      monthOptions: [
        {
          name: this.$tc('months.january', 2),
          value: 0
        },
        {
          name: this.$tc('months.february', 2),
          value: 1
        },
        {
          name: this.$tc('months.march', 2),
          value: 2
        },
        {
          name: this.$tc('months.april', 2),
          value: 3
        },
        {
          name: this.$tc('months.may', 2),
          value: 4
        },
        {
          name: this.$tc('months.june', 2),
          value: 5
        },
        {
          name: this.$tc('months.july', 2),
          value: 6
        },
        {
          name: this.$tc('months.august', 2),
          value: 7
        },
        {
          name: this.$tc('months.september', 2),
          value: 8
        },
        {
          name: this.$tc('months.october', 2),
          value: 9
        },
        {
          name: this.$tc('months.november', 2),
          value: 10
        },
        {
          name: this.$tc('months.december', 2),
          value: 11
        },
      ]
    }
  },
  computed: {
  }
}
</script>

<style>

</style>