<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed inset-0 overflow-hidden z-20"
      @close="$emit('update:open', false)"
      :open="open"
    >
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="absolute inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-x-0 sm:inset-x-auto sm:inset-y-0 bottom-0 sm:right-0 sm:pl-10 max-w-full flex">
          <TransitionChild
            as="template"
            enter="transform motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            enter-from="translate-y-full sm:translate-y-0 sm:translate-x-full"
            enter-to="translate-y-0 sm:translate-x-0"
            leave="transform motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            leave-from="translate-y-0 sm:translate-x-0"
            leave-to="translate-y-full sm:translate-y-0 sm:translate-x-full"
          >
            <div class="relative w-screen sm:max-w-md">
              <TransitionChild
                as="template"
                enter="motion-reduce:transition-none ease-in-out duration-500"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="motion-reduce:transition-none ease-in-out duration-500"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="hidden sm:flex absolute top-0 left-0 -ml-8 pt-4 pr-2 sm:-ml-10 sm:pr-4">
                  <button class="rounded-md text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600" @click="$emit('update:open', false)">
                    <span class="sr-only">{{ t('dashboard.library.filters.close') }}</span>
                    <XIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="h-full flex flex-col sm:py-6 bg-white shadow-xl overflow-y-scroll dark:bg-gray-800 rounded-t-2xl sm:rounded-t-none">
                <div class="pt-5 sm:pt-0 pb-4 sm:pb-0 px-4 sm:px-6 border-b sm:border-b-0 border-gray-300 dark:border-gray-700">
                  <DialogTitle class="leading-3 text-lg font-title font-medium text-gray-900 dark:text-gray-100">
                    {{ t('dashboard.library.filters.title') }}
                  </DialogTitle>
                </div>
                <form
                  role="form"
                  aria-label="Filtros"
                  class="h-s-40 sm:h-auto overflow-y-auto sm:overflow-y-visible py-4 sm:py-0 sm:mt-6 space-y-5 relative sm:flex-1 px-4 sm:px-6"
                >
                  <div>
                    <RadioGroup v-model="viewMode">
                      <RadioGroupLabel class="label">
                        {{ t('dashboard.library.filters.viewMode.label' )}}
                      </RadioGroupLabel>

                      <div class="w-full">
                        <RadioGroupOption
                          value="table"
                          v-slot="{ checked }"
                          class="inline-block mr-2 has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ t('dashboard.library.filters.viewMode.table') }}
                          </span>
                        </RadioGroupOption>
                        <RadioGroupOption
                          value="grid"
                          v-slot="{ checked }"
                          class="inline-block has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ t('dashboard.library.filters.viewMode.grid') }}
                          </span>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div v-if="viewMode === 'grid'">
                    <RadioGroup v-model="gridMode">
                      <RadioGroupLabel class="label">
                        {{ t('dashboard.library.filters.gridMode.label') }}
                      </RadioGroupLabel>

                      <div class="w-full">
                        <RadioGroupOption
                          value="compact"
                          v-slot="{ checked }"
                          class="inline-block mr-2 has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ t('dashboard.library.filters.gridMode.compact') }}
                          </span>
                        </RadioGroupOption>
                        <RadioGroupOption
                          value="comfortable"
                          v-slot="{ checked }"
                          class="inline-block has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ t('dashboard.library.filters.gridMode.comfortable') }}
                          </span>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div v-if="groups.length > 0">
                    <RadioGroup v-model="group">
                      <RadioGroupLabel class="label">
                        {{ t('dashboard.library.filters.collection') }}
                      </RadioGroupLabel>

                      <div class="w-full -mt-2">
                        <RadioGroupOption
                          v-for="grp of groups"
                          :key="grp.name"
                          :value="grp.name"
                          v-slot="{ checked }"
                          class="mr-2 mt-2 inline-block has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ grp.name }}
                          </span>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <RadioGroup v-model="sortDirection">
                      <RadioGroupLabel class="label">
                        {{ t('dashboard.library.filters.sortDirection.label') }}
                      </RadioGroupLabel>

                      <div class="w-full">
                        <RadioGroupOption
                          value="asc"
                          v-slot="{ checked }"
                          class="inline-block mr-2 has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ t('dashboard.library.filters.sortDirection.asc') }}
                          </span>
                        </RadioGroupOption>
                        <RadioGroupOption
                          value="desc"
                          v-slot="{ checked }"
                          class="inline-block has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ t('dashboard.library.filters.sortDirection.desc') }}
                          </span>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <RadioGroup v-model="sortProperty">
                      <RadioGroupLabel class="label">
                        {{ t('dashboard.library.filters.sortBy') }}
                      </RadioGroupLabel>

                      <div class="w-full -mt-2">
                        <RadioGroupOption
                          v-for="sortOption of sortProperties"
                          :key="sortOption.attr"
                          :value="sortOption.attr"
                          v-slot="{ checked }"
                          class="mr-2 mt-2 inline-block has-ring-focus rounded"
                        >
                          <span :class="['chip is-square', checked ? 'is-active' : '']">
                            {{ sortOption.title }}
                          </span>
                        </RadioGroupOption>
                      </div>
                    </RadioGroup>
                  </div>
                </form>

                <div class="flex justify-between sm:justify-end w-full py-3 sm:py-0 px-4 sm:px-6 border-t sm:border-t-0 border-gray-300 dark:border-gray-700">
                  <button
                    type="button"
                    class="button is-ghost justify-center sm:hidden -ml-4"
                    @click="$emit('update:open', false)"
                  >
                    {{ t('dashboard.library.filters.closeMobile') }}
                  </button>

                  <button
                    type="button"
                    class="button justify-center text-base hidden sm:flex md:hidden sm:text-sm flex-1"
                    @click="$emit('update:open', false)"
                  >
                    {{ t('dashboard.library.filters.closeMobile') }}
                  </button>
                  <button
                    type="button"
                    class="button is-primary justify-center sm:ml-4 sm:flex-1 md:flex-initial md:w-1/2"
                    @click="handleFilter"
                  >
                    {{ t('dashboard.library.filters.filter') }}
                  </button>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import { XIcon } from '@heroicons/vue/solid'

