// src/pages/ContactPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useApp }          from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSEO }          from "../hooks/useSEO";
import { trackFormSubmit, trackPhoneClick, trackEmailClick } from "../utils/analytics";
import Api                 from "../utils/Api";
import "./ContactPage.css";

/* ─────────────────────────────────────────────────────────────────
   CONFETTI TOAST — self-contained, zero extra packages
   ───────────────────────────────────────────────────────────────── */
const CONFETTI_COLORS = ["#335765","#74A8A4","#B6D9E0","#f59e0b","#ec4899","#a78bfa","#34d399","#f97316"];
const CONFETTI_SHAPES = ["●","■","▲","★","♦","✿"];

function useConfettiToast() {
  const [visible,   setVisible]   = useState(false);
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);

  const fire = useCallback(() => {
    const pieces = Array.from({ length: 48 }, (_, i) => ({
      id:     i,
      shape:  CONFETTI_SHAPES[i % CONFETTI_SHAPES.length],
      color:  CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left:   Math.random() * 100,
      delay:  Math.random() * 0.5,
      dur:    0.9 + Math.random() * 0.6,
      size:   9 + Math.random() * 8,
      rotate: Math.random() * 720 - 360,
      drift:  (Math.random() - 0.5) * 60,
    }));
    setParticles(pieces);
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setVisible(false); setParticles([]); }, 4200);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);
  return { visible, particles, fire };
}

