// src/pages/ShopPage.jsx — Subcategory dropdowns for Apparel & Handicrafts
import React, { useState, useEffect, useMemo, useCallback, useRef, useTransition } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { VALID_PRODUCTS, CATEGORIES } from "../data/products";
import { useApp } from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./ShopPage.css";

// ── Apparel card image overrides ─────────────────────────────────────────────
const APPAREL_CARD_IMAGES = {
  "Polo":       "./Polo1.png",
  "Round Neck": "./Round1.png",
  "Hoodies":    "./Hoodie1.png",
};

// ── Subcategory definitions ──────────────────────────────────────────────────
const SUBCATEGORY_MAP = [
  {
    match: (cat) => cat.toLowerCase().includes("handicraft"),
    subs:  ["Blue Pottery", "Handmade Cotton Bags", "Wooden Handicrafts"],
  },
];

function getSubsFor(catName) {
  const entry = SUBCATEGORY_MAP.find(e => e.match(catName));
  return entry ? entry.subs : null;
}

function isTShirtCategory(catName) {
  return (
    catName.toLowerCase().includes("apparel") ||
    catName.toLowerCase().includes("t-shirt") ||
    catName.toLowerCase().includes("tshirt")
  );
}

const norm = (s) => (s ?? "").trim().toLowerCase();

const displayCategoryLabel = (cat) => cat === "Apparel" ? "Apparels" : cat;

const subCatMatch = (productSubCat, filterSubCat) => {
  const a = norm(productSubCat);
  const b = norm(filterSubCat);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
};

const isFeaturedApparel = (product) => product.category === "Apparel" && (
  (product.subCategory === "Polo"       && product.colorName === "Black")        ||
  (product.subCategory === "Round Neck" && product.colorName === "Melange Grey") ||
  (product.subCategory === "Hoodies"    && product.colorHex  === "#dfd6c1")
);

const actualProductCount = (catName) => {
  if (catName === "All") {
    return VALID_PRODUCTS.filter(p => p.category !== "Apparel" || isFeaturedApparel(p)).length;
  }
  if (catName === "Apparel") {
    return 3;
  }
  return VALID_PRODUCTS.filter(p => p.category === catName).length;
};

// ── HeartIconBtn ─────────────────────────────────────────────────────────────
function HeartIconBtn({ filled, onClick, label }) {
  const [particles, setParticles] = React.useState([]);
  const handleClick = (e) => {
    onClick(e);
    const burst = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 2 * Math.PI;
      const dist  = 20 + Math.random() * 12;
      return { id: Date.now() + i, tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, size: 7 + Math.random() * 5 };
    });
    setParticles(burst);
    setTimeout(() => setParticles([]), 700);
  };
  return (
    <button
      className={`sp-card__wishlist${filled ? " active" : ""}`}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={filled}
    >
      <svg viewBox="0 0 24 24" width="16" height="16"
        fill={filled ? "#ef4444" : "none"}
        stroke={filled ? "#ef4444" : "currentColor"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {particles.map(p => (
        <span key={p.id} className="heart-particle" style={{ fontSize: `${p.size}px`, "--tx": `${p.tx}px`, "--ty": `${p.ty}px` }} aria-hidden="true">&#9829;</span>
      ))}
    </button>
  );
}

