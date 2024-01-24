import type { Meta, StoryObj } from '@storybook/vue3'
import BetaWarning from './BetaWarning.vue'

export default {
  title: 'Components/Dashboard/BetaWarning',
  component: BetaWarning,
  decorators: [
    () => ({
      template: '<div class="max-w-2xl p-6"><story/></div>',
    }),
  ],
} as Meta<typeof BetaWarning>

export const Normal: StoryObj<typeof BetaWarning> = {
  render: () => ({
    components: { BetaWarning },
    template: '<BetaWarning />',
  }),
}
