// CategoriesSection — SVG icons, no emojis
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import Api from "../../utils/Api";
import "./CategoriesSection.css";

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

// category_master carries no icon/color of its own — this is a purely
// decorative palette cycled by position so DB-driven tiles still look
// visually distinct. It does not gate which categories render.
const THEMES = [
  { icon: <ShirtIcon />,  accent: "#335765", bg: "#E8F4F6" },
  { icon: <FoamIcon />,   accent: "#4A6B8A", bg: "#EDF3F7" },
  { icon: <CopperIcon />, accent: "#B87333", bg: "#FEF6EC" },
  { icon: <CraftIcon />,  accent: "#7F543D", bg: "#F5EEE8" },
];

// Picks a random duration in the 4–6s window once per card instance, so
// sibling cards don't all flip in lockstep even though they mount together.
const randomRotationMs = () => Math.round(4000 + Math.random() * 2000);

/**
 * Rotates through a category's own product photos (already-loaded data —
 * no extra API calls). With 0 matching products no image layer renders at
 * all — just the card's flat accent background. With exactly 1 it renders
 * that product's photo, static, and never starts a timer. With 2+ products
 * it crossfades between them on its own independent interval and unwinds
 * the interval on unmount.
 */
function CategoryCard({ to, accent, bg, icon, name, matchedProducts, count }) {
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

  return (
    <div
      className="cat-card-4"
      style={{ "--cat-accent": accent, "--cat-bg": bg }}
      role="button"
      tabIndex={0}
      onClick={() => navigate(to)}
    >
      {rotationProducts.map((p, i) => (
        <div
          key={p.id}
          className={`cat-card-4__bg cat-card-4__bg--layer${i === index ? " cat-card-4__bg--active" : ""}`}
          style={{ backgroundImage: `url(${p.image})` }}
        />
      ))}
      <div className="cat-card-4__overlay" />
      <div className="cat-card-4__body">
        <span className="cat-card-4__icon">{icon}</span>
        <h3 className="cat-card-4__name">{name}</h3>
        {isRotating && activeProduct?.name && (
          <p className="cat-card-4__sub">{activeProduct.name}</p>
        )}
        <p className="cat-card-4__count">{count}+ products</p>
        <span className="cat-card-4__cta">Explore →</span>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  const { products } = useProducts();
  const [categories, setCategories] = useState([]);

  // Categories come from the backend only — no static fallback list.
  useEffect(() => {
    let cancelled = false;
    Api.get('/category/categorydropdown')
      .then(res => {
        if (cancelled) return;
        const rows = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setCategories(rows);
      })
      .catch(() => { if (!cancelled) setCategories([]); });
    return () => { cancelled = true; };
  }, []);

  const matchesCategory = (cat, name) => (cat ?? "").toLowerCase() === name.toLowerCase();

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

        {categories.length > 0 && (
        <nav className="cats-grid-4 reveal" aria-label="Product categories">
          {categories.map((cat, i) => {
            const theme = THEMES[i % THEMES.length];
            const matchedProducts = products.filter(p => matchesCategory(p.category, cat.category_name));
            return (
              <CategoryCard
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.category_name)}`}
                accent={theme.accent}
                bg={theme.bg}
                icon={theme.icon}
                name={cat.category_name}
                matchedProducts={matchedProducts}
                count={matchedProducts.length}
              />
            );
          })}
        </nav>
        )}
      </div>
    </section>
  );
}
