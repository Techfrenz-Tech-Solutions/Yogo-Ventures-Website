// ProductDetailPage — v2 wishlist-near-name
// CHANGES IN THIS VERSION:
// 1. T-shirt gallery now uses the SAME sticky pdp-gallery as Memory Foam — identical main image card size
// 2. RoundColorWheel replaced with SpectrumColorPicker:
//    - Horizontal gradient spectrum strip (drag anywhere to pick hue + saturation)
//    - Vertical shade/brightness slider below the strip
//    - Live hex readout + color name — no round wheel, matches the HTML reference design
// 3. T-shirt right column top section (name, description, wishlist) now matches Memory Foam pdp-info
//    structure and CSS classes exactly — same margins, same description block, same ctas container.
// 4. All cart, wishlist, quote buttons and B2B content are untouched
// 5. YMAL cards now show only product name (subcategory label removed)
// FIX: stableKey uses subCategory so all colors for Polo/Round Neck/Hoodies merge into one cart row.
// FIX (apparel image): buildCartProductWithImage pins .image to slides[slideIndex].image —
//      the exact same field the thumbnail strip renders — so mini cart always shows the correct
//      variation thumbnail regardless of inner gallery state.
// FIX (apparel wishlist): clicking the heart on any apparel variant wishlists the entire
//      subcategory group (all slide IDs toggled together). isWishlisted = true when ANY
//      slide is in the wishlist. The wishlist panel always shows slides[0] (the first /
//      "main" image) as the display product — identical behaviour to Memory Foam.

import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PRODUCTS, VALID_PRODUCTS } from "../data/products";
import { useApp } from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./ProductDetailPage.css";
import "./ColorCustomization.css";

// ── Local image imports for color customization ──
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
   COLOR HELPERS
   ──────────────────────────────────────────────────────────────── */

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  let l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const COLOR_NAMES = [
  { name: "Black",        h: 0,   s: 0,   l: 0   },
  { name: "White",        h: 0,   s: 0,   l: 100 },
  { name: "Charcoal",     h: 210, s: 10,  l: 20  },
  { name: "Dark Grey",    h: 0,   s: 0,   l: 30  },
  { name: "Grey",         h: 0,   s: 0,   l: 50  },
  { name: "Light Grey",   h: 0,   s: 0,   l: 75  },
  { name: "Navy Blue",    h: 222, s: 100, l: 18  },
  { name: "Royal Blue",   h: 211, s: 100, l: 36  },
  { name: "Sky Blue",     h: 203, s: 90,  l: 64  },
  { name: "Cobalt Blue",  h: 215, s: 100, l: 45  },
  { name: "Powder Blue",  h: 207, s: 52,  l: 76  },
  { name: "Teal",         h: 180, s: 100, l: 25  },
  { name: "Cyan",         h: 180, s: 100, l: 50  },
  { name: "Forest Green", h: 120, s: 61,  l: 25  },
  { name: "Sage Green",   h: 143, s: 22,  l: 58  },
  { name: "Olive",        h: 80,  s: 40,  l: 33  },
  { name: "Mint",         h: 160, s: 60,  l: 73  },
  { name: "Lime",         h: 83,  s: 80,  l: 50  },
  { name: "Yellow",       h: 53,  s: 95,  l: 62  },
  { name: "Mustard",      h: 42,  s: 80,  l: 45  },
  { name: "Gold",         h: 43,  s: 100, l: 50  },
  { name: "Orange",       h: 30,  s: 100, l: 50  },
  { name: "Rust",         h: 18,  s: 70,  l: 40  },
  { name: "Red",          h: 0,   s: 100, l: 40  },
  { name: "Crimson",      h: 348, s: 94,  l: 36  },
  { name: "Maroon",       h: 0,   s: 100, l: 25  },
  { name: "Pink",         h: 350, s: 100, l: 75  },
  { name: "Hot Pink",     h: 330, s: 100, l: 60  },
  { name: "Rose",         h: 350, s: 75,  l: 60  },
  { name: "Blush",        h: 345, s: 55,  l: 82  },
  { name: "Lavender",     h: 270, s: 50,  l: 75  },
  { name: "Purple",       h: 270, s: 70,  l: 40  },
  { name: "Indigo",       h: 245, s: 100, l: 35  },
  { name: "Brown",        h: 20,  s: 55,  l: 30  },
  { name: "Tan",          h: 30,  s: 50,  l: 60  },
  { name: "Beige",        h: 35,  s: 40,  l: 78  },
  { name: "Ivory",        h: 55,  s: 50,  l: 90  },
  { name: "Cream",        h: 47,  s: 60,  l: 92  },
  { name: "Off-White",    h: 30,  s: 20,  l: 95  },
];

function getColorName(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  let best = COLOR_NAMES[0], bestDist = Infinity;
  for (const c of COLOR_NAMES) {
    const dh = Math.min(Math.abs(h - c.h), 360 - Math.abs(h - c.h));
    const dist = dh * 1.5 + Math.abs(s - c.s) + Math.abs(l - c.l) * 1.2;
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best.name;
}

function getContrastColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#335765" : "#ffffff";
}

/* ─────────────────────────────────────────────────────────────────
   SPECTRUM COLOR PICKER
   ──────────────────────────────────────────────────────────────── */

