import { useState, useEffect } from "react";
import { ISD_CODES } from "../../data/countries";
import Api from "../../utils/Api";
import "./EnquirySection.css";

/* ── Validators ── */
const validateFirstName = (v) =>
  v.trim() ? "" : "First name is required.";

const validateLastName = (v) => "";

const validateEmail = (v) => {
  if (!v || v.trim() === "") return "Email address is required.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
    ? ""
    : "Invalid Email ID. Please enter a valid Email ID.";
};

// Phone is optional; if provided must be exactly 6–15 digits
const validatePhone = (v) => {
  if (!v || v.trim() === "") return "";
  return /^[0-9]{6,15}$/.test(v.trim())
    ? ""
    : "Please enter a valid phone number (6–15 digits).";
};

const validateCountry = (v) =>
  v.trim() ? "" : "Country is required.";

const validateCategory = (v) =>
  v ? "" : "Please select a product category.";

const validateMessage = (v) =>
  v.trim() ? "" : "Message is required.";

/* ── Inline error display ── */
const FieldError = ({ id, message }) =>
  message ? (
    <span className="field-error" id={id} role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8"  x2="12"    y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </span>
  ) : null;

/* ════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════ */
export default function EnquirySection() {
  // ── Live country list — GET /country/countrylist ────────────────────────
  const [countryList,      setCountryList]      = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError,   setCountriesError]   = useState(false);

  // ── Live category list — GET /country/categorydropdown ──────────────────
  const [categoryList,      setCategoryList]      = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError,   setCategoriesError]   = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Fetch countries
    Api.get("/country/countrylist")
      .then((res) => {
        if (cancelled) return;
        // Shape: { status: 1, data: [{ id, country_code, country_name }] }
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setCountryList([...list].sort((a, b) => a.id - b.id));
      })
      .catch(() => { if (!cancelled) setCountriesError(true); })
      .finally(() => { if (!cancelled) setCountriesLoading(false); });

    // Fetch categories
    Api.get("/country/categorydropdown")
      .then((res) => {
        if (cancelled) return;
        // Shape: { status: 1, data: [{ id, category_name }] } — adjust if API differs
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setCategoryList(
          [...list].sort((a, b) => a.id - b.id)
        );
      })
      .catch(() => { if (!cancelled) setCategoriesError(true); })
      .finally(() => { if (!cancelled) setCategoriesLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // ── Form state ──────────────────────────────────────────────────────────
  const INITIAL_FORM = {
    firstName: "",
    lastName:  "",
    email:     "",
    isdCode:   "+91",
    phone:     "",
    country:   "",
    category:  "",
    message:   "",
  };

  const INITIAL_ERRORS = {
    firstName: "", lastName: "", email: "",
    phone: "", country: "", category: "", message: "",
  };

  const INITIAL_TOUCHED = {
    firstName: false, lastName: false, email: false,
    phone: false, country: false, category: false, message: false,
  };

  const [form,       setForm]       = useState(INITIAL_FORM);
  const [errors,     setErrors]     = useState(INITIAL_ERRORS);
  const [touched,    setTouched]    = useState(INITIAL_TOUCHED);
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState({ visible: false, type: "success", msg: "" });

  const showToast = (msg, type = "success") => {
    setToast({ visible: true, type, msg });
    setTimeout(() => setToast({ visible: false, type: "success", msg: "" }), 3500);
  };

  const validators = {
    firstName: validateFirstName,
    lastName:  validateLastName,
    email:     validateEmail,
    phone:     validatePhone,
    country:   validateCountry,
    category:  validateCategory,
    message:   validateMessage,
  };

  /* ── Change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      // Auto-update ISD code when country changes — look up from ISD_CODES
      const selected = ISD_CODES.find((item) => item.country === value);
      setForm((prev) => ({
        ...prev,
        country: value,
        isdCode: selected ? selected.code : prev.isdCode,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (touched[name] && validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  /* ── Blur ── */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name in touched) {
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validators[name]) {
        setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
      }
    }
  };

  /* ── Submit — POST /enquiry/enquirycreate ──────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateFirstName(form.firstName),
      lastName:  validateLastName(form.lastName),
      email:     validateEmail(form.email),
      phone:     validatePhone(form.phone),
      country:   validateCountry(form.country),
      category:  validateCategory(form.category),
      message:   validateMessage(form.message),
    };

    setErrors(newErrors);
    setTouched({
      firstName: true, lastName: false, email: true,
      phone: true, country: true, category: true, message: true,
    });

    if (Object.values(newErrors).some((err) => err !== "")) {
      const firstError = document.querySelector(
        ".input-error-border, .phone-input-wrapper.input-error-border"
      );
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    try {
      await Api.post("/enquiry/enquirycreate", {
        first_name:       form.firstName.trim(),
        last_name:        form.lastName.trim(),
        email_id:         form.email.trim(),
        country:          form.country,
        phone_number:     `${form.isdCode}${form.phone.trim()}`,
        product_category: form.category,
        message:          form.message.trim(),
      });

      showToast("Enquiry submitted! We'll get back to you shortly.", "success");
      setForm(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      setTouched(INITIAL_TOUCHED);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong. Please try again.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Render ── */
  return (
    <section className="section enquiry-section" aria-labelledby="enquiry-heading">
      <div className="container">

        {/* TOAST */}
        {toast.visible && (
          <div
            className={`enquiry-toast${toast.type === "error" ? " enquiry-toast--error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {toast.msg}
          </div>
        )}

        {/* HEADING */}
        <header className="section-header reveal">
          <span className="section-tag">Support</span>
          <h2 className="section-title" id="enquiry-heading">Enquiry Form</h2>
          <p className="section-subtitle">
            Have questions about our products? Fill out the form below and our team will get back to you shortly.
          </p>
        </header>

        {/* FORM CARD */}
        <div className="enquiry-wrapper">
          <h2 className="enquiry-form-title">Contact us</h2>

          <form className="enquiry-form" onSubmit={handleSubmit} noValidate>

            {/* ROW — First Name + Last Name */}
            <div className="row">
              <div className="form-group">
                <label htmlFor="enq-firstName">First Name <span className="required-star">*</span></label>
                <input
                  id="enq-firstName" type="text" name="firstName"
                  value={form.firstName}
                  onChange={handleChange} onBlur={handleBlur}
                  className={errors.firstName ? "input-error-border" : ""}
                  aria-describedby="enq-firstName-error"
                  autoComplete="given-name"
                />
                <FieldError id="enq-firstName-error" message={errors.firstName} />
              </div>
              <div className="form-group">
                <label htmlFor="enq-lastName">Last Name</label>
                <input
                  id="enq-lastName" type="text" name="lastName"
                  value={form.lastName}
                  onChange={handleChange} onBlur={handleBlur}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="enq-email">Email Address <span className="required-star">*</span></label>
              <input
                id="enq-email" type="text" name="email"
                value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.email ? "input-error-border" : ""}
                aria-describedby="enq-email-error"
                autoComplete="email"
              />
              <FieldError id="enq-email-error" message={errors.email} />
            </div>

            {/* Country — live from DB */}
            <div className="form-group">
              <label htmlFor="enq-country">Country <span className="required-star">*</span></label>
              <select
                id="enq-country" name="country"
                value={form.country}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.country ? "input-error-border" : ""}
                aria-describedby="enq-country-error"
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
              <FieldError id="enq-country-error" message={errors.country} />
            </div>

            {/* Phone — ISD selector from local ISD_CODES (API has no phone codes) */}
            <div className="form-group">
              <label htmlFor="enq-phone">Phone Number</label>
              <div className={`phone-input-wrapper${errors.phone ? " input-error-border" : ""}`}>
                <select
                  name="isdCode"
                  className="isd-select"
                  value={form.isdCode}
                  onChange={handleChange}
                  aria-label="Country calling code"
                >
                  {ISD_CODES.map((item, i) => (
                    <option key={i} value={item.code}>
                      {item.flag} {item.code}
                    </option>
                  ))}
                </select>
                <div className="isd-divider" aria-hidden="true" />
                <input
                  id="enq-phone" type="text" name="phone"
                  className="phone-number-input"
                  value={form.phone}
                  onChange={handleChange} onBlur={handleBlur}
                  aria-describedby="enq-phone-error"
                  inputMode="numeric"
                  autoComplete="tel-national"
                />
              </div>
              <FieldError id="enq-phone-error" message={errors.phone} />
            </div>

            {/* Product Category — live from DB */}
            <div className="form-group">
              <label htmlFor="enq-category">Product Category <span className="required-star">*</span></label>
              <select
                id="enq-category" name="category"
                value={form.category}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.category ? "input-error-border" : ""}
                aria-describedby="enq-category-error"
                disabled={categoriesLoading || categoriesError}
              >
                {categoriesLoading && <option value="">Loading categories…</option>}
                {categoriesError   && <option value="">Failed to load — please refresh</option>}
                {!categoriesLoading && !categoriesError && <option value="">Select Category</option>}
                {categoryList.map((item) => (
                  <option key={item.id} value={item.category_name}>
                    {item.category_name}
                  </option>
                ))}
              </select>
              <FieldError id="enq-category-error" message={errors.category} />
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="enq-message">Message <span className="required-star">*</span></label>
              <textarea
                id="enq-message" rows="4" name="message"
                value={form.message}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.message ? "input-error-border" : ""}
                aria-describedby="enq-message-error"
              />
              <FieldError id="enq-message-error" message={errors.message} />
            </div>

            <button
              type="submit"
              className="btn btn--theme enquiry-submit"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Sending…" : "Enquire Now"}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
