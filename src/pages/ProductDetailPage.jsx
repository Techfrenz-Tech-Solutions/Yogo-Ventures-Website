// ProductDetailPage — real backend product data only.
// Each product is a single row (no color/size variants in the backend), so
// this shows: an image gallery built from the product's own uploaded images,
// name, description, quantity + "Get Quote" (enquiry cart), wishlist, and
// "You may also like" sourced from other real products in the same category.

import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useApp } from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./ProductDetailPage.css";
import "./ColorCustomization.css";

// ── Local image imports for the B2B capabilities section (Apparel only) ──
import cottonJerseyImg   from "../Assets/Fabrics/Cottonjersey.png";
import cvcImg            from "../Assets/Fabrics/CVCblend.png";
import frenchTerryImg    from "../Assets/Fabrics/Frenchterry.png";
import dryFitImg         from "../Assets/Fabrics/Dryfit.png";
import modalImg          from "../Assets/Fabrics/Modal.png";
import piqueImg          from "../Assets/Fabrics/Pique.png";
import screenPrintImg    from "../Assets/Fabrics/Screenprinting.jpg";
import dtfPrintImg       from "../Assets/Fabrics/DTF.jpg";
import embroideryImg     from "../Assets/Fabrics/Embroidery.jpg";
import puffPrintImg      from "../Assets/Fabrics/Puff.jpg";
import vintageWashImg    from "../Assets/Fabrics/Vintage.jpg";
import sublimationImg    from "../Assets/Fabrics/Sublimation.jpg";

const ZOOM_FACTOR = 3;

/* ─────────────────────────────────────────────────────────────────
   B2B CONTENT — generic capability marketing, shown for Apparel products
   ──────────────────────────────────────────────────────────────── */
const LockSVG = () => (
  <svg style={{ width: 13, height: 13, flexShrink: 0 }} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="10" height="7" rx="1.5" />
    <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" />
  </svg>
);

const fabrics = [
  { badge: "yogo-badge-hot", badgeText: "#1 Worldwide", img: cottonJerseyImg, name: "Cotton Jersey",  comp: "100% Combed Ring-Spun Cotton", markets: ["Everyday", "Basics"] },
  { badge: "yogo-badge-hot", badgeText: "Top Pick",      img: cvcImg,          name: "CVC Blend",      comp: "60% Cotton, 40% Polyester",   markets: ["Durable", "Promo Wear"] },
  { badge: "yogo-badge-new", badgeText: "Streetwear",    img: frenchTerryImg,  name: "French Terry",   comp: "100% Cotton / Blend",         markets: ["Athleisure", "Trend"] },
  { badge: "yogo-badge-new", badgeText: "Performance",   img: dryFitImg,       name: "Dry Fit",        comp: "100% Polyester",              markets: ["Activewear", "Sports"] },
  { badge: "yogo-badge-eco", badgeText: "Luxury",        img: modalImg,        name: "Modal",          comp: "100% Modal / Blend",          markets: ["Premium", "Comfort"] },
  { badge: "yogo-badge-eco", badgeText: "Polo Essential",img: piqueImg,        name: "Pique",          comp: "Cotton / Blend",              markets: ["Structured", "Global Demand"] },
];

const prints = [
  { img: screenPrintImg, name: "Screen Printing",   desc: "Dominant worldwide — vibrant, durable, and ideal for bulk orders in any market.", tag: "Plastisol · Water-Based" },
  { img: dtfPrintImg,    name: "DTF — Direct to Film", desc: "Photo-quality, any-fabric, any-colour. Preferred by fashion brands across EU.", tag: "No colour limits" },
  { img: embroideryImg,  name: "Embroidery",         desc: "Flat, 3D puff and chenille — the go-to for premium, corporate, and luxury brand identity.", tag: "Logo · Name · Badge" },
  { img: puffPrintImg,   name: "Puff & 3D Print",    desc: "Raised, tactile texture trending across global streetwear and lifestyle collections.", tag: "Feel the quality" },
  { img: vintageWashImg, name: "Vintage Wash Finish",desc: "Garment-dyed, lived-in aesthetic dominating Gen Z and premium casual globally.", tag: "Acid · Pigment" },
  { img: sublimationImg, name: "Sublimation & AOP",  desc: "Edge-to-edge all-over prints — high demand across Asia-Pacific fashion and sportswear.", tag: "Full coverage" },
];

