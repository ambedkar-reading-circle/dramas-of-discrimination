import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { registerPageScroller } from './pageScroller'
import { useMediaQuery } from '#/lib/use-media-query'

/** Enhance the window scroll so sticky layout and Motion keep using native positions. */
export default function SmoothScroll() {
  const router = useRouter()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (reducedMotion) return
    // Marks this run's instance as destroyed so an anchor navigation that is
    // still in flight when the preference flips falls back to native scroll.
    let disposed = false
    const lenis = new Lenis({
      autoRaf: true,
      anchors: false,
      syncTouch: false,
      allowNestedScroll: true,
    })
    registerPageScroller(lenis)

    // Stop the old page's inertia before the router resets or restores scroll.
    const unsubscribe = router.subscribe('onBeforeLoad', () => {
      lenis.scrollTo(window.scrollY, { immediate: true })
    })

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return

      const url = new URL(link.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return

      let id: string
      try {
        id = decodeURIComponent(url.hash.slice(1))
      } catch {
        return
      }
      const target = document.getElementById(id)
      if (!target) return

      // Prevent the native jump and the router's own hash scroll. Start Lenis
      // after navigation so onBeforeLoad cannot cancel the new animation.
      event.preventDefault()
      void router
        .navigate({
          hash: id,
          search: true,
          resetScroll: false,
          hashScrollIntoView: false,
        })
        .then(() => {
          if (!target.isConnected) return
          const focusTarget = () => {
            const needsTabIndex = !target.hasAttribute('tabindex') && target.tabIndex < 0
            if (needsTabIndex) target.setAttribute('tabindex', '-1')
            target.focus({ preventScroll: true })
            if (needsTabIndex) target.removeAttribute('tabindex')
          }
          if (disposed) {
            target.scrollIntoView({ behavior: 'instant' })
            focusTarget()
          } else {
            lenis.scrollTo(target, { onComplete: focusTarget })
          }
        })
    }
    window.addEventListener('click', onAnchorClick)

    return () => {
      disposed = true
      window.removeEventListener('click', onAnchorClick)
      unsubscribe()
      registerPageScroller(null)
      lenis.destroy()
    }
  }, [router, reducedMotion])

  return null
}
