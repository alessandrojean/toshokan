<script lang="ts" setup>
import slugify from 'slugify'
import { ArrowUpIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { useI18n } from '@/i18n'
import type { GroupData } from '@/queries/useGroupsQuery'
import { DisableSearchShortcutKey, EnableSearchShortcutKey } from '@/symbols'
import type { Sort } from '@/types'
import { TriState } from '@/types'
import { injectStrict } from '@/util'

export interface FilterState {
  favorites: TriState
  futureItems: TriState
  groups: string[]
  sortDirection: Sort
  sortProperty: string
}

export interface LibraryFiltersDialogProps {
  favorites: TriState
  futureItems: TriState
  groups: string[]
  sortDirection: Sort
  sortProperty: string
  open: boolean
}

const props = defineProps<LibraryFiltersDialogProps>()

const emit = defineEmits<{
  (e: 'update:open', open: boolean): void
  (e: 'filter', filter: FilterState): void
}>()

const {
  favorites,
  futureItems,
  groups: groupsProps,
  sortDirection,
  sortProperty,
  open,
} = toRefs(props)

const { t, locale } = useI18n({ useScope: 'global' })

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
    { attr: 'updatedAt', title: t('book.properties.updatedAt') },
  ]

  return properties.sort((a, b) => a.title.localeCompare(b.title, locale.value))
})

const sheetStore = useSheetStore()
const groupsEnabled = computed(() => sheetStore.sheetId !== null)

const { data: groupsData } = useGroupsQuery({ enabled: groupsEnabled })

const state = reactive<FilterState>({
  favorites: favorites.value,
  futureItems: futureItems.value,
  sortDirection: sortDirection.value,
  sortProperty: sortProperty.value,
  groups: groupsProps.value,
})

const groups = computed<GroupData[]>(() => {
  const values = groupsData.value?.slice() || []

  if (state.futureItems === TriState.HIDE) {
    return values
  }

  return state.futureItems === TriState.ONLY
    ? values.sort((a, b) => b.futureCount - a.futureCount)
    : values.sort((a, b) => b.totalCount - a.totalCount)
})

const disableSearchShortcut = injectStrict(DisableSearchShortcutKey)
const enableSearchShortcut = injectStrict(EnableSearchShortcutKey)

watch(open, (newOpen) => {
  if (newOpen) {
    Object.assign(state, {
      favorites: favorites.value,
      futureItems: futureItems.value,
      sortDirection: sortDirection.value,
      sortProperty: sortProperty.value,
      groups: groupsProps.value,
    })
  }

  newOpen ? disableSearchShortcut() : enableSearchShortcut()
})

function handleFilter() {
  emit('update:open', false)
  emit('filter', unref(state))
}

function checked(key: keyof typeof state, value: string) {
  return state[key].includes(value)
}

const countProperty: Record<TriState, keyof GroupData> = {
  [TriState.INDIFERENT]: 'totalCount',
  [TriState.ONLY]: 'futureCount',
  [TriState.HIDE]: 'count',
}

interface FilterGroup {
  title: string
  open: boolean
  children: Filter[]
}

type Filter = {
  key: keyof typeof state
  label: string
  multiple?: boolean
  sort?: boolean
  hidden?: boolean
  options: {
    key: string
    value: string
    label: string
    count?: number
  }[]
} & {
  multiple: true
  key: 'groups'
}

const filters = computed(
  () =>
    [
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
              count: grp[countProperty[state.futureItems]],
            })),
          },
          {
            key: 'favorites',
            label: t('dashboard.library.filters.favorites.label'),
            options: [
              {
                key: TriState.INDIFERENT,
                value: TriState.INDIFERENT,
                label: t('dashboard.library.filters.favorites.indiferent'),
              },
              {
                key: TriState.ONLY,
                value: TriState.ONLY,
                label: t('dashboard.library.filters.favorites.only'),
              },
              {
                key: TriState.HIDE,
                value: TriState.HIDE,
                label: t('dashboard.library.filters.favorites.hide'),
              },
            ],
          },
          {
            key: 'futureItems',
            label: t('dashboard.library.filters.futureItems.label'),
            options: [
              {
                key: TriState.INDIFERENT,
                value: TriState.INDIFERENT,
                label: t('dashboard.library.filters.futureItems.indiferent'),
              },
              {
                key: TriState.ONLY,
                value: TriState.ONLY,
                label: t('dashboard.library.filters.futureItems.only'),
              },
              {
                key: TriState.HIDE,
                value: TriState.HIDE,
                label: t('dashboard.library.filters.futureItems.hide'),
              },
            ],
          },
          {
            key: 'sortProperty',
            label: t('dashboard.library.filters.sortBy'),
            sort: true,
            options: sortProperties.value.map(property => ({
              key: property.attr,
              value: property.attr,
              label: property.title,
            })),
          },
        ],
      },
    ] as FilterGroup[],
)