const flowSteps = [
  { n: "1", title: "Submit Enquiry", desc: "Share your design brief, quantities, and fabric preferences." },
  { n: "2", title: "Spec Review",    desc: "Our team reviews and confirms fabric, print and colour options." },
  { n: "3", title: "Sample",         desc: "Pre-production sample made and shipped for approval." },
  { n: "4", title: "Production",     desc: "Full bulk run on confirmed spec with QC at every stage." },
  { n: "5", title: "Delivery",       desc: "Packed, labelled and shipped to your warehouse or 3PL." },
];

const YogoB2BContent = memo(function YogoB2BContent() {
  return (
    <div className="yogo-b2b-content">
      <div className="yogo-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="yogo-stats-band">
          {[["18+","Fabrics"],["70+","Print Types"],["16","Washes"],["15","Embroidery"]].map(([n, l]) => (
            <div key={l} className="yogo-stat">
              <div className="yogo-stat-n">{n}</div>
              <div className="yogo-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="yogo-section">
        <div className="yogo-eyebrow">What we work with</div>
        <div className="yogo-title">Globally Demanded Fabrics</div>
        <p className="yogo-sub">Selected from what wholesale buyers across the Globe are actively sourcing — comfort, performance, and sustainability covered.</p>
        <div className="yogo-fab-row">
          {fabrics.map(f => (
            <div key={f.name} className="yogo-fab-card">
              <span className={`yogo-fab-badge ${f.badge}`}>{f.badgeText}</span>
              <div className="yogo-fab-img"><img src={f.img} alt={f.name} loading="lazy" /></div>
              <div className="yogo-fab-info">
                <div className="yogo-fab-name">{f.name}</div>
                <div className="yogo-fab-comp">{f.comp}</div>
                <div className="yogo-fab-markets">{f.markets.map(m => <span key={m} className="yogo-fmkt">{m}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="yogo-teaser">
          <div className="yogo-teaser-top">
            <span className="yogo-teaser-label">12 more fabrics available →</span>
            <div className="yogo-chips">
              <span className="yogo-chip">Viscose</span>
              <span className="yogo-chip">Fleece</span>
              <span className="yogo-chip yogo-chip-blur">Waffle Knit</span>
              <span className="yogo-chip yogo-chip-blur">Scuba</span>
              <span className="yogo-chip yogo-chip-blur">Velour</span>
              <span className="yogo-chip yogo-chip-blur">Lycra Jersey</span>
            </div>
          </div>
          <div className="yogo-unlock"><LockSVG /> Full fabric catalogue shared after enquiry</div>
        </div>
      </div>

      <div className="yogo-section">
        <div className="yogo-eyebrow">How we bring designs to life</div>
        <div className="yogo-title">Most Ordered Print Techniques</div>
        <p className="yogo-sub">What global wholesale buyers are choosing — from high-volume screen prints to luxury embroidery and the latest digital finishes.</p>
        <div className="yogo-print-row">
          {prints.map(p => (
            <div key={p.name} className="yogo-print-card">
              <div className="yogo-print-img"><img src={p.img} alt={p.name} loading="lazy" /></div>
              <div className="yogo-print-info">
                <div className="yogo-print-name">{p.name}</div>
                <div className="yogo-print-desc">{p.desc}</div>
                <span className="yogo-print-tag">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="yogo-teaser">
          <div className="yogo-teaser-top">
            <span className="yogo-teaser-label">60+ more techniques →</span>
            <div className="yogo-chips">
              <span className="yogo-chip">DTG</span>
              <span className="yogo-chip">Foil</span>
              <span className="yogo-chip yogo-chip-blur">Metallic</span>
              <span className="yogo-chip yogo-chip-blur">Discharge</span>
              <span className="yogo-chip yogo-chip-blur">Rhinestone</span>
              <span className="yogo-chip yogo-chip-blur">Laser</span>
              <span className="yogo-chip yogo-chip-blur">Gel Print</span>
            </div>
          </div>
          <div className="yogo-unlock"><LockSVG /> Full print catalogue with samples shared on enquiry</div>
        </div>
      </div>

      <div className="yogo-section">
        <div className="yogo-eyebrow">How it works</div>
        <div className="yogo-title">Order Process</div>
        <p className="yogo-sub">From brief to delivery — a clear, structured process built for wholesale buyers.</p>
        <div className="yogo-flow-row">
          {flowSteps.map((step, i) => (
            <>
              <div key={step.n} className="yogo-flow-step">
                <div className="yogo-step-number">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {i < flowSteps.length - 1 && (
                <span key={`arrow-${i}`} className="yogo-flow-arrow" aria-hidden="true">→</span>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────
   Icons
   ──────────────────────────────────────────────────────────────── */
const HeartSVG = memo(({ filled }) => (
  <svg viewBox="0 0 24 24" width="20" height="20"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "currentColor"}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
));

function WishlistBtn({ isWishlisted, onToggle, className = "pdp-info__wishlist-btn" }) {
  const [particles, setParticles] = useState([]);

  const handleClick = () => {
    onToggle();
    const burst = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 2 * Math.PI;
      const dist = 22 + Math.random() * 12;
      return { id: Date.now() + i, tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, size: 7 + Math.random() * 5 };
    });
    setParticles(burst);
    setTimeout(() => setParticles([]), 700);
  };

  return (
    <button
      className={`${className}${isWishlisted ? " active" : ""}`}
      onClick={handleClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      style={{ position: "relative", overflow: "visible" }}
    >
      <HeartSVG filled={isWishlisted} />
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

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   Toast
   ──────────────────────────────────────────────────────────────── */
const ToastItem = memo(({ toast }) => {
  const style = toast.bgColor ? { background: toast.bgColor } : undefined;
  return (
    <div className={`pdp-toast pdp-toast--${toast.type}`} role="status" style={style}>
      <span className="pdp-toast__icon" aria-hidden="true">
        {toast.type === "warning" && "⚠"}
        {toast.type === "info"    && "ℹ"}
        {toast.type === "success" && "✓"}
        {toast.type === "error"   && "✕"}
      </span>
      <span className="pdp-toast__msg">{toast.message}</span>
    </div>
  );
});

const ToastContainer = memo(({ toasts }) => {
  const footerToasts       = toasts.filter(t => t.position !== "center" && t.position !== "bottom-center");
  const centerToasts       = toasts.filter(t => t.position === "center");
  const bottomCenterToasts = toasts.filter(t => t.position === "bottom-center");
  return (
    <>
      {footerToasts.length > 0 && createPortal(
        <div className="pdp-toast-container" aria-live="polite" aria-atomic="false">
          {footerToasts.map(t => <ToastItem key={t.id} toast={t} />)}
        </div>, document.body
      )}
      {centerToasts.length > 0 && createPortal(
        <div className="pdp-toast-container pdp-toast-container--center" aria-live="assertive" aria-atomic="false">
          {centerToasts.map(t => <ToastItem key={t.id} toast={t} />)}
        </div>, document.body
      )}
      {bottomCenterToasts.length > 0 && createPortal(
        <div className="pdp-toast-container pdp-toast-container--bottom-center" aria-live="assertive" aria-atomic="false">
          {bottomCenterToasts.map(t => <ToastItem key={t.id} toast={t} />)}
        </div>, document.body
      )}
    </>
  );
});

function useToast() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);
  const showToast = useCallback((message, type = "info", duration = 2800, options = {}) => {
    const id = ++counterRef.current;
    const { position = "bottom-center", bgColor = null, replace = false } = options;
    const nextToast = { id, message, type, position, bgColor };
    setToasts(prev => replace ? [nextToast] : [...prev, nextToast]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  return { toasts, showToast };
}

/* ─────────────────────────────────────────────────────────────────
   Inner-card zoom (generic — works on whatever image is displayed)
   ──────────────────────────────────────────────────────────────── */
function useInnerZoom() {
  const containerRef  = useRef(null);
  const bgRef         = useRef(null);
  const srcRef        = useRef("");
  const imageSizeRef  = useRef({ width: 1, height: 1 });
  const mouseIsInside = useRef(false);
  const touchZoomed   = useRef(false);
  const [active, setActive]               = useState(false);
  const [isTouchZoomed, setIsTouchZoomed] = useState(false);

  const applyZoom = useCallback((clientX, clientY) => {
    const container = containerRef.current, bg = bgRef.current;
    if (!container || !bg) return;
    const rect = container.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const cx = Math.max(0, Math.min(clientX - rect.left, W));
    const cy = Math.max(0, Math.min(clientY - rect.top,  H));
    const { width: imgW, height: imgH } = imageSizeRef.current;
    let bgW = W * ZOOM_FACTOR, bgH = H * ZOOM_FACTOR;
    if (imgW > 0 && imgH > 0) {
      const ratio = imgW / imgH;
      if (ratio >= 1) { bgW = Math.max(W*ZOOM_FACTOR, H*ZOOM_FACTOR*ratio); bgH = bgW/ratio; }
      else { bgH = Math.max(H*ZOOM_FACTOR, W*ZOOM_FACTOR/ratio); bgW = bgH*ratio; }
    }
    let bgX = (cx/W)*bgW - W/2, bgY = (cy/H)*bgH - H/2;
    bgX = Math.max(0, Math.min(bgX, bgW-W));
    bgY = Math.max(0, Math.min(bgY, bgH-H));
    bg.style.backgroundSize     = `${Math.round(bgW)}px ${Math.round(bgH)}px`;
    bg.style.backgroundPosition = `-${Math.round(bgX)}px -${Math.round(bgY)}px`;
  }, []);

  const resetForNewImage = useCallback((newSrc) => {
    if (!newSrc) return;
    srcRef.current = newSrc;
    const bg = bgRef.current;
    const image = new Image();
    image.src = newSrc;
    image.onload = () => {
      imageSizeRef.current = { width: image.naturalWidth || 1, height: image.naturalHeight || 1 };
      if (bg) bg.style.backgroundImage = `url('${newSrc}')`;
    };
    touchZoomed.current = mouseIsInside.current = false;
    setActive(false); setIsTouchZoomed(false);
  }, []);

  const handleMouseEnter = useCallback((e) => {
    if (window.matchMedia("(hover: none)").matches) return;
    mouseIsInside.current = true;
    const bg = bgRef.current;
    if (bg && srcRef.current) bg.style.backgroundImage = `url('${srcRef.current}')`;
    setActive(true); applyZoom(e.clientX, e.clientY);
  }, [applyZoom]);

  const handleMouseMove = useCallback((e) => {
    if (mouseIsInside.current) {
      const bg = bgRef.current;
      if (bg && srcRef.current) bg.style.backgroundImage = `url('${srcRef.current}')`;
      setActive(true); applyZoom(e.clientX, e.clientY);
    }
  }, [applyZoom]);

  const handleMouseLeave = useCallback(() => { mouseIsInside.current = false; setActive(false); }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (!touchZoomed.current) {
      touchZoomed.current = mouseIsInside.current = true;
      const bg = bgRef.current;
      if (bg && srcRef.current) bg.style.backgroundImage = `url('${srcRef.current}')`;
      setActive(true); setIsTouchZoomed(true); applyZoom(touch.clientX, touch.clientY);
    } else {
      touchZoomed.current = mouseIsInside.current = false;
      setActive(false); setIsTouchZoomed(false);
    }
  }, [applyZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onTouchMove = (e) => {
      if (!touchZoomed.current || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const bg = bgRef.current;
      if (bg && srcRef.current) bg.style.backgroundImage = `url('${srcRef.current}')`;
      applyZoom(touch.clientX, touch.clientY);
    };
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => container.removeEventListener("touchmove", onTouchMove);
  }, [applyZoom]);

  return {
    containerRef, bgRef, active, isTouchZoomed, resetForNewImage,
    handlers: { onMouseEnter: handleMouseEnter, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, onTouchStart: handleTouchStart },
  };
}

/* ─────────────────────────────────────────────────────────────────
   YMAL Card
   ──────────────────────────────────────────────────────────────── */
const YmalCard = memo(function YmalCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="ymal-card">
      <div className="ymal-card__img-wrap"><img src={product.image} alt={product.name} loading="lazy" /></div>
      <div className="ymal-card__info">
        <p className="ymal-card__name">{product.name}</p>
      </div>
    </Link>
  );
});

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart, toggleWishlist, wishlist, addRecentlyViewed, setCartOpen } = useApp();
  const { toasts, showToast } = useToast();
  const { products, loading } = useProducts();

  const product = useMemo(() => products.find(p => p.id === Number(id)), [products, id]);
  const isApparel = product?.category === "Apparel";

  const [qty,             setQty]             = useState("");
  const [qtyError,        setQtyError]        = useState(false);
  const [innerImageIndex, setInnerImageIndex]  = useState(0);

  const productImages = useMemo(() => {
    if (!product) return [];
    if (product.images?.length > 0) return product.images;
    return product.image ? [product.image] : [];
  }, [product]);

  const displayedImage = productImages[innerImageIndex] ?? product?.image;

  const zoom = useInnerZoom();
  useEffect(() => { if (displayedImage) zoom.resetForNewImage(displayedImage); }, [displayedImage]); // eslint-disable-line

  useScrollReveal([id]);

  useEffect(() => {
    if (product) {
      setQty(""); setQtyError(false);
      setInnerImageIndex(0);
      addRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, product]); // eslint-disable-line

  useEffect(() => { if (qty !== "" && parseInt(qty, 10) >= 1) setQtyError(false); }, [qty]);

  const isWishlisted = wishlist.includes(product?.id);

  const youMayAlsoLike = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  }, [products, product]);

  const handlePrevImage = useCallback(() => setInnerImageIndex(i => Math.max(0, i - 1)), []);
  const handleNextImage = useCallback(() => setInnerImageIndex(i => Math.min(productImages.length - 1, i + 1)), [productImages.length]);
  const handleThumbClick = useCallback((idx) => setInnerImageIndex(idx), []);

  const handleAddToCart = useCallback(() => {
    const resolved = parseInt(qty, 10);
    if (isNaN(resolved) || resolved < 1) {
      setQtyError(true);
      return;
    }
    addToCart(product, resolved, {}, { suppressToast: true });
    showToast("Product added to cart", "success", 2800, { position: "bottom-center", replace: true });
    setCartOpen(true);
  }, [product, qty, addToCart, showToast, setCartOpen]);

  const handleToggleWishlist = useCallback(() => {
    toggleWishlist(product?.id);
  }, [toggleWishlist, product]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="page-enter" style={{ padding: "100px 0", textAlign: "center" }}>
        <p>Loading…</p>
      </main>
    );
  }

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <main className="page-enter" style={{ padding: "100px 0", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px" }}>Product Not Found</h1>
        <button className="btn btn-secondary" style={{ marginTop: "24px" }} onClick={() => navigate("/shop")}>
          Back to Shop
        </button>
      </main>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════ */
  return (
    <main className="page-enter" aria-label={`Product: ${product.name}`}>
      <ToastContainer toasts={toasts} />

      <div className="container">

        {/* BREADCRUMB */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__sep">/</span>
          <Link to="/shop" className="breadcrumb__link">Shop</Link>
          <span className="breadcrumb__sep">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="breadcrumb__link">
            {product.category}
          </Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current" aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp-layout">

          <section className="pdp-gallery" aria-label="Product images">
            <div
              ref={zoom.containerRef}
              className={`pdp-gallery__main${zoom.active ? " pdp-gallery__main--zooming" : ""}`}
              {...zoom.handlers}
            >
              <img
                key={`${product.id}-${innerImageIndex}`}
                src={displayedImage}
                alt={product.name}
                className={`pdp-gallery__main-img${zoom.active ? " pdp-gallery__main-img--hidden" : ""}`}
                draggable={false}
              />
              <div ref={zoom.bgRef} className={`pdp-zoom__bg${zoom.active ? " active" : ""}`} aria-hidden="true" />
              <div className={`pdp-gallery__touch-hint${zoom.isTouchZoomed ? " pdp-gallery__touch-hint--panning" : ""}`} aria-hidden="true">
                {zoom.isTouchZoomed ? "Drag to pan" : "Tap to zoom"}
              </div>

              {productImages.length > 1 && (
                <>
                  <button className="pdp-gallery__arrow pdp-gallery__arrow--prev" onClick={handlePrevImage} disabled={innerImageIndex === 0} aria-label="Previous image"><ChevronLeft /></button>
                  <button className="pdp-gallery__arrow pdp-gallery__arrow--next" onClick={handleNextImage} disabled={innerImageIndex === productImages.length - 1} aria-label="Next image"><ChevronRight /></button>
                  <span className="pdp-gallery__counter" aria-hidden="true">{innerImageIndex + 1} / {productImages.length}</span>
                </>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="pdp-thumb-strip" role="list" aria-label="Product image variations">
                {productImages.map((imgSrc, idx) => (
                  <button
                    key={idx} type="button"
                    className={`pdp-thumb__card${idx === innerImageIndex ? " active" : ""}`}
                    onClick={() => handleThumbClick(idx)}
                    aria-label={`Image ${idx + 1}`} aria-pressed={idx === innerImageIndex}
                  >
                    <div className="pdp-thumb__img-wrap"><img src={imgSrc} alt={`${product.name} view ${idx + 1}`} loading="lazy" /></div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <article className="pdp-info">
            <div className="pdp-info__name-row">
              <h1 className="pdp-info__name">{product.name}</h1>
              <div className="pdp-info__wishlist-wrap">
                <WishlistBtn isWishlisted={isWishlisted} onToggle={handleToggleWishlist} />
                <span className="pdp-info__wishlist-tip">
                  {isWishlisted ? "Remove from wishlist" : "Click to add to your wishlist"}
                </span>
              </div>
            </div>

            {product.subCategory && (
              <p className="pdp-info__variant-label" style={{ marginBottom: 8 }}>{product.subCategory}</p>
            )}

            <div className="pdp-info__qty-row">
              <p className="pdp-info__variant-label">
                Quantity
                <span className="pdp-info__qty-required" aria-hidden="true"> *</span>
              </p>
              <div className={`qty-selector${qtyError ? " qty-selector--error" : ""}`}>
                <input
                  type="number"
                  className="qty-selector__val"
                  value={qty}
                  min={1}
                  placeholder="Enter qty"
                  aria-label="Quantity"
                  aria-required="true"
                  aria-invalid={qtyError}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") { setQty(""); return; }
                    const val = parseInt(raw, 10);
                    if (!isNaN(val) && val >= 1) setQty(val);
                  }}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val < 1) setQty("");
                  }}
                />
              </div>
              {qtyError && (
                <p className="pdp-info__qty-error" role="alert">
                  Please enter a quantity before adding to cart
                </p>
              )}
            </div>

            <div className="pdp-info__ctas">
              {product.stock ? (
                <button className="btn btn-secondary pdp-info__add-btn" onClick={handleAddToCart}>
                  Get Quote
                  <span className="pdp-info__add-hint">Use "Add to cart" to inquire about multiple products.</span>
                </button>
              ) : (
                <button className="btn btn-ghost pdp-info__add-btn" disabled>Out of Stock</button>
              )}
            </div>

            {product.description && (
              <div className="pdp-info__description">
                <p className="pdp-desc-text">{product.description}</p>
              </div>
            )}
          </article>

        </div>

        {isApparel && (
          <div className="pdp-extra-content">
            <YogoB2BContent />
          </div>
        )}

        {/* ── YOU MAY ALSO LIKE ── */}
        {youMayAlsoLike.length > 0 && (
          <section className="ymal-section" aria-label="You may also like">
            <div className="ymal-section__header">
              <h2 className="ymal-section__title">You May Also Like</h2>
              <p className="ymal-section__sub">More from {product.category}</p>
            </div>
            <div className="ymal-grid">
              {youMayAlsoLike.map(p => (
                <YmalCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
