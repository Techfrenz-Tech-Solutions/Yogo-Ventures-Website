// WhyUsSection — YoGo B2B features with card effect
import "./HomeSections.css";

const WHY_DATA = [
  {
    svg: "customize",
    title: "Customization & Private Label Support",
    desc: "Whether it's product design, materials, packaging, or branding, YoGo helps you create products tailored to your market and brand identity.",
  },
  {
    svg: "price",
    title: "Competitive Pricing",
    desc: "We ensure you get the most competitive pricing without hidden markups, helping you maximize margins while maintaining product quality.",
  },
  {
    svg: "quality",
    title: "Quality Assurance",
    desc: "Samples are provided for your approval before production, and the same approved quality standards are consistently maintained throughout bulk orders.",
  },
  {
    svg: "order",
    title: "End-to-End Order Management",
    desc: "From product selection, sampling, branding, customization to production and final dispatch, we handle the entire process so you can focus on growing your business.",
  },
  {
    svg: "communication",
    title: "Seamless Communication",
    desc: "YoGo bridges language and operational gaps, ensuring clear communication, timely updates, and dependable execution throughout the sourcing process.",
  },
  {
    svg: "compliance",
    title: "Compliance & Certification Support",
    desc: "Based on the import requirements provided by you, we assist in arranging the necessary certifications, helping ensure a smooth and compliant sourcing process.",
  },
];

const ICONS = {
  customize: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
  price: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  quality: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  order: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  communication: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  compliance: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
};

// Accent colours cycling through brand palette
const ACCENTS = ["#335765","#B87333","#335765","#7F543D","#4A6B8A","#335765"];

export function WhyUsSection() {
  return (
    <section className="section section--alt" aria-labelledby="whyus-heading">
      <div className="container">
        <header className="section-header reveal">
          <span className="section-tag">Why Choose YoGo</span>
          <p className="section-subtitle">
            Six key advantages that make YoGo Ventures the preferred choice for global buyers.
          </p>
        </header>
        <div className="why-grid">
          {WHY_DATA.map((w, i) => (
            <div
              key={w.title}
              className={`why-card reveal reveal-delay-${(i % 3) + 1}`}
              style={{ "--why-accent": ACCENTS[i] }}
            >
              {/* Coloured top accent bar */}
              <div className="why-card__accent-bar" aria-hidden="true"/>
              {/* Icon */}
              <div className="why-card__icon" aria-hidden="true">
                {ICONS[w.svg]}
              </div>
              <h3 className="why-card__title">{w.title}</h3>
              <p className="why-card__desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
