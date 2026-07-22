// src/components/layout/Footer.jsx — Yogo Ventures
// SEO: semantic <nav> with aria-labels, fixed broken /privacy-policy link,
//      correct phone href values, keyword-rich tagline, schema-ready markup.
import { Link, useNavigate, useLocation } from "react-router-dom";
import { trackWhatsAppClick } from "../../utils/analytics";
import "./Footer.css";

export default function Footer() {
  const year     = new Date().getFullYear();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleFaqClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  // ── SEO: category links use the correct backend category names ───────────
  const SHOP_LINKS = [
    { label: "Fashion Apparel",      cat: "Apparel" },
    { label: "Memory Foam Products", cat: "Memory Foam Products" },
    { label: "Copper Utensils",      cat: "Copper Utensils" },
    { label: "Handicraft Items",     cat: "Handicraft Items" },
  ];

  const SITEMAP_LINKS = [
    { label: "Home",     path: "/" },
    { label: "Shop",     path: "/shop" },
    { label: "Services", path: "/services" },
    { label: "Contact",  path: "/contact" },
  ];

  const HELP_LINKS = [
    { label: "FAQ",                 path: "/#faq",          isFaq: true },
    { label: "Privacy Policy",      path: "/PrivacyPolicy" },
    { label: "Terms & Conditions",  path: "/TermOfuse" },
  ];

  return (
    <footer className="footer" role="contentinfo" aria-label="Yogo Ventures site footer">

      {/* ── MAIN GRID ── */}
      <div className="footer__main">
        <div className="container footer__main-inner">

          {/* ── Brand Column ─────────────────────────────────────────────── */}
          <div className="footer__brand-col">
            <Link to="/" className="footer__logo-wrap" aria-label="Yogo Ventures — go to homepage">
              <img
                src="./Logo.png"
                alt="Yogo Ventures logo — B2B Marketplace India"
                className="footer__logo-img"
                width="160"
                height="48"
                loading="lazy"
              />
            </Link>

            {/* SEO: keyword-rich company description for Google entity recognition */}
            <p className="footer__tagline">
              Yogo Ventures is a globally trusted B2B wholesale marketplace and product supplier
              offering premium fashion apparel, memory foam products, ayurvedic copper utensils,
              and authentic Indian handicrafts — your reliable partner for bulk orders,
              private label sourcing, and quality products from India.
            </p>

            {/* ── Social Links ── */}
            <div className="footer__socials" aria-label="Follow Yogo Ventures on social media">

              <a
                href="https://instagram.com/yogoventures"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="Follow Yogo Ventures on Instagram"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>

              <a
                href="https://linkedin.com/company/yogoventures"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="Connect with Yogo Ventures on LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>

              <a
                href="https://wa.me/919003317417"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="Chat with Yogo Ventures on WhatsApp"
                onClick={() => trackWhatsAppClick("+919003317417")}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.012 22l4.974-1.404A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 0 1-4.076-1.124l-.292-.173-3.012.85.854-2.944-.19-.302A7.95 7.95 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                </svg>
              </a>

              <a
                href="mailto:support@yogoventures.com"
                className="footer__social"
                aria-label="Email Yogo Ventures support team"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>

            </div>
          </div>

          {/* ── Shop Column ───────────────────────────────────────────────── */}
          <div className="footer__col">
            <h3 className="footer__col-heading">Shop</h3>
            <nav aria-label="Shop by product category">
              <ul className="footer__col-list">
                {SHOP_LINKS.map(l => (
                  <li key={l.cat}>
                    <Link
                      to={`/shop?category=${encodeURIComponent(l.cat)}`}
                      className="footer__col-link"
                      aria-label={`Browse ${l.label} wholesale products`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Sitemap Column ────────────────────────────────────────────── */}
          <div className="footer__col">
            <h3 className="footer__col-heading">Sitemap</h3>
            <nav aria-label="Main site navigation">
              <ul className="footer__col-list">
                {SITEMAP_LINKS.map(l => (
                  <li key={l.path}>
                    <Link to={l.path} className="footer__col-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Help Column ───────────────────────────────────────────────── */}
          <div className="footer__col">
            <h3 className="footer__col-heading">Help</h3>
            <nav aria-label="Help, legal, and policy links">
              <ul className="footer__col-list">
                {HELP_LINKS.map(l => {
                  if (l.isFaq) {
                    return (
                      <li key={l.label}>
                        <a href="/#faq" className="footer__col-link" onClick={handleFaqClick}>
                          {l.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={l.label}>
                      <Link to={l.path} className="footer__col-link">{l.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ── Contact Info — SEO: machine-readable address + contacts ── */}
            <address className="footer__contact-quick" aria-label="Yogo Ventures contact information">
              <p className="footer__contact-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.29 5.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+919003317417" aria-label="Call Yogo Ventures: +91 9003317417">+91 9003317417</a>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>,</span>
                <a href="tel:+916369681960" aria-label="Call Yogo Ventures: +91 6369681960">+91 6369681960</a>
              </p>
              <p className="footer__contact-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:support@yogoventures.com" aria-label="Email Yogo Ventures">
                  support@yogoventures.com
                </a>
              </p>
              <p className="footer__contact-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Trichy - 620003, Tamil Nadu, India</span>
              </p>
              <p className="footer__contact-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Mon – Sat : 10AM – 7PM IST</span>
              </p>
            </address>
          </div>

        </div>
      </div>

      {/* ── Wave Divider ── */}
      <div className="footer__wave-divider" aria-hidden="true">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C180,40 360,0 540,20 C720,40 900,0 1080,20 C1260,40 1380,10 1440,20 L1440,40 L0,40 Z"
            fill="rgba(182,217,224,0.12)"/>
        </svg>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <div className="footer__bottom-left">
            <small>© {year} Yogo Ventures. All rights reserved.</small>
            <span className="footer__bottom-sep" aria-hidden="true">·</span>
            <Link to="/PrivacyPolicy" className="footer__bottom-link">Privacy Policy</Link>
            <span className="footer__bottom-sep" aria-hidden="true">·</span>
            <Link to="/TermOfuse" className="footer__bottom-link">Terms of Use</Link>
          </div>
          <div className="footer__bottom-right">
            Developed by{" "}
            <a
              href="https://techfrenz.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__techfrenz"
              aria-label="TechFrenz — Web Development Agency"
            >
              TechFrenz
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