const SPECTRUM_GRADIENT = [
  "#000000 0%",
  "#3b3b3b 6%",
  "#001f5c 12%",
  "#0057b8 18%",
  "#4fc3f7 24%",
  "#008080 30%",
  "#2e7d32 36%",
  "#6b8e23 42%",
  "#f4d03f 48%",
  "#f39c12 54%",
  "#d62828 60%",
  "#800020 66%",
  "#ff6fa3 72%",
  "#6a0dad 78%",
  "#c8a2c8 84%",
  "#d9b99b 90%",
  "#ffffff 100%",
];

function sampleSpectrum(xRatio, shadeRatio) {
  const canvas = document.createElement("canvas");
  canvas.width = 200; canvas.height = 1;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 200, 0);
  SPECTRUM_GRADIENT.forEach(stop => {
    const parts = stop.split(" ");
    grad.addColorStop(parseFloat(parts[1]) / 100, parts[0]);
  });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 200, 1);
  const px = Math.round(xRatio * 199);
  const [r, g, b] = ctx.getImageData(px, 0, 1, 1).data;

  let fr, fg, fb;
  if (shadeRatio <= 0.5) {
    const t = shadeRatio / 0.5;
    fr = Math.round(255 + (r - 255) * t);
    fg = Math.round(255 + (g - 255) * t);
    fb = Math.round(255 + (b - 255) * t);
  } else {
    const t = (shadeRatio - 0.5) / 0.5;
    fr = Math.round(r * (1 - t));
    fg = Math.round(g * (1 - t));
    fb = Math.round(b * (1 - t));
  }
  const toHex = v => v.toString(16).padStart(2, "0");
  return `#${toHex(fr)}${toHex(fg)}${toHex(fb)}`;
}

