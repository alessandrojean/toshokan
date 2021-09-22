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
            ? 'border-primary-600 dark:border-primary-500'
            : 'dark:bg-gray-700 border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
          'cursor-pointer group rounded-md border flex flex-col md:flex-row items-start md:items-center text-sm px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 motion-safe:transition-shadow'
        ]"
      >
        <div
          aria-hidden="true"
          :class="[
            checked
              ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500'
              : 'bg-white border-gray-300',
            'w-4 h-4 -ml-2 mr-4 border rounded-xl flex items-center justify-center'
          ]"
        >
          <span class="inline-block w-1.5 h-1.5 bg-white rounded-xl"></span>
        </div>
        <div class="inline-flex flex-col text-left flex-grow">
          <RadioGroupLabel as="span" class="block font-medium truncate dark:text-gray-200">
            {{ book.title }}
          </RadioGroupLabel>
          <RadioGroupDescription
            as="span"
            v-if="book.authors && book.authors.length > 0"
            class="block text-gray-500 dark:text-gray-300 truncate"
          >
            {{ formatAuthors(book.authors) }}
          </RadioGroupDescription>
        </div>
        <div class="flex-shrink-0 mt-1 md:mt-0 inline-flex md:flex-col items-end space-x-2 md:space-x-0 md:space-y-0.5">
          <span class="text-xs bg-primary-100 dark:bg-transparent text-primary-600 dark:text-gray-200 dark:group-hover:text-gray-100 font-semibold px-2 py-0.5 dark:p-0 rounded text uppercase tracking-wide">
            {{ book.provider }}
          </span>
          <span
            v-if="book.publisher && book.publisher.length > 0"
            class="block text-gray-500 dark:text-gray-300"
          >
            {{ book.publisher }}
          </span>
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
