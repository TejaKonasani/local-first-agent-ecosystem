import { useEffect, useRef } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Initialize AOS (Animation On Scroll) with the exact specification:
 * duration: 500ms, offset: 80, easing: 'ease-out-cubic', once: true.
 * Disables immediately if prefers-reduced-motion is true.
 */
export function initAOS() {
  if (typeof window !== 'undefined' && window.AOS) {
    if (prefersReducedMotion()) {
      window.AOS.init({ disable: true })
    } else {
      window.AOS.init({
        duration: 500,
        offset: 80,
        easing: 'ease-out-cubic',
        once: true,
      })
    }
  }
}

/**
 * Number count-up for Dashboard stat cards using GSAP power1.out (duration: 0.8s).
 * Counts up from 0 to target value on first view.
 */
export function useNumberCountUp(targetVal, { duration = 0.8 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const num = Number(targetVal)
    if (!Number.isFinite(num) || num === 0) {
      el.textContent = String(targetVal ?? 0)
      return
    }

    if (prefersReducedMotion()) {
      el.textContent = num.toLocaleString()
      return
    }

    const gsap = window.gsap
    if (gsap) {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: num,
        duration,
        ease: 'power1.out',
        onUpdate: () => {
          if (el) el.textContent = Math.round(obj.val).toLocaleString()
        },
      })
    } else {
      // Fallback if GSAP is loading
      const start = performance.now()
      let rafId = 0
      const tick = (now) => {
        const p = Math.min((now - start) / (duration * 1000), 1)
        // power1.out approximation: 1 - (1 - p)^2
        const eased = 1 - Math.pow(1 - p, 2)
        el.textContent = Math.round(num * eased).toLocaleString()
        if (p < 1) {
          rafId = requestAnimationFrame(tick)
        }
      }
      rafId = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafId)
    }
  }, [targetVal, duration])

  return ref
}

/**
 * Aceternity-style card spotlight hook.
 * Follows mouse position on cards and sets --spotlight-x, --spotlight-y, and --spotlight-opacity.
 */
export function useSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--spotlight-x', `${x}px`)
      el.style.setProperty('--spotlight-y', `${y}px`)
      el.style.setProperty('--spotlight-opacity', '1')
    }

    const onMouseLeave = () => {
      el.style.setProperty('--spotlight-opacity', '0')
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return ref
}

/**
 * GSAP Timeline for Home Hero text stagger, card float, and parallax glow.
 */
export function useHeroMotion({ textContainerRef, auditCardRef, glowRef }) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const gsap = window.gsap
    if (!gsap) return

    const tl = gsap.timeline()

    // Hero text stagger: y 24 to 0, opacity 0 to 1, duration 0.5, stagger 0.1, ease power2.out
    if (textContainerRef?.current) {
      const targets = textContainerRef.current.querySelectorAll('.hero-stagger-item')
      if (targets.length > 0) {
        tl.fromTo(
          targets,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        )
      }
    }

    // Hero card float: y 0 to -8, duration 3s, ease sine.inOut, yoyo, repeat -1
    let floatTween = null
    if (auditCardRef?.current) {
      floatTween = gsap.to(auditCardRef.current, {
        y: -8,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    }

    // Subtle parallax with ScrollTrigger: y -40 over hero scroll, scrub 0.6
    let st = null
    if (glowRef?.current && window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger)
      st = window.ScrollTrigger.create({
        trigger: glowRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(glowRef.current, { y: -40 * self.progress })
        },
      })
    }

    return () => {
      if (floatTween) floatTween.kill()
      if (st) st.kill()
      tl.kill()
    }
  }, [textContainerRef, auditCardRef, glowRef])
}
