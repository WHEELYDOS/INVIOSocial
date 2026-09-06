import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Suppress known upstream Three.js r183+ deprecation warnings triggered by @react-three/fiber v9
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (
    msg.includes('THREE.Clock: This module has been deprecated') ||
    msg.includes('THREE.WebGLShadowMap: PCFSoftShadowMap')
  ) {
    return
  }
  originalWarn.apply(console, args)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
