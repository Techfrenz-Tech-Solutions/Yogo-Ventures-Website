// src/pages/ContactPage.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { COUNTRY_LIST } from "../data/countries";
import "./ContactPage.css";
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
    stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

// ── Contact info data ─────────────────────────────────────────────────────────
const INFO = [
  {
    Icon:  LocationIcon,
    value: "Trichy - 620003, Tamil Nadu, India.",
    label: "Address",
  },
  {
    Icon:  MailIcon,
    value: "support@yogoventures.com",
    label: "Email",
  },
  {
    Icon:  PhoneIcon,
    // Changed \n to comma separator between phone numbers
    value: "+91 9003317417, +91 6369681960",
    label: "Phone",
  },
  {
    Icon:  ClockIcon,
    value: "Mon – Sat : 10AM – 7PM IST",
    label: "Hours",
  },
];


// ── Validators ────────────────────────────────────────────────────────────────
const validateRequired = (v, label) =>
  v && v.trim() !== "" ? "" : `${label} is required. Please enter your ${label.toLowerCase()}.`;

const validateEmail = (v) => {
  if (!v || v.trim() === "") return "Email Address is required. Please enter your email address.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
    ? "" : "Invalid Email ID. Please enter a valid Email ID.";
};

// Phone is optional — only validate format if a value is entered (6–10 digits)
const validatePhone = (v) => {
  if (!v || v.trim() === "") return "";
  return /^[0-9]{6,10}$/.test(v.trim())
    ? "" : "Please enter a valid phone number (6–10 digits).";
};

const validateCountry = (v) =>
  v && v.trim() !== "" ? "" : "Country is required. Please enter your country.";

const validateSubject = (v) =>
  v && v.trim() !== "" ? "" : "Subject is required. Please enter a subject.";

const validateMessage = (v) =>
  v && v.trim() !== "" ? "" : "Message is required. Please enter your message.";

// ── Inline field error ────────────────────────────────────────────────────────
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

