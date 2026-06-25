// src/pages/CheckoutPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { COUNTRY_LIST } from "../data/countries";
import "./CheckoutPage.css";

const ISD_CODES = [
  { code: "+93",  label: "🇦🇫 +93",  country: "Afghanistan" },
  { code: "+61",  label: "🇦🇺 +61",  country: "Australia" },
  { code: "+973", label: "🇧🇭 +973", country: "Bahrain" },
  { code: "+880", label: "🇧🇩 +880", country: "Bangladesh" },
  { code: "+1",   label: "🇨🇦 +1",   country: "Canada" },
  { code: "+86",  label: "🇨🇳 +86",  country: "China" },
  { code: "+49",  label: "🇩🇪 +49",  country: "Germany" },
  { code: "+33",  label: "🇫🇷 +33",  country: "France" },
  { code: "+91",  label: "🇮🇳 +91",  country: "India" },
  { code: "+62",  label: "🇮🇩 +62",  country: "Indonesia" },
  { code: "+39",  label: "🇮🇹 +39",  country: "Italy" },
  { code: "+81",  label: "🇯🇵 +81",  country: "Japan" },
  { code: "+60",  label: "🇲🇾 +60",  country: "Malaysia" },
  { code: "+960", label: "🇲🇻 +960", country: "Maldives" },
  { code: "+977", label: "🇳🇵 +977", country: "Nepal" },
  { code: "+64",  label: "🇳🇿 +64",  country: "New Zealand" },
  { code: "+968", label: "🇴🇲 +968", country: "Oman" },
  { code: "+92",  label: "🇵🇰 +92",  country: "Pakistan" },
  { code: "+63",  label: "🇵🇭 +63",  country: "Philippines" },
  { code: "+974", label: "🇶🇦 +974", country: "Qatar" },
  { code: "+966", label: "🇸🇦 +966", country: "Saudi Arabia" },
  { code: "+65",  label: "🇸🇬 +65",  country: "Singapore" },
  { code: "+82",  label: "🇰🇷 +82",  country: "South Korea" },
  { code: "+94",  label: "🇱🇰 +94",  country: "Sri Lanka" },
  { code: "+66",  label: "🇹🇭 +66",  country: "Thailand" },
  { code: "+971", label: "🇦🇪 +971", country: "United Arab Emirates" },
  { code: "+44",  label: "🇬🇧 +44",  country: "United Kingdom" },
  { code: "+1",   label: "🇺🇸 +1",   country: "United States" },
  { code: "+84",  label: "🇻🇳 +84",  country: "Vietnam" },
  { code: "+27",  label: "🇿🇦 +27",  country: "South Africa" },
];

const validatePhone = (v) => {
  if (!v || v.trim() === "") return "";
  const digits = v.replace(/[^0-9]/g, "");
  if (digits.length < 6 || digits.length > 15) {
    return "Please enter a valid phone number (6–15 digits).";
  }
  return "";
};

