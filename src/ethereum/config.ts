import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { getEnvInt, getEnvIntArray, getEnvString } from '../utils'

import FortmaticPNG from './images/fortmatic.png'
import MetaMaskPNG from './images/metamask.png'
import PortisPNG from './images/portis.png'
import TorusPNG from './images/torus.png'
import WalletConnectPNG from './images/walletconnect.png'
import type {
  ConnectorConfig,
  ConnectorKey,
  EthereumConfig,
  PartialConnectorConfig,
  PartialEthereumConfig,
} from './types'

const connectorDefaults: Record<ConnectorKey, { label: string; logo: string }> = {
  fortmatic: {
    label: 'Fortmatic',
    logo: FortmaticPNG,
  },
  injected: {
    label: 'MetaMask',
    logo: MetaMaskPNG,
  },
  portis: {
    label: 'Portis',
    logo: PortisPNG,
  },
  torus: {
    label: 'Torus',
    logo: TorusPNG,
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

export function getEnvConnectors(
  prefix = 'MULTIAUTH'
): Record<ConnectorKey, PartialConnectorConfig | null> {
  const connectors: Record<ConnectorKey, PartialConnectorConfig | null> = {
    fortmatic: null,
    injected: null,
    portis: null,
    torus: null,
    walletConnect: null,
  }

  const fortmaticApiKey = getEnvString(`${prefix}_FORTMATIC_API_KEY`)
  const fortmaticChainId = getEnvInt(`${prefix}_FORTMATIC_CHAIN_ID`)
  if (fortmaticApiKey != null && fortmaticChainId != null) {
    connectors.fortmatic = {
      key: 'fortmatic',
      connector: new FortmaticConnector({ apiKey: fortmaticApiKey, chainId: fortmaticChainId }),
    }
  }

  const injectedChainIds = getEnvIntArray(`${prefix}_INJECTED_CHAIN_IDS`)
  if (injectedChainIds != null) {
    connectors.injected = {
      key: 'injected',
      connector: new InjectedConnector({ supportedChainIds: injectedChainIds }),
    }
  }

  const portisDappId = getEnvString(`${prefix}_PORTIS_DAPP_ID`)
  const portisNetworks = getEnvIntArray(`${prefix}_PORTIS_NETWORKS`)
  if (portisDappId != null && portisNetworks != null) {
    connectors.portis = {
      key: 'portis',
      connector: new PortisConnector({ dAppId: portisDappId, networks: portisNetworks }),
    }
  }

  const torusChainId = getEnvInt(`${prefix}_TORUS_CHAIN_ID`)
  if (torusChainId) {
    connectors.torus = {
      key: 'torus',
      connector: new TorusConnector({ chainId: torusChainId }),
    }
  }

  const walletConnectChainId = getEnvString(`${prefix}_WALLETCONNECT_CHAIN_ID`)
  const walletConnectRpcUrl = getEnvString(`${prefix}_WALLETCONNECT_RPC_URL`)
  if (walletConnectChainId != null && walletConnectRpcUrl != null) {
    connectors.walletConnect = {
      key: 'walletConnect',
      connector: new WalletConnectConnector({
        rpc: { [walletConnectChainId]: walletConnectRpcUrl },
      }),
    }
  }

  return connectors
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
