<template>
  <div class="pt-4 pb-6">
    <default-page-template
      :title="$tc('settings')"
      page-name="SettingsPage"
    >
      <template v-slot:body>
        <v-row>
          <v-col cols="12">
            <personal-info-block />
          </v-col>
          <v-col cols="12">
            <security-block />
          </v-col>
          <v-col cols="12">
            <preferences-block />
          </v-col>
          <v-col cols="12">
            <critical-block 
              @delete-account="showSelfDeleteModal = true"
              class="pb-14"
            />
          </v-col>
        </v-row>
      </template>
    </default-page-template>
  </div>
</template>

<script>
import DefaultPageTemplate from '@/components/DefaultPageTemplate'
import PersonalInfoBlock from './PersonalInfoBlock'
import PreferencesBlock from './PreferencesBlock'
import SecurityBlock from './SecurityBlock'
import CriticalBlock from './CriticalBlock'
export default {
  components: {
    PersonalInfoBlock,
    PreferencesBlock,
    SecurityBlock,
    DefaultPageTemplate,
    CriticalBlock
  }
}
</script>

<style>

</style>