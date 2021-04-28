import { Text } from 'grommet'
import React from 'react'

import { useMultiAuth } from '../hooks'

export function DisplayState() {
  const state = useMultiAuth()[0]

  switch (state.status) {
    case 'connected':
      return <Text>Connected with account: {state.connected.accountID.toString()}</Text>
    case 'connecting':
      return <Text>Connecting...</Text>
    case 'disconnected':
      return <Text>Disconnected</Text>
    case 'failed':
      return <Text>Failed to connect: {state.error?.message}</Text>
  }
}
