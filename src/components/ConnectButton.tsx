import { Button } from 'grommet'
import type { ButtonExtendedProps } from 'grommet'
import React, { useCallback } from 'react'

import { useMultiAuth } from '../hooks'

export type ConnectButtonProps = Omit<ButtonExtendedProps, 'disabled' | 'onClick'>

export function ConnectButton(props: ConnectButtonProps) {
  const [state, connect] = useMultiAuth()

  const onClick = useCallback(() => {
    connect({ mode: 'select' }).catch((err) => {
      console.warn('Failed to connect:', err.message)
    })
  }, [connect])

  return (
    <Button label="Connect" {...props} disabled={state.status === 'connecting'} onClick={onClick} />
  )
}
