import type { AccountID } from 'caip'

import type {
  EthereumConnectionProvider,
  EthereumConfig,
  PartialEthereumConfig,
} from './ethereum/types'
import type { Deferred } from './utils'

export type ConnectionProviders = {
  ethereum: EthereumConnectionProvider
}

export type ProviderType = keyof ConnectionProviders

export type AuthAccount<Type extends ProviderType> = {
  accountID: AccountID
  provider: ConnectionProviders[Type]
}

export type SelectedAuthMethod<Type extends ProviderType> = {
  type: Type
  method: ConnectionProviders[Type]['method']
}

export type AuthState<Type extends ProviderType = 'ethereum'> =
  | { status: 'disconnected' }
  | {
      status: 'connecting'
      promise: Deferred<AuthAccount<Type> | null>
      modal: boolean
      provider?: SelectedAuthMethod<Type>
    }
  | { status: 'connected'; connected: AuthAccount<Type> }
  | { status: 'failed'; error?: Error }

export type ProvidersPartialConfigs = {
  ethereum: PartialEthereumConfig
}

export type ProvidersConfigs = {
  ethereum: EthereumConfig
}

export type ProviderConfig<Type extends ProviderType = ProviderType> = ProvidersConfigs[Type] & {
  key: Type
  label: string
  logo: string
}

export type PartialProviderConfig<Type extends ProviderType = ProviderType> =
  ProvidersPartialConfigs[Type] & {
    key: Type
    label?: string
    logo?: string
  }

export type Config = {
  providers: Array<ProviderConfig>
}

export type PartialConfig = {
  providers?: Array<ProviderConfig | PartialProviderConfig>
}
