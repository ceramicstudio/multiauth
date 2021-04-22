import { InjectedConnector } from '@web3-react/injected-connector'

import MetaMaskPNG from './images/metamask.png'
import WalletConnectPNG from './images/walletconnect.png'
import type { ConnectorConfig, EthereumConfig, PartialEthereumConfig } from './types'

const connectorDefaults = {
  injected: {
    label: 'MetaMask',
    logo: MetaMaskPNG,
  },
  walletConnect: {
    label: 'WalletConnect',
    logo: WalletConnectPNG,
  },
}

function getInjectedConnector(): ConnectorConfig<'injected'> {
  return {
    ...connectorDefaults.injected,
    key: 'injected',
    connector: new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] }),
  }
}

export function getConfig(partial: PartialEthereumConfig = {}): EthereumConfig {
  const connectors = partial.connectors
    ? partial.connectors.map((cfg) => {
        const defaults = connectorDefaults[cfg.key]
        return (defaults ? { ...defaults, ...cfg } : cfg) as ConnectorConfig<typeof cfg['key']>
      })
    : [getInjectedConnector()]
  return { connectors }
}
