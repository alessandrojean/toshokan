<template>
  <section
    :class="[
      'motion-safe:transition-transform transform duration-200 h-16 bg-white dark:bg-gray-800 shadow-top sm:hidden fixed inset-x-0 bottom-16 pt-5 pb-2 rounded-t-2xl border-t dark:border-r dark:border-l dark:-mx-px border-gray-200 dark:border-gray-700',
      sheetLoading ? 'translate-y-full' : '',
      loading ? 'translate-y-full' : 'translate-y-0'
    ]"
  >
    <RadioGroup v-model="activeGroup">
      <RadioGroupLabel class="sr-only">
        {{ t('book.properties.collection') }}
      </RadioGroupLabel>
      <div class="w-full flex space-x-2 overflow-x-auto px-3 h-auto">
        <RadioGroupOption
          v-for="group in groups"
          :key="group.name"
          :value="group.name"
          v-slot="{ checked }"
        >
          <span :class="['chip', checked ? 'is-active' : '']">
            {{ group.name }}
          </span>
        </RadioGroupOption>
      </div>
    </RadioGroup>
  </section>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption
} from '@headlessui/vue'

export default {
  components: {
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption
  },

  setup () {
    const { t } = useI18n()

    const store = useStore()
    const sheetLoading = computed(() => store.state.sheet.loading)

    const loading = computed(() => store.state.collection.groups.loading)
    const groups = computed(() => store.state.collection.groups.items)
    const activeGroup = ref(store.state.collection.group)

    watch(activeGroup, async newGroup => {
      if (newGroup !== store.state.collection.group) {
        store.commit(MutationTypes.COLLECTION_UPDATE_GROUP, { group: newGroup })
        await store.dispatch('collection/fetchBooks', 1)
      }
    })

    async function changeGroup (groupName) {
      if (groupName !== activeGroup.value) {
        store.commit(MutationTypes.COLLECTION_UPDATE_GROUP, { group: groupName })
        await store.dispatch('collection/fetchBooks', 1)
      }
    }

    watch(() => store.state.collection.group, newGroup => {
      activeGroup.value = newGroup
    })

    return {
      sheetLoading,
      loading,
      groups,
      activeGroup,
      changeGroup,
      t
    }
  }
}
</script>

<style>

</style>
