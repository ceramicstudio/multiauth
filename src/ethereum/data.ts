import type { AbstractConnector } from '@web3-react/abstract-connector'
import { TorusConnector } from '@web3-react/torus-connector'

import type { ConnectorState, ConnectorStateParams, EthereumProvider } from './types'
import { toChainID } from './utils'

export async function getEthereumAccount(provider: EthereumProvider): Promise<string | null> {
  try {
    // @ts-ignore provider type
    const res = await provider.send('eth_accounts')
    return res.result[0] ?? null
  } catch (err) {
    return null
  }
}

export async function getTorusProviderAndAccount<Provider = EthereumProvider>(
  connector: TorusConnector
): Promise<[Provider, string | null]> {
  const provider = await connector.getProvider()
  const account = await getEthereumAccount(provider)
  return [provider, account]
}

export async function getTorusConnectorState<Provider = EthereumProvider>(
  connector: TorusConnector,
  params: ConnectorStateParams = {}
): Promise<ConnectorState<Provider>> {
  const [[provider, account], chainID] = await Promise.all([
    getTorusProviderAndAccount<Provider>(connector),
    params.chainID ?? connector.getChainId(),
  ])
  return { account, chainID: toChainID(chainID), provider }
}

export async function getConnectorState<Provider = EthereumProvider>(
  connector: AbstractConnector,
  params: ConnectorStateParams = {}
): Promise<ConnectorState<Provider>> {
  if (connector instanceof TorusConnector) {
    // connector.getAccount() doesn't work with Torus, needs custom workaround
    return await getTorusConnectorState(connector, params)
  }

  const [provider, account, chainID] = await Promise.all([
    connector.getProvider() as Promise<Provider>,
    params.account ?? connector.getAccount(),
    params.chainID ?? connector.getChainId(),
  ])
  return { account, chainID: toChainID(chainID), provider }
}
