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
        :class="[
          'absolute inset-y-0 left-0 flex items-center',
          prefixClass
        ]"
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
        @input="$emit('update:modelValue', $event.target.value)"
      >
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
          <SelectorIcon class="w-5 h-5" />
        </div>
      </template>
      <div
        v-if="$slots.suffix"
        :class="[
          'absolute inset-y-0 right-0 flex items-center',
          suffixClass
        ]"
      >
        <slot name="suffix" />
      </div>
    </div>
  </BaseField>
</template>

<script>
import { computed, toRefs } from 'vue'

import { SelectorIcon } from '@heroicons/vue/solid'

import BaseField from './BaseField.vue'

export default {
  components: { BaseField, SelectorIcon },

  props: {
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
    modelValue: {
      type: String,
      required: true
    },
    multiline: Boolean,
    placeholder: String,
    prefixClass: String,
    required: Boolean,
    suffixClass: String
  },

  emits: ['update:modelValue'],

  setup (props) {
    const { error, help, list } = toRefs(props)

    const hasError = computed(() => error.value && error.value.length > 0)
    const hasHelp = computed(() => help.value && help.value.length > 0)
    const hasList = computed(() => list.value && list.value.length > 0)

    return {
      hasError,
      hasHelp,
      hasList
    }
  }
}
</script>

<style lang="postcss" scoped>
.selector-icon {
  @apply absolute inset-y-0 right-2 pl-3 text-gray-500
    flex items-center pointer-events-none;
}

.field-wrapper:focus-within .selector-icon {
  @apply dark:text-gray-300;
}
</style>
