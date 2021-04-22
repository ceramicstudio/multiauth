import { AccountID } from 'caip'
import { Box, Button, Heading, Grommet, Layer } from 'grommet'
import type { ThemeType } from 'grommet'
import { useAtom } from 'jotai'
import React from 'react'

import { useConnection } from '../ethereum/hooks'
import { authStateAtom } from '../state'
import type { AuthAccount, Config, ProviderType } from '../types'
import { deferred } from '../utils'

import closeIconSrc from './images/icon-close.svg'

import { ProviderOption } from './ProviderOption'

export type ModalProps = {
  config: Config
  theme?: ThemeType
}

export function Modal({ config, theme }: ModalProps) {
  const connect = useConnection()[0]
  const [authState, setAuthState] = useAtom(authStateAtom)

  const onCloseModal = () => {
    if (authState.status === 'CONNECTING') {
      if (authState.provider == null) {
        authState.promise.resolve(null)
        void setAuthState({ status: 'DISCONNECTED' })
      } else {
        void setAuthState({ ...authState, modal: false })
      }
    }
  }

  const ethereumProvider = config.providers.find((p) => p.key === 'ethereum')
  if (ethereumProvider == null) {
    console.warn('Ethereum provider missing in config')
    return null
  }

  const ethereumWallets = ethereumProvider.connectors.map((method) => {
    const onClick = () => {
      if (authState.status === 'CONNECTING') {
        if (authState.provider == null) {
          void setAuthState({ ...authState, provider: { type: 'ethereum', method } })
        }
      } else {
        void setAuthState({
          status: 'CONNECTING',
          promise: deferred<AuthAccount<ProviderType> | null>(),
          provider: { type: 'ethereum', method },
          modal: true,
        })
      }

      connect(method.connector).then(
        (state) => {
          if (state == null) {
            return setAuthState({ status: 'DISCONNECTED' })
          }

          const connected: AuthAccount<'ethereum'> = {
            accountID: new AccountID({ address: state.account, chainId: state.chainID }),
            provider: { method, state },
          }

          if (authState.status === 'CONNECTING') {
            authState.promise.resolve(connected)
          }
          void setAuthState({ status: 'CONNECTED', connected })
        },
        (error: Error) => {
          if (authState.status === 'CONNECTING') {
            authState.promise.reject(error)
          }
          void setAuthState({ status: 'FAILED', error })
        }
      )
    }

    return (
      <ProviderOption
        disabled={authState.status === 'CONNECTING' && authState.provider != null}
        key={method.key}
        label={method.label}
        logo={method.logo}
        onClick={onClick}
      />
    )
  })

  return (
    <Grommet plain theme={theme}>
      {authState.status === 'CONNECTING' && authState.modal ? (
        <Layer onEsc={onCloseModal} onClickOutside={onCloseModal}>
          <Box flex="grow" pad="small" width="large">
            <Box direction="row">
              <Box flex="grow">
                <Heading level={2} margin={{ bottom: 'small', top: 'none' }}>
                  Connect wallet
                </Heading>
              </Box>
              <Box>
                <Button
                  icon={<img alt="x" src={closeIconSrc} />}
                  onClick={onCloseModal}
                  plain
                  style={{ padding: '10px' }}
                />
              </Box>
            </Box>
            <Box overflow="auto" height={{ max: 'calc(100vh - 120px)' }}>
              <Box flex={false}>
                <Heading level={4} margin={{ vertical: 'small' }}>
                  1. Choose network
                </Heading>
                <Box direction="row">
                  <ProviderOption
                    label={ethereumProvider.label}
                    logo={ethereumProvider.logo}
                    onClick={() => {}}
                    selected
                  />
                </Box>
                <Heading level={4} margin={{ vertical: 'small' }}>
                  2. Choose wallet
                </Heading>
                <Box direction="row">{ethereumWallets}</Box>
              </Box>
            </Box>
          </Box>
        </Layer>
      ) : null}
    </Grommet>
  )
}
