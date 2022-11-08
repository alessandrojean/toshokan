import Alert from './Alert.vue'

import { Meta, StoryObj } from '@storybook/vue3'

export default {
  title: 'Components/Common/Alert',
  component: Alert,
  argTypes: {
    title: {
      name: 'Title',
      description: 'Optional title for the alert'
    },
    show: {
      name: 'Show',
      description: 'Defines if the alert is visible or not'
    },
    type: {
      name: 'Type',
      description: 'The semantic type of the alert',
      control: {
        type: 'radio',
        labels: {
          info: 'Information',
          error: 'Error',
          warning: 'Warning'
        }
      },
      options: ['info', 'error', 'warning']
    }
  },
  decorators: [
    () => ({
      template: '<div class="max-w-2xl p-6"><story/></div>'
    })
  ]
} as Meta<typeof Alert>

const lorem = `
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
    posuere est sed faucibus mattis. Sed erat dolor, pellentesque a
    enim ut, sollicitudin rutrum tellus. Pellentesque habitant morbi
    tristique senectus et <a href="https://google.com">netus</a> et
    malesuada fames ac turpis egestas. <em>Fusce</em> maximus diam
    <strong>nulla</strong>, et scelerisque odio tristique ac.
  </p>
`

export const Info: StoryObj<typeof Alert> = {
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args">
        ${lorem}

        <template v-slot:actions>
          <button type="button">Action one</button>
        </template>
      </Alert>
    `
  }),
  args: {
    title: 'This is an info alert',
    show: true,
    type: 'info'
  }
}

export const Error: StoryObj<typeof Alert> = {
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args">
        ${lorem}

        <template v-slot:actions>
          <button type="button">Action one</button>
        </template>
      </Alert>
    `
  }),
  args: {
    title: 'This is an error alert',
    show: true,
    type: 'error'
  }
}

export const Warning: StoryObj<typeof Alert> = {
  render: (args) => ({
    components: { Alert },
    setup: () => ({ args }),
    template: `
      <Alert v-bind="args">
        ${lorem}

        <template v-slot:actions>
          <button type="button">Action one</button>
        </template>
      </Alert>
    `
  }),
  args: {
    title: 'This is an warning alert',
    show: true,
    type: 'error'
  }
}
