import type { ThemeType } from 'grommet'
import { Provider as JotaiProvider } from 'jotai'
import React, { useState } from 'react'
import type { ReactNode } from 'react'

import { getConfig } from '../config'
import { scope } from '../constants'
import { EthereumProvider } from '../ethereum/components'
import type { PartialConfig } from '../types'

import { Modal } from './Modal'

export type ProviderProps = PartialConfig & {
  children: ReactNode
  theme?: ThemeType
}

export function Provider({ children, theme, ...partialConfig }: ProviderProps) {
  const [config] = useState(() => getConfig(partialConfig))

  return (
    <JotaiProvider scope={scope}>
      <EthereumProvider>
        {children}
        <Modal config={config} theme={theme} />
      </EthereumProvider>
    </JotaiProvider>
  )
}