function ConfettiToast({ visible, particles }) {
  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" style={{
      position:"fixed", bottom:"28px", left:"50%", transform:"translateX(-50%)",
      zIndex:9999, minWidth:"320px", maxWidth:"90vw",
      background:"linear-gradient(135deg,#1a3a45 0%,#335765 60%,#74A8A4 100%)",
      borderRadius:"16px", boxShadow:"0 8px 40px rgba(51,87,101,0.35)",
      overflow:"hidden", padding:"18px 28px 20px",
      animation:"cf-toast-in 0.4s cubic-bezier(.34,1.56,.64,1) both",
    }}>
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        {particles.map(p => (
          <span key={p.id} style={{
            position:"absolute", top:"-16px", left:`${p.left}%`,
            fontSize:`${p.size}px`, color:p.color,
            animation:`cf-fall ${p.dur}s ${p.delay}s ease-in both`,
            "--drift":`${p.drift}px`, "--rotate":`${p.rotate}deg`, display:"inline-block",
          }}>{p.shape}</span>
        ))}
      </div>
      <div style={{ position:"relative", display:"flex", alignItems:"center", gap:"12px" }}>
        <span style={{ fontSize:"28px", lineHeight:1 }}>🎉</span>
        <div>
          <p style={{ margin:0, fontFamily:"var(--font-serif,serif)", fontSize:"17px", fontWeight:600, color:"#fff" }}>
            Message Sent Successfully!
          </p>
          <p style={{ margin:"3px 0 0", fontSize:"13px", color:"rgba(182,217,224,0.9)", fontFamily:"var(--font-body,sans-serif)" }}>
            🛍️ Thank you for reaching out — our team will get back to you shortly.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes cf-toast-in {
          from { opacity:0; transform:translateY(24px) translateX(-50%); }
          to   { opacity:1; transform:translateY(0)    translateX(-50%); }
        }
        @keyframes cf-fall {
          0%   { transform:translateY(0) translateX(0) rotate(0deg); opacity:1; }
          80%  { opacity:1; }
          100% { transform:translateY(120px) translateX(var(--drift)) rotate(var(--rotate)); opacity:0; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CONTACT INFO ICONS
   ───────────────────────────────────────────────────────────────── */
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const INFO = [
  { Icon: LocationIcon, value: "Trichy - 620003, Tamil Nadu, India.", label: "Address" },
  { Icon: MailIcon,     value: "support@yogoventures.com",            label: "Email"   },
  { Icon: PhoneIcon,    value: "+91 9003317417, +91 6369681960",       label: "Phone"   },
  { Icon: ClockIcon,    value: "Mon – Sat : 10AM – 7PM IST",           label: "Hours"   },
];

/* ─────────────────────────────────────────────────────────────────
   VALIDATORS
   ───────────────────────────────────────────────────────────────── */
const validateRequired = (v, label) =>
  v?.trim() ? "" : `${label} is required. Please enter your ${label.toLowerCase()}.`;

const validateEmail = (v) => {
  if (!v?.trim()) return "Email Address is required. Please enter your email address.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Invalid Email ID. Please enter a valid Email ID.";
};

const validatePhone = (v) => {
  if (!v?.trim()) return "";
  return /^[0-9]{6,15}$/.test(v.trim()) ? "" : "Please enter a valid phone number (6–15 digits).";
};

const validateCountry = (v) => v?.trim() ? "" : "Country is required. Please select your country.";
const validateSubject = (v) => v?.trim() ? "" : "Subject is required. Please enter a subject.";
const validateMessage = (v) => v?.trim() ? "" : "Message is required. Please enter your message.";

/* ─────────────────────────────────────────────────────────────────
   FIELD ERROR
   ───────────────────────────────────────────────────────────────── */
const FieldError = ({ id, message }) =>
  message ? (
    <span className="cf-field-error" id={id} role="alert">
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8"  x2="12"    y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {message}
    </span>
  ) : null;

const Req = () => <span className="cf-required-star"> *</span>;

/* ─────────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────────── */
export default function ContactPage() {
  const { showToast } = useApp();
  useScrollReveal([]);

  useSEO({
    title: "Contact Us — Request a Quotation for Bulk Orders",
    description: "Contact Yogo Ventures for wholesale inquiries, bulk order quotations, and B2B sourcing. Reach us at support@yogoventures.com or +91 9003317417. Mon–Sat 10AM–7PM IST.",
    canonical: "https://www.yogoventures.com/contact",
    breadcrumb: [
      { name: "Home",       url: "https://www.yogoventures.com/" },
      { name: "Contact Us", url: "https://www.yogoventures.com/contact" },
    ],
    schemaId: "contact-page",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Yogo Ventures",
      "description": "Contact Yogo Ventures for wholesale bulk order inquiries, product sourcing, and B2B quotations.",
      "url": "https://www.yogoventures.com/contact",
      "mainEntity": {
        "@type": "Organization",
        "name": "Yogo Ventures",
        "email": "support@yogoventures.com",
        "telephone": "+91-9003317417",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Tiruchirappalli",
          "addressRegion": "Tamil Nadu",
          "postalCode": "620003",
          "addressCountry": "IN"
        }
      }
    },
  });

  const { visible: confettiVisible, particles, fire: fireConfetti } = useConfettiToast();

  // ── Live country list — GET /country/countrydropdown (public) ─────────────
  const [countryList,      setCountryList]      = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError,   setCountriesError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    Api.get("/country/countrydropdown")
      .then((res) => {
        if (cancelled) return;
        // Shape: { status: 1, data: [{ id, country_code, iso3, country_name, phone_code }] }
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        const sorted = [...list].sort((a, b) => a.country_name.localeCompare(b.country_name));
        setCountryList(sorted);

        // Default the form to India / +91 once the DB list has loaded, but
        // only if the user hasn't already picked something else in the
        // meantime (unlikely given how fast this resolves, but safe).
        const india = sorted.find((c) => c.country_name === "India");
        if (india) {
          setForm((prev) => (
            prev.country ? prev : { ...prev, country: india.country_name, isdCode: india.phone_code?.trim() || "+91" }
          ));
        }
      })
      .catch(() => { if (!cancelled) setCountriesError(true); })
      .finally(() => { if (!cancelled) setCountriesLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Form state ────────────────────────────────────────────────────────────
  const INITIAL_FORM = {
    firstName: "", lastName: "", email: "",
    isdCode: "+91", phone: "", country: "",
    subject: "", message: "",
  };
  const INITIAL_ERRORS   = { firstName:"", lastName:"", email:"", phone:"", country:"", subject:"", message:"" };
  const INITIAL_TOUCHED  = { firstName:false, lastName:false, email:false, phone:false, country:false, subject:false, message:false };

  const [form,       setForm]       = useState(INITIAL_FORM);
  const [errors,     setErrors]     = useState(INITIAL_ERRORS);
  const [touched,    setTouched]    = useState(INITIAL_TOUCHED);
  const [submitting, setSubmitting] = useState(false);

  const runValidator = (name, value) => {
    switch (name) {
      case "firstName": return validateRequired(value, "First Name");
      case "lastName":  return "";
      case "email":     return validateEmail(value);
      case "phone":     return validatePhone(value);
      case "country":   return validateCountry(value);
      case "subject":   return validateSubject(value);
      case "message":   return validateMessage(value);
      default:          return "";
    }
  };

  // Resolves the dialing code for a selected country name from the DB
  // list (Country Master is the single source of truth); +91 is the last
  // resort only if the country somehow has no phone_code set.
  const resolvePhoneCode = (countryName) => {
    const dbMatch = countryList.find((c) => c.country_name === countryName);
    return dbMatch?.phone_code?.trim() || "+91";
  };

  // Distinct dialing codes across the DB country list — the phone-code
  // <select> itself has no per-row country context, only the deduped code
  // list, so multiple countries sharing a code (e.g. US and Canada both
  // +1) collapse to a single option.
  const isdOptions = [...new Map(
    countryList
      .filter((c) => c.phone_code?.trim())
      .map((c) => [c.phone_code.trim(), c.phone_code.trim()])
  ).values()];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      // Auto-update ISD code when country changes. Local number (form.phone)
      // is left untouched, only the prefix changes.
      setForm((p) => ({
        ...p,
        country: value,
        isdCode: resolvePhoneCode(value),
      }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }

    if (touched[name]) {
      setErrors((p) => ({ ...p, [name]: runValidator(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name in touched) {
      setTouched((p) => ({ ...p, [name]: true }));
      setErrors((p)  => ({ ...p, [name]: runValidator(name, value) }));
    }
  };

  // ── Submit — POST /contactus/contact-uscreate ─────────────────────────────
  const handleSubmit = async () => {
    const newErrors = {
      firstName: runValidator("firstName", form.firstName),
      lastName:  "",
      email:     runValidator("email",    form.email),
      phone:     runValidator("phone",    form.phone),
      country:   runValidator("country",  form.country),
      subject:   runValidator("subject",  form.subject),
      message:   runValidator("message",  form.message),
    };
    setErrors(newErrors);
    setTouched({ firstName:true, lastName:false, email:true, phone:true, country:true, subject:true, message:true });
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await Api.post("/contactus/contact-uscreate", {
        first_name:   form.firstName.trim(),
        last_name:    form.lastName.trim(),
        email_id:     form.email.trim(),
        country:      form.country,
        phone_number: `${form.isdCode}${form.phone.trim()}`,
        subject:      form.subject.trim(),
        message:      form.message.trim(),
      });
      // ── Track lead conversion in GTM/GA4 ──────────────────────────────
      trackFormSubmit({
        formId: "contact_form",
        country: form.country,
        subject: form.subject.trim(),
      });
      fireConfetti();
      setForm(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
      setTouched(INITIAL_TOUCHED);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Something went wrong. Please try again.";
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-enter contact-page" id="main-content" aria-label="Contact Yogo Ventures — Request Quotation">

      {/* ── HERO ── */}
      <section className="page-hero section--dark">
        <div className="container">
          <span className="section-tag" style={{ background:"rgba(182,217,224,0.2)", color:"var(--light)" }}>
            Get in Touch
          </span>
          <h1 className="page-hero__title">Contact Us</h1>
          <p className="page-hero__sub">
            Have questions or need assistance? Reach out to us through the contact form, and our team will get back to you promptly with the support you need.
          </p>
        </div>
      </section>

      {/* ── FORM + INFO ── */}
      <section className="section" aria-label="Contact form and information">
        <div className="container">
          <div className="contact-grid">

            {/* FORM */}
            <div className="reveal">
              <div className="contact-form-card">
                <h2 className="contact-form-card__title">Send a Message</h2>
                <div className="contact-form-inner">

                  {/* First Name + Last Name */}
                  <div className="contact-name-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="cf-fname">First Name<Req /></label>
                      <input
                        id="cf-fname"
                        className={`form-input${errors.firstName ? " cf-input-error" : ""}`}
                        type="text" name="firstName" value={form.firstName}
                        onChange={handleChange} onBlur={handleBlur}
                        autoComplete="given-name" aria-describedby="cf-fname-error"
                      />
                      <FieldError id="cf-fname-error" message={errors.firstName} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cf-lname">Last Name</label>
                      <input
                        id="cf-lname"
                        className="form-input"
                        type="text" name="lastName" value={form.lastName}
                        onChange={handleChange} onBlur={handleBlur}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-email">Email Address<Req /></label>
                    <input
                      id="cf-email"
                      className={`form-input${errors.email ? " cf-input-error" : ""}`}
                      type="email" name="email" value={form.email}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete="email" aria-describedby="cf-email-error"
                    />
                    <FieldError id="cf-email-error" message={errors.email} />
                  </div>

                  {/* Country — live from DB */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-country">Country<Req /></label>
                    <select
                      id="cf-country"
                      className={`form-input${errors.country ? " cf-input-error" : ""}`}
                      name="country" value={form.country}
                      onChange={handleChange} onBlur={handleBlur}
                      autoComplete="country-name" aria-describedby="cf-country-error"
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
                    <FieldError id="cf-country-error" message={errors.country} />
                  </div>

                  {/* Phone — ISD prefix, built from the DB country list (Country
                      Master is the single source of truth for dialing codes). */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-phone">Phone Number</label>
                    <div className={`cf-phone-wrapper${errors.phone ? " cf-input-error" : ""}`}>
                      <select
                        name="isdCode" className="cf-isd-select"
                        value={form.isdCode} onChange={handleChange}
                        aria-label="Country calling code"
                      >
                        {/* A selected phone_code not present in the deduped DB
                            list (e.g. before the list has loaded) still needs an
                            <option> or the <select> silently shows the wrong code. */}
                        {!isdOptions.includes(form.isdCode) && (
                          <option value={form.isdCode}>{form.isdCode}</option>
                        )}
                        {isdOptions.map((code) => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                      <div className="cf-isd-divider" aria-hidden="true" />
                      <input
                        id="cf-phone" type="text" name="phone"
                        className="cf-phone-input" value={form.phone}
                        onChange={handleChange} onBlur={handleBlur}
                        inputMode="numeric" autoComplete="tel-national"
                        aria-describedby="cf-phone-error"
                      />
                    </div>
                    <FieldError id="cf-phone-error" message={errors.phone} />
                  </div>

                  {/* Subject */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-subject">Subject<Req /></label>
                    <input
                      id="cf-subject"
                      className={`form-input${errors.subject ? " cf-input-error" : ""}`}
                      type="text" name="subject" value={form.subject}
                      onChange={handleChange} onBlur={handleBlur}
                      aria-describedby="cf-subject-error"
                    />
                    <FieldError id="cf-subject-error" message={errors.subject} />
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-message">Message<Req /></label>
                    <textarea
                      id="cf-message" name="message"
                      className={`form-input form-textarea${errors.message ? " cf-input-error" : ""}`}
                      value={form.message} onChange={handleChange} onBlur={handleBlur}
                      rows={5} aria-describedby="cf-message-error"
                    />
                    <FieldError id="cf-message-error" message={errors.message} />
                  </div>

                  <button
                    className="btn btn-secondary btn-block"
                    onClick={handleSubmit}
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </button>

                </div>
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="reveal reveal-delay-3">
              <div className="contact-info-grid">
                {INFO.map(({ Icon, value, label }) => (
                  <div key={label} className="contact-info-card">
                    <span className="contact-info-card__icon"><Icon /></span>
                    {label === "Phone" ? (
                      <p className="contact-info-card__value">
                        <a href="tel:+919003317417"
                           onClick={() => trackPhoneClick("+919003317417")}
                           aria-label="Call Yogo Ventures: +91 9003317417">
                          +91 9003317417
                        </a>
                        {", "}
                        <a href="tel:+916369681960"
                           onClick={() => trackPhoneClick("+916369681960")}
                           aria-label="Call Yogo Ventures: +91 6369681960">
                          +91 6369681960
                        </a>
                      </p>
                    ) : label === "Email" ? (
                      <p className="contact-info-card__value">
                        <a href="mailto:support@yogoventures.com"
                           onClick={() => trackEmailClick("support@yogoventures.com")}
                           aria-label="Email Yogo Ventures">
                          {value}
                        </a>
                      </p>
                    ) : (
                      <p className="contact-info-card__value">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <ConfettiToast visible={confettiVisible} particles={particles} />
    </main>
  );
}
