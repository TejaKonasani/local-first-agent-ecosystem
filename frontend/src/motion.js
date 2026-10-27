import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * AOS-style scroll reveal. Attach the returned ref to any element with
 * className "reveal" (optionally "reveal-up" | "reveal-left" | "reveal-right"
 * | "reveal-zoom") and it will gently fade/slide in when it enters the
 * viewport. Stagger is supported via the data-reveal-delay attribute.
 */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const delay = parseFloat(el.dataset.revealDelay || '0')
    const from = {
      opacity: 0,
      y: el.classList.contains('reveal-up') ? 0 : 24,
      x: el.classList.contains('reveal-left') ? -24 : el.classList.contains('reveal-right') ? 24 : 0,
      scale: el.classList.contains('reveal-zoom') ? 0.97 : 1,
    }
    const tween = gsap.fromTo(
      el,
      from,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.5,
        delay,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    )
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => tween.play(),
    })
    return () => {
      trigger.kill()
      tween.kill()
      gsap.set(el, { clearProps: 'all' })
    }
  }, [])
  return ref
}

/** Reveal every .reveal element inside the returned container ref. */
export function useRevealGroup() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const items = Array.from(root.querySelectorAll('.reveal'))
    const tweens = []
    const triggers = []
    items.forEach((el, i) => {
      const delay = parseFloat(el.dataset.revealDelay || String(Math.min(i * 0.06, 0.3)))
      const from = {
        opacity: 0,
        y: el.classList.contains('reveal-up') ? 0 : 24,
        x: el.classList.contains('reveal-left') ? -24 : el.classList.contains('reveal-right') ? 24 : 0,
        scale: el.classList.contains('reveal-zoom') ? 0.97 : 1,
      }
      gsap.set(el, { ...from })
      const tween = gsap.to(el, {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.5,
        delay,
        ease: 'power2.out',
        clearProps: 'transform',
        paused: true,
      })
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => tween.play(),
      })
      tweens.push(tween)
      triggers.push(trigger)
    })
    return () => {
      triggers.forEach((t) => t.kill())
      tweens.forEach((t) => t.kill())
      gsap.set(items, { clearProps: 'all' })
    }
  }, [])
  return ref
}

/** Subtle parallax drift on decorative background layers. */
export function useParallax() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const layers = Array.from(el.querySelectorAll('[data-parallax]'))
    if (layers.length === 0) return
    const update = () => {
      const y = window.scrollY
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax || '0.1')
        layer.style.transform = `translate3d(0, ${y * speed}px, 0)`
      })
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      layers.forEach((layer) => (layer.style.transform = ''))
    }
  }, [])
  return ref
}

/** Count-up animation for KPI numbers (skipped for reduced motion). */
export function useCountUp(value, { duration = 0.7 } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const target = Number(value)
    if (!Number.isFinite(target) || target === 0) {
      el.textContent = String(value)
      return
    }
    if (prefersReducedMotion()) {
      el.textContent = String(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3) // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString()
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return ref
}