import React from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

const container = document.getElementById('root')

if (container == null) {
  throw new Error('Container not found')
}

const root = createRoot(container)
root.render(<App />)