// ── Required star helper ──────────────────────────────────────────────────────
const Req = () => <span className="cf-required-star"> *</span>;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { showToast } = useApp();
  useScrollReveal([]);

  const INITIAL_FORM = {
    firstName: "",
    lastName:  "",
    email:     "",
    isdCode:   "+91",
    phone:     "",
    country:   "",
    subject:   "",
    message:   "",
  };

  const INITIAL_ERRORS = {
    firstName: "",
    lastName:  "",
    email:     "",
    phone:     "",
    country:   "",
    subject:   "",
    message:   "",
  };

  const INITIAL_TOUCHED = {
    firstName: false,
    lastName:  false,
    email:     false,
    phone:     false,
    country:   false,
    subject:   false,
    message:   false,
  };

  const [form,    setForm]    = useState(INITIAL_FORM);
  const [errors,  setErrors]  = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);

  // ── Run the right validator for a given field ──────────────────────────────
  const runValidator = (name, value) => {
    switch (name) {
      case "firstName": return validateRequired(value, "First Name");
      case "lastName":  return ""; // Last name is now optional
      case "email":     return validateEmail(value);
      case "phone":     return validatePhone(value);        // optional
      case "country":   return validateCountry(value);
      case "subject":   return validateSubject(value);
      case "message":   return validateMessage(value);
      default:          return "";
    }
  };

  // ── Generic change handler ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    // If country changes, set the ISD code
    if (name === "country") {
      const selectedCountry = COUNTRY_LIST.find(c => c.country === value);
      if (selectedCountry) {
        setForm((p) => ({ ...p, isdCode: selectedCountry.code }));
      }
    }

    if (touched[name] !== undefined && touched[name]) {
      setErrors((p) => ({ ...p, [name]: runValidator(name, value) }));
    }
  };

  // ── Blur — mark touched & validate ────────────────────────────────────────
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name in touched) {
      setTouched((p) => ({ ...p, [name]: true }));
      setErrors((p)  => ({ ...p, [name]: runValidator(name, value) }));
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    // Validate all fields
    const newErrors = {
      firstName: runValidator("firstName", form.firstName),
      lastName:  "", // Last name is now optional
      email:     runValidator("email",     form.email),
      phone:     runValidator("phone",     form.phone),
      country:   runValidator("country",   form.country),
      subject:   runValidator("subject",   form.subject),
      message:   runValidator("message",   form.message),
    };

    setErrors(newErrors);
    setTouched({
      firstName: true, lastName: false, email: true,
      phone: true, country: true, subject: true, message: true,
    });

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    showToast("Message sent! We'll be in touch soon.");
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched(INITIAL_TOUCHED);
  };

  return (
    <main className="page-enter contact-page" aria-label="Contact page">

      {/* ── HERO ── */}
      <section className="page-hero section--dark">
        <div className="container">
          <span className="section-tag" style={{ background: "rgba(182,217,224,0.2)", color: "var(--light)" }}>
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
                      <label className="form-label" htmlFor="cf-fname">
                        First Name<Req />
                      </label>
                      <input
                        id="cf-fname"
                        className={`form-input${errors.firstName ? " cf-input-error" : ""}`}
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="given-name"
                        aria-describedby="cf-fname-error"
                      />
                      <FieldError id="cf-fname-error" message={errors.firstName} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="cf-lname">
                        Last Name
                      </label>
                      <input
                        id="cf-lname"
                        className={`form-input${errors.lastName ? " cf-input-error" : ""}`}
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="family-name"
                        aria-describedby="cf-lname-error"
                      />
                      <FieldError id="cf-lname-error" message={errors.lastName} />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-email">
                      Email Address<Req />
                    </label>
                    <input
                      id="cf-email"
                      className={`form-input${errors.email ? " cf-input-error" : ""}`}
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      aria-describedby="cf-email-error"
                    />
                    <FieldError id="cf-email-error" message={errors.email} />
                  </div>

                  {/* Country — dropdown, mandatory */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-country">
                      Country<Req />
                    </label>
                    <select
                      id="cf-country"
                      className={`form-input${errors.country ? " cf-input-error" : ""}`}
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="country-name"
                      aria-describedby="cf-country-error"
                    >
                      <option value="">Select Country</option>
                      {COUNTRY_LIST.map((item, i) => (
                        <option key={i} value={item.country}>
                          {item.flag} {item.country}
                        </option>
                      ))}
                    </select>
                    <FieldError id="cf-country-error" message={errors.country} />
                  </div>

                  {/* Phone Number — optional, format-validated if filled */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-phone">Phone Number</label>
                    <div className={`cf-phone-wrapper${errors.phone ? " cf-input-error" : ""}`}>
                      <select
                        name="isdCode"
                        className="cf-isd-select"
                        value={form.isdCode}
                        onChange={handleChange}
                        aria-label="Country calling code"
                      >
                        {COUNTRY_LIST.map((item, i) => (
                          <option key={i} value={item.code}>
                            {item.flag} {item.code}
                          </option>
                        ))}
                      </select>
                      <div className="cf-isd-divider" aria-hidden="true" />
                      <input
                        id="cf-phone"
                        type="text"
                        name="phone"
                        className="cf-phone-input"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        aria-describedby="cf-phone-error"
                      />
                    </div>
                    <FieldError id="cf-phone-error" message={errors.phone} />
                  </div>

                  {/* Subject — mandatory, free-text input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-subject">
                      Subject<Req />
                    </label>
                    <input
                      id="cf-subject"
                      className={`form-input${errors.subject ? " cf-input-error" : ""}`}
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-describedby="cf-subject-error"
                    />
                    <FieldError id="cf-subject-error" message={errors.subject} />
                  </div>

                  {/* Message — mandatory */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="cf-message">
                      Message<Req />
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      className={`form-input form-textarea${errors.message ? " cf-input-error" : ""}`}
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      aria-describedby="cf-message-error"
                    />
                    <FieldError id="cf-message-error" message={errors.message} />
                  </div>

                  <button className="btn btn-secondary btn-block" onClick={handleSubmit}>
                    Send Message
                  </button>

                </div>
              </div>
            </div>

            {/* INFO CARDS (map removed) */}
            <div className="reveal reveal-delay-3">
              <div className="contact-info-grid">
                {INFO.map(({ Icon, value, label }) => (
                  <div key={label} className="contact-info-card">
                    <span className="contact-info-card__icon">
                      <Icon />
                    </span>
                    <p className="contact-info-card__value">{value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}