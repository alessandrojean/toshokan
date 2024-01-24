import type { Meta, StoryObj } from '@storybook/vue3'
import TextField from './TextField.vue'

export default {
  title: 'Components/Form/Field/Text',
  component: TextField,
  args: {
    error: '',
    help: 'The help text',
    label: 'Text field',
    placeholder: 'The placeholder',
    required: false,
    modelValue: 'The value',
    multiline: false,
    max: undefined,
  },
  argTypes: {
    'error': {
      control: { type: null },
    },
    'modelValue': {
      control: { type: null },
    },
    'inputClass': {
      control: { type: null },
    },
    'inputMode': {
      control: { type: null },
    },
    'inputType': {
      control: { type: null },
    },
    'list': {
      control: { type: null },
    },
    'listText': {
      control: { type: null },
    },
    'listValue': {
      control: { type: null },
    },
    'max': {
      control: 'number',
    },
    'prefixClass': {
      control: { type: null },
    },
    'suffixClass': {
      control: { type: null },
    },
    'prefix': {
      control: { type: null },
    },
    'suffix': {
      control: { type: null },
    },
    'update:modelValue': {
      action: 'onUpdate:modelValue',
      control: { type: null },
    },
  },
  decorators: [() => ({ template: '<div class="p-6 md:w-3/5"><story/></div>' })],
} as Meta<typeof TextField>

export const Default: StoryObj<typeof TextField> = {
  render: args => ({
    components: { TextField },
    setup: () => ({ args }),
    template: '<TextField v-bind="args" v-on="args" />',
  }),
}

export const Empty: StoryObj<typeof TextField> = {
  render: args => ({
    components: { TextField },
    setup: () => ({ args }),
    template: '<TextField v-bind="args" v-on="args" />',
  }),
  args: { modelValue: '' },
}

export const Multiline: StoryObj<typeof TextField> = {
  render: args => ({
    components: { TextField },
    setup: () => ({ args }),
    template: '<TextField v-bind="args" v-on="args" />',
  }),
  args: { multiline: true },
}

export const List: StoryObj<typeof TextField> = {
  render: args => ({
    components: { TextField },
    setup: () => ({ args }),
    template: '<TextField v-bind="args" v-on="args" />',
  }),
  args: { list: ['suggestion one', 'suggestion two'] },
}

export const Prefix: StoryObj<typeof TextField> = {
  render: args => ({
    components: { TextField },
    setup: () => ({ args }),
    template: `
      <TextField v-bind="args" v-on="args">
        <template #prefix>
          <span class="pointer-events-none text-sm text-gray-500 dark:text-gray-400 pl-3 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-300">
            USER_DOMAIN/
          </span>
        </template>
      </TextField>
    `,
  }),
  args: {
    inputClass: 'pl-32',
    modelValue: 'your.username',
    prefixClass: 'pointer-events-none',
  },
}

export const Suffix: StoryObj<typeof TextField> = {
  render: args => ({
    components: { TextField },
    setup: () => ({ args }),
    template: `
      <TextField v-bind="args" v-on="args">
        <template #suffix>
          <span class="pointer-events-none text-sm text-gray-500 dark:text-gray-400 pr-3 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-300">
            @yourdomain.com
          </span>
        </template>
      </TextField>
    `,
  }),
  args: {
    inputClass: 'pr-36',
    modelValue: 'your.new.email',
    suffixClass: 'pointer-events-none',
  },
}
