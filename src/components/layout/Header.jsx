// src/components/layout/Header.jsx — Yogo Ventures
import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useHeaderScroll } from "../../hooks/useHeaderScroll";
import { NAV_LINKS } from "../../data/content";
import { VALID_PRODUCTS, PRODUCTS } from "../../data/products";
import "./Header.css";

/* ── SVG Icons ── */
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18"
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#ef4444" : "currentColor"}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5"/>
      <path d="m21 21-5-5"/>
      <circle cx="10.5" cy="10.5" r="2.5" fill="var(--terra)" stroke="none"/>
      <line x1="10.5" y1="6"    x2="10.5" y2="7.5"  stroke="var(--mid)" strokeWidth="1.5"/>
      <line x1="10.5" y1="13.5" x2="10.5" y2="15"   stroke="var(--mid)" strokeWidth="1.5"/>
      <line x1="6"    y1="10.5" x2="7.5"  y2="10.5" stroke="var(--mid)" strokeWidth="1.5"/>
      <line x1="13.5" y1="10.5" x2="15"   y2="10.5" stroke="var(--mid)" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── Sun Icon (light mode) ── */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5"/>
      <line x1="12" y1="2"   x2="12" y2="4.5"/>
      <line x1="12" y1="19.5" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="5.87" y2="5.87"/>
      <line x1="18.13" y1="18.13" x2="19.78" y2="19.78"/>
      <line x1="2"   y1="12" x2="4.5"  y2="12"/>
      <line x1="19.5" y1="12" x2="22"  y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.87" y2="18.13"/>
      <line x1="18.13" y1="5.87" x2="19.78" y2="4.22"/>
    </svg>
  );
}

/* ── Moon Icon (dark mode) ── */
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

/* ── Badge count formatter ──
   1–99      → exact count, normal badge
   100–9999  → "99+" with pulsing alert badge
   10000+    → exact count shown (large number mode)
── */
const formatBadgeCount = (count) => {
  if (count > 10000) return count.toLocaleString();
  if (count > 99)    return "99+";
  return count;
};

const getBadgeModifier = (count) => {
  if (count > 10000) return "header__cart-badge header__cart-badge--overflow";
  if (count > 100)   return "header__cart-badge header__cart-badge--alert";
  return "header__cart-badge";
};

/* ── Nav items — same icons as BottomNav ── */
const MENU_ITEMS = [
  {
    label: "Home", path: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    ),
  },
  {
    label: "Shop", path: "/shop",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    label: "Services", path: "/services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
        <path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07"/>
      </svg>
    ),
  },
  // {
  //   label: "Blog", path: "/blog",
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  //       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
  //       <path d="M4 4h16v12H4z"/>
  //       <path d="M8 20h8M12 16v4"/>
  //       <line x1="8" y1="8" x2="16" y2="8"/>
  //       <line x1="8" y1="12" x2="12" y2="12"/>
  //     </svg>
  //   ),
  // },
  // {
  //   // label: "About", path: "/about",
  //   icon: (
  //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
  //       strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
  //       <circle cx="12" cy="8" r="4"/>
  //       <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  //     </svg>
  //   ),
  // },
  {
    label: "Contact", path: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
];

/* ── Compute deduplicated wishlist count ──────────────────────────────────────
   Apparel variants in the same subCategory are wishlisted as a group (all IDs
   stored), but should count as ONE item in the badge — matching WishlistPage.
   For every other category each ID counts as 1.
   ──────────────────────────────────────────────────────────────────────────── */
function useWishlistCount(wishlist) {
  if (!wishlist || wishlist.length === 0) return 0;

  // Look up full product data for every wishlisted id
  const wishlistedProducts = (PRODUCTS || VALID_PRODUCTS || []).filter(
    p => wishlist.includes(p.id)
  );

  const seenApparelGroups = new Set();
  let count = 0;

  for (const p of wishlistedProducts) {
    if (p.category === "Apparel") {
      const groupKey = `apparel|${p.subCategory}`;
      if (!seenApparelGroups.has(groupKey)) {
        seenApparelGroups.add(groupKey);
        count += 1;
      }
      // subsequent variants in same subCategory → skip
    } else {
      count += 1;
    }
  }

  return count;
}

/* ── Deduplicate search results ───────────────────────────────────────────────
   For Apparel products, only keep the FIRST variant per subCategory so that
   "Polo Apparel" shows once (with its main image) instead of 5 colour cards.
   All other categories pass through unchanged.
   ──────────────────────────────────────────────────────────────────────────── */
function deduplicateSearchResults(results) {
  const seenApparelSubs = new Set();
  const deduped = [];

  for (const p of results) {
    if (p.category === "Apparel") {
      const key = p.subCategory; // "Polo" | "Round Neck" | "Hoodies"
      if (!seenApparelSubs.has(key)) {
        seenApparelSubs.add(key);
        deduped.push(p);
      }
      // skip subsequent colour variants of the same sub-type
    } else {
      deduped.push(p);
    }
  }

  return deduped;
}

