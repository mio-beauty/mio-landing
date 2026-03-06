import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import App from './App.jsx'

// Global smooth scrolling (guarded for Vite HMR + React StrictMode in dev).
if (!globalThis.__mioLenis) {
  globalThis.__mioLenis = new Lenis({
    autoRaf: true,
    anchors: true,
  })

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      globalThis.__mioLenis?.destroy?.()
      delete globalThis.__mioLenis
    })
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
