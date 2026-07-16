// src/pages/CheckoutPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ISD_CODES } from "../data/countries";
import Api from "../utils/Api";
import "./CheckoutPage.css";

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
  const [emailSent, setEmailSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Live country list — GET /country/countrydropdown (public) ─────────────
  const [countryList,      setCountryList]      = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError,   setCountriesError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    Api.get("/country/countrydropdown")
      .then((res) => {
        if (cancelled) return;
        // Shape: { status: 1, data: [{ id, country_code, country_name }] }
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setCountryList([...list].sort((a, b) => a.id - b.id));
      })
      .catch(() => { if (!cancelled) setCountriesError(true); })
      .finally(() => { if (!cancelled) setCountriesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const getColorCustomizations = (item) =>
    item.colorCustomization?.length > 0
      ? item.colorCustomization
      : item.variant?.colorCustomization ?? [];

  const formatColorLine = (color) =>
    `${color.name} (${color.hex.toUpperCase()}) ×${color.quantity}`;

  const change = field => e => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (field === "phone") {
      setErrors(prev => ({ ...prev, phone: validatePhone(value) }));
    }
    // Auto-load ISD code when country is selected
    if (field === "country") {
      const selectedCountry = ISD_CODES.find(item => item.country === value);
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

  const handleSubmit = async () => {
    // An empty cart has no products to quote — submitting anyway sends the
    // backend an empty `color` string, which fails its required-field
    // validation. Catching it here (rather than showing a confusing
    // backend validator message) also prevents that failure response from
    // ever reaching the status-blindness bug this used to have.
    if (cart.length === 0) {
      showToast("Your cart is empty. Add a product before requesting a quote.");
      return;
    }

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

    setSubmitting(true);
    try {
      // Build one product_name string from all cart items
      const productNames = cart.length > 0
        ? cart.map(item => {
            const colors = getColorCustomizations(item);
            const base = `${item.name} ×${item.qty}`;
            if (colors.length > 0) {
              const colorStr = colors
                .map(c => `${c.name} (${c.hex.toUpperCase()}) ×${c.quantity}`)
                .join(", ");
              return `${base} [${colorStr}]`;
            }
            return base;
          }).join("; ")
        : "No products selected";

      // Structured line items (product id lets the backend re-validate/re-fetch
      // canonical name + image rather than trusting the browser).
      const items = cart.map(item => {
        const colors = getColorCustomizations(item);
        return {
          product_id: item.id,
          product_name: item.name,
          quantity: item.qty,
          variant: colors.length > 0 ? colors.map(c => c.name).join(", ") : "",
          color: colors.length > 0 ? colors.map(c => c.name).join(", ") : "",
          image: item.image || "",
        };
      });

      const response = await Api.post("/quoteenquire/enquiry-quotecreate", {
        // Legacy flattened fields — kept for the admin quote-enquiries list.
        product_name:  productNames,
        qty:           cart.reduce((sum, item) => sum + item.qty, 0),
        color:         cart.flatMap(item => getColorCustomizations(item)).map(c => c.name).join(", ") || "",
        first_name:    form.firstName.trim(),
        last_name:     form.lastName.trim(),
        email_id:      form.email.trim(),
        country:       form.country,
        phone_number:  `${isdCode}${form.phone.trim()}`,
        message:       form.message.trim(),
        // Structured cart data for the confirmation email.
        items,
      });

      const data = response?.data || {};

      // The backend returns HTTP 200 even for a validation/DB failure
      // (status: 0 with a message) — axios won't throw for that, so it
      // must be checked explicitly. Previously this was never checked at
      // all: any 200 response was treated as a success, showing a "Quote
      // Submitted!" screen with a blank Quote ID, no email, and clearing
      // the cart even though nothing was saved.
      if (data.status !== 1) {
        showToast(data.message || "Something went wrong. Please try again.");
        return;
      }

      const reference = data.quote_reference || "";
      const wasEmailSent = data.email?.sent === true;

      setOrderId(reference);
      setEmailSent(wasEmailSent);
      setShowBlast(true);
      showToast(
        wasEmailSent
          ? `Enquiry has been sent, we will reach you soon. Quote #${reference}`
          : `Enquiry has been sent, we will reach you soon. Quote #${reference} (confirmation email pending)`
      );
      setSubmitted(true);
      clearCart();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong. Please try again.";
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
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
            {emailSent ? (
              <p className="checkout-success__msg">
                Thank you for your enquiry. We've received your details and will
                get back to you with pricing within 24 hours. A confirmation
                email has been sent to <strong>{form.email}</strong>.
              </p>
            ) : (
              <p className="checkout-success__msg">
                Your quote request was submitted successfully, but we could not
                send the confirmation email. Our team still received your enquiry.
              </p>
            )}
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
                    disabled={countriesLoading || countriesError}
                  >
                    {countriesLoading && <option value="">Loading countries…</option>}
                    {countriesError   && <option value="">Failed to load — please refresh</option>}
                    {!countriesLoading && !countriesError && <option value="">Select Country</option>}
                    {countryList.map((item) => (
                      <option key={item.id} value={item.country_name}>
                        {item.country_name}
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
                      {ISD_CODES.map((item, idx) => (
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
                disabled={submitting}
                aria-busy={submitting}
                aria-label="Send enquiry"
              >
                {submitting ? "Sending…" : "Get Quote"}
              </button>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}