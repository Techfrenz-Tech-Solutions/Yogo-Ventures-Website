// QuickViewModal — SVG heart, no emoji, proper z-index
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { renderStars } from "../../utils/helpers";
import "./QuickViewModal.css";

function HeartSVG({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18"
      fill={filled ? "var(--terra)" : "none"}
      stroke={filled ? "var(--terra)" : "currentColor"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [selectedSize,  setSelectedSize]  = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="qv-overlay" role="dialog" aria-modal="true"
      aria-labelledby="qv-modal-title"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="qv-modal">
        <div className="qv-modal__img-col">
          <img src={product.image} alt={product.name} className="qv-modal__img"/>
        </div>
        <div className="qv-modal__info-col">
          <h2 id="qv-modal-title" className="qv-modal__name">{product.name}</h2>
          <div className="qv-modal__rating">
            <span className="stars" aria-label={`Rated ${product.rating} out of 5`}>{renderStars(product.rating)}</span>
            <span className="qv-modal__review-count">({product.reviews} reviews)</span>
          </div>
          <p className="qv-modal__desc">
            {product.description ? product.description.slice(0, 175) + "…" : "Premium quality product from Yogo Ventures."}
          </p>
          {product.sizes?.length > 0 && (
            <div className="qv-modal__variants">
              <p className="qv-modal__variant-label">Size / Volume</p>
              <div className="qv-modal__variant-options">
                {product.sizes.map(s => (
                  <button key={s} className={`qv-modal__variant-btn${selectedSize === s ? " active" : ""}`}
                    onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {product.colors?.length > 0 && (
            <div className="qv-modal__variants">
              <p className="qv-modal__variant-label">Colour</p>
              <div className="qv-modal__variant-options">
                {product.colors.map(c => (
                  <button key={c} className={`qv-modal__swatch${selectedColor === c ? " active" : ""}`}
                    style={{ background: c }} onClick={() => setSelectedColor(c)}
                    aria-label={`Select colour ${c}`}/>
                ))}
              </div>
            </div>
          )}
          <p className={`qv-modal__stock ${product.stock ? "in" : "out"}`}>
            <span className="qv-modal__stock-dot" aria-hidden="true"/>
            {product.stock ? "In Stock — Ready to Ship" : "Currently Out of Stock"}
          </p>
          <div className="qv-modal__actions">
            {product.stock ? (
              <button className="btn btn-secondary btn-block"
                onClick={() => { addToCart(product, 1, { size: selectedSize, color: selectedColor }); onClose(); }}>
                Add to Cart
              </button>
            ) : (
              <button className="btn btn-ghost btn-block" disabled>Out of Stock</button>
            )}
            <button className={`qv-modal__wishlist-btn${isWishlisted ? " active" : ""}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
              <HeartSVG filled={isWishlisted}/>
            </button>
          </div>
          <Link to={`/product/${product.id}`} className="qv-modal__full-link" onClick={onClose}>
            View Full Details →
          </Link>
        </div>
        <button className="close-btn qv-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
