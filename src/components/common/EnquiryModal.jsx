// src/components/common/EnquiryModal.jsx — Yogo Ventures (no scroll, logo inside)
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import "./EnquiryModal.css";

export default function EnquiryModal({ onClose }) {
  const { showToast } = useApp();
  const [form, setForm] = useState({ firstName:"", email:"", phone:"", message:"" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onClose();
    showToast("Thanks! We'll be in touch soon 🎉");
  };

  const change = field => ev => setForm(f => ({ ...f, [field]: ev.target.value }));

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="enquiry-modal">
        {/* Top accent bar */}
        <div className="enquiry-modal__bar" aria-hidden="true" />

        {/* Close */}
        <button className="close-btn enquiry-modal__close" onClick={onClose} aria-label="Close">✕</button>

        {/* Logo + Header */}
        <div className="enquiry-modal__header">
          <h2 id="enquiry-modal-title" className="enquiry-modal__title">
            Enquiry Form
          </h2>
          <p className="enquiry-modal__subtitle">
            India's trusted marketplace for authentic handicrafts, copper utensils &amp; premium lifestyle products.
          </p>
        </div>

        {/* Form — compact, no inner scroll */}
        <div className="enquiry-modal__body">
          <div className="enquiry-modal__row">
            <div className="form-group">
              <label className="form-label" htmlFor="eq-firstname">
                First Name <span style={{color:"var(--terra)"}}>*</span>
              </label>
              <input
                id="eq-firstname"
                className={`form-input${errors.firstName ? " form-input--error" : ""}`}
                type="text"
                placeholder="Your first name"
                value={form.firstName}
                onChange={change("firstName")}
                aria-required="true"
                autoComplete="given-name"
              />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="eq-phone">Phone</label>
              <input
                id="eq-phone"
                className="form-input"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={change("phone")}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="eq-email">
              Email <span style={{color:"var(--terra)"}}>*</span>
            </label>
            <input
              id="eq-email"
              className={`form-input${errors.email ? " form-input--error" : ""}`}
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={change("email")}
              aria-required="true"
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="eq-message">Message</label>
            <textarea
              id="eq-message"
              className="form-input form-textarea"
              placeholder="What are you looking for?"
              value={form.message}
              onChange={change("message")}
              rows={2}
            />
          </div>

          <button className="btn btn-secondary btn-block" onClick={handleSubmit}>
            Send Enquiry
          </button>
          <button className="enquiry-modal__skip" onClick={onClose}>
            Continue browsing →
          </button>
        </div>
      </div>
    </div>
  );
}
