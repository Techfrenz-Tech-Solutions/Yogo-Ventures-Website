// CategoriesSection — SVG icons, no emojis
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import "./CategoriesSection.css";

// ✅ Import category images (IMPORTANT FIX)
import cat1 from "../../Assets/Categories/Category1.png";
import cat2 from "../../Assets/Categories/Category2.png";
import cat3 from "../../Assets/Categories/Category3.png";
import cat4 from "../../Assets/Categories/Category4.png";

// SVG icons for each category
const CraftIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const CopperIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
);

const ShirtIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
  </svg>
);

const FoamIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="7" width="20" height="10" rx="3"/>
    <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
    <path d="M6 17v2"/>
    <path d="M18 17v2"/>
  </svg>
);

// Picks a random duration in the 4–6s window once per card instance, so
// sibling cards don't all flip in lockstep even though they mount together.
const randomRotationMs = () => Math.round(4000 + Math.random() * 2000);

/**
 * Rotates through a category's own product photos (already-loaded data —
 * no extra API calls). With 0 or 1 matching products this renders exactly
 * what the card always rendered (the static category illustration, or that
 * single product's photo) and never starts a timer. With 2+ products it
 * crossfades between them on its own independent interval and unwinds the
 * interval on unmount.
 */
function CategoryCard({ to, accent, bg, icon, name, subtitle, fallbackImg, matchedProducts, count }) {
  const navigate = useNavigate();

  // Only products with an actual photo can be rotated through; a product
  // without an image is still counted, just not part of the visual rotation.
  const rotationProducts = useMemo(
    () => matchedProducts.filter(p => p.image),
    [matchedProducts]
  );

  const [rotationMs] = useState(randomRotationMs);
  const [index, setIndex] = useState(0);

  const isRotating = rotationProducts.length > 1;

  useEffect(() => {
    if (!isRotating) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % rotationProducts.length);
    }, rotationMs);
    return () => clearInterval(id);
  }, [isRotating, rotationProducts.length, rotationMs]);

  // Reset to the first slide if the underlying product list shrinks (e.g.
  // fewer than `index` products left) so we never point past the end.
  useEffect(() => {
    if (index >= rotationProducts.length) setIndex(0);
  }, [rotationProducts.length, index]);

  const activeProduct = rotationProducts[index];
  const displaySub = isRotating ? (activeProduct?.name || subtitle) : subtitle;

  return (
    <div
      className="cat-card-4"
      style={{ "--cat-accent": accent, "--cat-bg": bg }}
      role="button"
      tabIndex={0}
      onClick={() => navigate(to)}
    >
      {isRotating ? (
        rotationProducts.map((p, i) => (
          <div
            key={p.id}
            className={`cat-card-4__bg cat-card-4__bg--layer${i === index ? " cat-card-4__bg--active" : ""}`}
            style={{ backgroundImage: `url(${p.image})` }}
          />
        ))
      ) : (
        // 0 or 1 matching products — unchanged from the pre-rotation behaviour:
        // always the static category illustration, no animation.
        <div
          className="cat-card-4__bg"
          style={{ backgroundImage: `url(${fallbackImg})` }}
        />
      )}
      <div className="cat-card-4__overlay" />
      <div className="cat-card-4__body">
        <span className="cat-card-4__icon">{icon}</span>
        <h3 className="cat-card-4__name">{name}</h3>
        <p className="cat-card-4__sub">{displaySub}</p>
        <p className="cat-card-4__count">{count}+ products</p>
        <span className="cat-card-4__cta">Explore →</span>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const { products } = useProducts();

  // Backend category names are free text (admin-typed, no enforced casing),
  // so match loosely instead of requiring an exact literal string.
  const matchesCategory = (cat, needle) => (cat ?? "").toLowerCase().includes(needle);

  const tshirtProducts = products.filter(p => matchesCategory(p.category, "apparel"));
  const foamProducts   = products.filter(p => matchesCategory(p.category, "memory foam"));
  const copperProducts = products.filter(p => matchesCategory(p.category, "copper"));
  const craftProducts  = products.filter(p => matchesCategory(p.category, "handicraft"));

  return (
    <section className="cats-section section" aria-labelledby="categories-heading">
      <div className="container">
        <header className="section-header reveal">
          <span className="section-tag">Browse By</span>
          <h2 className="section-title" id="categories-heading">Top Categories</h2>
          <p className="section-subtitle">
            Discover our signature product lines — each handpicked for quality and authenticity.
          </p>
        </header>

        <nav className="cats-grid-4 reveal" aria-label="Product categories">

          <CategoryCard
            to="/shop?category=Apparel"
            accent="#335765"
            bg="#E8F4F6"
            icon={<ShirtIcon />}
            name="Apparel"
            subtitle="Fashion"
            fallbackImg={cat1}
            matchedProducts={tshirtProducts}
            count={tshirtProducts.length}
          />

          <CategoryCard
            to="/shop?category=Memory Foam Products"
            accent="#4A6B8A"
            bg="#EDF3F7"
            icon={<FoamIcon />}
            name="Memory Foam Products"
            subtitle="Sleep & Comfort"
            fallbackImg={cat2}
            matchedProducts={foamProducts}
            count={foamProducts.length}
          />

          <CategoryCard
            to="/shop?category=Copper Utensils"
            accent="#B87333"
            bg="#FEF6EC"
            icon={<CopperIcon />}
            name="Copper Utensils"
            subtitle="Ayurvedic Living"
            fallbackImg={cat3}
            matchedProducts={copperProducts}
            count={copperProducts.length}
          />

          <CategoryCard
            to="/shop?category=Handicraft Items"
            accent="#7F543D"
            bg="#F5EEE8"
            icon={<CraftIcon />}
            name="Handicraft Items"
            subtitle="Authentic Indian Crafts"
            fallbackImg={cat4}
            matchedProducts={craftProducts}
            count={craftProducts.length}
          />

        </nav>
      </div>
    </section>
  );
}
