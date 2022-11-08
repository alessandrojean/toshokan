import BetaWarning from './BetaWarning.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Dashboard/BetaWarning',
  component: BetaWarning,
  decorators: [
    () => ({
      template: '<div class="max-w-2xl p-6"><story/></div>'
    })
  ]
} as Meta<typeof BetaWarning>

export const Normal: StoryObj<typeof BetaWarning> = {
  render: () => ({
    components: { BetaWarning },
    template: '<BetaWarning />'
  })
}
