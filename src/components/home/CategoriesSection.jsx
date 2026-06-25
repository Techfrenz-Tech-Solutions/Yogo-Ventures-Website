// CategoriesSection — SVG icons, no emojis
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
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

export function CategoriesSection() {
  const navigate = useNavigate();

  const tshirtCount = PRODUCTS.filter(p => p.category === "Apparel").length;
  const foamCount = PRODUCTS.filter(p => p.category === "Memory Foam Products").length;
  const copperCount = PRODUCTS.filter(p => p.category === "Copper Utensils").length;
  const craftCount = PRODUCTS.filter(p => p.category === "Handicraft Items").length;

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

          {/* T-SHIRTS */}
          <div
            className="cat-card-4"
            style={{ "--cat-accent": "#335765", "--cat-bg": "#E8F4F6" }}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/shop?category=Apparel`)}
          >
            <div
              className="cat-card-4__bg"
              style={{ backgroundImage: `url(${cat1})` }}
            />
            <div className="cat-card-4__overlay" />
            <div className="cat-card-4__body">
              <span className="cat-card-4__icon"><ShirtIcon /></span>
              <h3 className="cat-card-4__name">Apparel</h3>
              <p className="cat-card-4__sub">Fashion</p>
              <p className="cat-card-4__count">2+ products</p>
              <span className="cat-card-4__cta">Explore →</span>
            </div>
          </div>

          {/* MEMORY FOAM */}
          <div
            className="cat-card-4"
            style={{ "--cat-accent": "#4A6B8A", "--cat-bg": "#EDF3F7" }}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/shop?category=Memory Foam Products`)}
          >
            <div
              className="cat-card-4__bg"
              style={{ backgroundImage: `url(${cat2})` }}
            />
            <div className="cat-card-4__overlay" />
            <div className="cat-card-4__body">
              <span className="cat-card-4__icon"><FoamIcon /></span>
              <h3 className="cat-card-4__name">Memory Foam Products</h3>
              <p className="cat-card-4__sub">Sleep & Comfort</p>
              <p className="cat-card-4__count">{foamCount}+ products</p>
              <span className="cat-card-4__cta">Explore →</span>
            </div>
          </div>

          {/* COPPER */}
          <div
            className="cat-card-4"
            style={{ "--cat-accent": "#B87333", "--cat-bg": "#FEF6EC" }}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/shop?category=Copper Utensils`)}
          >
            <div
              className="cat-card-4__bg"
              style={{ backgroundImage: `url(${cat3})` }}
            />
            <div className="cat-card-4__overlay" />
            <div className="cat-card-4__body">
              <span className="cat-card-4__icon"><CopperIcon /></span>
              <h3 className="cat-card-4__name">Copper Utensils</h3>
              <p className="cat-card-4__sub">Ayurvedic Living</p>
              <p className="cat-card-4__count">{copperCount}+ products</p>
              <span className="cat-card-4__cta">Explore →</span>
            </div>
          </div>

          {/* HANDICRAFT */}
          <div
            className="cat-card-4"
            style={{ "--cat-accent": "#7F543D", "--cat-bg": "#F5EEE8" }}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/shop?category=Handicraft Items`)}
          >
            <div
              className="cat-card-4__bg"
              style={{ backgroundImage: `url(${cat4})` }}
            />
            <div className="cat-card-4__overlay" />
            <div className="cat-card-4__body">
              <span className="cat-card-4__icon"><CraftIcon /></span>
              <h3 className="cat-card-4__name">Handicraft Items</h3>
              <p className="cat-card-4__sub">Authentic Indian Crafts</p>
              <p className="cat-card-4__count">{craftCount}+ products</p>
              <span className="cat-card-4__cta">Explore →</span>
            </div>
          </div>

        </nav>
      </div>
    </section>
  );
}