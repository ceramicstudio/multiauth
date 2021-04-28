import { AccountID } from 'caip'
import { Box, Button, Heading, Grommet, Layer } from 'grommet'
import type { ThemeType } from 'grommet'
import { useAtom } from 'jotai'
import React from 'react'
import styled from 'styled-components'

import { useConnection } from '../ethereum/hooks'
import { authStateAtom } from '../state'
import type { AuthAccount, Config, ProviderType } from '../types'
import { deferred } from '../utils'

import closeIconSrc from './images/icon-close.svg'

import { ProviderOption } from './ProviderOption'

const ProvidersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`

export type ModalProps = {
  config: Config
  theme?: ThemeType
}

export function Modal({ config, theme }: ModalProps) {
  const connect = useConnection()[0]
  const [authState, setAuthState] = useAtom(authStateAtom)

  const onCloseModal = () => {
    if (authState.status === 'connecting') {
      if (authState.provider == null) {
        authState.promise.resolve(null)
        void setAuthState({ status: 'disconnected' })
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
      if (authState.status === 'connecting') {
        if (authState.provider == null) {
          void setAuthState({ ...authState, provider: { type: 'ethereum', method } })
        }
      } else {
        void setAuthState({
          status: 'connecting',
          promise: deferred<AuthAccount<ProviderType> | null>(),
          provider: { type: 'ethereum', method },
          modal: true,
        })
      }

      connect(method.connector).then(
        (state) => {
          if (state == null) {
            if (authState.status === 'connecting') {
              authState.promise.resolve(null)
            }
            return setAuthState({ status: 'disconnected' })
          }

          const connected: AuthAccount<'ethereum'> = {
            accountID: new AccountID({ address: state.account, chainId: state.chainID }),
            provider: { method, state },
          }

          if (authState.status === 'connecting') {
            authState.promise.resolve(connected)
          }
          void setAuthState({ status: 'connected', connected })
        },
        (error: Error) => {
          if (authState.status === 'connecting') {
            authState.promise.reject(error)
          }
          void setAuthState({ status: 'failed', error })
        }
      )
    }

    return (
      <ProviderOption
        disabled={authState.status === 'connecting' && authState.provider != null}
        key={method.key}
        label={method.label}
        logo={method.logo}
        onClick={onClick}
      />
    )
  })

  return (
    <Grommet plain theme={theme}>
      {authState.status === 'connecting' && authState.modal ? (
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
                <ProvidersGrid>
                  <ProviderOption
                    label={ethereumProvider.label}
                    logo={ethereumProvider.logo}
                    onClick={() => {}}
                    selected
                  />
                </ProvidersGrid>
                <Heading level={4} margin={{ vertical: 'small' }}>
                  2. Choose wallet
                </Heading>
                <ProvidersGrid>{ethereumWallets}</ProvidersGrid>
              </Box>
            </Box>
          </Box>
        </Layer>
      ) : null}
    </Grommet>
  )
}
