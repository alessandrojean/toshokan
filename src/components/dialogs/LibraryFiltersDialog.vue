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
          <DialogOverlay class="absolute inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity backdrop-blur-sm" />
        </TransitionChild>
        <div class="fixed inset-x-0 sm:inset-x-auto sm:inset-y-0 bottom-0 sm:right-0 sm:pl-10 max-w-full flex">
          <TransitionChild
            as="template"
            enter="motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            enter-from="translate-y-full sm:translate-y-0 sm:translate-x-full"
            enter-to="translate-y-0 sm:translate-x-0"
            leave="motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
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
                      v-for="(section, sectionIdx) in filters"
                      :key="sectionIdx"
                      as="div"
                      class="py-4"
                      v-slot="{ open }"
                      :default-open="section.open"
                    >
                      <DisclosureButton class="w-full flex justify-between items-center font-medium px-4 sm:px-6 rounded has-ring-focus dark:text-gray-200">
                        <span>
                          {{ section.title }}
                        </span>
                        <span aria-hidden="true">
                          <ChevronUpIcon
                            :class="open ? 'rotate-180' : ''"
                            class="w-5 h-5 text-gray-500 motion-safe:transition-transform duration-300"
                          />
                        </span>
                      </DisclosureButton>

                      <DisclosurePanel class="space-y-6 pt-4 px-4 sm:px-6">
                        <template v-for="child in section.children">
                          <fieldset
                            v-if="child.options.length > 0 && child.multiple"
                            :key="child.key"
                          >
                            <legend class="label">
                              {{ child.label }}
                            </legend>

                            <div class="w-full">
                              <div
                                v-for="option of child.options"
                                :key="option.key"
                                class="mr-2 mt-2 inline-block"
                              >
                                <input
                                  type="checkbox"
                                  class="sr-only"
                                  :name="child.key + '-filter'"
                                  :id="slugify(child.key + '-' + option.key)"
                                  :value="option.value"
                                  v-model="state[child.key]"
                                >
                                <label
                                  :for="slugify(child.key + '-' + option.key)"
                                  :class="[
                                    'chip is-square',
                                    checked(child.key, option.value)
                                      ? 'is-active'
                                      : ''
                                  ]"
                                >
                                  {{ option.label }}
                                  <span
                                    class="count"
                                    v-if="option.count !== undefined"
                                  >
                                    <span class="sr-only">(</span>
                                    <span>{{ option.count }}</span>
                                    <span class="sr-only">)</span>
                                  </span>
                                </label>
                              </div>
                            </div>
                          </fieldset>

                          <RadioGroup
                            v-else-if="child.options.length > 0 && !child.hidden"
                            :key="child.key"
                            v-model="state[child.key]"
                            as="div"
                          >
                            <RadioGroupLabel class="label">
                              {{ child.label }}
                            </RadioGroupLabel>

                            <div class="w-full">
                              <RadioGroupOption
                                v-for="option of child.options"
                                :key="option.key"
                                :value="option.value"
                                v-slot="{ checked }"
                                class="mr-2 mt-2 inline-block has-ring-focus rounded"
                              >
                                <span
                                  :class="[
                                    'chip is-square',
                                    checked ? 'is-active' : ''
                                  ]"
                                >
                                  {{ option.label }}
                                </span>
                              </RadioGroupOption>
                            </div>
                          </RadioGroup>
                        </template>
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
                    {{ t('dashboard.library.filters.apply') }}
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
import { computed, inject, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import slugify from 'slugify'

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

import {
  FUTURE_HIDE,
  FUTURE_INDIFERENT,
  FUTURE_ONLY
} from '@/store/modules/collection'

export default {
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

    const groups = computed(() => {
      const values = store.state.collection.filters.groups.items

      if (state.futureItems === FUTURE_HIDE) {
        return values
      }

      return state.futureItems === FUTURE_ONLY
        ? values.sort((a, b) => b.futureCount - a.futureCount)
        : values.sort((a, b) => b.totalCount - a.totalCount)
    })

    const { open } = toRefs(props)

    const disableSearchShortcut = inject('disableSearchShortcut')
    const enableSearchShortcut = inject('enableSearchShortcut')

    watch(open, newOpen => {
      if (newOpen) {
        Object.assign(state, {
          groups: store.state.collection.filters.groups.selected,
          futureItems: store.state.collection.futureItems,
          sortDirection: store.state.collection.sortDirection,
          sortProperty: store.state.collection.sortBy,
          viewMode: store.state.settings.viewMode,
          gridMode: store.state.settings.gridMode
        })
      }

      newOpen ? disableSearchShortcut() : enableSearchShortcut()
    })

    function handleFilter () {
      context.emit('update:open', false)
      context.emit('filter', state)
    }

    function checked (key, value) {
      return state[key].includes(value)
    }

    const state = reactive({
      groups: store.state.collection.filters.groups.selected,
      futureItems: store.state.collection.futureItems,
      sortDirection: store.state.collection.sortDirection,
      sortProperty: store.state.collection.sortBy,
      viewMode: store.state.settings.viewMode,
      gridMode: store.state.settings.gridMode
    })

    const countProperty = {
      indiferent: 'totalCount',
      only: 'futureCount',
      hide: 'count'
    }

    const filters = computed(() => [
      {
        title: t('dashboard.library.filters.books'),
        open: true,
        children: [
          {
            key: 'groups',
            label: t('dashboard.library.filters.groups'),
            multiple: true,
            options: groups.value.map(grp => ({
              key: grp.name,
              value: grp.name,
              label: grp.name,
              count: grp[countProperty[state.futureItems]]
            }))
          },
          {
            key: 'futureItems',
            label: t('dashboard.library.filters.futureItems.label'),
            options: [
              {
                key: FUTURE_INDIFERENT,
                value: FUTURE_INDIFERENT,
                label: t('dashboard.library.filters.futureItems.indiferent')
              },
              {
                key: FUTURE_ONLY,
                value: FUTURE_ONLY,
                label: t('dashboard.library.filters.futureItems.only')
              },
              {
                key: FUTURE_HIDE,
                value: FUTURE_HIDE,
                label: t('dashboard.library.filters.futureItems.hide')
              }
            ]
          },
          {
            key: 'sortDirection',
            label: t('dashboard.library.filters.sortDirection.label'),
            options: [
              {
                key: 'asc',
                value: 'asc',
                label: t('dashboard.library.filters.sortDirection.asc')
              },
              {
                key: 'desc',
                value: 'desc',
                label: t('dashboard.library.filters.sortDirection.desc')
              }
            ]
          },
          {
            key: 'sortProperty',
            label: t('dashboard.library.filters.sortBy'),
            options: sortProperties.value.map(property => ({
              key: property.attr,
              value: property.attr,
              label: property.title
            }))
          }
        ]
      },
      {
        title: t('dashboard.library.filters.visualization'),
        children: [
          {
            key: 'viewMode',
            label: t('dashboard.library.filters.viewMode.label'),
            options: [
              {
                key: 'table',
                value: 'table',
                label: t('dashboard.library.filters.viewMode.table')
              },
              {
                key: 'grid',
                value: 'grid',
                label: t('dashboard.library.filters.viewMode.grid')
              }
            ]
          },
          {
            key: 'gridMode',
            label: t('dashboard.library.filters.gridMode.label'),
            hidden: state.viewMode === 'table',
            options: [
              {
                key: 'compact',
                value: 'compact',
                label: t('dashboard.library.filters.gridMode.compact')
              },
              {
                key: 'comfortable',
                value: 'comfortable',
                label: t('dashboard.library.filters.gridMode.comfortable')
              }
            ]
          }
        ]
      }
    ])

    return {
      groups,
      sortProperties,
      handleFilter,
      t,
      n,
      slugify,
      checked,
      state,
      filters
    }
  }
}
</script>
