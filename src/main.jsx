import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger)

function shouldUseLenis() {
  if (typeof window === 'undefined') return false

  const isDesktopViewport = window.matchMedia?.('(min-width: 1024px)')?.matches ?? false
  const hasFinePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false

  return isDesktopViewport && hasFinePointer
}

function syncLenisInstance() {
  if (!shouldUseLenis()) {
    if (globalThis.__mioLenisTicker) {
      gsap.ticker.remove(globalThis.__mioLenisTicker)
      delete globalThis.__mioLenisTicker
    }
    globalThis.__mioLenis?.destroy?.()
    delete globalThis.__mioLenis
    return
  }

  if (!globalThis.__mioLenis) {
    globalThis.__mioLenis = new Lenis({
      autoRaf: false,
      anchors: true,
      lerp: 0.08,
      wheelMultiplier: 0.85,
    })

    globalThis.__mioLenis.on('scroll', ScrollTrigger.update)
  }

  if (!globalThis.__mioLenisTicker) {
    globalThis.__mioLenisTicker = (time) => {
      globalThis.__mioLenis?.raf(time * 1000)
    }
    gsap.ticker.add(globalThis.__mioLenisTicker)
    gsap.ticker.lagSmoothing(0)
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
