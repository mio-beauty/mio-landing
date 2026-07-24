import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import App from './App.jsx'

function shouldUseLenis() {
  if (typeof window === 'undefined') return false

  const isDesktopViewport = window.matchMedia?.('(min-width: 1024px)')?.matches ?? false
  const hasFinePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false

  return isDesktopViewport && hasFinePointer
}

function syncLenisInstance() {
  if (!shouldUseLenis()) {
    globalThis.__mioLenis?.destroy?.()
    delete globalThis.__mioLenis
    return
  }

  if (!globalThis.__mioLenis) {
    globalThis.__mioLenis = new Lenis({
      autoRaf: true,
      anchors: true,
    })
  }
}

// Keep smooth scroll on desktop, but disable it on touch/mobile to prevent jumpy stop behavior.
syncLenisInstance()

if (!globalThis.__mioLenisViewportBound && typeof window !== 'undefined') {
  const handleViewportChange = () => {
    syncLenisInstance()
  }

  globalThis.__mioLenisViewportBound = true
  window.addEventListener('resize', handleViewportChange, { passive: true })

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      globalThis.__mioLenis?.destroy?.()
      delete globalThis.__mioLenis
      window.removeEventListener('resize', handleViewportChange)
      delete globalThis.__mioLenisViewportBound
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
