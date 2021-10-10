<template>
  <div class="space-y-8">
    <p class="text-gray-700 dark:text-gray-400 leading-snug">
      {{ t('dashboard.details.readingForm.description') }}
    </p>
    <div class="flex flex-col space-y-2.5 px-4">
      <div class="flex items-center space-x-2.5">
        <input
          v-model="state"
          type="radio"
          name="reading"
          id="unread"
          class="radio"
          value="unread"
        >
        <label for="unread" class="label mb-0">
          {{ t('dashboard.details.readingForm.options.notReadYet') }}
        </label>
      </div>
      <div class="flex items-center space-x-2.5">
        <input
          v-model="state"
          type="radio"
          name="reading"
          id="read-today"
          class="radio"
          value="read-today"
        >
        <label for="read-today" class="label mb-0">
          {{ t('dashboard.details.readingForm.options.readToday') }}
        </label>
      </div>
      <div
        :class="state === 'read-other' ? 'items-start' : 'items-center'"
        class="flex space-x-2.5"
      >
        <input
          v-model="state"
          type="radio"
          name="reading"
          id="read-other"
          class="radio"
          value="read-other"
        >
        <div>
          <label for="read-other" class="label mb-0">
            {{ t('dashboard.details.readingForm.options.readOtherDate') }}
          </label>
          <TextField
            v-if="state === 'read-other'"
            v-model="newReadDate"
            class="mt-4 w-56"
            input-type="date"
            :help="t('dashboard.details.readingForm.fieldHelp')"
          >
            <template #suffix>
              <button
                @click="clearDate"
                class="p-px mr-1.5 bg-white dark:bg-gray-850 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus-visible:text-gray-700 dark:focus-visible:text-gray-300 rounded has-ring-focus dark:focus-visible:ring-offset-gray-850"
                :title="t('dashboard.details.readingForm.actionClear')"
              >
                <span class="sr-only">
                  {{ t('dashboard.details.readingForm.actionClear') }}
                </span>
                <span aria-hidden="true">
                  <XIcon class="w-5 h-5" />
                </span>
              </button>
            </template>
          </TextField>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { XIcon } from '@heroicons/vue/solid'

import TextField from '@/components/fields/TextField.vue'

import cloneDeep from 'lodash.clonedeep'

import { BookStatus } from '@/model/Book'

export default {
  components: {
    TextField,
    XIcon
  },

  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup (props, context) {
    const { t } = useI18n()

    const { modelValue: book } = toRefs(props)

    const isRead = computed(() => book.value.status === BookStatus.READ)

    // Don't remove the timezone offset because it's already removed
    // when saving in the spreadsheet by the formatBook method.
    const today = new Date()

    function isToday (date) {
      return today.getUTCFullYear() === date.getUTCFullYear() &&
        today.getUTCMonth() === date.getUTCMonth() &&
        today.getUTCDate() === date.getUTCDate()
    }

    const state = ref(isRead.value ? 'read-other' : 'unread')
    const newReadDate = ref('')

    if (book.value.readAt) {
      const { readAt } = book.value

      state.value = 'read-' + (isToday(readAt) ? 'today' : 'other')
      newReadDate.value = readAt.toISOString().substring(0, 10)
    }

    watch(book, newBook => {
      newReadDate.value = today.toISOString().substring(0, 10)

      if (newBook.readAt) {
        const { readAt } = book

        state.value = 'read-' + (isToday(readAt.getTime()) ? 'today' : 'other')
        newReadDate.value = readAt.toISOString().substring(0, 10)
      }
    })

    watch(state, newState => {
      const bookCopy = cloneDeep(book.value)

      if (newState === 'unread') {
        bookCopy.status = BookStatus.UNREAD
        bookCopy.readAt = null
      } else if (newState.includes('read')) {
        bookCopy.status = BookStatus.READ
        bookCopy.readAt = today
      }

      context.emit('update:modelValue', bookCopy)
    })

    watch(newReadDate, newValue => {
      const bookCopy = cloneDeep(book.value)
      bookCopy.readAt = newValue.length === 10 ? new Date(newValue) : null

      if (bookCopy.readAt) {
        bookCopy.readAt.setMinutes(
          bookCopy.readAt.getMinutes() + bookCopy.readAt.getTimezoneOffset()
        )
      }

      context.emit('update:modelValue', bookCopy)
    })

    function clearDate () {
      newReadDate.value = ''
    }

    return {
      t,
      state,
      newReadDate,
      clearDate
    }
  }
}
</script>