// ── ShopProductCard ──────────────────────────────────────────────────────────
// FIX: For Apparel products, wishlist state and toggle now mirror ProductDetailPage's
// group behaviour — all variant IDs sharing the same subCategory are toggled/checked
// together, so hearts stay in sync between ShopPage and ProductDetailPage.
function ShopProductCard({ product }) {
  const { toggleWishlist, wishlist } = useApp();

  // Build the group of all variant IDs for the same Apparel subCategory.
  // For non-Apparel products this is null and the original single-ID logic applies.
  const apparelGroupIds = React.useMemo(() => {
    if (product.category !== "Apparel") return null;
    return VALID_PRODUCTS
      .filter(p => p.subCategory === product.subCategory)
      .map(p => p.id);
  }, [product.category, product.subCategory]);

  // isWishlisted: true if ANY variant in the group is in the wishlist (mirrors PDP).
  const isWishlisted = apparelGroupIds
    ? apparelGroupIds.some(id => wishlist.includes(id))
    : wishlist.includes(product.id);

  // Toggle: add/remove ALL variant IDs together (mirrors PDP handleToggleWishlist).
  const handleWishlistToggle = useCallback((e) => {
    e.preventDefault();
    if (apparelGroupIds) {
      apparelGroupIds.forEach(id => toggleWishlist(id));
    } else {
      toggleWishlist(product.id);
    }
  }, [apparelGroupIds, toggleWishlist, product.id]);

  // For the three featured Apparel cards, use the /public path image.
  const displayImage =
    product.category === "Apparel" && APPAREL_CARD_IMAGES[product.subCategory]
      ? APPAREL_CARD_IMAGES[product.subCategory]
      : product.image;

  return (
    <article className="sp-card" aria-label={product.name}>
      <div className="sp-card__img-wrap">
        <Link to={`/product/${product.id}`} tabIndex={-1}>
          <img
            src={displayImage}
            alt={product.name}
            className="sp-card__img"
            loading="lazy"
          />
        </Link>
        <HeartIconBtn
          filled={isWishlisted}
          onClick={handleWishlistToggle}
          label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        />
        {!product.stock && <div className="sp-card__oos">Out of Stock</div>}
      </div>
      <div className="sp-card__info">
        <Link to={`/product/${product.id}`} className="sp-card__name">{product.name}</Link>
      </div>
    </article>
  );
}

// ── PlaceholderCard ───────────────────────────────────────────────────────────
function PlaceholderCard() {
  return (
    <article className="sp-card sp-card--placeholder" aria-hidden="true">
      <div className="sp-card__img-wrap sp-card__img-wrap--placeholder">
        <div className="sp-card__placeholder-img" />
      </div>
      <div className="sp-card__info">
        <span className="sp-card__name sp-card__name--placeholder">Coming Soon</span>
      </div>
    </article>
  );
}

