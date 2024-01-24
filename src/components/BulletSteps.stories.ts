import type { Meta, StoryObj } from '@storybook/vue3'
import BulletSteps from './BulletSteps.vue'

export default {
  title: 'Components/Common/BulletSteps',
  component: BulletSteps,
  argTypes: {
    modelValue: {
      control: {
        type: 'range',
        min: 1,
        max: 4,
      },
    },
    steps: {
      control: { type: null },
    },
  },
  decorators: [
    () => ({
      template: '<div class="max-w-2xl p-6"><story/></div>',
    }),
  ],
} as Meta<typeof BulletSteps>

export const Normal: StoryObj<typeof BulletSteps> = {
  render: args => ({
    components: { BulletSteps },
    setup: () => ({ args }),
    template: '<BulletSteps v-bind="args" />',
  }),
  args: {
    modelValue: 1,
    steps: ['Step one', 'Step two', 'Step three', 'Step four'],
  },
}
