import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { ConnectButton, DisplayState, Provider } from '..'

const App = () => {
  return (
    <Provider>
      <p>
        <DisplayState />
      </p>
      <ConnectButton />
    </Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
