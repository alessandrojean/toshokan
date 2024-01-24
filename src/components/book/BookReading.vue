<script lang="ts" setup>
import cloneDeep from 'lodash.clonedeep'

import type Book from '@/model/Book'
import { STATUS_READ, STATUS_UNREAD } from '@/model/Book'

const props = defineProps<{ modelValue: Book }>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: Book): void
}>()

const { t } = useI18n({ useScope: 'global' })

const { modelValue: book } = toRefs(props)

// Don't remove the timezone offset because it's already removed
// when saving in the spreadsheet by the Book.toArray() method.
const today = new Date()

function isToday(date: Date) {
  return (
    today.getUTCFullYear() === date.getUTCFullYear()
    && today.getUTCMonth() === date.getUTCMonth()
    && today.getUTCDate() === date.getUTCDate()
  )
}

const state = ref(book.value.isRead ? 'read-other' : 'unread')
const newReadDate = ref('')

if (book.value.readAt) {
  const { readAt } = book.value

  state.value = `read-${isToday(readAt) ? 'today' : 'other'}`
  newReadDate.value = readAt.toISOString().substring(0, 10)
}

watch(book, (newBook) => {
  newReadDate.value = today.toISOString().substring(0, 10)

  if (newBook.readAt) {
    const { readAt } = newBook

    state.value = `read-${isToday(readAt) ? 'today' : 'other'}`
    newReadDate.value = readAt.toISOString().substring(0, 10)
  }
})

watch(state, (newState) => {
  const bookCopy = cloneDeep(toRaw(book.value))

  if (newState === 'unread') {
    bookCopy.status = STATUS_UNREAD
    bookCopy.readAt = null
  } else if (newState.includes('read')) {
    bookCopy.status = STATUS_READ
    bookCopy.readAt = today
  }

  emit('update:modelValue', bookCopy)
})

watch(newReadDate, (newValue) => {
  const bookCopy = cloneDeep(toRaw(book.value))
  bookCopy.readAt = newValue.length === 10 ? new Date(newValue) : null
  bookCopy.readAt?.setMinutes(
    bookCopy.readAt.getMinutes() + bookCopy.readAt.getTimezoneOffset(),
  )

  emit('update:modelValue', bookCopy)
})
</script>

<template>
  <div class="space-y-8">
    <Alert type="info" show>
      {{ t('dashboard.details.readingForm.description') }}
    </Alert>
    <div class="flex flex-col space-y-2.5 px-4">
      <div class="flex items-center space-x-2.5">
        <input
          id="unread"
          v-model="state"
          type="radio"
          name="reading"
          class="radio"
          value="unread"
        >
        <label for="unread" class="label mb-0">
          {{ t('dashboard.details.readingForm.options.notReadYet') }}
        </label>
      </div>
      <div class="flex items-center space-x-2.5">
        <input
          id="read-today"
          v-model="state"
          type="radio"
          name="reading"
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
          id="read-other"
          v-model="state"
          type="radio"
          name="reading"
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
            input-class="tabular-nums"
            :help="t('dashboard.details.readingForm.fieldHelp')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
