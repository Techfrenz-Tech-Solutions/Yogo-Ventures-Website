// src/components/home/BrandsSection.jsx — Marquee infinite loop
import { TRUSTED_BRANDS } from "../../data/content";
import "./HomeSections.css";

const BRANDS_LIST = [
  { name: "Craftsvilla" },    { name: "FabIndia" },
  { name: "Jaypore" },        { name: "Amala Earth" },
  { name: "Desi Krafts" },    { name: "iTokri" },
  { name: "Tana Bana" },      { name: "Okhai" },
  { name: "CopperKing" },     { name: "SleepWell" },
  { name: "KolhamCraft" },    { name: "TamilWeave" },
  { name: "YogoArtisans" },   { name: "PureCopperCo" },
  { name: "FoamElite" },      { name: "CraftRoots" },
];

export function BrandsSection() {
  // Duplicate for seamless loop
  const doubled = [...BRANDS_LIST, ...BRANDS_LIST];
  return (
    <section className="section brands-section" aria-labelledby="brands-heading">
      <div className="container">
        <header className="section-header reveal">
          <span className="section-tag">Our Partners</span>
          <h2 className="section-title" id="brands-heading">Trusted Brands</h2>
          <p className="section-subtitle">Partnering with India's finest brands and artisan collectives.</p>
        </header>
      </div>
      {/* Full-width marquee */}
      <div className="brands-marquee-wrap" aria-label="Brand partners marquee">
        <div className="brands-marquee-track">
          {doubled.map((b, i) => (
            <div key={i} className="brand-marquee-pill" aria-label={b.name}>
              <span className="brand-marquee-dot" aria-hidden="true" />
              <span className="brand-marquee-name">{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
