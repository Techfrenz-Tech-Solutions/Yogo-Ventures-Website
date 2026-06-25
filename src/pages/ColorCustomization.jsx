import { useState, useRef, useCallback, useEffect } from "react";


// ── Color name lookup ──
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
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
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
  { name: "Denim",        h: 215, s: 40,  l: 40  },
  { name: "Teal",         h: 180, s: 100, l: 25  },
  { name: "Cyan",         h: 180, s: 100, l: 50  },
  { name: "Turquoise",    h: 175, s: 65,  l: 50  },
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
  { name: "Terracotta",   h: 15,  s: 60,  l: 50  },
  { name: "Red",          h: 0,   s: 100, l: 40  },
  { name: "Crimson",      h: 348, s: 94,  l: 36  },
  { name: "Maroon",       h: 0,   s: 100, l: 25  },
  { name: "Pink",         h: 350, s: 100, l: 75  },
  { name: "Hot Pink",     h: 330, s: 100, l: 60  },
  { name: "Rose",         h: 350, s: 75,  l: 60  },
  { name: "Blush",        h: 345, s: 55,  l: 82  },
  { name: "Lavender",     h: 270, s: 50,  l: 75  },
  { name: "Purple",       h: 270, s: 70,  l: 40  },
  { name: "Violet",       h: 270, s: 100, l: 55  },
  { name: "Plum",         h: 300, s: 50,  l: 30  },
  { name: "Magenta",      h: 300, s: 100, l: 50  },
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
  let best = COLOR_NAMES[0];
  let bestDist = Infinity;
  for (const c of COLOR_NAMES) {
    const dh = Math.min(Math.abs(h - c.h), 360 - Math.abs(h - c.h));
    const dist = dh * 1.5 + Math.abs(s - c.s) + Math.abs(l - c.l) * 1.2;
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best.name;
}

// ── Lock SVG (reusable) ──
function LockSVG() {
  return (
    <svg
      style={{ width: 13, height: 13, flexShrink: 0 }}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="6" width="10" height="7" rx="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" />
    </svg>
  );
}

