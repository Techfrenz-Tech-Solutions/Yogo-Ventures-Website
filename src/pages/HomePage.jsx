// src/pages/HomePage.jsx — Yogo Ventures
import React, { useEffect } from "react";
import { Link }      from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { gsap }      from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection        from "../components/home/HeroSection";
import { CategoriesSection }   from "../components/home/CategoriesSection";
import { WhyUsSection }        from "../components/home/WhyUsSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { FAQSection }          from "../components/home/FAQSection";
import { BEST_SELLERS, NEW_ARRIVALS } from "../data/products";
import { useApp }              from "../context/AppContext";
import EnquirySection           from "../components/home/EnquirySection";
import "./HomePage.css";

gsap.registerPlugin(ScrollTrigger);

function FireIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="var(--white)"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="var(--white)"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline", verticalAlign: "middle", flexShrink: 0 }}
    >
      <path d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z" />
      <circle cx="19" cy="5" r="1.5" />
    </svg>
  );
}

function HeartIconBtn({ filled, onClick, label }) {
  const [particles, setParticles] = React.useState([]);

  const handleClick = (e) => {
    onClick(e);
    const burst = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 2 * Math.PI;
      const dist  = 22 + Math.random() * 12;
      return {
        id:   Date.now() + i,
        tx:   Math.cos(angle) * dist,
        ty:   Math.sin(angle) * dist,
        size: 7 + Math.random() * 5,
      };
    });
    setParticles(burst);
    setTimeout(() => setParticles([]), 700);
  };

  return (
    <button
      className={`hpc__wishlist-btn${filled ? " active" : ""}`}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={filled}
    >
      <svg viewBox="0 0 24 24" width="18" height="18"
        fill={filled ? "#ef4444" : "none"}
        stroke={filled ? "#ef4444" : "currentColor"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {particles.map(p => (
        <span
          key={p.id}
          className="heart-particle"
          style={{
            fontSize: `${p.size}px`,
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
          }}
          aria-hidden="true"
        >♥</span>
      ))}
    </button>
  );
}

function HomeProductCard({ product }) {
  const { toggleWishlist, wishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <article className="hpc" aria-label={product.name}>
      <div className="hpc__img-wrap">
        <Link to={`/product/${product.id}`} tabIndex={-1}>
          <img src={product.image} alt={product.name} className="hpc__img" loading="lazy" />
        </Link>
        <span className="hpc__badge">
          <FireIcon />
          Best Seller
        </span>
        <HeartIconBtn
          filled={isWishlisted}
          onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
          label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        />
        {!product.stock && <div className="hpc__oos">Out of Stock</div>}
      </div>
      <div className="hpc__info">
        <Link to={`/product/${product.id}`} className="hpc__name">{product.name}</Link>
      </div>
    </article>
  );
}

function NewArrivalCard({ product }) {
  const { toggleWishlist, wishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <article className="hpc" aria-label={product.name}>
      <div className="hpc__img-wrap">
        <Link to={`/product/${product.id}`} tabIndex={-1}>
          <img src={product.image} alt={product.name} className="hpc__img" loading="lazy" />
        </Link>
        <span className="hpc__badge hpc__badge--new">
          <SparkleIcon />
          New
        </span>
        <HeartIconBtn
          filled={isWishlisted}
          onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
          label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        />
        {!product.stock && <div className="hpc__oos">Out of Stock</div>}
      </div>
      <div className="hpc__info">
        <Link to={`/product/${product.id}`} className="hpc__name">{product.name}</Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  const bestSellers = BEST_SELLERS;
  const newArrivals = NEW_ARRIVALS;
  const navigate    = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.utils.toArray(".section-header").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      const bestSellerCards = gsap.utils.toArray(".home-products-grid:not(.home-products-grid--5) .hpc");
      bestSellerCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: -50, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, ease: "power2.out",
            delay: i * 0.09,
            scrollTrigger: { trigger: ".home-products-grid", start: "top 85%", once: true },
          }
        );
      });

      const newArrivalCards = gsap.utils.toArray(".home-products-grid--5 .hpc");
      newArrivalCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: -50, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.6, ease: "power2.out",
            delay: i * 0.09,
            scrollTrigger: { trigger: ".home-products-grid--5", start: "top 85%", once: true },
          }
        );
      });

      gsap.fromTo(".why-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ".why-grid", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(".cat-card-4",
        { opacity: 0, y: 60, rotateX: 15 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: ".cats-grid-4", start: "top 85%", once: true },
        }
      );

    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="page-enter" aria-label="Yogo Ventures Home">

      {/* 1. HERO */}
      <HeroSection />

      {/* 2. TOP CATEGORIES */}
      <CategoriesSection />

      {/* 3. BEST SELLING PRODUCTS */}
      <section className="section section--alt" aria-labelledby="bestsellers-heading">
        <div className="container">
          <header className="section-header reveal">
            <span className="section-tag">Best Sellers</span>
            <h2 className="section-title" id="bestsellers-heading">Best Selling Products</h2>
          </header>
          <div className="home-products-grid">
            {bestSellers.map((p) =>
              p ? <HomeProductCard key={p.id} product={p} /> : null
            )}
          </div>
          <div className="home-products__cta reveal">
            <Link
              to="/shop"
              className="btn btn--footer-theme btn-lg"
              style={{ textDecoration: "none" }}
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="section" aria-labelledby="new-arrivals-heading">
          <div className="container">
            <header className="section-header reveal">
              <span className="section-tag">New Arrivals</span>
              <h2 className="section-title" id="new-arrivals-heading">New Arrivals</h2>
              <p className="section-subtitle">
                Fresh additions — be the first to discover our latest products.
              </p>
            </header>
            <div className="home-products-grid home-products-grid--5">
              {newArrivals.map((p) =>
                p ? <NewArrivalCard key={p.id} product={p} /> : null
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5b. SOURCING CTA */}
      <section className="sourcing-cta-section" aria-labelledby="sourcing-heading">
        <div className="container">
          <div className="sourcing-cta-block reveal">
            <h2 className="sourcing-cta-block__title" id="sourcing-heading">
              Can&#39;t find the product you&#39;re looking for?
            </h2>
            <p className="sourcing-cta-block__body">
              No worries &#8212; we offer reliable sourcing services across India. We collaborate
              with trusted manufacturers in specialized production hubs to help you source the
              right products at competitive prices.
            </p>
            <p className="sourcing-cta-block__body">
              From product sourcing and sampling to supplier coordination and order management,
              we support you through every step to make your sourcing process smooth and efficient.
            </p>
            <Link to="/services" className="btn btn--footer-theme btn-lg" style={{ textDecoration: "none" }}>
              Explore Our Services &#8594;
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPACER — guaranteed gap between Sourcing CTA and Why section ── */}
      <div className="section-spacer" aria-hidden="true" />

      {/* 8. WHY YOGO VENTURES */}
      <WhyUsSection />

      {/* 9. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 10. FAQ */}
      <FAQSection />

      {/* 11. ENQUIRY FORM */}
      <EnquirySection />

    </main>
  );
}