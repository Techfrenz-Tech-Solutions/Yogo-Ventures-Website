// src/pages/WishlistPage.jsx — resolves wishlisted ids against real backend products
import React from "react";
import { useProducts } from "../hooks/useProducts";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSEO } from "../hooks/useSEO";
import "./ShopPage.css";
import "./WishlistPage.css";

/* ─────────────────────────────────────────────────────────────────
   Heart button — removes the item from the wishlist. Burst animation
   fires on every click.
   ──────────────────────────────────────────────────────────────── */
function WishlistHeartBtn({ productId, onToggle }) {
  const [particles, setParticles] = React.useState([]);
  const [removing,  setRemoving]  = React.useState(false);

  const handleClick = () => {
    if (removing) return;

    const burst = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 2 * Math.PI;
      const dist = 20 + Math.random() * 12;
      return {
        id:   Date.now() + i,
        tx:   Math.cos(angle) * dist,
        ty:   Math.sin(angle) * dist,
        size: 7 + Math.random() * 5,
      };
    });
    setParticles(burst);
    setRemoving(true);

    setTimeout(() => {
      onToggle(productId);
      setParticles([]);
      setRemoving(false);
    }, 420);
  };

  return (
    <button
      className="sp-card__wishlist active"
      onClick={handleClick}
      aria-label="Remove from wishlist"
      style={{ overflow: "visible" }}
    >
      <svg
        viewBox="0 0 24 24" width="16" height="16"
        fill="#ef4444" stroke="#ef4444"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          transform: removing ? "scale(1.35)" : "scale(1)",
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {particles.map(p => (
        <span
          key={p.id}
          className="heart-particle"
          style={{ fontSize: `${p.size}px`, "--tx": `${p.tx}px`, "--ty": `${p.ty}px` }}
          aria-hidden="true"
        >♥</span>
      ))}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────── */
export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useApp();
  const { products, loading } = useProducts();
  useScrollReveal([wishlist.length]);

  useSEO({
    title: "My Wishlist — Saved Products | Yogo Ventures",
    description: "View your saved products on Yogo Ventures. Browse and request wholesale quotations for your wishlisted fashion apparel, copper utensils, memory foam products and handicrafts.",
    canonical: "https://www.yogoventures.com/wishlist",
    robots: "noindex, nofollow",
    keywords: "wishlist, saved products, Yogo Ventures, wholesale products India",
  });

  const displayProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <main className="page-enter wishlist-page" aria-label="Wishlist">

      {/* ── HERO ── */}
      <section className="page-hero section--dark wishlist-hero">
        <div className="container">
          <span
            className="section-tag"
            style={{ background: "rgba(182,217,224,0.2)", color: "var(--light)" }}
          >
            My Collection
          </span>
          <h1 className="page-hero__title">My Wishlist</h1>
          <p className="page-hero__sub">
            {displayProducts.length === 0
              ? "You haven't saved any items yet."
              : `${displayProducts.length} saved ${displayProducts.length === 1 ? "item" : "items"}`}
          </p>
        </div>
      </section>

      {/* ── CARDS ── */}
      <div className="wishlist-body">
        <div className="container wishlist-container">
          {loading ? (
            <p style={{ textAlign: "center", padding: "40px 0" }}>Loading…</p>
          ) : displayProducts.length > 0 ? (
            <div className="sp-products-grid">
              {displayProducts.map(p => (
                <article key={p.id} className="sp-card reveal">
                  <div className="sp-card__img-wrap">
                    <Link to={`/product/${p.id}`} tabIndex={-1}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="sp-card__img"
                        loading="lazy"
                      />
                    </Link>
                    <WishlistHeartBtn productId={p.id} onToggle={toggleWishlist} />
                    {!p.stock && <div className="sp-card__oos">Out of Stock</div>}
                  </div>
                  <div className="sp-card__info">
                    <Link to={`/product/${p.id}`} className="sp-card__name">
                      {p.name}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="wishlist-empty">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--border)" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h2>Your wishlist is empty</h2>
              <p>Tap the heart icon on any product to save it here for later.</p>
              <Link to="/shop" className="btn btn-secondary">Discover Products</Link>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