function toggleSort() {
  state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
}
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed inset-0 overflow-hidden z-30"
      :open="open"
      @close="$emit('update:open', false)"
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
          <div class="dialog-overlay" />
        </TransitionChild>
        <div
          class="fixed inset-x-0 sm:inset-x-auto sm:inset-y-0 bottom-0 sm:right-0 sm:pl-10 max-w-full flex"
        >
          <TransitionChild
            as="template"
            enter="motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            enter-from="translate-y-full sm:translate-y-0 sm:translate-x-full"
            enter-to="translate-y-0 sm:translate-x-0"
            leave="motion-reduce:transform-none transition motion-reduce:transition-none ease-in-out duration-500 sm:duration-700"
            leave-from="translate-y-0 sm:translate-x-0"
            leave-to="translate-y-full sm:translate-y-0 sm:translate-x-full"
          >
            <DialogPanel class="relative w-screen sm:max-w-md">
              <form
                class="h-full flex flex-col sm:py-4 bg-white shadow-xl overflow-y-scroll dark:bg-gray-800 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl ring-1 ring-black/5"
                @submit.prevent="handleFilter"
              >
                <div
                  class="flex justify-between items-center pt-4 sm:pt-0 px-4 sm:px-6"
                >
                  <DialogTitle
                    class="text-lg font-display-safe font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ t('dashboard.library.filters.title') }}
                  </DialogTitle>

                  <button
                    class="hidden md:flex items-center justify-center -mr-2 w-10 h-10 p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 motion-safe:transition-shadow"
                    @click="$emit('update:open', false)"
                  >
                    <span class="sr-only">{{
                      t('dashboard.library.filters.close')
                    }}</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div
                  class="h-s-50 sm:h-auto overflow-y-auto sm:overflow-y-visible mt-4 relative sm:flex-1 border-t border-gray-300 dark:border-gray-600"
                >
                  <div
                    class="divide-y divide-gray-200 dark:divide-gray-600 border-b border-gray-200 dark:border-gray-600"
                  >
                    <Disclosure
                      v-for="(section, sectionIdx) in filters"
                      :key="sectionIdx"
                      v-slot="{ open }"
                      as="div"
                      class="py-4"
                      :default-open="section.open"
                    >
                      <DisclosureButton
                        class="w-full flex justify-between items-center font-medium px-4 sm:px-6 rounded has-ring-focus dark:text-gray-200"
                      >
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
                            :key="`${child.key}-fieldset`"
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
                                  :id="slugify(`${child.key}-${option.key}`)"
                                  v-model="state[child.key]"
                                  type="checkbox"
                                  class="sr-only"
                                  :name="`${child.key}-filter`"
                                  :value="option.value"
                                >
                                <label
                                  :for="slugify(`${child.key}-${option.key}`)"
                                  :class="[
                                    'chip is-square',
                                    checked(child.key, option.value)
                                      ? 'is-active'
                                      : '',
                                  ]"
                                >
                                  {{ option.label }}
                                  <span
                                    v-if="option.count !== undefined"
                                    class="count"
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
                            v-else-if="
                              child.options.length > 0 && !child.hidden
                            "
                            :key="`${child.key}-radiogroup`"
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
                                v-slot="{ checked }"
                                :value="option.value"
                                class="mr-2 mt-2 inline-block has-ring-focus rounded"
                              >
                                <span
                                  :class="[
                                    'chip is-square',
                                    checked ? 'is-active' : '',
                                  ]"
                                  @click="checked && child.sort && toggleSort()"
                                >
                                  {{ option.label }}
                                  <span
                                    v-if="child.sort && checked"
                                    aria-hidden="true"
                                    class="ml-1 -mr-1"
                                  >
                                    <ArrowUpIcon
                                      :class="[
                                        'w-4 h-4 motion-safe:transition-transform',
                                        state.sortDirection === 'desc'
                                          ? '-scale-y-100'
                                          : 'scale-y-100',
                                      ]"
                                    />
                                  </span>
                                </span>
                              </RadioGroupOption>
                            </div>
                          </RadioGroup>
                        </template>
                      </DisclosurePanel>
                    </Disclosure>
                  </div>
                </div>

                <div
                  class="flex justify-between sm:justify-end w-full pb-4 sm:pb-0 pt-4 px-4 sm:px-6 border-t border-gray-300 dark:border-gray-600"
                >
                  <Button
                    kind="ghost"
                    size="large"
                    class="justify-center sm:hidden -ml-4"
                    rounded
                    @click="$emit('update:open', false)"
                  >
                    {{ t('dashboard.library.filters.closeMobile') }}
                  </Button>

                  <Button
                    size="large"
                    class="justify-center hidden sm:flex md:hidden flex-1"
                    rounded
                    @click="$emit('update:open', false)"
                  >
                    {{ t('dashboard.library.filters.closeMobile') }}
                  </Button>
                  <Button
                    type="submit"
                    size="large"
                    kind="primary"
                    class="justify-center sm:ml-4 sm:flex-1 md:flex-initial"
                    rounded
                  >
                    {{ t('dashboard.library.filters.apply') }}
                  </Button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
