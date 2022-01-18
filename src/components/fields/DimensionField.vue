<template>
  <BaseField
    :label="label"
    :error="error"
    :required="required"
    :help="help"
    class="w-full"
    v-slot="{ inputId }"
  >
    <div class="dimension-field" :id="inputId">
      <input
        type="text"
        class="input grow width"
        inputmode="decimal"
        placeholder="0.0"
        v-model="width"
        @keydown.x.prevent="focusHeight()"
      >
      <span class="symbol">×</span>
      <input
        ref="heightInput"
        type="text"
        class="input grow height"
        inputmode="decimal"
        placeholder="0.0"
        v-model="height"
      >
      <span class="symbol cm">cm</span>
    </div>
  </BaseField>
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'

import BaseField from '@/components/fields/BaseField.vue'

export default {
  components: { BaseField },

  props: {
    error: String,
    help: String,
    label: String,
    modelValue: {
      type: String,
      required: true
    },
    required: Boolean
  },

  emits: ['update:modelValue'],

  setup (props, context) {
    const { modelValue } = toRefs(props)

    const dimensions = computed(() => modelValue.value.split(/\s*[Xx×]\s*/))

    const width = ref(dimensions.value[0])
    const height = ref(dimensions.value[1])

    const dimensionsStr = computed(() => `${width.value} × ${height.value}`)

    watch(dimensionsStr, newDimensions => {
      context.emit('update:modelValue', newDimensions)
    })

    const heightInput = ref(null)

    function focusHeight () {
      heightInput.value?.select()
    }

    return { width, height, heightInput, focusHeight }
  }
}
</script>

<style lang="postcss" scoped>
.dimension-field {
  @apply flex w-full
    bg-white dark:bg-gray-850
    border border-gray-300 dark:border-gray-600
    rounded-md shadow-sm
    motion-safe:transition-colors;
}

.dimension-field:hover:not(:focus-within),
.dimension-field:hover:not(:focus-within) .input {
  @apply border-gray-400 dark:border-gray-500 transition-none;
}

.dimension-field .input {
  @apply shadow-none -my-px;
}

.dimension-field .input:focus {
  @apply border-primary-500 dark:border-primary-400;
}

.dimension-field .input.width {
  @apply rounded-r-none -ml-px border-r-transparent;
}

.dimension-field:hover:not(:focus-within) .input.width {
  @apply border-r-transparent;
}

.dimension-field .input.height {
  @apply rounded-none -mr-px border-x-transparent;
}

.dimension-field:hover:not(:focus-within) .input.height {
  @apply border-x-transparent;
}

.dimension-field .input.width:focus,
.dimension-field .input.height:focus {
  @apply border-primary-500 dark:border-primary-400;
}

.dimension-field:focus-within .input:not(:focus):hover {
  @apply border-gray-300 dark:border-gray-600;
}

.symbol {
  @apply shrink-0 inline-flex justify-center items-center
    text-gray-500 dark:text-gray-400 px-2 pb-0.5
    select-none sm:text-sm;
}
</style>
