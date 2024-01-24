import type { Meta, StoryObj } from '@storybook/vue3'
import BaseField from './BaseField.vue'

export default {
  title: 'Components/Form/Field/Base',
  component: BaseField,
  args: {
    error: '',
    help: 'The help text',
    label: 'Label',
    required: false,
  },
  argTypes: {
    error: {
      control: { type: null },
    },
    default: {
      control: { type: null },
    },
  },
  decorators: [() => ({ template: '<div class="p-6 md:w-3/5"><story/></div>' })],
} as Meta<typeof BaseField>

const fakeInputComponent = `
  <div class="select-none w-full h-10 bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-medium text-sm text-gray-400 border border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
    The input component
  </div>
`

export const Default: StoryObj<typeof BaseField> = {
  render: args => ({
    components: { BaseField },
    setup: () => ({ args }),
    template: `
      <BaseField v-bind="args" v-on="args">
        ${fakeInputComponent}
      </BaseField>
    `,
  }),
}

export const Required: StoryObj<typeof BaseField> = {
  render: args => ({
    components: { BaseField },
    setup: () => ({ args }),
    template: `
      <BaseField v-bind="args" v-on="args">
        ${fakeInputComponent}
      </BaseField>
    `,
  }),
  args: { required: true },
}

export const InputOnly: StoryObj<typeof BaseField> = {
  render: args => ({
    components: { BaseField },
    setup: () => ({ args }),
    template: `
      <BaseField v-bind="args" v-on="args">
        ${fakeInputComponent}
      </BaseField>
    `,
  }),
  args: { required: true, label: '', help: '' },
}
