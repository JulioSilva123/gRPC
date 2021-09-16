<template>
  <div>
    <v-card outlined class="mt-3">
      <v-text-field
        v-model="search"
        clearable
        solo
        flat
        autocomplete="off"
        background-color="soloTxtFldBg"
        :readonly="loading"
        append-icon="search"
        :label="$tc('search')"
        class="px-4 mt-4 pt-6 mb-0"
      />
      <template v-if="items.length">
        <v-data-table
          :headers="headers"
          :items="items"
          sort-by="label"
          mobile-breakpoint=""
          :search="search"
        >
          <template
            v-slot:body="{ items }"
          >
            <tbody>
              <tr v-for="item in items" :key="item.id" class="cursor-pointer" @click="viewDetail(item)">
                <td class="ma-0 pa-0">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-icon>dns</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.id }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </td>

                <td>
                  <v-chip outlined v-if="item.label">
                    {{ item.label }}
                  </v-chip>
                </td>

                <td style="min-width:140px">
                  <v-row no-gutters justify="end">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon @click.stop="viewDetail(item)" v-on="on">
                          <v-icon>info_outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $tc('view_details') }} </span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon @click.stop="unblock(item)" v-on="on">
                          <v-icon>remove_circle_outline</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $tc('unblock') }} </span>
                    </v-tooltip>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </template>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      search: null
    }
  },
  computed: {
    headers () {
      let headers = [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: this.$tc('actions'), align: 'end', value: 'action', sortable: false },
      ]
      if (this.$vuetify.breakpoint.mdAndUp) {
        headers.splice(1, 0, {
          text: this.$tc('label'),
          align: 'start',
          sortable: true,
          value: 'label'
        })
      }
      return headers
    },
    loading () {
      return this.fetching
    }
  },
  methods: {
    unblock (item) {
      this.$emit('unblock', item.id)
    },
    viewDetail (item) {
      this.$emit('cert-detail', item.id)
    }
  }
}
</script>

<style>

</style>