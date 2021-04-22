import { Text } from 'grommet'
import React from 'react'

import { useMultiAuth } from '../hooks'

export function DisplayState() {
  const state = useMultiAuth()[0]

  switch (state.status) {
    case 'CONNECTED':
      return <Text>Connected with account: {state.connected.accountID.toString()}</Text>
    case 'CONNECTING':
      return <Text>Connecting...</Text>
    case 'DISCONNECTED':
      return <Text>Disconnected</Text>
    case 'FAILED':
      return <Text>Failed to connect: {state.error?.message}</Text>
  }
}
