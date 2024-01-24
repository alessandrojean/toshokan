import type { Meta, StoryObj } from '@storybook/vue3'
import DashboardAsideMenu from './DashboardAsideMenu.vue'

export default {
  title: 'Components/Dashboard/Aside Menu',
  component: DashboardAsideMenu,
  // decorators: [
  //   () => ({
  //     template: '<div class="max-w-2xl -m-6"><story/></div>'
  //   })
  // ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof DashboardAsideMenu>

export const Default: StoryObj<typeof DashboardAsideMenu> = {
  render: args => ({
    components: { DashboardAsideMenu },
    setup: () => ({ args }),
    template: '<DashboardAsideMenu v-bind="args" v-on="args" />',
  }),
}
