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
          <DialogOverlay class="absolute inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity backdrop-filter backdrop-blur-sm" />
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
              <form
                class="h-full flex flex-col sm:py-4 bg-white shadow-xl overflow-y-scroll dark:bg-gray-800 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl"
                @submit.prevent="handleFilter"
              >
                <div class="flex justify-between items-center pt-4 sm:pt-0 px-4 sm:px-6">
                  <DialogTitle class="text-lg font-display font-medium text-gray-900 dark:text-gray-100">
                    {{ t('dashboard.library.filters.title') }}
                  </DialogTitle>

                  <button
                    class="hidden md:flex items-center justify-center -mr-2 w-10 h-10 p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 motion-safe:transition-shadow"
                    @click="$emit('update:open', false)"
                  >
                    <span class="sr-only">{{ t('dashboard.library.filters.close') }}</span>
                    <XIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="h-s-40 sm:h-auto overflow-y-auto sm:overflow-y-visible mt-4 relative sm:flex-1 border-t border-gray-300 dark:border-gray-600">
                  <div class="divide-y divide-gray-200 dark:divide-gray-600 border-b border-gray-200 dark:border-gray-600">
                    <Disclosure
                      as="div"
                      class="py-4"
                      v-slot="{ open }"
                      default-open
                    >
                      <DisclosureButton class="w-full flex justify-between items-center font-medium px-4 sm:px-6 rounded has-ring-focus dark:text-gray-200">
                        <span>
                          {{ t('dashboard.library.filters.books') }}
                        </span>
                        <span aria-hidden="true">
                          <ChevronUpIcon
                            :class="open ? 'transform rotate-180' : ''"
                            class="w-5 h-5 text-gray-500"
                          />
                        </span>
                      </DisclosureButton>
                      <DisclosurePanel class="space-y-6 pt-4 px-4 sm:px-6">
                        <RadioGroup
                          v-if="groups.length > 0"
                          v-model="group"
                          as="div"
                        >
                          <RadioGroupLabel class="label">
                            {{ t('dashboard.library.filters.group') }}
                          </RadioGroupLabel>

                          <div class="w-full -mt-2">
                            <RadioGroupOption
                              v-for="grp of groups"
                              :key="grp.name"
                              :value="grp.name"
                              v-slot="{ checked }"
                              class="mr-2 mt-2 inline-block has-ring-focus rounded"
                            >
                              <span
                                :class="[
                                  'chip is-square',
                                  checked ? 'is-active' : ''
                                ]"
                                @click="resetGroup(checked)"
                              >
                                {{ grp.name }}
                              </span>
                            </RadioGroupOption>
                          </div>
                        </RadioGroup>

                        <RadioGroup v-model="futureItems" as="div">
                          <RadioGroupLabel class="label">
                            {{ t('dashboard.library.filters.futureItems.label') }}
                          </RadioGroupLabel>

                          <div class="w-full">
                            <RadioGroupOption
                              v-for="option of ['indiferent', 'only', 'hide']"
                              :key="option"
                              :value="option"
                              v-slot="{ checked }"
                              class="inline-block mr-2 has-ring-focus rounded"
                            >
                              <span :class="['chip is-square', checked ? 'is-active' : '']">
                                {{ t(`dashboard.library.filters.futureItems.${option}`) }}
                              </span>
                            </RadioGroupOption>
                          </div>
                        </RadioGroup>

                        <RadioGroup v-model="sortDirection" as="div">
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

                        <RadioGroup v-model="sortProperty" as="div">
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
                      </DisclosurePanel>
                    </Disclosure>

                    <Disclosure
                      as="div"
                      class="py-4"
                      v-slot="{ open }"
                    >
                      <DisclosureButton class="w-full flex justify-between items-center font-medium px-4 sm:px-6 rounded has-ring-focus dark:text-gray-200">
                        <span>
                          {{ t('dashboard.library.filters.visualization') }}
                        </span>
                        <span aria-hidden="true">
                          <ChevronUpIcon
                            :class="open ? 'transform rotate-180' : ''"
                            class="w-5 h-5 text-gray-500"
                          />
                        </span>
                      </DisclosureButton>
                      <DisclosurePanel class="space-y-6 pt-4 px-4 sm:px-6">
                        <RadioGroup v-model="viewMode" as="div">
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

                        <RadioGroup
                          v-if="viewMode === 'grid'"
                          v-model="gridMode"
                          as="div"
                        >
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
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                </div>

                <div class="flex justify-between sm:justify-end w-full pb-4 sm:pb-0 pt-4 px-4 sm:px-6 border-t border-gray-300 dark:border-gray-600">
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
                    type="submit"
                    class="button is-primary justify-center sm:ml-4 sm:flex-1 md:flex-initial"
                  >
                    {{ t('dashboard.library.filters.filter') }}
                  </button>
                </div>
              </form>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, inject, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import { ChevronUpIcon, XIcon } from '@heroicons/vue/solid'

export default {
  name: 'LibraryFilters',

  components: {
    ChevronUpIcon,
    XIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
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
    const futureItems = ref(store.state.collection.futureItems)

    const sortProperties = computed(() => {
      const properties = [
        { attr: 'title', title: t('book.properties.title') },
        { attr: 'publisher', title: t('book.properties.publisher') },
        { attr: 'status', title: t('book.properties.status') },
        { attr: 'boughtAt', title: t('book.properties.boughtAt') },
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

    const disableSearchShortcut = inject('disableSearchShortcut')
    const enableSearchShortcut = inject('enableSearchShortcut')

    watch(open, newOpen => {
      if (newOpen) {
        gridMode.value = store.state.collection.gridMode
        viewMode.value = store.state.collection.viewMode
        group.value = store.state.collection.group
        sortProperty.value = store.state.collection.sortBy
        sortDirection.value = store.state.collection.sortDirection
        futureItems.value = store.state.collection.futureItems
      }

      newOpen ? disableSearchShortcut() : enableSearchShortcut()
    })

    function handleFilter () {
      context.emit('update:open', false)
      context.emit('filter', {
        viewMode: viewMode.value,
        gridMode: gridMode.value,
        group: group.value,
        sortProperty: sortProperty.value,
        sortDirection: sortDirection.value,
        futureItems: futureItems.value
      })
    }

    function resetGroup (checked) {
      if (checked) {
        setTimeout(() => { group.value = null })
      }
    }

    return {
      gridMode,
      group,
      groups,
      sortProperty,
      sortDirection,
      futureItems,
      sortProperties,
      viewMode,
      handleFilter,
      resetGroup,
      t,
      n
    }
  }
}
</script>

<style>

</style>
