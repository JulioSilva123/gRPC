<template>
  <v-menu
    v-model="open"
    :transition="transition"
    max-width="230px"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <slot v-bind:on="on" name="activator">
      </slot>
    </template>
    <v-card>
      <template v-if="title || subtitle">
        <v-card-title>
          <v-row>
            <v-col class="py-0" cols="12" v-if="title">
              <span class="text-button text--secondary">{{ $t(title) }}</span>
            </v-col>
            <v-col class="py-0" cols="12" v-if="subtitle">
              <span class="text-button text--primary">{{ subtitle }}</span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-divider />
      </template>
      
      <v-list>
        <v-list-item
          v-for="(option, index) in options"
          :key="option.id"
          @click="itemClicked(index)"
        >
          <v-list-item-icon v-if="option.icon">
            <v-icon>{{ option.icon }}</v-icon>
          </v-list-item-icon>
          <!-- <v-list-item-content> -->
          {{ $te(option.title) ? $tc(option.title) : option.title }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: 'scale-transition'
    },
    items: Array,
    title: String,
    subtitle: String,
  },
  mounted () {
    this.options = this.items.slice()
  },
  data () {
    return {
      open: this.value,
      options: {}
    }
  },
  computed: {
    
  },
  methods: {
    // Struct sample:
    // [
    //   {
    //     id: 'last_week',
    //     title: 'last_week_title'
    //   },
    //   {
    //     id: 'more_ranges',
    //     title: 'more_ranges',
    //     children: [
    //       {
    //         id: 'last_month',
    //         title: 'last_month'
    //       },
    //       {
    //         id: 'last_year',
    //         title: 'last_year'
    //       }
    //     ]
    //   },
    //   {
    //     id: 'from_calendar',
    //     title: 'custom',
    //     action: true
    //   }
    // ]
    itemClicked (index) {
      const item = this.options[index]
      if (item.children) {
        this.options.splice(index, 1, ...item.children)
      } else {
        if (item.action) this.$emit('action-selected', item)
        else this.$emit('option-selected', item)
        this.open = false
      }
    }
  },
  watch: {
    value (val) {
      this.open = val
    },
    open (val) {
      if (!val) {
        this.options = this.items
      }
      if (val !== this.value) this.$emit('input', val)
    }
  }
}
</script>

<style>

</style>