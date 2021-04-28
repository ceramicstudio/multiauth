# Multiauth

Blockchain authentication for React apps

## Installation

```sh
npm install @ceramicstudio/multiauth
```

## Setup

> Only Ethereum is currently supported

### 1. Configure Ethereum connectors

Multiauth uses [Web3React](https://github.com/NoahZinsmeister/web3-react) for Ethereum, and re-exports the following connectors so they can be imported directly from `@ceramicstudio/multiauth`:

- `FortmaticConnector`
- `InjectedConnector`
- `PortisConnector`
- `TorusConnector`
- `WalletConnectConnector`

Connectors can be setup manually as followed:

```ts
import { InjectedConnector } from '@ceramicstudio/multiauth'

const connectors = [
  { key: 'injected', connector: new InjectedConnector({ supportedChainIds: [1, 3] }) },
]
```

Connectors can also be created based on environment variables:

```ts
import { getEnvEthereumConnectors } from '@ceramicstudio/multiauth'

const fromEnv = getEnvEthereumConnectors('PREFIX') // Prefix defaults to 'MULTIAUTH'
const connectors = [fromEnv.injected, fromEnv.walletConnect].filter(Boolean) // Filter out `null` values
```

Using the following environment variables (with the given prefix instead of `MULTIAUTH`):

- `fortmatic` (`FortmaticConnector`):
  - `MULTIAUTH_FORTMATIC_API_KEY`
  - `MULTIAUTH_FORTMATIC_CHAIN_ID`: chain ID, ex `3`
- `injected` (`InjectedConnector`):
  - `MULTIAUTH_INJECTED_CHAIN_IDS`: comma-separared chain IDs, ex `1,3`
- `portis` (`PortisConnector`):
  - `MULTIAUTH_PORTIS_DAPP_ID`
  - `MULTIAUTH_PORTIS_NETWORKS`: comma-separared networks, ex `1,3`
- `torus` (`TorusConnector`):
  - `MULTIAUTH_TORUS_CHAIN_ID`: chain ID, ex `3`
- `walletConnect` (`WalletConnectConnector`):
  - `MULTIAUTH_WALLETCONNECT_CHAIN_ID`: chain ID, ex `3`
  - `MULTIAUTH_WALLETCONNECT_RPC_URL`: JSON-RPC URL to connect to network

### 2. Inject the Provider at the root of the components tree

```tsx
import { Provider } from '@ceramicstudio/multiauth'

const connectors = ... // From previous step

export function App(props) {
  return <Provider providers={[{ key: 'ethereum', connectors }]}>{props.children}</Provider>
}
```

## Usage

```tsx
import { useMultiAuth } from '@ceramicstudio/multiauth'

function HelloMultiAuth() {
  const [state, connect, disconnect] = useMultiAuth()

  switch (state.status) {
    case 'connected':
      return <p>Connected with account: {state.connected.accountID.toString()}</p>
    case 'connecting':
      return <p>Connecting...</p>
    case 'disconnected':
      return <p>Disconnected</p>
    case 'failed':
      return <p>Failed to connect: {state.error?.message}</p>
  }
}
```

## License

GPL 3.0 or later