const SpectrumColorPicker = memo(function SpectrumColorPicker({ onColorChange }) {
  const spectrumRef  = useRef(null);
  const shadeRef     = useRef(null);
  const draggingSpec = useRef(false);
  const draggingShade = useRef(false);

  const [xRatio,     setXRatio]     = useState(0.18);
  const [shadeRatio, setShadeRatio] = useState(0.45);
  const [cursorX,    setCursorX]    = useState(null);

  const pureHex = useMemo(() => sampleSpectrum(xRatio, 0.5), [xRatio]);
  const pickedHex = useMemo(() => sampleSpectrum(xRatio, shadeRatio), [xRatio, shadeRatio]);

  useEffect(() => {
    onColorChange({ hex: pickedHex, name: getColorName(pickedHex) });
  }, [pickedHex, onColorChange]);

  const updateFromSpectrum = useCallback((clientX) => {
    const strip = spectrumRef.current;
    if (!strip) return;
    const rect = strip.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setXRatio(ratio);
    setCursorX((clientX - rect.left));
  }, []);

  const updateFromShade = useCallback((clientX) => {
    const slider = shadeRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setShadeRatio(ratio);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (draggingSpec.current)  updateFromSpectrum(e.clientX);
      if (draggingShade.current) updateFromShade(e.clientX);
    };
    const onUp = () => { draggingSpec.current = false; draggingShade.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [updateFromSpectrum, updateFromShade]);

  useEffect(() => {
    const onMove = (e) => {
      if (draggingSpec.current)  { e.preventDefault(); updateFromSpectrum(e.touches[0].clientX); }
      if (draggingShade.current) { e.preventDefault(); updateFromShade(e.touches[0].clientX); }
    };
    const onEnd = () => { draggingSpec.current = false; draggingShade.current = false; };
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onEnd);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [updateFromSpectrum, updateFromShade]);

  const spectrumGradientCSS = SPECTRUM_GRADIENT.map(s => {
    const parts = s.split(" ");
    return `${parts[0]} ${parts[1]}`;
  }).join(", ");

  const shadeGradientCSS = `linear-gradient(to right, #ffffff 0%, ${pureHex} 50%, #000000 100%)`;

  const specCursorPct = `${(xRatio * 100).toFixed(1)}%`;
  const shadeCursorPct = `${(shadeRatio * 100).toFixed(1)}%`;

  return (
    <div className="spectrum-picker">
      <div className="spectrum-picker__label">Pick a colour</div>
      <div
        ref={spectrumRef}
        className="spectrum-picker__strip"
        style={{ background: `linear-gradient(to right, ${spectrumGradientCSS})` }}
        onMouseDown={e => { draggingSpec.current = true; updateFromSpectrum(e.clientX); }}
        onTouchStart={e => { e.preventDefault(); draggingSpec.current = true; updateFromSpectrum(e.touches[0].clientX); }}
        aria-label="Colour spectrum — drag to pick a colour"
        role="slider"
        aria-valuenow={Math.round(xRatio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="spectrum-picker__cursor"
          style={{ left: specCursorPct, background: pickedHex, borderColor: getContrastColor(pickedHex) }}
        />
      </div>

      <div className="spectrum-picker__label spectrum-picker__label--shade">Shade</div>
      <div
        ref={shadeRef}
        className="spectrum-picker__shade-strip"
        style={{ background: shadeGradientCSS }}
        onMouseDown={e => { draggingShade.current = true; updateFromShade(e.clientX); }}
        onTouchStart={e => { e.preventDefault(); draggingShade.current = true; updateFromShade(e.touches[0].clientX); }}
        aria-label="Shade — drag to lighten or darken"
        role="slider"
        aria-valuenow={Math.round(shadeRatio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="spectrum-picker__shade-cursor"
          style={{ left: shadeCursorPct, background: pickedHex, borderColor: getContrastColor(pickedHex) }}
        />
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────────
   B2B CONTENT
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
   T-shirt color inference
   ──────────────────────────────────────────────────────────────── */
const COLOR_KEYWORDS = [
  ["jet black","#0A0A0A"],["black","#1C1C1E"],["charcoal","#374151"],["dark grey","#4B5563"],
  ["dark gray","#4B5563"],["grey","#6B7280"],["gray","#6B7280"],["light grey","#D1D5DB"],
  ["light gray","#D1D5DB"],["silver","#C0C0C0"],["off white","#F5F0E8"],["off-white","#F5F0E8"],
  ["cream","#FFFDD0"],["beige","#D4C5A9"],["ivory","#FFFFF0"],["white","#F5F5F5"],
  ["navy blue","#1D3461"],["navy","#1D3461"],["royal blue","#4169E1"],["sky blue","#0EA5E9"],
  ["baby blue","#89CFF0"],["cobalt","#0047AB"],["denim","#1560BD"],["teal","#0D9488"],
  ["cyan","#06B6D4"],["blue","#1D4ED8"],["forest green","#14532D"],["bottle green","#006A4E"],
  ["olive green","#4D7C0F"],["mint green","#98FF98"],["lime green","#32CD32"],["olive","#6B7C1D"],
  ["sage","#B2AC88"],["mint","#3EB489"],["khaki","#C3B091"],["green","#16A34A"],
  ["dark red","#8B0000"],["burgundy","#7F1D1D"],["maroon","#800000"],["wine","#722F37"],
  ["crimson","#DC143C"],["coral","#FF6B6B"],["rose","#E91E8C"],["hot pink","#FF69B4"],
  ["baby pink","#FFB6C1"],["blush","#FFACAC"],["pink","#EC4899"],["red","#DC2626"],
  ["rust","#B7410E"],["copper","#B87333"],["burnt orange","#CC5500"],["orange","#EA580C"],
  ["peach","#FFCBA4"],["mustard","#D97706"],["yellow","#EAB308"],["gold","#FFD700"],
  ["amber","#F59E0B"],["lavender","#967BB6"],["lilac","#C8A2C8"],["violet","#8B00FF"],
  ["indigo","#4B0082"],["mauve","#E0B0FF"],["plum","#8E4585"],["purple","#7C3AED"],
  ["chocolate","#7B3F00"],["brown","#92400E"],["camel","#C19A6B"],["tan","#D2B48C"],
  ["multicolor","#E040FB"],["multi","#E040FB"],["printed","#F97316"],
];
const FALLBACK_COLORS = ["#1C1C1E","#1D3461","#DC2626","#16A34A","#7C3AED","#EA580C","#0D9488","#9D174D","#374151","#D97706","#0284C7","#92400E"];

function inferTshirtColor(product, index) {
  if (product.colorHex) return { hex: product.colorHex, label: product.colorName ?? product.colorHex };
  if (product.color)    return { hex: product.color,    label: product.colorName ?? product.color };
  const haystack = `${product.colorName ?? ""} ${product.name ?? ""}`.toLowerCase();
  for (const [keyword, hex] of COLOR_KEYWORDS) {
    if (haystack.includes(keyword)) return { hex, label: keyword.replace(/\b\w/g, c => c.toUpperCase()) };
  }
  return { hex: FALLBACK_COLORS[index % FALLBACK_COLORS.length], label: product.name ?? tshirtLabel(product.subCategory) };
}

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

/* Wishlist button with Twitter-style heart burst */
function WishlistBtn({ isWishlisted, onToggle, className = "pdp-info__wishlist-btn" }) {
  const [particles, setParticles] = useState([]);

  const handleClick = () => {
    onToggle();
    const burst = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 2 * Math.PI;
      const dist  = 22 + Math.random() * 12;
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
   Inner-card zoom
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
   Helpers
   ──────────────────────────────────────────────────────────────── */
function tshirtLabel(subCat) {
  if (subCat === "Polo")       return "Polo Apparel";
  if (subCat === "Round Neck") return "Round Neck Apparel";
  if (subCat === "Hoodies")    return "Hoodies";
  return subCat;
}

/* ─────────────────────────────────────────────────────────────────
   YMAL Card — subcategory label removed, only product name shown
   ──────────────────────────────────────────────────────────────── */
const YmalCard = memo(function YmalCard({ product, onSlide }) {
  if (onSlide) return (
    <button type="button" className="ymal-card ymal-card--btn" onClick={onSlide}>
      <div className="ymal-card__img-wrap"><img src={product.image} alt={product.name} loading="lazy" /></div>
      <div className="ymal-card__info">
        <p className="ymal-card__name">{product.name}</p>
      </div>
    </button>
  );
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
  const { addToCart, toggleWishlist, wishlist, addRecentlyViewed, setCartOpen, mergeColorToCart } = useApp();
  const { toasts, showToast } = useToast();

  const urlProduct = useMemo(() => PRODUCTS.find(p => p.id === Number(id)), [id]);

  // ── CATEGORY FLAGS ──────────────────────────────────────────────────────
  const isTShirt  = urlProduct?.category    === "Apparel";
  const isFoam    = urlProduct?.category    === "Memory Foam Products";
  const isCopper  = urlProduct?.category    === "Copper Utensils";
  const isPottery = urlProduct?.subCategory === "Blue Pottery";
  const isBags    = urlProduct?.subCategory === "Handmade Cotton Bags";
  const isWooden  = urlProduct?.subCategory === "Wooden Handicraft";

  const isSlider        = isTShirt || isFoam;
  const isHandicraftVar = isPottery || isBags || isWooden;
  const hasYmal         = isTShirt || isFoam || isCopper || isPottery || isBags || isWooden;

  const [displayProduct,     setDisplayProduct]     = useState(urlProduct);
  const [qty,                setQty]                = useState("");
  const [qtyError,           setQtyError]           = useState(false);
  const [innerImageIndex,    setInnerImageIndex]    = useState(0);
  const [handicraftVarIndex, setHandicraftVarIndex] = useState(0);
  const [showPoloMainImage,  setShowPoloMainImage]  = useState(false);

  // ── Color customization state ────────────────────────────────────────────
  const [currentPickedColor, setCurrentPickedColor] = useState({ hex: "#0057b8", name: "Royal Blue" });
  const [selectedColors,     setSelectedColors]     = useState([]);
  const [colorQty,           setColorQty]           = useState("");
  const [colorQtyError,      setColorQtyError]      = useState(false);

  // ── Slides ──────────────────────────────────────────────────────────────
  const slides = useMemo(() => {
    if (!isSlider || !urlProduct) return [];
    if (isTShirt) {
      const all = PRODUCTS.filter(p => p.subCategory === urlProduct.subCategory);
      return all.slice().sort((a, b) => a.id - b.id);
    }
    const all = VALID_PRODUCTS.filter(p => p.category === "Memory Foam Products");
    return all.slice().sort((a, b) => a.id - b.id);
  }, [isSlider, isTShirt, urlProduct]);

  const [slideIndex, setSlideIndex] = useState(0);

  const defaultSlideIndex = useMemo(() => {
    if (!isSlider || !urlProduct) return 0;
    const index = slides.findIndex(s => s.id === urlProduct.id);
    return index >= 0 ? index : 0;
  }, [isSlider, slides, urlProduct]);

  useEffect(() => {
    setSlideIndex(defaultSlideIndex);
  }, [defaultSlideIndex, id]);

  const visibleApparelThumbnails = useMemo(() => {
    if (!isTShirt) return [];
    return slides;
  }, [isTShirt, slides]);

  const handicraftVariants = useMemo(() => {
    if (!isHandicraftVar || !urlProduct) return [];
    const others = VALID_PRODUCTS.filter(p => p.subCategory === urlProduct.subCategory && p.id !== urlProduct.id);
    return [urlProduct, ...others].slice(0, 5);
  }, [isHandicraftVar, urlProduct]);

  const product = useMemo(() => {
    if (isHandicraftVar) return urlProduct;
    if (isSlider) return slides[slideIndex] ?? urlProduct;
    return displayProduct ?? urlProduct;
  }, [isHandicraftVar, urlProduct, isSlider, slides, slideIndex, displayProduct]);

  const productImages = useMemo(() => {
    const src = isTShirt ? (slides[slideIndex] ?? product) : product;
    if (!src) return [];
    if (Array.isArray(src.images) && src.images.length > 1) return src.images;
    return [src.image ?? product?.image].filter(Boolean);
  }, [product, isTShirt, slides, slideIndex]);

  const activeSlideIndex = isTShirt && product?.subCategory === "Polo" && showPoloMainImage ? 0 : slideIndex;

  const cartProduct = useMemo(() => {
    // For apparel (T-shirt slider): always use the FIRST slide's image as the cart thumbnail
    if (isTShirt && slides.length > 0) {
      return { ...product, image: slides[0]?.image ?? product?.image };
    }
    if (isHandicraftVar) return urlProduct;
    return product;
  }, [isTShirt, isHandicraftVar, urlProduct, product, slides]);

  const displayedImage = isHandicraftVar
    ? (handicraftVariants[handicraftVarIndex]?.image ?? urlProduct?.image)
    : ((isTShirt && product?.subCategory === "Polo" && showPoloMainImage && innerImageIndex === 0)
      ? (slides[0]?.image ?? productImages[innerImageIndex] ?? product?.image)
      : (productImages[innerImageIndex] ?? slides[slideIndex]?.image ?? product?.image));

  const zoom = useInnerZoom();
  useEffect(() => { if (displayedImage) zoom.resetForNewImage(displayedImage); }, [displayedImage]); // eslint-disable-line

  useScrollReveal([id]);

  useEffect(() => {
    const p = PRODUCTS.find(prod => prod.id === Number(id));
    if (p) {
      setDisplayProduct(p);
      setQty(""); setQtyError(false);
      setInnerImageIndex(0); setHandicraftVarIndex(0);
      setSelectedColors([]);
      setColorQty("");
      setColorQtyError(false);
      setShowPoloMainImage(p.category === "Apparel" && p.subCategory === "Polo");
      addRecentlyViewed(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]); // eslint-disable-line

  useEffect(() => { setInnerImageIndex(0); }, [slideIndex, displayProduct?.id, handicraftVarIndex]);
  useEffect(() => { if (qty !== "" && parseInt(qty, 10) >= 1) setQtyError(false); }, [qty]);

  // ── APPAREL WISHLIST — group behaviour (matches Memory Foam) ────────────
  // All colour variants of the same subcategory (Polo / Round Neck / Hoodies)
  // are wishlisted together as one unit:
  //   • isWishlisted = true when ANY slide id is already in the wishlist array
  //   • toggling adds / removes ALL slide ids at once
  //   • the wishlist panel/page receives slides[0] (first image) as the display
  //     product, so only the canonical "main" image ever appears there.
  // For every non-apparel product type the original cartProduct.id logic is kept.
  const apparelSlideIds = useMemo(
    () => (isTShirt ? slides.map(s => s.id) : []),
    [isTShirt, slides]
  );

  const isWishlisted = useMemo(() => {
    if (isTShirt) return apparelSlideIds.some(sid => wishlist.includes(sid));
    return wishlist.includes(cartProduct?.id);
  }, [isTShirt, apparelSlideIds, wishlist, cartProduct]);

  const youMayAlsoLike = useMemo(() => {
    if (!urlProduct) return [];
    if (isTShirt) {
      const otherSubs = ["Polo","Round Neck","Hoodies"].filter(sc => sc !== urlProduct.subCategory);
      return otherSubs.map(sc => VALID_PRODUCTS.find(p => p.subCategory === sc)).filter(Boolean);
    }
    if (isFoam)    return VALID_PRODUCTS.filter(p => p.category    === "Memory Foam Products"    && p.id !== urlProduct.id);
    if (isCopper)  return VALID_PRODUCTS.filter(p => p.category    === "Copper Utensils"         && p.id !== urlProduct.id);
    if (isPottery) return VALID_PRODUCTS.filter(p => p.subCategory === "Blue Pottery"            && p.id !== urlProduct.id);
    if (isBags)    return VALID_PRODUCTS.filter(p => p.subCategory === "Handmade Cotton Bags"    && p.id !== urlProduct.id);
    if (isWooden)  return VALID_PRODUCTS.filter(p => p.subCategory === "Wooden Handicraft"       && p.id !== urlProduct.id);
    return [];
  }, [isTShirt, isFoam, isCopper, isPottery, isBags, isWooden, urlProduct]);

  const ymalSubtitle = useMemo(() => {
    if (!urlProduct) return "";
    if (isTShirt) {
      if (urlProduct.subCategory === "Polo")       return "Explore Round Neck & Hoodies";
      if (urlProduct.subCategory === "Round Neck") return "Explore Polo & Hoodies";
      if (urlProduct.subCategory === "Hoodies")    return "Explore Polo & Round Neck";
    }
    if (isFoam)    return "Explore other Memory Foam Products";
    if (isCopper)  return "Explore other Copper Utensils";
    if (isPottery) return "Explore other Blue Pottery";
    if (isBags)    return "Explore other Handmade Cotton Bags";
    if (isWooden)  return "Explore other Wooden Handicrafts";
    return "";
  }, [isTShirt, isFoam, isCopper, isPottery, isBags, isWooden, urlProduct]);

  const foamYmalSlideIndexMap = useMemo(() => {
    if (!isFoam) return {};
    return Object.fromEntries(slides.map((s, idx) => [s.id, idx]));
  }, [isFoam, slides]);

  const handlePrevSlide = useCallback(() => {
    const newIdx = Math.max(0, slideIndex - 1);
    if (newIdx !== slideIndex) {
      setSlideIndex(newIdx);
      setShowPoloMainImage(false);
      zoom.resetForNewImage(slides[newIdx]?.image);
    }
  }, [slideIndex, slides, zoom]);

  const handleNextSlide = useCallback(() => {
    const newIdx = Math.min(slides.length - 1, slideIndex + 1);
    if (newIdx !== slideIndex) {
      setSlideIndex(newIdx);
      setShowPoloMainImage(false);
      zoom.resetForNewImage(slides[newIdx]?.image);
    }
  }, [slideIndex, slides, zoom]);

  const handleThumbClick = useCallback((idx, image) => {
    setSlideIndex(idx); setInnerImageIndex(0);
    setShowPoloMainImage(false);
    const src = image ?? slides[idx]?.image;
    if (src) zoom.resetForNewImage(src);
  }, [zoom, slides]);

  const handlePrevImage       = useCallback(() => { setShowPoloMainImage(false); setInnerImageIndex(i => Math.max(0, i - 1)); }, []);
  const handleNextImage       = useCallback(() => { setShowPoloMainImage(false); setInnerImageIndex(i => Math.min(productImages.length - 1, i + 1)); }, [productImages.length]);
  const handleInnerThumbClick = useCallback((idx) => { setShowPoloMainImage(false); setInnerImageIndex(idx); }, []);

  const handleHandicraftVarClick = useCallback((idx, image) => {
    setHandicraftVarIndex(idx); setInnerImageIndex(0);
    if (image) zoom.resetForNewImage(image);
  }, [zoom]);

  const handlePrevHandicraftVar = useCallback(() => {
    const newIdx = Math.max(0, handicraftVarIndex - 1);
    handleHandicraftVarClick(newIdx, handicraftVariants[newIdx]?.image);
  }, [handicraftVarIndex, handicraftVariants, handleHandicraftVarClick]);

  const handleNextHandicraftVar = useCallback(() => {
    const newIdx = Math.min(handicraftVariants.length - 1, handicraftVarIndex + 1);
    handleHandicraftVarClick(newIdx, handicraftVariants[newIdx]?.image);
  }, [handicraftVarIndex, handicraftVariants, handleHandicraftVarClick]);

  const handleAddToCart = useCallback(() => {
    const resolved = parseInt(qty, 10);
    if (isNaN(resolved) || resolved < 1) {
      setQtyError(true);
      return;
    }
    for (let i = 0; i < resolved; i++) {
      addToCart(cartProduct, 1, {}, { suppressToast: true });
    }
    showToast("Product added to cart", "success", 2800, { position: "bottom-center", replace: true });
    setCartOpen(true);
  }, [cartProduct, qty, addToCart, showToast, setCartOpen]);

  // For apparel: toggle ALL slide ids together so every colour variant enters /
  // leaves the wishlist as one group. The wishlist display product is always
  // slides[0] (the "main" image) regardless of which variant is viewed.
  // For all other product types: unchanged single-id toggle.
  const handleToggleWishlist = useCallback(() => {
    if (isTShirt && apparelSlideIds.length > 0) {
      apparelSlideIds.forEach(sid => toggleWishlist(sid));
    } else {
      toggleWishlist(cartProduct?.id);
    }
  }, [isTShirt, apparelSlideIds, toggleWishlist, cartProduct]);

  const handleColorChange = useCallback((color) => {
    setCurrentPickedColor({ hex: color.hex, name: color.name });
  }, []);

  const handleAddColor = useCallback(() => {
    const parsedQty = parseInt(colorQty, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      setColorQtyError(true);
      showToast("Please enter a quantity before adding a colour", "warning", 2800, { position: "bottom-center" });
      return;
    }
    setColorQtyError(false);

    setCurrentPickedColor(prev => {
      const snapshot = { hex: prev.hex, name: prev.name, quantity: parsedQty };
      setSelectedColors(existing => {
        const idx = existing.findIndex(c => c.hex === snapshot.hex);
        if (idx !== -1) {
          const updated = [...existing];
          updated[idx] = snapshot;
          return updated;
        }
        return [...existing, snapshot];
      });
      return prev;
    });

    setColorQty("");
  }, [colorQty, showToast]);

  const handleRemoveColor = useCallback((hex) => {
    setSelectedColors(prev => prev.filter(c => c.hex !== hex));
  }, []);

  // ── FIX: buildCartProductWithImage ──────────────────────────────────────
  const buildCartProductWithImage = useCallback(() => {
    const firstSlide = slides[0];
    const variationThumb = firstSlide?.image ?? cartProduct.image;

    return {
      ...cartProduct,
      image: variationThumb,
      images: [
        variationThumb,
        ...(cartProduct.images ?? []).filter(img => img !== variationThumb),
      ],
    };
  }, [cartProduct, slides]);

  const handleColorAddToCart = useCallback(() => {
    const stableKey = `apparel|${urlProduct.subCategory}|colors`;
    const cartProductWithImage = buildCartProductWithImage();

    if (selectedColors.length === 0) {
      const parsedQty = parseInt(colorQty, 10);
      if (isNaN(parsedQty) || parsedQty < 1) {
        setColorQtyError(true);
        showToast("Please enter a quantity and add a colour first", "warning", 2800, { position: "bottom-center" });
        return;
      }
      setColorQtyError(false);
      const inlineColor = { hex: currentPickedColor.hex, name: currentPickedColor.name, quantity: parsedQty };
      mergeColorToCart(cartProductWithImage, [inlineColor], stableKey);
      showToast("Product added to cart", "success", 2800, { position: "bottom-center", replace: true });
      setCartOpen(true);
      setColorQty("");
      return;
    }

    mergeColorToCart(cartProductWithImage, selectedColors, stableKey);
    showToast("Product added to cart", "success", 2800, { position: "bottom-center", replace: true });
    setCartOpen(true);
    setSelectedColors([]);
    setColorQty("");
  }, [
    selectedColors,
    currentPickedColor,
    colorQty,
    cartProduct,
    slides,
    slideIndex,
    urlProduct,
    buildCartProductWithImage,
    mergeColorToCart,
    showToast,
    setCartOpen,
  ]);

  // ── 404 ──────────────────────────────────────────────────────────────────
  if (!urlProduct) {
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
          <Link to={`/shop?category=${encodeURIComponent(urlProduct.category)}`} className="breadcrumb__link">
            {urlProduct.category}
          </Link>
          <span className="breadcrumb__sep">/</span>
          <span className="breadcrumb__current" aria-current="page">
            {isTShirt ? tshirtLabel(product.subCategory) : product.name}
          </span>
        </nav>

        {/* ════════════════════════════════════════════════════════════
            T-SHIRT LAYOUT
            ════════════════════════════════════════════════════════════ */}
        {isTShirt ? (
          <>
            <div className="pdp-layout">

            {/* ── LEFT: Standard sticky gallery ── */}
            <section className="pdp-gallery" aria-label="Product images">

              <div
                ref={zoom.containerRef}
                className={`pdp-gallery__main${zoom.active ? " pdp-gallery__main--zooming" : ""}`}
                {...zoom.handlers}
              >
                <img
                  key={`${product.id}-${innerImageIndex}-${slideIndex}`}
                  src={displayedImage}
                  alt={product.name}
                  className={`pdp-gallery__main-img${zoom.active ? " pdp-gallery__main-img--hidden" : ""}`}
                  draggable={false}
                />
                <div ref={zoom.bgRef} className={`pdp-zoom__bg${zoom.active ? " active" : ""}`} aria-hidden="true" />
                <div className={`pdp-gallery__touch-hint${zoom.isTouchZoomed ? " pdp-gallery__touch-hint--panning" : ""}`} aria-hidden="true">
                  {zoom.isTouchZoomed ? "Drag to pan" : "Tap to zoom"}
                </div>

                {slides.length > 1 && (
                  <>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--prev" onClick={handlePrevSlide} disabled={slideIndex === 0} aria-label="Previous variant"><ChevronLeft /></button>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--next" onClick={handleNextSlide} disabled={slideIndex === slides.length - 1} aria-label="Next variant"><ChevronRight /></button>
                    <span className="pdp-gallery__counter" aria-hidden="true">{slideIndex + 1} / {slides.length}</span>
                  </>
                )}
              </div>

              {visibleApparelThumbnails.length > 0 && (
                <div className="pdp-thumb-strip" role="list" aria-label="Apparel variant previews">
                  {visibleApparelThumbnails.map((slide) => {
                    const idx = slides.indexOf(slide);
                    return (
                      <button
                        key={`thumb-${slide.id}`} type="button"
                        className={`pdp-thumb__card${idx === activeSlideIndex ? " active" : ""}`}
                        onClick={() => handleThumbClick(idx, slide.image)}
                        aria-label={`${slide.subCategory} — ${slide.colorName || slide.name}`}
                        aria-pressed={idx === activeSlideIndex}
                      >
                        <div className="pdp-thumb__img-wrap">
                          <img src={slide.image} alt={`${slide.colorName || slide.name} preview`} loading="lazy" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── RIGHT: Product info ── */}
            <article className="pdp-info pdp-info--tshirt-right">

              <div className="pdp-info__name-row">
                <h1 className="pdp-info__name">
                  {product.name}
                </h1>
                {/* ── FIXED: WishlistBtn now receives the correct isWishlisted state
                        (based on product.id / current slide) and toggles it correctly. ── */}
                <div className="pdp-info__wishlist-wrap">
                  <WishlistBtn isWishlisted={isWishlisted} onToggle={handleToggleWishlist} />
                  <span className="pdp-info__wishlist-tip">
                    {isWishlisted ? "Remove from wishlist" : "Click to add to your wishlist"}
                  </span>
                </div>
              </div>

              {product.description && (
                <div className="pdp-info__description">
                  <p className="pdp-desc-text">{product.description}</p>
                </div>
              )}

            </article>

          </div>

          <div className="pdp-extra-content">
            <div className="color-customization-page color-customization-page--inline">
              <div className="section">
                <div className="sec-eyebrow">Colours &amp; Shades</div>
                <div className="sec-title">Colour Customization</div>
                <p className="sec-sub">
                  The shades in our product images are samples, not the full range. We source fabric
                  across the complete colour spectrum to match your exact brief. Share a Pantone code,
                  RAL reference, hex value, or physical swatch and we'll try to source the shade for
                  your bulk order.
                </p>

                <SpectrumColorPicker onColorChange={handleColorChange} />

                <div className="selected-color-display">
                  <div
                    className="color-swatch-lg"
                    style={{ background: currentPickedColor.hex }}
                  />
                  <div className="color-info-text">
                    <div className="color-label">{currentPickedColor.name}</div>
                    <div className="color-hex">{currentPickedColor.hex.toUpperCase()}</div>
                  </div>
                </div>

                <div className="quantity-wrap">
                  <span className="quantity-label">
                    Quantity (pcs)<span className="qty-required-mark" aria-hidden="true"> *</span>:
                  </span>
                  <input
                    type="number"
                    min="1"
                    className={`qty-input${colorQtyError ? " qty-input--error" : ""}`}
                    placeholder="e.g. 100"
                    value={colorQty}
                    aria-required="true"
                    aria-invalid={colorQtyError}
                    onChange={e => {
                      setColorQty(e.target.value);
                      if (colorQtyError && parseInt(e.target.value, 10) >= 1) setColorQtyError(false);
                    }}
                  />
                  {colorQtyError && (
                    <p className="qty-error-msg" role="alert">Please enter a quantity</p>
                  )}
                </div>

                <div className="color-actions">
                  <button className="btn-add-color" onClick={handleAddColor} type="button">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="7" y1="2" x2="7" y2="12" />
                      <line x1="2" y1="7" x2="12" y2="7" />
                    </svg>
                    Add Colour
                  </button>

                  <div className="btn-add-to-cart-wrap">
                    <button className="btn-add-to-cart" onClick={handleColorAddToCart} type="button">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 1h2l1.5 7h7l1.5-5H4" />
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="11" cy="12" r="1" />
                      </svg>
                     Get Quote
                    </button>
                  </div>

                </div>

                {selectedColors.length > 0 && (
                  <div className="selected-colors-list">
                    <div className="selected-colors-title">
                      Selected Colours ({selectedColors.length})
                    </div>
                    <div className="color-chips-row">
                      {selectedColors.map((c, i) => (
                        <div className="color-chip-item" key={`${c.hex}-${i}`}>
                          <div className="chip-dot" style={{ background: c.hex }} />
                          <span className="chip-label">
                            {c.name}
                            <span className="chip-hex"> · {c.hex.toUpperCase()}</span>
                            {c.quantity && <span className="chip-qty"> ×{c.quantity}</span>}
                          </span>
                          <button className="chip-remove" onClick={() => handleRemoveColor(c.hex)} aria-label={`Remove ${c.name}`}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <YogoB2BContent />
          </div>
        </>
        ) : (
          /* ── NON-T-SHIRT LAYOUT ── */
          <div className="pdp-layout">

            <section className="pdp-gallery" aria-label="Product images">
              <div
                ref={zoom.containerRef}
                className={`pdp-gallery__main${zoom.active ? " pdp-gallery__main--zooming" : ""}`}
                {...zoom.handlers}
              >
                <img
                  key={`${product.id}-${innerImageIndex}-${slideIndex}`}
                  src={displayedImage}
                  alt={product.name}
                  className={`pdp-gallery__main-img${zoom.active ? " pdp-gallery__main-img--hidden" : ""}`}
                  draggable={false}
                />
                <div ref={zoom.bgRef} className={`pdp-zoom__bg${zoom.active ? " active" : ""}`} aria-hidden="true" />
                <div className={`pdp-gallery__touch-hint${zoom.isTouchZoomed ? " pdp-gallery__touch-hint--panning" : ""}`} aria-hidden="true">
                  {zoom.isTouchZoomed ? "Drag to pan" : "Tap to zoom"}
                </div>

                {!isCopper && !isPottery && !isBags && !isWooden && productImages.length > 1 && (
                  <>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--prev" onClick={handlePrevImage} disabled={innerImageIndex === 0} aria-label="Previous image"><ChevronLeft /></button>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--next" onClick={handleNextImage} disabled={innerImageIndex === productImages.length - 1} aria-label="Next image"><ChevronRight /></button>
                    <span className="pdp-gallery__counter" aria-hidden="true">{innerImageIndex + 1} / {productImages.length}</span>
                  </>
                )}

                {isSlider && slides.length > 1 && productImages.length <= 1 && (
                  <>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--prev" onClick={handlePrevSlide} disabled={slideIndex === 0} aria-label="Previous variant"><ChevronLeft /></button>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--next" onClick={handleNextSlide} disabled={slideIndex === slides.length - 1} aria-label="Next variant"><ChevronRight /></button>
                    <span className="pdp-gallery__counter" aria-hidden="true">{slideIndex + 1} / {slides.length}</span>
                  </>
                )}

                {isHandicraftVar && handicraftVariants.length > 1 && (
                  <>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--prev" onClick={handlePrevHandicraftVar} disabled={handicraftVarIndex === 0} aria-label="Previous variant"><ChevronLeft /></button>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--next" onClick={handleNextHandicraftVar} disabled={handicraftVarIndex === handicraftVariants.length - 1} aria-label="Next variant"><ChevronRight /></button>
                    <span className="pdp-gallery__counter" aria-hidden="true">{handicraftVarIndex + 1} / {handicraftVariants.length}</span>
                  </>
                )}
              </div>

              {!isCopper && !isPottery && !isBags && !isWooden && productImages.length > 1 && (
                <div className="pdp-thumb-strip" role="list" aria-label="Product image variations">
                  {productImages.map((imgSrc, idx) => (
                    <button
                      key={idx} type="button"
                      className={`pdp-thumb__card${idx === innerImageIndex ? " active" : ""}`}
                      onClick={() => handleInnerThumbClick(idx)}
                      aria-label={`Image ${idx + 1}`} aria-pressed={idx === innerImageIndex}
                    >
                      <div className="pdp-thumb__img-wrap"><img src={imgSrc} alt={`${product.name} view ${idx + 1}`} loading="lazy" /></div>
                    </button>
                  ))}
                </div>
              )}

              {isHandicraftVar && handicraftVariants.length > 1 && (
                <div className="pdp-thumb-strip" role="list" aria-label={`${urlProduct.subCategory} variations`}>
                  {handicraftVariants.map((variant, idx) => (
                    <button
                      key={`hvar-${variant.id}`} type="button"
                      className={`pdp-thumb__card${idx === handicraftVarIndex ? " active" : ""}`}
                      onClick={() => handleHandicraftVarClick(idx, variant.image)}
                      aria-label={variant.name} aria-pressed={idx === handicraftVarIndex}
                    >
                      <div className="pdp-thumb__img-wrap"><img src={variant.image} alt={variant.name} loading="lazy" /></div>
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
                {urlProduct.stock ? (
                  <button className="btn btn-secondary pdp-info__add-btn" onClick={handleAddToCart}>
                    Get Quote
                    <span className="pdp-info__add-hint">Use "Add to cart" to inquire about multiple products.</span>
                  </button>
                ) : (
                  <button className="btn btn-ghost pdp-info__add-btn" disabled>Out of Stock</button>
                )}
              </div>

              <div className="pdp-info__description">
                <p className="pdp-desc-text">{product.description}</p>
              </div>
            </article>

          </div>
        )}

        {/* ── YOU MAY ALSO LIKE ── */}
        {hasYmal && youMayAlsoLike.length > 0 && (
          <section className="ymal-section" aria-label="You may also like">
            <div className="ymal-section__header">
              <h2 className="ymal-section__title">You May Also Like</h2>
              {ymalSubtitle && <p className="ymal-section__sub">{ymalSubtitle}</p>}
            </div>
            <div className="ymal-grid">
              {youMayAlsoLike.map(p => (
                <YmalCard
                  key={p.id}
                  product={p}
                  onSlide={isFoam
                    ? () => { setSlideIndex(foamYmalSlideIndexMap[p.id] ?? 0); window.scrollTo({ top: 0, behavior: "smooth" }); }
                    : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}