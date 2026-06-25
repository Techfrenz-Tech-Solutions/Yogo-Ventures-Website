// FAQSection — accordion, one open at a time, SVG chevron icon
import { useState } from "react";
import { Link } from "react-router-dom";
import "./FAQSection.css";

const FAQS = [
  { q:"Is it possible to customise any product as per the Customer requirements?",
    a:"Yes. It is possible to customise any product as per the Customer requirements." },
  { q:"Is it possible to print Customer Logo on the product?",
    a:"Yes. It is possible to print customer Logo on the product." },
  { q:"Is it possible to send the Sample piece to the customer address?",
    a:"Yes. Sample piece can be sent to the customer through courier service after payment of Sample cost plus Courier charge." },
  { q:"Can I customize apparel with my own design?",
    a:"Yes, custom printing is available for bulk orders." },
  { q:"How do I clean copper items?",
    a:"Use lemon and salt, tamarind paste, or a mild copper cleaner. Avoid harsh chemicals." },
  { q:"Can I store water in the copper bottle overnight?",
    a:"Yes. Storing water for 6–8 hours enhances its benefits as per traditional practices." },
  { q:"Is copper safe for hot beverages?",
    a:"We recommend using copper only for room-temperature or cold water, not hot liquids." },
  { q:"Are the cushion covers removable and washable?",
    a:"Yes. Most of our cushion covers come with zippers and are machine-washable." },
  { q:"Do the cushions lose shape over time?",
    a:"No. Our cushions are designed to maintain their shape even with regular use." },
  { q:"Can I order custom sizes or colours for apparel?",
    a:"Yes, custom sizes and colours are available for bulk orders." },
  { q:"Are the apparel fabrics skin-friendly?",
    a:"Absolutely. We use soft, non-irritating fabrics suitable for all skin types." },
];

// Chevron SVG — rotates when open
function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24" width="20" height="20"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      className={`faq-chevron${open ? " open" : ""}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <section id="faq" className="section faq-section" aria-labelledby="faq-heading">
      <div className="container">
        <header className="section-header reveal">
          <span className="section-tag">Help Centre</span>
          <h2 className="section-title" id="faq-heading">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about our products, customisation, and services.
          </p>
        </header>

        <div className="faq-list reveal">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className={`faq-item${openIdx === i ? " open" : ""}`}
            >
              {/* Question row — click to toggle */}
              <button
                className="faq-item__question"
                onClick={() => toggle(i)}
                aria-expanded={openIdx === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                <span className="faq-item__q-number">{String(i + 1).padStart(2,"0")}</span>
                <span className="faq-item__q-text">{item.q}</span>
                <ChevronIcon open={openIdx === i}/>
              </button>

              {/* Answer — only visible when open */}
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="faq-item__answer"
                style={{
                  maxHeight: openIdx === i ? "200px" : "0",
                  opacity:   openIdx === i ? 1 : 0,
                }}
              >
                <p className="faq-item__answer-text">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta reveal">
          <Link to="/contact" className="btn btn--footer-theme btn-lg">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
