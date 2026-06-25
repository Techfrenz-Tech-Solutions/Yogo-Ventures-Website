// HeroSection — 4 slides, e-commerce
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

const SLIDES = [
  {
    id: 1,
    image: "Hero1.png",
    heading: "Premium Apparels",
    shopLink: "/shop?category=Apparel",
  },
  {
    id: 2,
    image: "Hero2.jpg",
    heading: "Memory Foam Products",
    shopLink: "/shop?category=Memory+Foam+Products",
    bgColor: "#e8e8e8",
  },
  {
    id: 3,
    image: "Hero3.png",
    heading: "Copper Utensils",
    shopLink: "/shop?category=Copper+Utensils",
  },
  {
    id: 4,
    image: "Hero4.png",
    heading: "Handicraft Items",
    shopLink: "/shop?category=Handicraft+Items",
  },
];

// Hero4.png is 1705×759px (ratio 2.2464 — ultra-wide).
// On mobile the hero height is based on the apparel ratio (1.4282).
// When the handicraft slide is active we switch the hero to its own
// ratio so the image fills edge-to-edge with zero cropping / letterbox.
const HANDICRAFT_INDEX = 3; // 0-based index of slide 4

/* ── SVG chevron icons ─────────────────────────────────────────────────── */
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function HeroSection() {
  const [current, setCurrent]   = useState(0);
  const [leaving, setLeaving]   = useState(false);
  const [paused,  setPaused]    = useState(false);
  const intervalRef             = useRef(null);
  const heroRef                 = useRef(null); // ref to <section>

  /* ── Auto-advance interval ──────────────────────────────────────────── */
  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 7000);
  };

  const goTo = idx => {
    setLeaving(true);
    setTimeout(() => {
      setCurrent(idx);
      setLeaving(false);
    }, 340);
    startInterval();
  };

  const next = () => goTo((current + 1) % SLIDES.length);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  /* ── Pause / resume on hover ────────────────────────────────────────── */
  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
    } else {
      startInterval();
    }
    return () => clearInterval(intervalRef.current);
  }, [paused]);

  /* ── Toggle hero--handicraft on mobile when slide 4 is active ──────────
     Hero4.png ratio = 2.2464.  CSS rule:
       .hero--handicraft { min-height: calc(100vw / 2.2464 + 64px); }
     This makes the container exactly as tall as the image at 100vw
     → object-fit:contain fills edge-to-edge with zero cropping.
     Class is removed immediately when any other slide becomes active.  */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const apply = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && current === HANDICRAFT_INDEX) {
        hero.classList.add("hero--handicraft");
      } else {
        hero.classList.remove("hero--handicraft");
      }
    };

    apply(); // run on every slide change
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [current]);

  const slide = SLIDES[current];
  if (!slide) return null;

  return (
    <section
      ref={heroRef}
      className="hero"
      aria-label="Featured slides"
      role="banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* Slide backgrounds */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`hero__slide-bg${i === current ? " active" : ""}`}
          aria-hidden="true"
          style={s.bgColor ? { backgroundColor: s.bgColor } : undefined}
        >
          <img
            src={s.image}
            alt=""
            className="hero__slide-img"
            draggable="false"
          />
        </div>
      ))}

      <div className="hero__overlay" aria-hidden="true" />

      {/* Heading + CTA */}
      <div className={`hero__top-left${leaving ? " leaving" : ""}`}>
        <h1 className="hero__product-name">{slide.heading}</h1>
        <div className="hero__ctas">
          <Link to={slide.shopLink} className="btn btn-primary btn-lg">
            View Products
          </Link>
        </div>
      </div>

      {/* Prev / Next */}
      <button className="hero__nav hero__nav--prev" onClick={prev} aria-label="Previous slide">
        <ChevronLeftIcon />
      </button>
      <button className="hero__nav hero__nav--next" onClick={next} aria-label="Next slide">
        <ChevronRightIcon />
      </button>

      {/* Dots */}
      <div className="hero__dots" role="group" aria-label="Slide indicators">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === current ? " active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>

    </section>
  );
}