export default function CheckoutPage() {
  const { cart, clearCart, showToast } = useApp();
  const navigate = useNavigate();
  const [isdCode, setIsdCode] = useState("+91");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    country: "", message: "",
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showBlast, setShowBlast] = useState(false);
  const [orderId,   setOrderId]   = useState("");

  const getColorCustomizations = (item) =>
    item.colorCustomization?.length > 0
      ? item.colorCustomization
      : item.variant?.colorCustomization ?? [];

  const formatColorLine = (color) =>
    `${color.name} (${color.hex.toUpperCase()}) ×${color.quantity}`;

  // Build the read-only "Products Selected" textarea value
  const productsSelectedText = cart.length > 0
    ? cart.map(item => {
        const colors = getColorCustomizations(item);
        const header = `${item.name} × ${item.qty}`;
        if (colors.length > 0) {
          const colorLines = colors
            .map(c => `  • ${c.name} | ${c.hex.toUpperCase()} × ${c.quantity}`)
            .join("\n");
          return `${header}\n${colorLines}`;
        }
        return header;
      }).join("\n\n")
    : "No products selected";

  const change = field => e => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (field === "phone") {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
    // Auto-load ISD code when country is selected
    if (field === "country") {
      const selectedCountry = COUNTRY_LIST.find(item => item.country === value);
      if (selectedCountry) {
        setIsdCode(selectedCountry.code);
      }
    }
  };

  const validateField = field => () => {
    let msg = "";
    if (field === "firstName" && !form.firstName.trim()) msg = "First name is required";
    if (field === "email") {
      if (!form.email.trim()) {
        msg = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        msg = "Please enter a valid email address (e.g. name@example.com)";
      }
    }
    if (field === "phone")    msg = validatePhone(form.phone);
    if (field === "country"   && !form.country.trim())  msg = "Country is required";
    setErrors(prev => ({ ...prev, [field]: msg }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    const emailVal = form.email.trim();
    if (!emailVal) {
      e.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      e.email = "Please enter a valid email address (e.g. name@example.com)";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else {
      const phoneErr = validatePhone(form.phone);
      if (phoneErr) e.phone = phoneErr;
    }
    if (!form.country.trim())  e.country  = "Country is required";
    if (!form.message.trim())  e.message  = "Message is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    const hasErrors = Object.values(e).some(Boolean);
    if (hasErrors) {
      showToast("Please fix the highlighted fields before submitting your quote.");
      const firstErrorField = document.querySelector(".form-input--error, .phone-input-wrap--error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    const nextOrderId = Math.random().toString(36).slice(2, 10).toUpperCase();
    setOrderId(nextOrderId);
    setShowBlast(true);
    showToast(`Enquiry has been sent, we will reach you soon. Quote #${nextOrderId}`);
    setSubmitted(true);
    clearCart();
  };

  useEffect(() => {
    if (!showBlast) return;
    const timer = window.setTimeout(() => setShowBlast(false), 1100);
    return () => window.clearTimeout(timer);
  }, [showBlast]);

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="page-enter" style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "560px" }}>
          <div className="checkout-success">
            <div className="checkout-success__icon-wrap">
              <div className={`checkout-success__icon${showBlast ? " checkout-success__icon--active" : ""}`}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none"
                     stroke="var(--white)" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              {showBlast && (
                <div className="checkout-success__burst" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, idx) => <span key={idx} />)}
                </div>
              )}
            </div>
            <h1 className="section-title">Quote Submitted!</h1>
            <p className="checkout-success__msg">
              Thank you for your enquiry. We've received your details and will
              get back to you with pricing within 24 hours. A confirmation
              will be sent to <strong>{form.email}</strong>.
            </p>
            <div className="checkout-success__order-id">
              Quote #{orderId}
            </div>
            <button
              className="btn btn-secondary btn-lg"
              style={{ marginTop: "32px" }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Quote form ──────────────────────────────────────────────────────────────
  return (
    <main className="page-enter checkout-page" aria-label="Checkout">

      {/* ── HERO BANNER ── */}
      <section className="checkout-hero page-hero section--dark">
        <div className="container">
          <span
            className="section-tag"
            style={{ background: "rgba(182,217,224,0.2)", color: "var(--light)" }}
          >
            Step 1 of 1
          </span>
          <h1 className="page-hero__title">Complete Your Enquiry</h1>
          <p className="page-hero__sub">
            No account required — just fill in your details below.
          </p>
        </div>
      </section>

      <div className="container">

        <div className="checkout-layout">

          {/* ── SINGLE FORM CARD ── */}
          <section aria-label="Enquiry form">
            <div className="checkout-card">
              <h2 className="checkout-card__title">Enquiry Details</h2>
              <div className="checkout-form-grid">

                {/* First Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="co-firstname">
                    First Name <span className="form-required">*</span>
                  </label>
                  <input
                    id="co-firstname"
                    className={`form-input${errors.firstName ? " form-input--error" : ""}`}
                    type="text"
                    value={form.firstName}
                    onChange={change("firstName")}
                    onBlur={validateField("firstName")}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>

                {/* Last Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="co-lastname">
                    Last Name
                  </label>
                  <input
                    id="co-lastname"
                    className={`form-input${errors.lastName ? " form-input--error" : ""}`}
                    type="text"
                    value={form.lastName}
                    onChange={change("lastName")}
                    onBlur={validateField("lastName")}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>

                {/* Email */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="co-email">
                    Email Address <span className="form-required">*</span>
                  </label>
                  <input
                    id="co-email"
                    className={`form-input${errors.email ? " form-input--error" : ""}`}
                    type="email"
                    value={form.email}
                    onChange={change("email")}
                    onBlur={validateField("email")}
                    autoComplete="email"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                {/* Country */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="co-country">
                    Country <span className="form-required">*</span>
                  </label>
                  <select
                    id="co-country"
                    className={`form-input${errors.country ? " form-input--error" : ""}`}
                    value={form.country}
                    onChange={change("country")}
                    onBlur={validateField("country")}
                    autoComplete="country-name"
                  >
                    <option value="">Select Country</option>
                    {COUNTRY_LIST.map((item, idx) => (
                      <option key={`${item.code}-${idx}`} value={item.country}>
                        {item.country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <span className="form-error">{errors.country}</span>}
                </div>

                {/* Phone */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="co-phone">
                    Phone Number <span className="form-required">*</span>
                  </label>
                  <div className={`phone-input-wrap${errors.phone ? " phone-input-wrap--error" : ""}`}>
                    <select
                      className="phone-isd-select"
                      value={isdCode}
                      onChange={e => setIsdCode(e.target.value)}
                      aria-label="ISD country code"
                    >
                      {COUNTRY_LIST.map((item, idx) => (
                        <option key={`${item.code}-${idx}`} value={item.code}>
                          {item.flag} {item.code} ({item.country})
                        </option>
                      ))}
                    </select>
                    <input
                      id="co-phone"
                      className="phone-number-input"
                      type="tel"
                      value={form.phone}
                      onChange={change("phone")}
                      onBlur={validateField("phone")}
                      autoComplete="tel-national"
                      inputMode="numeric"
                      aria-describedby="co-phone-error"
                    />
                  </div>
                  {errors.phone && (
                    <span className="form-error" id="co-phone-error">{errors.phone}</span>
                  )}
                </div>

                {/* ── Products Selected (read-only) ── */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="co-products-selected">
                    Products Selected
                  </label>
                  <div className="products-selected-wrap">
                    {cart.length > 0 ? (
                      <ul className="products-selected-list" id="co-products-selected" aria-label="Selected products">
                        {cart.map(item => {
                          const colors = getColorCustomizations(item);
                          return (
                            <li key={item.cartKey} className="products-selected-item">
                              <div className="products-selected-item__header">
                                <span className="products-selected-item__name">{item.name}</span>
                                <span className="products-selected-item__qty">× {item.qty}</span>
                              </div>
                              {colors.length > 0 && (
                                <ul className="products-selected-colors">
                                  {colors.map((color, idx) => (
                                    <li key={idx} className="products-selected-color">
                                      <span
                                        className="products-selected-color__swatch"
                                        style={{ background: color.hex }}
                                        aria-hidden="true"
                                      />
                                      <span className="products-selected-color__name">{color.name}</span>
                                      <span className="products-selected-color__hex">{color.hex.toUpperCase()}</span>
                                      <span className="products-selected-color__qty">× {color.quantity}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="products-selected-empty">No products selected</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label" htmlFor="co-message">
                    Message <span className="form-required">*</span>
                  </label>
                  <textarea
                    id="co-message"
                    className={`form-input form-textarea${errors.message ? " form-input--error" : ""}`}
                    rows={5}
                    value={form.message}
                    onChange={change("message")}
                    onBlur={validateField("message")}
                    placeholder="Write your enquiry or additional order details"
                  />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

              </div>
            </div>
          </section>

          {/* ── ORDER SUMMARY ── */}
          <aside aria-label="Order summary">
            <div className="checkout-card checkout-summary">
              <h2 className="checkout-card__title">Order Summary</h2>

              {cart.length > 0 ? (
                <ul className="checkout-items">
                  {cart.map(item => {
                    const colors = getColorCustomizations(item);
                    return (
                      <li key={item.cartKey} className="checkout-item">
                        <div className="checkout-item__img-wrap">
                          <img src={item.image} alt={item.name} className="checkout-item__img" />
                          <span className="checkout-item__qty-badge">{item.qty}</span>
                        </div>
                        <div className="checkout-item__details">
                          <p className="checkout-item__name">{item.name}</p>
                          {colors.length > 0 && (
                            <p className="checkout-item__variant">
                              {colors.map((color, idx) => formatColorLine(color)).join(" · ")}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "16px" }}>
                  Fill in your details and we'll get back to you with a personalised quote.
                </p>
              )}

              <button
                type="button"
                className="btn btn-primary btn-block btn-lg"
                onClick={handleSubmit}
                aria-label="Send enquiry"
              >
                Get Quote
              </button>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}