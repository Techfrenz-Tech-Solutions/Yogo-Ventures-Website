// src/pages/SourcingPage.jsx
import { useNavigate } from "react-router-dom";
import heroBanner        from "../Assets/Services/Banner.png";
import panIndiaSourcing  from "../Assets/Services/Services1.png";
import customizedDev     from "../Assets/Services/Services2.png";
import privateLabel      from "../Assets/Services/Services3.png";
import qualityInspection from "../Assets/Services/Services4.png";
import bulkOrder         from "../Assets/Services/Services5.png";
import commBridge        from "../Assets/Services/Services6.png";
import whoThisIsFor      from "../Assets/Services/Services7.png";
import "./ServicesPage.css";

// ── Data ──────────────────────────────────────────────────────────────────────
const services = [
  {
    img:   panIndiaSourcing,
    title: "Pan-India Product Sourcing",
    desc:  "We source from the right manufacturers across India to ensure optimal quality and cost efficiency.",
  },
  {
    img:   customizedDev,
    title: "Customized Development",
    desc:  "We bring your ideas to life with full customization in size, material, and packaging.",
  },
  {
    img:   privateLabel,
    title: "Private Label & Branding",
    desc:  "Logo printing, packaging design, and brand building support.",
  },
  {
    img:   qualityInspection,
    title: "Quality Inspection",
    desc:  "We visit factories to ensure quality standards and production reliability.",
  },
  {
    img:   bulkOrder,
    title: "Bulk Order Management",
    desc:  "From sampling to dispatch, we manage everything efficiently.",
  },
  {
    img:   commBridge,
    title: "Communication Bridge",
    desc:  "We eliminate language barriers and ensure smooth coordination.",
  },
];

const steps = [
  {
    num:   "1",
    title: "Share Your Requirements",
    desc:  "Tell us what products you need, quantities, customization requirements, and any other details.",
  },
  {
    num:   "2",
    title: "We Source from the Best Manufacturers",
    desc:  "We connect with specialized manufacturers across India to find the best quality and cost-efficient options.",
  },
  {
    num:   "3",
    title: "Review Samples & Customization",
    desc:  "Receive product samples, check quality, and approve any customization for packaging, sizes, or materials.",
  },
  {
    num:   "4",
    title: "Place Your Bulk Order",
    desc:  "Once approved, we manage production, quality checks, and delivery to ensure a smooth bulk order process.",
  },
];

const whyChoose = [
  "Competitive pricing",
  "Transparent communication",
  "Reliable Continuous Supply",
  "Timely execution",
  "Flexible customization",
  "Compliance Certificate",
];

const audience = [
  "E-commerce and Amazon sellers seeking high-quality products for their online stores",
  "New businesses setting up stores",
  "Importers sourcing multiple product categories",
  "Brands looking for private label manufacturing",
  "Businesses needing reliable India-based sourcing support",
  "Food businesses looking to source raw materials in bulk (rice, coffee powder, spices, etc.)",
  "Cafes, restaurants, or boutique food brands sourcing specialty ingredients or packaged goods",
  "Corporate gifting companies looking for customized products",
  "Home decor, textile, or kitchenware retailers sourcing unique items directly from India",
  "Subscription box services sourcing diverse product assortments",
  "Startup brands exploring private labeling or custom packaging solutions",
];

// ── Page Component ────────────────────────────────────────────────────────────
export default function SourcingPage() {
  const navigate = useNavigate();

  return (
    <div className="sourcing-page">

      {/* ── HERO ── */}
      <section className="sourcing-hero">
        <div className="sourcing-hero__banner">
          <img src={heroBanner} alt="YoGo Sourcing — End-to-End Sourcing Across India" />
        </div>
        <div className="sourcing-container sourcing-hero__text">
          <h1 className="sourcing-hero__title">End-to-End Sourcing Across India</h1>
          <p className="sourcing-hero__sub">
            We can source any product that is specialized and manufactured in different regions across India.
          </p>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="sourcing-intro">
        <div className="sourcing-container sourcing-container--narrow sourcing-text-center">
          <h2 className="sourcing-section-title">Bridge Between Manufacturers &amp; Global Buyers</h2>
          <p className="sourcing-intro__text">
            At YoGo, we help you source the right products from the most specialized regions across India. Every product has its origin — whether it's textiles, metalware, handicrafts, kitchenware etc., we leverage our trusted manufacturing network to deliver the best sourcing solutions tailored to your needs.
          </p>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="sourcing-services">
        <div className="sourcing-container">
          <h2 className="sourcing-section-title sourcing-text-center">What We Do for You</h2>
          <div className="sourcing-services__grid">
            {services.map((s, i) => (
              <div key={i} className="sourcing-card">
                <img src={s.img} alt={s.title} className="sourcing-card__img" />
                <h3 className="sourcing-card__title">{s.title}</h3>
                <p className="sourcing-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO THIS IS FOR ── */}
      <section className="sourcing-audience">
        <div className="sourcing-container">
          <div className="sourcing-audience__inner">
            <div className="sourcing-audience__img-wrap">
              <img src={whoThisIsFor} alt="Who This Is For" className="sourcing-audience__img" />
            </div>
            <div className="sourcing-audience__content">
              <h2 className="sourcing-section-title">Who This Is For</h2>
              <ul className="sourcing-audience__list">
                {audience.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="sourcing-steps">
        <div className="sourcing-container sourcing-text-center">
          <h2 className="sourcing-steps__title">How to Use Our Service</h2>
          <p className="sourcing-steps__sub">
            Follow these simple steps to source the best products from India for your business.
            We make the process smooth, reliable, and transparent.
          </p>
          <div className="sourcing-steps__grid">
            {steps.map((s, i) => (
              <div key={i} className="sourcing-step-card">
                <div className="sourcing-step-card__num">{s.num}</div>
                <h3 className="sourcing-step-card__title">{s.title}</h3>
                <p className="sourcing-step-card__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section className="sourcing-why">
        <div className="sourcing-container sourcing-container--narrow">
          <h2 className="sourcing-section-title">Why Choose YoGo</h2>
          <ul className="sourcing-why__grid">
            {whyChoose.map((item, i) => (
              <li key={i} className="sourcing-why__item">✔ {item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sourcing-cta">
        <h2 className="sourcing-cta__title">Looking to source from India?</h2>
        <p className="sourcing-cta__sub">Let YoGo simplify your journey — from factory to final delivery.</p>
        {/* Navigates to /contact — uses site's --deep CSS variable so it
            automatically updates whenever you change your global theme color */}
        <button
          className="sourcing-cta__btn"
          onClick={() => navigate("/contact")}
          type="button"
        >
          Contact Us
        </button>
      </section>

    </div>
  );
}