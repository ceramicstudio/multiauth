import { getConfig as getEthereumConfig } from './ethereum/config'
import type { Config, PartialConfig, ProviderConfig } from './types'

import EthereumPNG from './images/ethereum.png'

const providerSetup = {
  ethereum: {
    defaults: {
      label: 'Ethereum',
      logo: EthereumPNG,
    },
    getConfig: getEthereumConfig,
  },
}

function getEthereumProvider(): ProviderConfig<'ethereum'> {
  return {
    ...providerSetup.ethereum.defaults,
    ...providerSetup.ethereum.getConfig(),
    key: 'ethereum',
  }
}

export function getConfig(partial: PartialConfig = {}): Config {
  const providers = partial.providers
    ? partial.providers.map((cfg) => {
        const setup = providerSetup[cfg.key]
        return (
          setup == null ? cfg : { ...setup.defaults, ...cfg, ...setup.getConfig(cfg) }
        ) as ProviderConfig<typeof cfg['key']>
      })
    : [getEthereumProvider()]

  return { providers }
}
