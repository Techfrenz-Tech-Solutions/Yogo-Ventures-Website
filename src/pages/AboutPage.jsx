// src/pages/AboutPage.jsx
import { useScrollReveal } from "../hooks/useScrollReveal";
import "./AboutPage.css";

// ── LOCAL IMAGE IMPORTS ────────────────────────────────────────────────────────
import heroImg    from "../Assets/About/Copper2.png";   // Hero banner (full, no transparency)
import sectionAImg from "../Assets/About/Copper1.png";  // Section A — image on LEFT
import sectionBImg from "../Assets/About/Copper3.png";  // Section B — image on RIGHT

import teamMeera  from "../Assets/About/Copper3.png";   // Dr. Meera Krishnan
import teamRahul  from "../Assets/About/Copper4.png";   // Rahul Bose
import teamAnjali from "../Assets/About/Copper5.png";   // Anjali Nair
// ─────────────────────────────────────────────────────────────────────────────

const HERO_QUOTES = [
  { quote: "Authentic India, delivered worldwide.", attr: "Our Promise" },
  { quote: "Craft without compromise. Quality without question.", attr: "Yogo Ventures" },
  { quote: "From artisan hands to global homes.", attr: "Since 2019" },
];

const TEAM = [
  {
    name: "Dr. Meera Krishnan",
    role: "Co-founder & Sourcing Lead",
    img:  teamMeera,
    bio:  "20 years of expertise in artisan networks across South India, ensuring every product meets our authenticity standard.",
  },
  {
    name: "Rahul Bose",
    role: "Co-founder & Export Director",
    img:  teamRahul,
    bio:  "International trade specialist who built YoGo's global distribution from the ground up across 18 countries.",
  },
  {
    name: "Anjali Nair",
    role: "Head of Product Curation",
    img:  teamAnjali,
    bio:  "Former luxury retail buyer who personally tests every product before it earns a place in our catalog.",
  },
];

export default function AboutPage() {
  useScrollReveal([]);

  return (
    <main className="about-page page-enter" aria-label="About Yogo Ventures">

      {/* ══════════════════════════════════════════
          HERO — full image, no transparency, quotes
         ══════════════════════════════════════════ */}
      <section className="about-hero" aria-label="Hero">
        <img
          src={heroImg}
          alt="Yogo Ventures — Indian Artisan Products"
          className="about-hero__img"
        />
        {/* Dark gradient overlay so quotes are legible */}
        <div className="about-hero__overlay" aria-hidden="true" />

        <div className="about-hero__content container">
          <span className="about-hero__eyebrow">Yogo Ventures · Chennai, India</span>
          <h1 className="about-hero__title">
            Rooted in India,<br />
            <em>Built for the World</em>
          </h1>

          {/* Rotating / stacked quotes */}
          <div className="about-hero__quotes" aria-label="Our values">
            {HERO_QUOTES.map(({ quote, attr }) => (
              <blockquote key={attr} className="about-hero__quote">
                <p className="about-hero__quote-text">"{quote}"</p>
                <cite className="about-hero__quote-attr">— {attr}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION A — Image LEFT · Paragraph RIGHT
         ══════════════════════════════════════════ */}
      <section className="about-split section" aria-labelledby="story-a-heading">
        <div className="container about-split__inner">

          {/* LEFT — image */}
          <div className="about-split__img-col reveal">
            <img
              src={sectionAImg}
              alt="Yogo Ventures — Copper Utensils crafted in India"
              className="about-split__img"
              loading="lazy"
            />
          </div>

          {/* RIGHT — text */}
          <div className="about-split__text-col reveal reveal-delay-1">
            <span className="section-tag">Our Roots</span>
            <h2 className="section-title about-split__heading" id="story-a-heading">
              From Artisan Hands<br />to Your Doorstep
            </h2>
            <p className="about-split__para">
              Founded in 2019 in Chennai, YoGo Ventures was born from a simple belief — that India's
              finest craftsmanship deserves a global audience. We bridge the gap between skilled artisan
              clusters and discerning buyers worldwide, building supply chains that are transparent,
              ethical, and deeply rooted in Indian heritage.
            </p>
            <p className="about-split__para">
              Every product we carry — from GI-tagged handicrafts and BIS-certified copper utensils to
              GOTS-certified organic cotton apparel and ergonomic memory foam — is personally verified
              before it leaves our warehouse. We are not a marketplace. We are curators, advocates, and
              partners to the artisans who make what we sell.
            </p>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION B — Paragraph LEFT · Image RIGHT
         ══════════════════════════════════════════ */}
      <section className="about-split about-split--alt section section--alt" aria-labelledby="story-b-heading">
        <div className="container about-split__inner">

          {/* LEFT — text */}
          <div className="about-split__text-col reveal">
            <span className="section-tag">Our Promise</span>
            <h2 className="section-title about-split__heading" id="story-b-heading">
              Quality Without<br />Compromise
            </h2>
            <p className="about-split__para">
              At YoGo Ventures, authenticity is not a marketing word — it is an operational standard.
              Each category we serve carries its own rigorous certification pathway: GI tags for
              handicrafts, BIS hallmarks for copper, GOTS certification for organic apparel, and
              certified foam grades for our wellness products.
            </p>
            <p className="about-split__para">
              We work directly with manufacturer clusters in Tirupur, Moradabad, Jaipur, and beyond —
              paying fair prices, maintaining long-term relationships, and investing in artisan
              communities. When you buy through YoGo Ventures, you are not just purchasing a product;
              you are sustaining a craft, a family, and a tradition that has endured for generations.
            </p>
            <ul className="about-split__pillars" aria-label="Our pillars">
              {[
                "GI-Tagged & BIS-Certified Products",
                "Direct Artisan Sourcing — Zero Middlemen",
                "Pan-India Manufacturer Network",
                "Global Export Compliance Standards",
              ].map((item) => (
                <li key={item} className="about-split__pillar">
                  <span className="about-split__pillar-dot" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — image */}
          <div className="about-split__img-col reveal reveal-delay-1">
            <img
              src={sectionBImg}
              alt="Yogo Ventures — Handicrafts sourced from Indian artisans"
              className="about-split__img"
              loading="lazy"
            />
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════
          TEAM
         ══════════════════════════════════════════ */}
      <section className="about-team section" aria-labelledby="team-heading">
        <div className="container">
          <header className="section-header reveal">
            <span className="section-tag">The People</span>
            <h2 className="section-title" id="team-heading">Meet Our Team</h2>
            <p className="about-team__subhead">
              The curators, connectors, and champions behind every YoGo Ventures product.
            </p>
          </header>

          <div className="about-team__grid">
            {TEAM.map((member, i) => (
              <article
                key={member.name}
                className={`about-team__card reveal reveal-delay-${i + 1}`}
                aria-label={`Team member: ${member.name}`}
              >
                <div className="about-team__card-img-wrap">
                  <img
                    src={member.img}
                    alt={`Portrait of ${member.name}`}
                    className="about-team__card-img"
                    loading="lazy"
                  />
                </div>
                <div className="about-team__card-body">
                  <h3 className="about-team__card-name">{member.name}</h3>
                  <p className="about-team__card-role">{member.role}</p>
                  <p className="about-team__card-bio">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}