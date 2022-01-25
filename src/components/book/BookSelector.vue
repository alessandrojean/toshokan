<template>
  <RadioGroup
    class="flex flex-col space-y-2"
    v-if="options"
    :modelValue="selected"
    @update:modelValue="setSelected"
  >
    <RadioGroupOption
      as="template"
      v-for="book in options"
      :key="book.code"
      :value="book"
      v-slot="{ checked }"
    >
      <div
        :class="[
          checked
            ? 'border-primary-600 dark:border-primary-400 shadow bg-primary-50 dark:bg-transparent'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700',
          'cursor-pointer group rounded-md border flex items-start text-sm px-4 py-4 has-input-focus'
        ]"
      >
        <div
          aria-hidden="true"
          :class="[
            checked
              ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500'
              : 'bg-white dark:bg-gray-900 dark:group-hover:bg-gray-850 border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500',
            'shrink-0 w-4 h-4 mr-4 mt-0.5 border rounded-xl flex items-center justify-center'
          ]"
        >
          <span
            :class="[
              checked ? 'bg-white' : 'bg-white dark:bg-gray-850 dark:group-hover:bg-gray-850',
              'inline-block w-1.5 h-1.5 rounded-xl'
            ]"
          />
        </div>
        <div class="inline-flex flex-col text-left flex-grow space-y-2 min-w-0">
          <div class="w-full">
            <RadioGroupLabel
              as="span"
              :class="checked ? 'text-primary-800' : ''"
              class="block w-full truncate font-medium font-display dark:text-gray-100"
            >
              {{ book.title }}
            </RadioGroupLabel>
            <RadioGroupDescription
              as="span"
              v-if="book.authors && book.authors.length > 0"
              :class="checked ? 'text-primary-700' : 'text-gray-600'"
              class="block w-full truncate dark:text-gray-300 font-medium"
            >
              {{ formatAuthors(book.authors) }}
            </RadioGroupDescription>
          </div>
          <div class="flex items-center space-x-3 text-xs">
            <span
              :class="[
                !checked
                  ? 'group-hover:text-gray-600 dark:group-hover:text-gray-100 group-hover:border-gray-300 dark:group-hover:border-gray-500 text-gray-500 border-gray-200'
                  : 'text-primary-600 border-primary-300',
                'text-xxs font-semibold bg-white dark:bg-transparent dark:text-gray-200 px-2 py-0.5 rounded text uppercase tracking-wide border dark:border-gray-600'
              ]"
            >
              {{ book.provider }}
            </span>
            <span
              v-if="book.publisher && book.publisher.length > 0"
              :class="[
                !checked
                  ? 'group-hover:text-gray-600 dark:group-hover:text-gray-300 text-gray-500'
                  : 'text-primary-600',
                'block dark:text-gray-400'
              ]"
            >
              {{ book.publisher }}
            </span>
          </div>
        </div>
      </div>
    </RadioGroupOption>
  </RadioGroup>
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption
} from '@headlessui/vue'

export default {
  components: {
    RadioGroup,
    RadioGroupDescription,
    RadioGroupLabel,
    RadioGroupOption
  },

  props: {
    options: Array
  },

  emits: ['select'],

  setup (_, context) {
    const { t } = useI18n()

    const separator = computed(() => {
      return t('dashboard.details.header.authorSeparator')
    })

    function formatAuthors (authors) {
      let formattedAuthors = (authors || []).join(separator)

      if (authors && authors.length >= 2) {
        const firstAuthors = (authors || [])
          .slice(0, -1)
          .join(separator.value)

        formattedAuthors = t(
          'dashboard.details.header.authorListComplete',
          {
            authors: firstAuthors,
            lastAuthor: authors[authors.length - 1]
          }
        )
      }

      return formattedAuthors
    }

    const selected = ref(null)

    function setSelected (newValue) {
      selected.value = newValue
      context.emit('select', newValue)
    }

    return {
      formatAuthors,
      selected,
      setSelected,
      t
    }
  }
}
</script>
