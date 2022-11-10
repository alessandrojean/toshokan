import BookMarkdown from './BookMarkdown.vue'

import { Meta, StoryObj } from '@storybook/vue3'

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
posuere est sed faucibus mattis. Sed erat dolor, pellentesque a
enim ut, sollicitudin rutrum tellus. Pellentesque habitant morbi
tristique senectus et [netus](https://google.com) et
malesuada fames ac turpis egestas. _Fusce_ maximus diam
**nulla**, et scelerisque odio tristique ac.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
posuere est sed faucibus mattis. Sed erat dolor, pellentesque a
enim ut, sollicitudin rutrum tellus. Pellentesque habitant morbi
tristique senectus et [netus](https://google.com) et
malesuada fames ac turpis egestas. _Fusce_ maximus diam
**nulla**, et scelerisque odio tristique ac.
`

export default {
  title: 'Components/Book/Markdown',
  component: BookMarkdown,
  args: {
    title: 'Markdown',
    markdown: lorem.trim(),
    emptyMessage: 'This is a message if empty',
    blur: false,
    loading: false
  },
  argTypes: {
    options: {
      control: { type: null }
    }
  },
  decorators: [
    () => ({
      template: '<div class="md:p-6 md:w-3/5"><story/></div>'
    })
  ]
} as Meta<typeof BookMarkdown>

export const Default: StoryObj<typeof BookMarkdown> = {
  render: (args) => ({
    components: { BookMarkdown },
    setup: () => ({ args }),
    template: '<BookMarkdown v-bind="args" />'
  })
}

export const Loading: StoryObj<typeof BookMarkdown> = {
  render: (args) => ({
    components: { BookMarkdown },
    setup: () => ({ args }),
    template: '<BookMarkdown v-bind="args" />'
  }),
  args: { loading: true }
}

export const Empty: StoryObj<typeof BookMarkdown> = {
  render: (args) => ({
    components: { BookMarkdown },
    setup: () => ({ args }),
    template: '<BookMarkdown v-bind="args" />'
  }),
  args: { markdown: '' }
}

export const Blur: StoryObj<typeof BookMarkdown> = {
  render: (args) => ({
    components: { BookMarkdown },
    setup: () => ({ args }),
    template: '<BookMarkdown v-bind="args" />'
  }),
  args: { blur: true }
}

export const SmallText: StoryObj<typeof BookMarkdown> = {
  render: (args) => ({
    components: { BookMarkdown },
    setup: () => ({ args }),
    template: '<BookMarkdown v-bind="args" />'
  }),
  args: { markdown: 'This is a _small_ text.' }
}
