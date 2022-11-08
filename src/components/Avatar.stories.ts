import Avatar from './Avatar.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Common/Avatar',
  component: Avatar,
  decorators: [
    () => ({
      template: '<div class="max-w-2xl p-6"><story/></div>'
    })
  ]
} as Meta<typeof Avatar>

export const Normal: StoryObj<typeof Avatar> = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: '<Avatar v-bind="args" />'
  }),
  args: {
    pictureUrl: 'https://github.com/alessandrojean.png',
    dark: false,
    shared: false,
    small: false
  }
}

export const Small: StoryObj<typeof Avatar> = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: '<Avatar v-bind="args" />'
  }),
  args: {
    pictureUrl: 'https://github.com/alessandrojean.png',
    dark: false,
    shared: false,
    small: true
  }
}

export const Shared: StoryObj<typeof Avatar> = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: '<Avatar v-bind="args" />'
  }),
  args: {
    pictureUrl: 'https://github.com/alessandrojean.png',
    dark: false,
    shared: true,
    small: false
  }
}

export const Empty: StoryObj<typeof Avatar> = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: '<Avatar v-bind="args" />'
  }),
  args: {
    pictureUrl: '',
    dark: false,
    shared: false,
    small: false
  }
}