// ── ChevronIcon ───────────────────────────────────────────────────────────────
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── ShopPage ──────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [searchParams]                    = useSearchParams();

  // ── Filter state ──────────────────────────────────────────────────────────
  const [category,      setCategory]      = useState(searchParams.get("category") || "All");
  const [subCategory,   setSubCategory]   = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [sortBy,        setSortBy]        = useState("default");

  const [searchInput,   setSearchInput]   = useState("");
  const [searchQ,       setSearchQ]       = useState("");
  const searchDebounceRef = useRef(null);

  const [catSearchQ,    setCatSearchQ]    = useState("");

  const productSectionRef = useRef(null);

  const [, startTransition] = useTransition();

  useScrollReveal([]);

  // ── URL param sync ────────────────────────────────────────────────────────
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      const matched = CATEGORIES.find(
        c => c.toLowerCase() === cat.toLowerCase()
      ) || cat;

      startTransition(() => {
        setCategory(matched);
        setSubCategory(null);

        const hasSubs = Boolean(getSubsFor(matched));
        if (hasSubs) {
          setOpenDropdowns(prev => ({ ...prev, [matched]: true }));
        }
      });

      setTimeout(() => {
        productSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [searchParams]);

  // ── Debounced product search ──────────────────────────────────────────────
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      startTransition(() => setSearchQ(val));
    }, 200);
  }, []);

  // ── Category / sub-category handlers ─────────────────────────────────────
  const handleCategoryChange = useCallback((c) => {
    setCategory(c);
    setSubCategory(null);
  }, []);

  const toggleDropdown = useCallback((catName) => {
    setOpenDropdowns(prev => ({ ...prev, [catName]: !prev[catName] }));
  }, []);

  const handleSubCategoryChange = useCallback((parentCat, sub) => {
    setCategory(parentCat);
    setSubCategory(sub);
  }, []);

  const clearFilters = useCallback(() => {
    clearTimeout(searchDebounceRef.current);
    setSearchInput("");
    startTransition(() => {
      setCategory("All");
      setSubCategory(null);
      setSearchQ("");
      setCatSearchQ("");
      setOpenDropdowns({});
      setSortBy("default");
    });
  }, []);

  // ── Filtered category list for sidebar ───────────────────────────────────
  const { filteredCategories, autoOpenFromSubSearch } = useMemo(() => {
    if (!catSearchQ.trim()) {
      return { filteredCategories: CATEGORIES, autoOpenFromSubSearch: {} };
    }
    const q = catSearchQ.trim().toLowerCase();
    const autoOpen = {};
    const result = CATEGORIES.filter(c => {
      if (c.toLowerCase().includes(q)) return true;
      const subs = getSubsFor(c);
      if (subs && subs.some(s => s.toLowerCase().includes(q))) {
        autoOpen[c] = true;
        return true;
      }
      return false;
    });
    return { filteredCategories: result, autoOpenFromSubSearch: autoOpen };
  }, [catSearchQ]);

  const effectiveOpenDropdowns = useMemo(
    () => ({ ...openDropdowns, ...autoOpenFromSubSearch }),
    [openDropdowns, autoOpenFromSubSearch]
  );

  const getVisibleSubs = useCallback((catName, allSubs) => {
    if (!catSearchQ.trim()) return allSubs;
    const q = catSearchQ.trim().toLowerCase();
    if (catName.toLowerCase().includes(q)) return allSubs;
    return allSubs.filter(s => s.toLowerCase().includes(q));
  }, [catSearchQ]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredOnly = useMemo(() => {
    return VALID_PRODUCTS.filter(p => {
      if (category !== "All" && p.category !== category) return false;
      if (p.category === "Apparel" && !isFeaturedApparel(p)) return false;
      if (subCategory && !subCatMatch(p.subCategory, subCategory)) return false;
      if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
      return true;
    });
  }, [category, subCategory, searchQ]);

  const filtered = useMemo(() => {
    const arr = [...filteredOnly];
    switch (sortBy) {
      case "name-asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      case "name-desc":
        return arr.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: "base" }));
      default:
        return arr;
    }
  }, [filteredOnly, sortBy]);

  const isHoodies = norm(subCategory) === "hoodies";
  const HOODIE_MIN = 8;
  const placeholderCount = isHoodies && filtered.length < HOODIE_MIN
    ? HOODIE_MIN - filtered.length
    : 0;

  const showTShirtNote = category !== "All" && isTShirtCategory(category);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="page-enter shop-page" aria-label="Shop — Yogo Ventures">

      {/* HERO */}
      <div className="shop-page__hero">
        <div className="container">
          <h1 className="shop-page__hero-title">Shop — YoGo Ventures</h1>
          <p className="shop-page__hero-sub">
            Premium Apparels, Memory Foam Products, Copper Utensils And Authentic Indian handicrafts.
          </p>
          <nav className="shop-cat-pills" aria-label="Quick category filter">
            <button
              className={`shop-cat-pill${category === "All" ? " active" : ""}`}
              onClick={() => handleCategoryChange("All")}>
              All
            </button>
            {CATEGORIES.filter(c => c !== "All").map(c => (
              <button key={c}
                className={`shop-cat-pill${category === c ? " active" : ""}`}
                onClick={() => handleCategoryChange(c)}>
                {displayCategoryLabel(c)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container" ref={productSectionRef}>
        <div className="shop-page__layout">

          {/* ── SIDEBAR ── */}
          <aside className="shop-sidebar" aria-label="Product filters">
            <div className="shop-sidebar__inner">
              <div className="shop-sidebar__heading-row">
                <h2 className="shop-sidebar__heading">Filters</h2>
                <button className="shop-sidebar__clear" onClick={clearFilters}>Clear all</button>
              </div>

              {/* Product Search */}
              <div className="filter-group">
                <label className="filter-group__label" htmlFor="shop-search">Search</label>
                <input
                  id="shop-search"
                  className="form-input"
                  type="search"
                  placeholder="Search products…"
                  value={searchInput}
                  onChange={handleSearchChange}
                  aria-label="Search products"
                />
              </div>

              {/* Category + subcategory radios */}
              <fieldset className="filter-group">
                <legend className="filter-group__label">Category</legend>

                {/* ── Category search bar ── */}
                <div className="filter-cat-search-wrap">
                  <svg className="filter-cat-search-icon" viewBox="0 0 20 20" width="13" height="13"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="8.5" cy="8.5" r="5.5"/>
                    <line x1="13" y1="13" x2="17" y2="17"/>
                  </svg>
                  <input
                    className="filter-cat-search"
                    type="search"
                    placeholder="Search categories…"
                    value={catSearchQ}
                    onChange={e => setCatSearchQ(e.target.value)}
                    aria-label="Search categories"
                  />
                </div>

                {filteredCategories.length === 0 ? (
                  <p className="filter-cat-empty">No categories found.</p>
                ) : (
                  filteredCategories.map(c => {
                    const subs    = getSubsFor(c);
                    const hasSubs = Boolean(subs);
                    const isOpen  = Boolean(effectiveOpenDropdowns[c]);
                    const visibleSubs = hasSubs ? getVisibleSubs(c, subs) : null;

                    return (
                      <div key={c} className="filter-cat-row-wrap">
                        <div className="filter-cat-row">
                          <label className="filter-option filter-option--cat">
                            <input
                              type="radio"
                              name="category"
                              value={c}
                              checked={category === c && !subCategory}
                              onChange={() => handleCategoryChange(c)}
                            />
                            <span className="filter-option__label">
                              {displayCategoryLabel(c)}
                              <span className="filter-option__count">
                                ({actualProductCount(c)})
                              </span>
                            </span>
                          </label>

                          {hasSubs && (
                            <button
                              type="button"
                              className={`filter-cat-chevron${isOpen ? " open" : ""}`}
                              onClick={() => toggleDropdown(c)}
                              aria-label={`${isOpen ? "Collapse" : "Expand"} ${c} subcategories`}
                              aria-expanded={isOpen}
                            >
                              <ChevronIcon />
                            </button>
                          )}
                        </div>

                        {hasSubs && isOpen && visibleSubs && visibleSubs.length > 0 && (
                          <div className="filter-subcat-options">
                            {visibleSubs.map(sub => (
                              <label key={sub} className="filter-option filter-option--subcat">
                                <input
                                  type="radio"
                                  name="subCategory"
                                  value={sub}
                                  checked={Boolean(subCategory) && subCatMatch(subCategory, sub)}
                                  onChange={() => handleSubCategoryChange(c, sub)}
                                />
                                <span className="filter-option__label">{sub}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </fieldset>

            </div>
          </aside>

          {/* ── PRODUCT AREA ── */}
          <section aria-label="Products">

            {/* Sort bar */}
            <div className="shop-sort-bar">
              <p className="shop-sort-bar__results">
                Showing <strong>{filtered.length}</strong> products
                {subCategory && (
                  <span className="shop-sort-bar__subcat-tag"> — {subCategory}</span>
                )}
              </p>
              <label className="shop-sort-bar__sort-label" htmlFor="sort-select">
                Sort:
                <select
                  id="sort-select"
                  className="shop-sort-bar__select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="default">Featured</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </label>
            </div>

            {/* T-shirt note */}
            {showTShirtNote && (
              <div className="shop-tshirt-note" role="note" aria-label="Apparel customisation note">
                <svg
                  className="shop-tshirt-note__icon"
                  viewBox="0 0 24 24" width="18" height="18"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="shop-tshirt-note__text">
                  Colors shown are for reference — we provide complete flexibility
                  across color selection, fabric composition, patterns, and designs, tailored to reflect your
                  requirements.
                </p>
              </div>
            )}

            {/* Product grid */}
            {filtered.length > 0 || placeholderCount > 0 ? (
              <div className="sp-products-grid">
                {filtered.map(p => (
                  <div key={p.id} className="reveal">
                    <ShopProductCard product={p} />
                  </div>
                ))}
                {Array.from({ length: placeholderCount }).map((_, i) => (
                  <div key={`placeholder-${i}`} className="reveal">
                    <PlaceholderCard />
                  </div>
                ))}
              </div>
            ) : (
              <div className="shop-empty">
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none"
                  stroke="var(--border)" strokeWidth="1.5"
                  style={{ display: "block", margin: "0 auto 16px" }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                <h3 className="shop-empty__title">No products found</h3>
                <p className="shop-empty__text">Try adjusting your filters.</p>
                <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </section>

        </div>
      </div>

    </main>
  );
}