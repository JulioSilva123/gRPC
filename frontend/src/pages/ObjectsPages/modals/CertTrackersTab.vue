<template>
  <v-card outlined class="mt-3">
    <v-data-table
      :headers="headers"
      :items="trackers"
      mobile-breakpoint=""
      :hide-default-footer="true"
    >
      <template
        v-slot:body="{ items }"
      >
        <tbody>
          <tr
            v-for="(tracker, i) in items"
            :key="i"
            :id="`CertTrackersTab_tracker_${i}`"
          >
            <td>
              <v-avatar>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" >{{ getIcon(tracker.type) }}</v-icon>
                  </template>
                  <span>{{ $t(tracker.type.toLowerCase()) }}</span>
                </v-tooltip>
              </v-avatar>
            </td>
            <td>
              {{ tracker.email }}
            </td>
            <td>
              {{ tracker.name }}
            </td>
            <td>
              <v-tooltip bottom v-for="option in actionOptions" :key="option.id">
                <template v-slot:activator="{ on }">
                  <v-btn
                    :id="`CertTrackersTab_tracker_${i}_${option.id}`"
                    icon
                    @click.stop="option.action(tracker)"
                    v-on="on"
                  >
                    <v-icon>{{ option.icon }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ option.title }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  props: {
    trackers: {
      type: Array,
      required: false
    }
  },
  computed: {
    headers () {
      return [
        {
          text: this.$tc('type'),
          align: 'start',
          value: 'type',
          sortable: false
        },
        {
          text: this.$tc('email'),
          align: 'start',
          value: 'email',
          sortable: false
        },
        {
          text: this.$tc('name'),
          align: 'start',
          value: 'name',
          sortable: false
        },
        {
          text: '',
          align: 'start',
          value: 'actions',
          sortable: false
        },
      ]
    },
    actionOptions () {
      const self = this
      return [
        {
          title: this.$tc('remove'),
          id: "delete",
          icon: 'delete',
          action: (tracker) => {
            self.$emit('remove-tracker', { tracker })
          }
        }
      ]
    }
  },
  methods: {
    getIcon (type) {
      let optionsIcons = {
        watracker: 'mdi-whatsapp',
        smstracker: 'sms',
        emailtracker: 'mdi-at'
      }
      return optionsIcons[type]
    },
  }
}
</script>

<style>

</style>