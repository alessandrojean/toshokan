import StatisticsRanking from './StatisticsRanking.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Statistics/Ranking',
  component: StatisticsRanking,
  args: {
    loading: false,
    ranking: [...Array.from({ length: 10 }).keys()].map((i) => ({
      name: `Item ${i + 1}`,
      count: (10 - i) * 120
    })),
    title: 'Ranking block'
  },
  argTypes: {
    ranking: {
      control: { type: null }
    }
  },
  decorators: [
    () => ({
      template: '<div class="md:p-6 md:w-2/5"><story/></div>'
    })
  ]
} as Meta<typeof StatisticsRanking>

export const Default: StoryObj<typeof StatisticsRanking> = {
  render: (args) => ({
    components: { StatisticsRanking },
    setup: () => ({ args }),
    template: '<StatisticsRanking v-bind="args">'
  })
}

export const Loading: StoryObj<typeof StatisticsRanking> = {
  render: (args) => ({
    components: { StatisticsRanking },
    setup: () => ({ args }),
    template: '<StatisticsRanking v-bind="args">'
  }),
  args: { loading: true }
}
