import React from 'react'
import { Provider } from 'react-redux'

import { store } from '@/shared/store'
import { GamePage } from '@/pages'

import './App.scss'

//
//
//

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <GamePage />
      </div>
    </Provider>
  )
}

export default App
