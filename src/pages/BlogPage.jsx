// BlogPage — Yogo Ventures
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BLOG_POSTS } from "../data/content";
import { useApp } from "../context/AppContext";
import "./BlogPage.css";

// Filter out About Us and Decor posts
const DISPLAY_POSTS = BLOG_POSTS.filter(
  p => p.category !== "About Us" && p.category !== "Decor"
);

const ALL_CATS = ["All", ...new Set(DISPLAY_POSTS.map(p => p.category))];

const SHOP_CATS = [
  { cat: "Apparel",              img: "/Blog1.png",  color: "#335765", desc: "Organic cotton & premium fabrics" },
  { cat: "Memory Foam Products", img: "/Blog2.png",  color: "#4A6B8A", desc: "Ergonomic comfort & sleep solutions" },
  { cat: "Copper Utensils",      img: "/Blog3.png",  color: "#B87333", desc: "Ayurvedic copper for health & wellness" },
  { cat: "Handicraft Items",     img: "/Blog4.png",  color: "#7F543D", desc: "Authentic Indian crafts & GI-tagged products" },
];

/*
  Simple alternating pattern (repeats every 2):
  even index (0,2,4…) → --img-right  → content LEFT  | image RIGHT
  odd  index (1,3,5…) → --img-left   → image  LEFT   | content RIGHT
*/
function getCardClass(i) {
  return i % 2 === 0
    ? "blog-alt-card blog-alt-card--img-right"
    : "blog-alt-card blog-alt-card--img-left";
}

/* ── IntersectionObserver hook for card animations ── */
function useAltReveal(deps) {
  const refs = useRef([]);
  useEffect(() => {
    refs.current.forEach(el => el && el.classList.remove("alt-visible"));
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("alt-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    refs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, deps); // eslint-disable-line
  return refs;
}

/* ── IntersectionObserver hook for generic reveal elements ── */
function useScrollReveal(selector, deps) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    els.forEach(el => el.classList.remove("sr-visible"));
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sr-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, deps); // eslint-disable-line
}

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState("All");
  const navigate  = useNavigate();
  const { themeColor } = useApp();
  const altRefs   = useAltReveal([activeCat]);

  // Scroll-reveal for every .sr element
  useScrollReveal(".sr", [activeCat]);

  const filtered = activeCat === "All"
    ? DISPLAY_POSTS
    : DISPLAY_POSTS.filter(p => p.category === activeCat);

  return (
    <main className="page-enter blog-page">

      {/* ── HERO ── */}
      <section className="blog-hero section--dark">
        <div className="container">
          <span
            className="section-tag hero-tag"
            style={{ background: "rgba(182,217,224,0.2)", color: "var(--light)" }}
          >
            Stories &amp; Insights
          </span>
          <h1 className="blog-hero__title">YoGo Ventures Journal</h1>
          <p className="blog-hero__sub">
            Authentic craftsmanship, Ayurvedic living, and the art of conscious shopping — curated for you.
          </p>
        </div>
      </section>

      {/* ── SHOP CATEGORY CARDS ── */}
      <section className="section" aria-label="Shop by category">
        <div className="container">
          <header className="section-header sr sr-up">
            <span className="section-tag">Explore</span>
            <h2 className="section-title">Shop by Category</h2>
          </header>

          <div className="blog-cat-cards">
            {SHOP_CATS.map(({ cat, img, color, desc }, idx) => (
              <div
                key={cat}
                className={`blog-cat-card sr sr-up sr-d${idx + 1}`}
                onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                aria-label={`Shop ${cat}`}
              >
                <div className="blog-cat-card__img-wrap">
                  <img src={img} alt={cat} className="blog-cat-card__img" loading="lazy" />
                  <div className="blog-cat-card__overlay" />
                </div>
                <div className="blog-cat-card__body">
                  <p className="blog-cat-card__name">{cat}</p>
                  <p className="blog-cat-card__desc">{desc}</p>
                  <span className="blog-cat-card__link" style={{ color }}>Shop Now →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="blog-intro sr sr-up">
            <p className="blog-intro__text">
              At YoGo Ventures, every product tells a story — from the hands that crafted it to the home it enriches.
              Our journal brings you closer to the artisans, the traditions, and the science behind our collections.
              Explore in-depth articles on premium apparel, ergonomic memory foam, Ayurvedic copper wellness, and
              authentic Indian handicrafts — all curated to inspire conscious, quality-driven living.
            </p>
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="section section--alt" aria-label="Articles">
        <div className="container">

          {/* Filter tabs */}
          <div className="blog-filter-row sr sr-fade">
            <div className="blog-cats">
              {ALL_CATS.map(cat => (
                <button
                  key={cat}
                  className={`blog-cat-btn${activeCat === cat ? " active" : ""}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Article rows */}
          <div className="blog-alt-list">
            {filtered.map((post, i) => (
              <article
                key={post.id}
                ref={el => { altRefs.current[i] = el; }}
                className={getCardClass(i)}
                aria-label={post.title}
              >
                {/* Content — always on the "body" side */}
                <div className="blog-alt-card__body">
                  <span className="blog-alt-card__cat-label">{post.category}</span>
                  <h2 className="blog-alt-card__title">{post.title}</h2>
                  <p className="blog-alt-card__excerpt">{post.excerpt}</p>
                  <div className="blog-alt-card__meta">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime} read</span>
                  </div>
                  <button
                    className="blog-read-btn"
                    style={{ background: themeColor }}
                    onClick={() => navigate(`/blog/${post.id}`)}
                    aria-label={`Read article: ${post.title}`}
                  >
                    Read Article →
                  </button>
                </div>

                {/* Image */}
                <div className="blog-alt-card__img-wrap">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blog-alt-card__img"
                    loading="lazy"
                  />
                  <span className="blog-alt-card__cat-badge">{post.category}</span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}