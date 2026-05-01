import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links route through Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -64 });
    });
  });
}

// Hero entrance
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero && !prefersReduced) {
  const headline = hero.querySelector<HTMLElement>('[data-hero-headline]');
  if (headline) {
    const split = new SplitType(headline, { types: 'lines,words', tagName: 'span' });
    const lines = split.lines ?? [];
    lines.forEach((line) => {
      line.style.overflow = 'hidden';
      line.style.display = 'block';
    });
    const words = split.words ?? [];
    gsap.set(words, { yPercent: 110 });
    gsap.to(words, {
      yPercent: 0,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.06,
      delay: 0.25,
    });
  }

  gsap.from('[data-hero-eyebrow]', { opacity: 0, y: 18, duration: 0.9, delay: 0.15, ease: 'power3.out' });
  gsap.from('[data-hero-sub]', { opacity: 0, y: 24, duration: 1.0, delay: 0.85, ease: 'power3.out' });
  gsap.from('[data-hero-cta]', { opacity: 0, y: 18, duration: 0.9, delay: 1.05, ease: 'power3.out' });
  gsap.from('[data-hero-meta]', { opacity: 0, y: 18, duration: 0.9, delay: 1.2, ease: 'power3.out', stagger: 0.05 });

  const ribbon = hero.querySelector<SVGPathElement>('[data-hero-ribbon]');
  if (ribbon) {
    const length = ribbon.getTotalLength();
    ribbon.style.strokeDasharray = `${length}`;
    ribbon.style.strokeDashoffset = `${length}`;
    gsap.to(ribbon, {
      strokeDashoffset: 0,
      duration: 2.4,
      ease: 'power2.inOut',
      delay: 0.1,
    });
  }
}

// Generic scroll reveals
if (!prefersReduced) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((wrap) => {
    const items = wrap.querySelectorAll<HTMLElement>('[data-reveal-item]');
    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: wrap, start: 'top 80%' },
      }
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-headline-split]').forEach((el) => {
    const split = new SplitType(el, { types: 'lines,words', tagName: 'span' });
    const lines = split.lines ?? [];
    lines.forEach((line) => {
      line.style.overflow = 'hidden';
      line.style.display = 'block';
    });
    const words = split.words ?? [];
    gsap.set(words, { yPercent: 110 });
    gsap.to(words, {
      yPercent: 0,
      duration: 1.0,
      ease: 'expo.out',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Parallax accents
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax ?? '0.2');
    gsap.to(el, {
      yPercent: -100 * speed,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

// Magnetic buttons
document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
  if (prefersReduced) return;
  const strength = 0.25;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

// Nav scroll state
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 24) nav.dataset.scrolled = 'true';
    else delete nav.dataset.scrolled;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
