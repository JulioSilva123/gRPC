<template>
  <options-summary-card v-bind="signinCard">
    <v-list class="py-0">
      <template v-for="(item, index) in signinItems">
        <item-template
          :key="`item_${item.title}`"
          v-bind="item"
          @click="item.onClick(item.title)"
        >
          <template v-slot:name>
            {{ $tc(item.title) }}
          </template>
          <template v-slot:detail>
            <template v-if="(typeof item.value) === 'boolean'">
              <v-row no-gutters align="center">
                <v-icon>{{ item.value ? 'check_circle' : 'mdi-close-circle-outline' }}</v-icon>
                <span class="pl-2">
                  {{ item.value ? $tc('on') : $tc('off') }}
                </span>
              </v-row>
            </template>
            <template v-else>
              {{ item.value }}
            </template>
          </template>
        </item-template>
        <v-divider
          v-if="index < signinItems.length -1"
          :key="`${item.title}_divider`"
        />
      </template>
    </v-list>
  </options-summary-card>  
</template>

<script>
import OptionsSummaryCard from '@/components/managementViews/OptionsSummaryCard'
import ItemTemplate from '@/components/managementViews/items/ItemTemplate'
export default {
  components: {
    OptionsSummaryCard, ItemTemplate
  },
  mounted () {
    this.getInfo()
  },
  computed: {
    signinCard () {
      return {
        title: this.$tc('authentication'),
      }
    },
    signinItems () {
      const self = this
      return [
        {
          title: 'password',
          value: '••••••••',
          clickable: true,
          onClick: function onClick () {
            self.$router.push({ name: 'change-password' })
          }
        },
        {
          title: 'tfa',
          value: false,
          disabled: true
        },
      ]
    },
    userInfo () {
      return this.$store.getters['account/GET_USER_INFO']
    }
  },
  methods: {
    getInfo () {
      // this.$store.dispatch('account/doGetUserInfo')
    }
  }
}
</script>

<style>

</style>