export default function Header() {
  const { wishlist, cartCount, setCartOpen } = useApp();
  const scrolled  = useHeaderScroll(20);
  const location  = useLocation();
  const navigate  = useNavigate();

  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState("Apparel");
  const [menuOpen,    setMenuOpen]    = useState(false);

  /* ── Theme toggle state ── */
  const [isDark,   setIsDark]   = useState(() => {
    // Restore from localStorage on mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("yogo-theme") === "dark";
    }
    return false;
  });
  const [spinning, setSpinning] = useState(false);

  const inputRef      = useRef(null);

  /* ── FIX: deduplicated wishlist count (1 per apparel subCategory group) ── */
  const wishlistCount = useWishlistCount(wishlist);

  /* ── Apply theme to <html> on mount + whenever isDark changes ── */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("yogo-theme", isDark ? "dark" : "light");
  }, [isDark]);

  /* ── Theme toggle handler — rotates icon then swaps ── */
  const toggleTheme = () => {
    if (spinning) return;
    setSpinning(true);
    // Swap icon at the visual midpoint (250ms into a 500ms spin)
    setTimeout(() => setIsDark(v => !v), 250);
    setTimeout(() => setSpinning(false), 520);
  };

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* ── Close menu on route change ── */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* ── Search focus ── */
  useEffect(() => {
    if (searchOpen && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 80);
  }, [searchOpen]);

  /* ── ESC key ── */
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") { closeSearch(); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setActiveSearchTab("Apparel");
  };

  /* ── FIX: filter then deduplicate apparel variants ── */
  const searchResults = searchQuery.trim().length > 1
    ? deduplicateSearchResults(
        VALID_PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).slice(0, 8)
    : [];

  const SEARCH_TABS = [
    { id: "Apparel", label: "Apparel" },
    { id: "Memory Foam Products", label: "Memory Foam" },
    { id: "Copper Utensils", label: "Copper" },
    { id: "Handicraft Items", label: "Handicraft" },
  ];

  const SEARCH_TAB_SUGGESTIONS = {
    Apparel: ["Polo Apparel", "Round Neck Apparel", "Hoodie"],
    "Memory Foam Products": ["Car Neck Rest Pillow", "Contour Pillow", "Wedge Pillow"],
    "Copper Utensils": ["Copper Bottle", "Copper Cup", "Copper Thali Set"],
    "Handicraft Items": ["Blue Pottery Wall Plates", "Wooden Walking Stick", "Tote Bags"],
  };

  const POPULAR = [
    "Apparel",
    "Memory Foam Products",
    "Copper Utensils",
    "Handicraft Items",
  ];

  /* ── FIX: clicking an apparel result navigates to /shop?category=Apparel&sub=<subCategory>
     so the shop page can pre-filter to show all colour variants of that type.
     Non-apparel products go to their individual product page as before. ── */
  const handleResultClick = (p) => {
    if (p.category === "Apparel") {
      navigate(`/shop?category=Apparel&sub=${encodeURIComponent(p.subCategory)}`);
    } else {
      navigate(`/product/${p.id}`);
    }
    closeSearch();
  };

  const handleCatNav = (cat) => { navigate(`/shop?category=${encodeURIComponent(cat)}`); closeSearch(); };

  return (
    <>
      <header className={`header${scrolled ? " header--scrolled" : ""}`} role="banner">
        <div className="header__inner container">

          {/* ── HAMBURGER — left of logo, mobile only ──
          <button
            className={`header__hamburger${menuOpen ? " header__hamburger--open" : ""}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span className="header__hamburger-bar"/>
            <span className="header__hamburger-bar"/>
            <span className="header__hamburger-bar"/>
          </button> */}

          {/* ── LOGO ── */}
          <Link to="/" className="header__logo-wrap" aria-label="Yogo Ventures — go to homepage">
            <img src="./Logo.png" alt="Yogo Ventures Logo" className="header__logo-img"/>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="header__nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`header__nav-link${location.pathname === link.path ? " active" : ""}`}
                aria-current={location.pathname === link.path ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── ACTIONS ── */}
          <div className="header__actions">
            <button
              className="header__search-pill"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              <SearchIcon/>
              <span className="header__search-pill-text">Search…</span>
              <kbd className="header__search-kbd">⌘K</kbd>
            </button>

            {/* ── CART ── */}
            <button
              className="header__icon-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Cart — ${cartCount} items`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
                {/* Handle */}
                <path d="M2 3h2l1.5 9h11l1.5-6H6"/>
                {/* Basket bottom */}
                <path d="M5.5 12H17a1 1 0 0 1 1 1v1H5l.5-2z"/>
                {/* Wheels */}
                <circle cx="8" cy="19" r="1.5" fill="currentColor" stroke="none"/>
                <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
              {cartCount > 0 && (
                <span className={getBadgeModifier(cartCount)} aria-hidden="true">
                  {formatBadgeCount(cartCount)}
                </span>
              )}
              {/* Notification ring — only shown when count > 100 */}
              {cartCount > 100 && (
                <span className="header__cart-ring" aria-hidden="true"/>
              )}
            </button>

            {/* ── WISHLIST ── */}
            <Link
              to="/wishlist"
              className="header__icon-btn header__wishlist-btn"
              aria-label={`Wishlist — ${wishlistCount} items`}
            >
              <HeartIcon filled={wishlistCount > 0}/>
              {wishlistCount > 0 && (
                <span className="header__cart-badge header__wishlist-badge" aria-hidden="true">
                  {formatBadgeCount(wishlistCount)}
                </span>
              )}
            </Link>

            {/* ── THEME TOGGLE — sun / moon ── */}
            <button
              className={`header__icon-btn header__theme-btn${spinning ? " header__theme-btn--spinning" : ""}`}
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              <span className="header__theme-icon">
                {isDark ? <MoonIcon/> : <SunIcon/>}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          MOBILE MENU BACKDROP
          ══════════════════════════════════════ */}
      <div
        className={`hmenu-backdrop${menuOpen ? " hmenu-backdrop--visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════
          MOBILE SLIDE-IN MENU
          ══════════════════════════════════════ */}
      <div
        id="mobile-nav-menu"
        className={`hmenu${menuOpen ? " hmenu--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="hmenu__head">
          <img src="./Logo.png" alt="Yogo Ventures" className="hmenu__logo"/>
          <button
            className="hmenu__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className="hmenu__nav" aria-label="Mobile navigation">
          {MENU_ITEMS.map(({ label, path, icon }, i) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `hmenu__item${isActive ? " hmenu__item--active" : ""}`
              }
              style={{ "--i": i }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="hmenu__icon-wrap">
                <span className="hmenu__icon">{icon}</span>
                <span className="hmenu__glow"/>
              </span>
              <span className="hmenu__label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hmenu__footer">
          <a href="tel:+914423456789" className="hmenu__contact">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +91 44 2345 6789
          </a>
          <a href="mailto:hello@yogoventures.com" className="hmenu__contact">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            hello@yogoventures.com
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FULL-SCREEN SEARCH OVERLAY
          ══════════════════════════════════════ */}
      {searchOpen && (
        <div
          className="search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          onClick={e => e.target === e.currentTarget && closeSearch()}
        >
          <div className="search-modal">
            <div className="search-modal__bar">
              <div className="search-modal__icon-wrap" aria-hidden="true">
                <SearchIcon/>
              </div>
              <input
                ref={inputRef}
                className="search-modal__input"
                type="search"
                placeholder="Search handicrafts, copper utensils, apparel…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search input"
                autoComplete="off"
              />
              <button className="search-modal__close-btn" onClick={closeSearch} aria-label="Close search">
                <span>ESC</span>
              </button>
            </div>

            <div className="search-modal__body">
              {searchResults.length > 0 ? (
                <div className="search-results" role="listbox">
                  <p className="search-results__label">
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
                  </p>
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      className="search-result-item"
                      role="option"
                      tabIndex={0}
                      onClick={() => handleResultClick(p)}
                      onKeyDown={e => e.key === "Enter" && handleResultClick(p)}
                    >
                      <div className="search-result-item__img-wrap">
                        {/* ── FIX: always use p.image (the main product image string),
                            never p.images (the variants array) ── */}
                        <img
                          src={typeof p.image === "string" ? p.image : p.images[0]}
                          alt={p.name}
                          className="search-result-item__img"
                          loading="lazy"
                        />
                      </div>
                      <div className="search-result-item__info">
                        <p className="search-result-item__cat">{p.category}</p>
                        <p className="search-result-item__name">
                          {/* ── FIX: for apparel show the subCategory label
                              ("Polo", "Round Neck", "Hoodie") instead of
                              the raw name which includes the colour variant ── */}
                          {p.category === "Apparel" ? p.subCategory : p.name}
                        </p>
                      </div>
                      <div className="search-result-item__arrow" aria-hidden="true">→</div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length > 1 ? (
                <div className="search-empty">
                  <p className="search-empty__title">No results for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="search-empty__hint">Try different keywords or browse our categories.</p>
                </div>
              ) : (
                <>
                  <div className="search-tabs" role="tablist" aria-label="Search categories">
                    {SEARCH_TABS.map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`search-tab${activeSearchTab === tab.id ? " search-tab--active" : ""}`}
                        onClick={() => setActiveSearchTab(tab.id)}
                        aria-selected={activeSearchTab === tab.id}
                        role="tab"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="search-suggestions">
                    <p className="search-suggestions__label">
                      Recommended {activeSearchTab === "Apparel" ? "Apparel" : activeSearchTab}
                    </p>
                    <div className="search-suggestions__pills">
                      {SEARCH_TAB_SUGGESTIONS[activeSearchTab].map(s => (
                        <button key={s} className="search-pill" onClick={() => setSearchQuery(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}