// ── Quote Modal ──
function QuoteModal({ colors, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Request a Quote</div>
        <div className="modal-sub">
          Your selection has been noted. Our team will get back to you within 24 hours
          with pricing and availability.
        </div>
        <div className="modal-summary">
          <div className="modal-summary-row">
            <span className="modal-summary-key">Colors selected</span>
            <span className="modal-summary-val">
              {colors.length} colour{colors.length !== 1 ? "s" : ""}
            </span>
          </div>
          {colors.length > 0 && (
            <>
              <div className="modal-colors-preview">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    title={`${c.name} ${c.hex}`}
                    className="modal-color-dot"
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
              <div className="modal-color-labels">
                {colors.map((c, i) => (
                  <span key={i} className="modal-color-label-item">
                    {c.name} ({c.hex.toUpperCase()})
                    {c.quantity ? ` × ${c.quantity} pcs` : ""}
                    {i < colors.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="modal-btns">
          <button className="modal-btn-close" onClick={onClose}>Close</button>
          <button className="modal-btn-submit" onClick={onClose}>Send Enquiry →</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
export default function App() {
  const canvasRef = useRef(null);
  const [pickerHue, setPickerHue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });
  const [currentPickedColor, setCurrentPickedColor] = useState({ hex: "#335765", name: "Deep Teal" });
  const [selectedColors, setSelectedColors] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ── Canvas drawing ──
  const drawCanvas = useCallback((h) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, 200);

    ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, 200);

    const wg = ctx.createLinearGradient(0, 0, canvas.width, 0);
    wg.addColorStop(0, "rgba(255,255,255,1)");
    wg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, canvas.width, 200);

    const bg = ctx.createLinearGradient(0, 0, 0, 200);
    bg.addColorStop(0, "rgba(0,0,0,0)");
    bg.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, 200);
  }, []);

  useEffect(() => { drawCanvas(pickerHue); }, [pickerHue, drawCanvas]);

  useEffect(() => {
    const handleResize = () => drawCanvas(pickerHue);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pickerHue, drawCanvas]);

  // ── Color picking ──
  const pickColorAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const px = Math.max(0, Math.min(canvas.width - 1,
      Math.round((clientX - rect.left) * (canvas.width / rect.width))
    ));
    const py = Math.max(0, Math.min(199,
      Math.round((clientY - rect.top) * (canvas.height / rect.height))
    ));
    const d = ctx.getImageData(px, py, 1, 1).data;
    const hex =
      "#" +
      d[0].toString(16).padStart(2, "0") +
      d[1].toString(16).padStart(2, "0") +
      d[2].toString(16).padStart(2, "0");
    setCursor({
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    });
    setCurrentPickedColor({ hex, name: getColorName(hex) });
  }, []);

  // ── Handlers ──
  const handleAddColor = () => {
    if (selectedColors.find(c => c.hex === currentPickedColor.hex)) return;
    setSelectedColors(prev => [
      ...prev,
      { ...currentPickedColor, quantity: quantity || "" },
    ]);
  };

  const handleRemoveColor = (hex) => {
    setSelectedColors(prev => prev.filter(c => c.hex !== hex));
  };

  // ── Static data ──
  const fabrics = [
    {
      badge: "badge-hot", badgeText: "#1 Worldwide",
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776002633/cotton_jersey_vsasuo.png",
      name: "Cotton Jersey", comp: "100% Combed Ring-Spun Cotton",
      markets: ["Everyday", "Basics"],
    },
    {
      badge: "badge-hot", badgeText: "Top Pick",
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776002633/cvc_ftfhjk.png",
      name: "CVC Blend", comp: "60% Cotton, 40% Polyester",
      markets: ["Durable", "Promo Wear"],
    },
    {
      badge: "badge-new", badgeText: "Streetwear",
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776002633/french_terry_v1oose.png",
      name: "French Terry", comp: "100% Cotton / Blend",
      markets: ["Athleisure", "Trend"],
    },
    {
      badge: "badge-new", badgeText: "Performance",
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776002633/dry_fit_tlyx8x.png",
      name: "Dry Fit", comp: "100% Polyester",
      markets: ["Activewear", "Sports"],
    },
    {
      badge: "badge-eco", badgeText: "Luxury",
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776002633/modal_ljgfns.png",
      name: "Modal", comp: "100% Modal / Blend",
      markets: ["Premium", "Comfort"],
    },
    {
      badge: "badge-eco", badgeText: "Polo Essential",
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776002634/pique_qgnzcb.png",
      name: "Pique", comp: "Cotton / Blend",
      markets: ["Structured", "Global Demand"],
    },
  ];

  const prints = [
    {
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776359870/screen_printing_yxozwh.jpg",
      name: "Screen Printing",
      desc: "Dominant worldwide — vibrant, durable, and ideal for bulk orders in any market.",
      tag: "Plastisol · Water-Based",
    },
    {
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776362172/dtf_print_h0hfzm.png",
      name: "DTF — Direct to Film",
      desc: "Photo-quality, any-fabric, any-colour. Preferred by fashion brands across EU.",
      tag: "No colour limits",
    },
    {
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776362634/embroidery_3_rztvie.png",
      name: "Embroidery",
      desc: "Flat, 3D puff and chenille — the go-to for premium, corporate, and luxury brand identity.",
      tag: "Logo · Name · Badge",
    },
    {
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776359873/puff_print_ed_d5d7un.png",
      name: "Puff & 3D Print",
      desc: "Raised, tactile texture trending across global streetwear and lifestyle collections.",
      tag: "Feel the quality",
    },
    {
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776365202/vintage_wash_2_ezkpjy.png",
      name: "Vintage Wash Finish",
      desc: "Garment-dyed, lived-in aesthetic dominating Gen Z and premium casual globally.",
      tag: "Acid · Pigment",
    },
    {
      img: "https://res.cloudinary.com/dahzt8ilg/image/upload/v1776364912/sublimation_eqj13x.png",
      name: "Sublimation & AOP",
      desc: "Edge-to-edge all-over prints — high demand across Asia-Pacific fashion and sportswear.",
      tag: "Full coverage",
    },
  ];

  const flowSteps = [
    { n: "1", title: "Submit Enquiry", desc: "Share your design brief, quantities, and fabric preferences." },
    { n: "2", title: "Spec Review",    desc: "Our team reviews and confirms fabric, print and colour options." },
    { n: "3", title: "Sample",         desc: "Pre-production sample made and shipped for approval." },
    { n: "4", title: "Production",     desc: "Full bulk run on confirmed spec with QC at every stage." },
    { n: "5", title: "Delivery",       desc: "Packed, labelled and shipped to your warehouse or 3PL." },
  ];

  useScrollReveal([]);

  return (
    <main className="color-customization-page page-enter" aria-label="Color Customization">
      <div className="hero">
        <p className="hero-sub">
          Premium custom apparel built for global wholesale — the right fabric for your
          market, the right finish for your brand, developed to your exact brief.
        </p>
        <div className="stats-row">
          <div className="stat"><div className="n">18+</div><div className="l">Fabrics</div></div>
          <div className="stat"><div className="n">70+</div><div className="l">Print Types</div></div>
          <div className="stat"><div className="n">16</div><div className="l">Washes</div></div>
          <div className="stat"><div className="n">15</div><div className="l">Embroidery</div></div>
        </div>
      </div>

      {/* ── FABRICS ── */}
      <div className="section">
        <div className="sec-eyebrow">What we work with</div>
        <div className="sec-title">Globally Demanded Fabrics</div>
        <p className="sec-sub">
          Selected from what wholesale buyers across the Globe are actively sourcing —
          comfort, performance, and sustainability covered.
        </p>
        <div className="fab-grid">
          {fabrics.map((f, i) => (
            <div className="fab-card" key={i}>
              <div className={`fab-badge ${f.badge}`}>{f.badgeText}</div>
              <div className="fab-img">
                <img src={f.img} alt={f.name} />
              </div>
              <div className="fab-info">
                <div className="fab-name">{f.name}</div>
                <div className="fab-comp">{f.comp}</div>
                <div className="fab-markets">
                  {f.markets.map(m => <span className="fmkt" key={m}>{m}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="teaser">
          <div className="teaser-top">
            <span className="teaser-label">12 more fabrics available →</span>
            <div className="chips">
              <span className="chip">Viscose</span>
              <span className="chip">Fleece</span>
              <span className="chip chip-blur">Waffle Knit</span>
              <span className="chip chip-blur">Scuba</span>
              <span className="chip chip-blur">Velour</span>
              <span className="chip chip-blur">Lycra Jersey</span>
            </div>
          </div>
          <div className="unlock">
            <LockSVG />
            Full fabric catalogue shared after enquiry
          </div>
        </div>
      </div>

      {/* ── PRINTS ── */}
      <div className="section">
        <div className="sec-eyebrow">How we bring designs to life</div>
        <div className="sec-title">Most Ordered Print Techniques</div>
        <p className="sec-sub">
          What global wholesale buyers are choosing — from high-volume screen prints to
          luxury embroidery and the latest digital finishes.
        </p>
        <div className="print-grid">
          {prints.map((p, i) => (
            <div className="print-card" key={i}>
              <div className="print-img">
                <img src={p.img} alt={p.name} />
              </div>
              <div className="print-info">
                <div className="print-name">{p.name}</div>
                <div className="print-desc">{p.desc}</div>
                <span className="print-tag">{p.tag}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="teaser">
          <div className="teaser-top">
            <span className="teaser-label">60+ more techniques →</span>
            <div className="chips">
              <span className="chip">DTG</span>
              <span className="chip">Foil</span>
              <span className="chip chip-blur">Metallic</span>
              <span className="chip chip-blur">Discharge</span>
              <span className="chip chip-blur">Rhinestone</span>
              <span className="chip chip-blur">Laser</span>
              <span className="chip chip-blur">Gel Print</span>
            </div>
          </div>
          <div className="unlock">
            <LockSVG />
            Full print catalogue with samples shared on enquiry
          </div>
        </div>
      </div>

      {/* ── COLOURS ── */}
      <div className="section">
        <div className="sec-eyebrow">Colours &amp; Shades</div>
        <div className="sec-title">Colour Customization</div>
        <p className="sec-sub">
          The shades in our product images are samples, not the full range. We source fabric
          across the complete colour spectrum to match your exact brief. Share a Pantone code,
          RAL reference, hex value, or physical swatch and we'll try to source the shade for
          your bulk order.
        </p>

        <div className="sec-eyebrow" style={{ marginBottom: "0.5rem" }}>Pick Your Colour</div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: "1rem" }}>
          Drag across the palette to mix and pick any colour. Adjust the hue slider to change the base colour.
        </p>

        {/* ── Canvas colour picker ── */}
        <div
          className="canvas-picker-wrap"
          onMouseDown={e => { setIsDragging(true); pickColorAt(e.clientX, e.clientY); }}
          onMouseMove={e => { if (isDragging) pickColorAt(e.clientX, e.clientY); }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={e => { e.preventDefault(); pickColorAt(e.touches[0].clientX, e.touches[0].clientY); }}
          onTouchMove={e => { e.preventDefault(); pickColorAt(e.touches[0].clientX, e.touches[0].clientY); }}
        >
          <canvas ref={canvasRef} className="canvas-picker" />
          <div
            className="canvas-cursor"
            style={{
              left: `calc(${cursor.x * 100}% - 8px)`,
              top: `calc(${cursor.y * 100}% - 8px)`,
              background: currentPickedColor.hex,
              transition: isDragging ? "none" : "left .05s, top .05s",
            }}
          />
        </div>

        {/* ── Hue slider ── */}
        <input
          type="range"
          min="0"
          max="360"
          value={pickerHue}
          onChange={e => setPickerHue(Number(e.target.value))}
          className="hue-slider"
        />

        {/* ── Picked colour display ── */}
        <div className="selected-color-display">
          <div className="color-swatch-lg" style={{ background: currentPickedColor.hex }} />
          <div className="color-info-text">
            <div className="color-label">{currentPickedColor.name}</div>
            <div className="color-hex">{currentPickedColor.hex.toUpperCase()}</div>
          </div>
        </div>

        {/* ── Quantity input ── */}
        <div className="quantity-wrap">
          <span className="quantity-label">Quantity (pcs):</span>
          <input
            type="number"
            min="1"
            className="qty-input"
            placeholder="e.g. 100"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </div>

        {/* ── Action buttons ── */}
        <div className="color-actions">
          <button className="btn-add-color" onClick={handleAddColor}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="7" y1="2" x2="7" y2="12" />
              <line x1="2" y1="7" x2="12" y2="7" />
            </svg>
            Add Colour
          </button>
          <button className="btn-get-quote" onClick={() => setShowModal(true)}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 2h10v8H8l-3 2v-2H2z" />
            </svg>
            Get Quote
          </button>
        </div>

        {/* ── Selected colours list ── */}
        {selectedColors.length > 0 && (
          <div className="selected-colors-list">
            <div className="selected-colors-title">
              Selected Colours ({selectedColors.length})
            </div>
            <div className="color-chips-row">
              {selectedColors.map((c, i) => (
                <div className="color-chip-item" key={i}>
                  <div className="chip-dot" style={{ background: c.hex }} />
                  <span className="chip-label">
                    {c.name} · {c.hex.toUpperCase()}
                    {c.quantity && (
                      <span className="chip-qty">× {c.quantity} pcs</span>
                    )}
                  </span>
                  <button
                    className="chip-remove"
                    onClick={() => handleRemoveColor(c.hex)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ORDER FLOW ── */}
      <div className="section">
        <div className="sec-eyebrow">How it works</div>
        <div className="sec-title">Order Process</div>
        <p className="sec-sub">A simple, transparent workflow — from brief to bulk delivery.</p>
        <div className="flow-container">
          {flowSteps.map((s, i) => (
            <>
              <div className="flow-step" key={s.n}>
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < flowSteps.length - 1 && (
                <div className="flow-arrow" key={`arrow-${i}`}>→</div>
              )}
            </>
          ))}
        </div>
      </div>

      {/* ── QUOTE MODAL ── */}
      {showModal && (
        <QuoteModal
          colors={selectedColors}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}