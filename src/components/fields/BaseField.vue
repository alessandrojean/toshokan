<script setup>
import { computed, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { nanoid } from 'nanoid'

const props = defineProps({
  error: String,
  help: String,
  label: String,
  required: Boolean
})

const inputId = ref(nanoid())

const { error, help } = toRefs(props)

const hasError = computed(() => error.value && error.value.length > 0)
const hasHelp = computed(() => help.value && help.value.length > 0)

const ariaDescribedBy = computed(() => {
  const helps = [inputId.value + '-error']

  if (hasHelp.value) {
    helps.push(inputId.value + '-help')
  }

  return helps.join(' ')
})

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div>
    <label
      v-if="label && label.length > 0"
      :class="['label', !required ? 'flex justify-between items-baseline' : '']"
      :for="inputId"
    >
      {{ label }}
      <span
        v-if="!required"
        class="font-normal text-gray-500 dark:text-gray-400 text-xs"
      >
        {{ t('book.form.optional') }}
      </span>
    </label>
    <slot :input-id="inputId" :aria-described-by="ariaDescribedBy" />
    <p class="sr-only" aria-hidden="true" :id="inputId + '-error'">
      {{ hasError ? error : '' }}
    </p>
    <p
      v-if="hasHelp"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      :id="inputId + '-help'"
    >
      {{ help }}
    </p>
  </div>
</template>
