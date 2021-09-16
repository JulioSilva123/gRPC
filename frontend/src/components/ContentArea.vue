<template>
  <v-card flat class="py-4">
    <v-row no-gutters wrap>
      <template v-for="(item, key) in items">
        <v-col cols="12" md="6" :key="`tab-item-${key}`"
          v-if="
            item.data !== null &&
            item.data !== undefined &&
            item.data !== ''
          "
        >
          <div>
            <template v-if="Array.isArray(item.data)">
              <template v-if="item.data.length > 0">
                <v-list class="list">
                  <v-list-group class="list-group">
                    <strong>
                      {{ item.title }}
                    </strong>
                    <p v-for="(i, k) in item.data" :key="k" @click="$emit('click')">
                      <template v-if="(i !== null && typeof i === 'object')">
                        <template v-if="item.table">
                          <table class="table" :key="`table-${key}`">
                            <tbody>
                              <tr>
                                <td v-for="(val, keyB) in i" :key="keyB">
                                  {{ val }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </template>

                        <template v-else>
                          <template v-for="(val, keyC) in i">
                            <span v-if="val !== null && val !== ''" :key="`obj-${keyC}`">
                              <strong class="grey--text text--darken-2">
                                {{ $tc(`${key}`) }}
                              </strong>
                              <p>{{ val }}</p>
                            </span>
                          </template>
                          <v-divider />
                        </template>
                      </template>

                      <template v-else>
                        {{ i }}
                      </template>
                    </p>
                  </v-list-group>
                </v-list>
              </template>
            </template>

            <template v-else>
              <strong>{{ item.title }}</strong>
              <p v-if="item.html" v-html="item.data" :class="item.class" />
              <p v-if="!item.html" :class="item.class">
                {{ item.data }}
              </p>
            </template>
          </div>
        </v-col>
      </template>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: false,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.title-grey {
  color: #424242;
}

.list {
  padding: 0;
}

.list-group {
  &::before,
  &::after {
    background: none !important;
  }
}

.table {
  border: solid 1px #cbcbcb;
  border-collapse: collapse;
  border-spacing: 0;
  font: normal 13px Arial, sans-serif;
}
.table tr {
  border: solid 1px #cbcbcb;
  color: #336b6b;
  padding: 10px;
  text-align: left;
  text-shadow: 1px 1px 1px #fff;
}
.table td {
  border: solid 1px #cbcbcb;
  color: #333;
  padding: 10px;
  text-shadow: 1px 1px 1px #fff;
}
</style>
