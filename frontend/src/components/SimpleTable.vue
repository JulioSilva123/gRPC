<template>
  <div>
    <v-card
      flat
      outlined
    >
      <v-simple-table
        fixed-header
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="column in headers" :key="column.name" class="text-left subtitle-2 text--primary">
                {{ column.name }}
                <v-tooltip v-if="column.tip" top>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      v-on="on"
                    >help_outline</v-icon>
                  </template>
                  {{ $t(column.tip.title) }}
                </v-tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
            >
              <td v-for="column in headers" :key="`${item.id}_${column.name}`">
                {{ item[column.key] }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    headers: Array
  }
}
</script>

<style>

</style>