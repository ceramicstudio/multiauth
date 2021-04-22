import React from 'react'
import { Meta, Story } from '@storybook/react'

import { ConnectButton, DisplayState, Provider } from '../src'

function Welcome() {
  return (
    <Provider
      providers={[{ key: 'ethereum' }]}
      theme={{ global: { font: { family: 'sans-serif' } } }}>
      <p>
        <DisplayState />
      </p>
      <ConnectButton />
    </Provider>
  )
}

const meta: Meta = {
  title: 'Welcome',
  component: Welcome,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story = (args) => <Welcome {...args} />

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({})

Default.args = {}
