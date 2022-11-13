<script lang="ts" setup>
import { toRefs } from 'vue'

export type Kind = 'primary' | 'secondary' | 'default' | 'ghost' | 'danger'
export type Size = 'small' | 'normal' | 'large'

export interface ButtonProps {
  as?: keyof HTMLElementTagNameMap | string
  disabled?: boolean
  iconOnly?: boolean
  kind?: Kind
  link?: boolean
  rounded?: boolean
  size?: Size
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  disabled: false,
  iconOnly: false,
  kind: 'default',
  link: false,
  rounded: false,
  size: 'normal',
  type: 'button'
})

const {
  kind,
  rounded,
  disabled,
  type,
  size,
  iconOnly,
  as: component
} = toRefs(props)
</script>

<template>
  <button
    v-if="component === 'button'"
    :class="[
      `btn btn-${size} btn-${kind} has-ring-focus`,
      {
        'btn-rounded': rounded,
        'btn-link': link,
        'btn-icon-only': iconOnly
      }
    ]"
    :disabled="disabled"
    :type="type"
  >
    <span v-if="$slots.left" class="btn-left">
      <slot name="left" iconClass="btn-icon" />
    </span>
    <slot iconClass="btn-icon" />
    <span v-if="$slots.right" class="btn-right">
      <slot name="right" iconClass="btn-icon" />
    </span>
  </button>
  <component
    v-else
    :is="component"
    :class="[
      `btn btn-${size} btn-${kind} has-ring-focus`,
      {
        'btn-rounded': rounded,
        'btn-link': link,
        'btn-icon-only': iconOnly
      }
    ]"
  >
    <span v-if="$slots.left" class="btn-left">
      <slot name="left" iconClass="btn-icon" />
    </span>
    <slot iconClass="btn-icon" />
    <span v-if="$slots.right" class="btn-right">
      <slot name="right" iconClass="btn-icon" />
    </span>
  </component>
</template>

<style lang="postcss">
.btn {
  @apply inline-flex items-center shadow-sm
    font-medium select-none rounded-lg border
    motion-safe:transition-shadow
    focus:outline-none
    disabled:cursor-default disabled:opacity-50;

  &.btn-icon-only {
    @apply justify-center;
  }

  &.btn-default {
    @apply border-gray-300 dark:border-gray-700
      text-gray-700 dark:text-gray-300
      bg-white dark:bg-gray-700
      not-disabled:hover:bg-gray-50 dark:not-disabled:hover:bg-gray-600
      dark:not-disabled:hover:border-gray-600 dark:not-disabled:hover:text-gray-200
      not-disabled:active:bg-gray-100 dark:not-disabled:active:bg-gray-700
      dark:not-disabled:active:border-gray-700;

    & .btn-icon {
      @apply text-gray-500 dark:text-gray-300;
    }

    &:not(:disabled):hover .btn-icon {
      @apply dark:text-gray-200;
    }
  }

  &.btn-ghost {
    @apply shadow-none bg-transparent border-transparent
      text-primary-600 dark:text-primary-400
      not-disabled:hover:bg-gray-700/10 dark:not-disabled:hover:bg-gray-200/10
      not-disabled:hover:text-primary-800 dark:not-disabled:hover:text-gray-200
      not-disabled:active:bg-gray-700/20 dark:not-disabled:active:bg-gray-200/20
      not-disabled:active:text-primary-800 dark:not-disabled:active:text-gray-200;

    & .btn-icon {
      @apply text-primary-500 dark:text-primary-400;
    }

    &:not(:disabled):where(:hover, :active) .btn-icon {
      @apply text-primary-600 dark:text-gray-200;
    }
  }

  &.btn-primary {
    @apply border-primary-600 text-white bg-primary-600
      not-disabled:hover:text-white not-disabled:hover:bg-primary-700
      dark:not-disabled:hover:bg-primary-500
      not-disabled:hover:border-primary-700
      dark:not-disabled:hover:border-primary-500
      not-disabled:active:bg-primary-800
      dark:not-disabled:active:bg-primary-700
      not-disabled:active:border-primary-800
      dark:not-disabled:active:border-primary-700;

    & .btn-icon {
      @apply text-white;
    }

    &:not(:disabled):hover .btn-icon {
      @apply bg-primary-700 dark:bg-primary-500
        border-primary-700 dark:border-primary-500;
    }

    &:not(:disabled):active .btn-icon {
      @apply bg-primary-800 dark:bg-primary-700
        border-primary-800 dark:border-primary-700;
    }
  }

  &.btn-secondary {
    @apply text-primary-600 dark:text-primary-600 border-none bg-white
      dark:bg-white dark:border-0 dark:not-disabled:hover:bg-gray-100
      focus-visible:ring-offset-primary-600 focus-visible:ring-white
      dark:focus-visible:ring-offset-primary-600 dark:focus-visible:ring-white;

    & .btn-icon {
      @apply text-primary-600 dark:text-primary-600;
    }
  }

  &.btn-danger {
    @apply border-red-600 text-white bg-red-600
      not-disabled:hover:bg-red-700 not-disabled:hover:border-red-700
      not-disabled:active:bg-red-800 not-disabled:active:border-red-800;

    & .btn-icon {
      @apply text-white;
    }
  }

  &.btn-small {
    @apply px-2 py-1 text-xs rounded;

    &.btn-icon-only {
      @apply p-1;
    }

    & .btn-icon {
      @apply h-4 w-4;
    }

    .btn-left .btn-icon {
      @apply -ml-0.5 mr-1.5;
    }

    .btn-right .btn-icon {
      @apply ml-1.5 -mr-0.5;
    }
  }

  &.btn-normal {
    @apply px-4 py-2 text-sm;

    &.btn-icon-only {
      @apply px-2;
    }

    & .btn-icon {
      @apply h-5 w-5;
    }

    .btn-left .btn-icon {
      @apply -ml-1 mr-2;
    }

    .btn-right .btn-icon {
      @apply ml-2 -mr-1;
    }
  }

  &.btn-large {
    @apply px-5 py-2.5 text-base;

    &.btn-icon-only {
      @apply px-2.5;
    }

    & .btn-icon {
      @apply h-5 w-5;
    }

    .btn-left .btn-icon {
      @apply -ml-1 mr-2.5;
    }

    .btn-right .btn-icon {
      @apply -mr-1 ml-2.5;
    }
  }

  &.btn-rounded {
    @apply rounded-full;
  }

  &.btn-link {
    @apply not-disabled:hover:underline;
  }
}
</style>
