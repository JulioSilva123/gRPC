<template>
  <div>
    <v-list-item>
      <v-list-item-avatar>
        <v-icon>subdirectory_arrow_right</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <p class="monospace">
          {{ source.content }}
        </p>
        <!-- <v-list-item-title class="monospace">
          {{ getLineInfo(4, 8) }}
        </v-list-item-title>
        <v-list-item-title class="monospace">
          {{ getLineInfo(8) }}
        </v-list-item-title> -->
      </v-list-item-content>
    </v-list-item>

    <v-divider />
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number
    },
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      keys: ['line', 'channel', 'line2', 'channel2', 'line3', 'channel3', 'line4', 'channel4', 'line5', 'channel5']
    }
  },
  methods: {
    getLineInfo (start, end = null) {
      const keys = end !== null ? this.keys.slice(start, end) : this.keys.slice(start)
      const parsedData = keys.map(key => {
        return `${key}: ${this.source.content[key]}`
      }).join(', ')
      console.log(parsedData)
      return parsedData
    }
  }
}
</script>

<style scoped>
</style>