// src/App.jsx — Yogo Ventures
import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// Layout
import Header    from "./components/layout/Header";
import Footer    from "./components/layout/Footer";

// Common
// import EnquiryModal  from "./components/common/EnquiryModal";
// import CookieConsent from "./components/common/CookieConsent";
import ThemeSwitcher from "./components/common/ThemeSwitcher";
import ScrollUp      from "./components/common/ScrollUp";
import Toast         from "./components/common/Toast";
import SiteLoader    from "./components/common/SiteLoader";

// Mobile bottom navigation (replaces old MobileNav / hamburger)
import BottomNav from "./components/common/BottomNav";

// Cart
import MiniCart from "./components/cart/MiniCart";

// Pages
import HomePage          from "./pages/HomePage";
import ShopPage          from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage      from "./pages/CheckoutPage";
// import BlogPage          from "./pages/BlogPage";
// import BlogDetailPage    from "./pages/BlogDetailPage"; // ── ADDED
import ServicesPage      from "./pages/ServicesPage";
// import AboutPage         from "./pages/AboutPage";
import ContactPage       from "./pages/ContactPage";
import WishlistPage      from "./pages/WishlistPage";
import TermOfuse         from "./pages/TermOfuse";
import PrivacyPolicy     from "./pages/PrivacyPolicy";
import "./styles/globals.css";
import ParticlesBackground from "./components/common/ParticlesBackground";

export default function App() {
  const [enquiryOpen,   setEnquiryOpen]   = useState(true);
  const [cookieVisible, setCookieVisible] = useState(true);
  const location = useLocation();

  /*
   * showLoader — true ONLY on the very first page load of the session.
   * All subsequent in-app navigations skip the loader entirely.
   */
  const [showLoader, setShowLoader] = useState(() => {
    if (sessionStorage.getItem("siteLoaded")) return false;
    return true;
  });

  useEffect(() => {
    if (showLoader) {
      sessionStorage.setItem("siteLoaded", "true");
    }
  }, [showLoader]);

  // Scroll to top + GSAP page transition on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    gsap.fromTo(".page-enter",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", clearProps: "all" }
    );
  }, [location.pathname]);

  // GSAP scroll reveal — reruns on route change
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal").forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.75, ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            }
          }
        );
      });
    });
    return () => ctx.revert();
  }, [location.pathname]);

  // IntersectionObserver — adds .is-visible to .section-header when scrolled into view
  // This triggers the CSS tag/title/subtitle animations defined in globals.css
  useEffect(() => {
    const headers = document.querySelectorAll(".section-header");
    if (!headers.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    headers.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [location.pathname]);

  const noFooter = ["/checkout"].includes(location.pathname);

  return (
    <>
      <ParticlesBackground />
      <Header />

      {/* ── MAIN CONTENT OFFSET ─────────────────────────────────────────
          On desktop the header is position:sticky (72px tall).
          On mobile  the header is position:fixed  (64px tall).
          This wrapper ensures page content always starts BELOW the header
          so nothing is hidden underneath it. The CSS media queries below
          mirror the exact header heights set in Header.css.
          ────────────────────────────────────────────────────────────── */}
      <main
        className="app-main"
        style={{
          /* Desktop: sticky header is 72px. Push content down by that amount
             so the first section starts below the header, not behind it.     */
          paddingTop: "72px",
          minHeight: "100vh",
          position: "relative",
          zIndex: 0,         /* sits below header z-index:100 */
        }}
      >
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/shop"           element={<ShopPage />} />
          <Route path="/product/:id"    element={<ProductDetailPage />} />
          <Route path="/checkout"       element={<CheckoutPage />} />
          {/* <Route path="/blog"           element={<BlogPage />} />
          <Route path="/blog/:id"       element={<BlogDetailPage />} /> ── ADDED */}
          <Route path="/services"       element={<ServicesPage />} />
          {/* <Route path="/about"          element={<AboutPage />} /> */}
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/wishlist"       element={<WishlistPage />} />
          <Route path="/TermOfuse"      element={<TermOfuse />} />
          <Route path="/PrivacyPolicy"  element={<PrivacyPolicy />} />
          <Route path="*" element={
            <main className="page-enter" style={{ padding:"120px 0", textAlign:"center" }}>
              <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"72px", color:"var(--deep)" }}>404</h1>
              <p style={{ color:"var(--muted)", marginTop:"12px", fontSize:"18px" }}>Page not found.</p>
              <a href="/" className="btn btn-secondary"
                 style={{ marginTop:"28px", display:"inline-flex", textDecoration:"none" }}>
                Return Home
              </a>
            </main>
          } />
        </Routes>

        {!noFooter && <Footer />}
      </main>

      {/* Mobile bottom navigation — renders only on ≤ 768px via CSS */}
      <BottomNav />

      <MiniCart />

      {/* {enquiryOpen && <EnquiryModal onClose={() => setEnquiryOpen(false)} />} */}
      {/* {cookieVisible && (
        <CookieConsent
          onAccept={() => setCookieVisible(false)}
          onDecline={() => setCookieVisible(false)}
        />
      )} */}

      <ThemeSwitcher />
      <ScrollUp />
      <Toast />

      {/* SiteLoader only on first session visit — never on internal navigation */}
      {showLoader && <SiteLoader />}
    </>
  );
}