export default {
  name: 'LibraryFilters',

  components: {
    XIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    RadioGroup,
    RadioGroupLabel,
    RadioGroupOption,
    TransitionChild,
    TransitionRoot
  },

  emits: ['update:open', 'filter'],

  props: {
    open: Boolean
  },

  setup (props, context) {
    const store = useStore()
    const { t, n, locale } = useI18n()

    const gridMode = ref(store.state.collection.gridMode)
    const viewMode = ref(store.state.collection.viewMode)
    const group = ref(store.state.collection.group)
    const sortProperty = ref(store.state.collection.sortBy)
    const sortDirection = ref(store.state.collection.sortDirection)

    const sortProperties = computed(() => {
      const properties = [
        { attr: 'title', title: t('book.properties.title') },
        { attr: 'imprint', title: t('book.properties.imprint') },
        { attr: 'status', title: t('book.properties.status') },
        { attr: 'readAt', title: t('book.properties.readAt') },
        { attr: 'paidPrice.value', title: t('book.properties.paidPrice') },
        { attr: 'labelPrice.value', title: t('book.properties.labelPrice') },
        { attr: 'createdAt', title: t('book.properties.createdAt') },
        { attr: 'updatedAt', title: t('book.properties.updatedAt') }
      ]

      return properties.sort((a, b) => a.title.localeCompare(b.title, locale.value))
    })

    const groups = computed(() => store.state.collection.groups.items)

    const { open } = toRefs(props)

    watch(open, newOpen => {
      if (newOpen) {
        gridMode.value = store.state.collection.gridMode
        viewMode.value = store.state.collection.viewMode
        group.value = store.state.collection.group
        sortProperty.value = store.state.collection.sortBy
        sortDirection.value = store.state.collection.sortDirection
      }
    })

    function handleFilter () {
      context.emit('update:open', false)
      context.emit('filter', {
        viewMode: viewMode.value,
        gridMode: gridMode.value,
        group: group.value,
        sortProperty: sortProperty.value,
        sortDirection: sortDirection.value
      })
    }

    return {
      gridMode,
      group,
      groups,
      sortProperty,
      sortDirection,
      sortProperties,
      viewMode,
      handleFilter,
      t,
      n
    }
  }
}
</script>

<style>

</style>
