<script lang="ts" setup>
import type { Ref } from 'vue'

import { nanoid } from 'nanoid'

export interface BaseFieldProps {
  error?: string | Ref<string>
  help?: string
  label?: string
  required?: boolean
}

const props = withDefaults(defineProps<BaseFieldProps>(), {
  required: false,
})

const inputId = ref(nanoid())

const { error, help } = toRefs(props)

const hasError = computed(() => {
  return error?.value ? (unref(error.value)?.length ?? 0) > 0 : false
})
const hasHelp = computed(() => help?.value && help.value.length > 0)

const ariaDescribedBy = computed(() => {
  const helps = [`${inputId.value}-error`]

  if (hasHelp.value) {
    helps.push(`${inputId.value}-help`)
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
    <p :id="`${inputId}-error`" class="sr-only" aria-hidden="true">
      {{ hasError ? error : '' }}
    </p>
    <p
      v-if="hasHelp"
      :id="`${inputId}-help`"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400"
      aria-hidden="true"
    >
      {{ help }}
    </p>
  </div>
</template>
