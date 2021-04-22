import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import type { ReactNode } from 'react'

import { NAMESPACE } from '../constants'

function getLibrary() {
  // No library to return
}

// Workaround for SSR issue, cf https://github.com/NoahZinsmeister/web3-react/issues/176
const Web3ReactRoot =
  typeof window === 'undefined' ? Web3ReactProvider : createWeb3ReactRoot(NAMESPACE)

export type ProviderProps = { children: ReactNode }

export function EthereumProvider({ children }: ProviderProps) {
  return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>
}
