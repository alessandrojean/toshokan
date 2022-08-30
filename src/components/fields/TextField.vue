<script setup>
import { computed, toRefs } from 'vue'

// TODO: Replace with SelectorIcon
import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'

import BaseField from './BaseField.vue'

const props = defineProps({
  error: String,
  help: String,
  inputClass: String,
  inputMode: String,
  inputType: {
    type: String,
    default: 'text'
  },
  label: String,
  list: Array,
  listText: Function,
  listValue: Function,
  max: String,
  modelValue: {
    type: String,
    required: true
  },
  multiline: Boolean,
  placeholder: String,
  prefixClass: String,
  required: Boolean,
  suffixClass: String
})

defineEmits(['update:modelValue'])

const { error, help, list } = toRefs(props)

const hasError = computed(() => error.value && error.value.length > 0)
const hasHelp = computed(() => help.value && help.value.length > 0)
const hasList = computed(() => list.value && list.value.length > 0)
</script>

<template>
  <BaseField
    :label="label"
    :error="error"
    :required="required"
    :help="help"
    v-slot="{ inputId, ariaDescribedBy }"
  >
    <div class="group relative field-wrapper">
      <div
        v-if="$slots.prefix"
        :class="['absolute inset-y-0 left-0 flex items-center', prefixClass]"
      >
        <slot name="prefix" />
      </div>
      <textarea
        v-if="multiline"
        rows="5"
        :id="inputId"
        :class="['input', inputClass]"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="hasError"
        :required="required"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <input
        v-else
        :type="inputType"
        :id="inputId"
        :class="['input', hasList ? 'pr-9' : '', inputClass]"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="hasError"
        :required="required"
        :list="hasList ? inputId + '-list' : undefined"
        :inputmode="inputMode"
        :max="max"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <template v-if="hasList">
        <datalist :id="inputId + '-list'">
          <option
            v-for="option of list"
            :key="listValue ? listValue(option) : option"
            :value="listValue ? listValue(option) : option"
          >
            {{ listText ? listText(option) : option }}
          </option>
        </datalist>
        <div class="selector-icon" aria-hidden="true">
          <EllipsisHorizontalIcon class="w-5 h-5" />
        </div>
      </template>
      <div
        v-if="$slots.suffix"
        :class="['absolute inset-y-0 right-0 flex items-center', suffixClass]"
      >
        <slot name="suffix" />
      </div>
    </div>
  </BaseField>
</template>

<style lang="postcss" scoped>
.selector-icon {
  @apply absolute inset-y-0 right-2 pl-3 text-gray-500
    flex items-center pointer-events-none;
}

.field-wrapper:focus-within .selector-icon {
  @apply dark:text-gray-300;
}

.monetary-field:hover:not(:focus-within) .input,
.monetary-field:hover:not(:focus-within) .select {
  @apply border-gray-400 dark:border-gray-500 transition-none;
}
</style>
