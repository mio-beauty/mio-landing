import { useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../components/Footer.jsx'

export default function SiteLayout() {
  const pageRef = useRef(null)
  const mainRef = useRef(null)
  const footerRef = useRef(null)
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  useLayoutEffect(() => {
    const page = pageRef.current
    const main = mainRef.current
    const footer = footerRef.current

    if (!page || !main || !footer) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyStaticLayout = () => {
      const footerHeight = footer.getBoundingClientRect().height
      page.style.setProperty('--footer-reveal-space', isLandingPage ? `${footerHeight}px` : '0px')
      page.style.setProperty('--footer-progress', '0')
      page.style.setProperty('--footer-side-gap', '0px')
      page.style.setProperty('--footer-radius', '0px')
      main.style.removeProperty('border-bottom-left-radius')
      main.style.removeProperty('border-bottom-right-radius')
      main.style.removeProperty('clip-path')
      main.style.removeProperty('box-shadow')
      footer.style.removeProperty('transform')
      footer.style.removeProperty('opacity')
    }

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          allowMotion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { reduceMotion, allowMotion } = context.conditions

          applyStaticLayout()

          if (!isLandingPage || reduceMotion || !allowMotion) {
            return undefined
          }

          const getFooterHeight = () => footer.getBoundingClientRect().height
          const getRevealDistance = () => Math.round(getFooterHeight() * 1.45)
          const getRevealOffset = (ratio) => Math.round(getFooterHeight() * ratio)
          const getRadius = () => {
            const viewportWidth = window.innerWidth || 0
            if (viewportWidth < 640) return 28
            if (viewportWidth < 1024) return 42
            return 64
          }

          const getSideGap = () => {
            const viewportWidth = window.innerWidth || 0
            if (viewportWidth < 640) return 14
            if (viewportWidth < 1024) return 24
            return 36
          }

          const updateFooterSpace = () => {
            page.style.setProperty('--footer-reveal-space', `${getFooterHeight()}px`)
          }

          updateFooterSpace()

          ScrollTrigger.create({
            trigger: main,
            start: () => `bottom bottom-=${getRevealOffset(0.28)}`,
            end: () => `+=${getRevealDistance()}`,
            scrub: 1.1,
            invalidateOnRefresh: true,
            onRefreshInit: updateFooterSpace,
            onUpdate: (self) => {
              page.style.setProperty('--footer-progress', `${self.progress}`)
            },
          })

          gsap.to(main, {
            clipPath: () =>
              `inset(0px ${getSideGap()}px 0px ${getSideGap()}px round 0px 0px ${getRadius()}px ${getRadius()}px)`,
            borderBottomLeftRadius: () => getRadius(),
            borderBottomRightRadius: () => getRadius(),
            boxShadow: '0 36px 96px rgba(13, 13, 13, 0.2)',
            ease: 'none',
            scrollTrigger: {
              trigger: main,
              start: () => `bottom bottom-=${getRevealOffset(0.34)}`,
              end: () => `+=${getRevealDistance()}`,
              scrub: 1.35,
              invalidateOnRefresh: true,
            },
          })

          gsap.fromTo(footer, {
            yPercent: 4,
            opacity: 0.72,
          }, {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: main,
              start: () => `bottom bottom-=${getRevealOffset(0.22)}`,
              end: () => `+=${getRevealDistance()}`,
              scrub: 1.45,
              invalidateOnRefresh: true,
            },
          })

          const handleViewportChange = () => {
            updateFooterSpace()
            ScrollTrigger.refresh()
          }

          window.addEventListener('resize', handleViewportChange)
          prefersReducedMotion.addEventListener('change', handleViewportChange)

          return () => {
            window.removeEventListener('resize', handleViewportChange)
            prefersReducedMotion.removeEventListener('change', handleViewportChange)
          }
        },
      )

      return () => {
        mm.revert()
      }
    }, page)

    return () => {
      ctx.revert()
    }
  }, [location.pathname])

  return (
    <div
      ref={pageRef}
      className="site-page min-h-screen bg-white text-neutral-900"
      data-footer-reveal={isLandingPage ? 'true' : 'false'}
    >
      <main ref={mainRef} className="site-main">
        <Outlet />
      </main>

      <div ref={footerRef} className="site-footer-reveal">
        <Footer />
      </div>
    </div>
  )
}
