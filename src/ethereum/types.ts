import type { AbstractConnector } from '@web3-react/abstract-connector'
import type { InjectedConnector } from '@web3-react/injected-connector'
import type { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import type { ChainID, ChainIDParams } from 'caip'

export type EthereumProvider = NodeJS.EventEmitter

export type ConnectorTypes = {
  injected: InjectedConnector
  walletConnect: WalletConnectConnector
}

export type ConnectorKey = keyof ConnectorTypes

export type ConnectorStateParams = {
  account?: string
  chainID?: ChainID | ChainIDParams | string | number
}

export type ConnectorState<Provider = EthereumProvider> = {
  account: string | null
  chainID: ChainID
  provider: Provider
}

export type ConnectedState<Provider = EthereumProvider> = ConnectorState<Provider> & {
  account: string
}

export type ConnectionState<
  Connector extends AbstractConnector = AbstractConnector,
  Provider = EthereumProvider
> =
  | { status: 'PENDING' }
  | { status: 'DISCONNECTED' }
  | { status: 'CONNECTED'; connector: Connector; connected: ConnectedState<Provider> }
  | {
      status: 'CONNECTING'
      connector: Connector
      promise: Promise<ConnectedState<Provider> | null>
    }
  | { status: 'FAILED'; connector: Connector; error?: Error }

export type ConnectorConfig<Key extends ConnectorKey = ConnectorKey> = {
  key: Key
  connector: ConnectorTypes[Key]
  label: string
  logo: string
}

export type PartialConnectorConfig<Key extends ConnectorKey = ConnectorKey> = {
  key: Key
  connector: ConnectorTypes[Key]
  label?: string
  logo?: string
}

export type EthereumConfig = {
  connectors: Array<ConnectorConfig>
}

export type PartialEthereumConfig = {
  connectors?: Array<ConnectorConfig | PartialConnectorConfig>
}

export type EthereumConnectionProvider<
  Key extends ConnectorKey = ConnectorKey,
  Provider = EthereumProvider
> = {
  method: ConnectorConfig<Key>
  state: ConnectedState<Provider>
}
