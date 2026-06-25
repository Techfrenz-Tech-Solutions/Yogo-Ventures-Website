// ProductCard — SVG heart icon, no emoji
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { renderStars } from "../../utils/helpers";
import "./ProductCard.css";

function HeartSVG({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16"
      fill={filled ? "var(--terra)" : "none"}
      stroke={filled ? "var(--terra)" : "currentColor"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const tagClass = product.tag === "New" ? "badge badge-new"
    : product.tag === "Premium" ? "badge badge-premium"
    : product.tag ? "badge badge-seller" : null;

  return (
    <article className="product-card" aria-label={`${product.name} by ${product.brand}`}>
      <div className="product-card__img-wrap">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`} tabIndex={-1}>
          <img src={product.image} alt={`${product.name} — ${product.brand}`}
            className="product-card__img" loading="lazy"/>
        </Link>
        {tagClass && (
          <span className={tagClass}>
            {product.tag === "Best Seller" ? "🔥" : ""}
            {product.tag}
          </span>
        )}
        <button
          className={`product-card__wishlist-btn${isWishlisted ? " active" : ""}`}
          onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
        >
          <HeartSVG filled={isWishlisted} />
        </button>
        {!product.stock && <div className="product-card__oos">Out of Stock</div>}
        <button className="product-card__quickview"
          onClick={() => onQuickView && onQuickView(product)}
          aria-label={`Quick view ${product.name}`}>
          Quick View
        </button>
      </div>
      <div className="product-card__info">
        <Link to={`/product/${product.id}`} className="product-card__name">{product.name}</Link>
        <div className="product-card__rating" aria-label={`Rated ${product.rating} out of 5`}>
          <span className="stars product-card__stars" aria-hidden="true">{renderStars(product.rating)}</span>
          <span className="product-card__review-count">(3)</span>
        </div>
      </div>
    </article>
  );
}
