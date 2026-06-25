import { useState } from "react";
import "./EnquirySection.css";

// Single source of truth — country list with flag, full display name, and ISD code.
// The Country dropdown is built from this same array, so selecting a country
// always has its ISD code right there — no cross-array lookup needed.
const COUNTRIES = [
  { code: "+93",  country: "Afghanistan",          flag: "🇦🇫" },
  { code: "+355", country: "Albania",              flag: "🇦🇱" },
  { code: "+213", country: "Algeria",              flag: "🇩🇿" },
  { code: "+376", country: "Andorra",              flag: "🇦🇩" },
  { code: "+244", country: "Angola",               flag: "🇦🇴" },
  { code: "+54",  country: "Argentina",            flag: "🇦🇷" },
  { code: "+374", country: "Armenia",              flag: "🇦🇲" },
  { code: "+61",  country: "Australia",            flag: "🇦🇺" },
  { code: "+43",  country: "Austria",              flag: "🇦🇹" },
  { code: "+994", country: "Azerbaijan",           flag: "🇦🇿" },
  { code: "+973", country: "Bahrain",              flag: "🇧🇭" },
  { code: "+880", country: "Bangladesh",           flag: "🇧🇩" },
  { code: "+375", country: "Belarus",              flag: "🇧🇾" },
  { code: "+32",  country: "Belgium",              flag: "🇧🇪" },
  { code: "+501", country: "Belize",               flag: "🇧🇿" },
  { code: "+229", country: "Benin",                flag: "🇧🇯" },
  { code: "+975", country: "Bhutan",               flag: "🇧🇹" },
  { code: "+591", country: "Bolivia",              flag: "🇧🇴" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+267", country: "Botswana",             flag: "🇧🇼" },
  { code: "+55",  country: "Brazil",               flag: "🇧🇷" },
  { code: "+673", country: "Brunei",               flag: "🇧🇳" },
  { code: "+359", country: "Bulgaria",             flag: "🇧🇬" },
  { code: "+226", country: "Burkina Faso",         flag: "🇧🇫" },
  { code: "+257", country: "Burundi",              flag: "🇧🇮" },
  { code: "+238", country: "Cape Verde",           flag: "🇨🇻" },
  { code: "+855", country: "Cambodia",             flag: "🇰🇭" },
  { code: "+237", country: "Cameroon",             flag: "🇨🇲" },
  { code: "+1",   country: "Canada",               flag: "🇨🇦" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+235", country: "Chad",                 flag: "🇹🇩" },
  { code: "+56",  country: "Chile",                flag: "🇨🇱" },
  { code: "+86",  country: "China",                flag: "🇨🇳" },
  { code: "+57",  country: "Colombia",             flag: "🇨🇴" },
  { code: "+269", country: "Comoros",              flag: "🇰🇲" },
  { code: "+242", country: "Congo",                flag: "🇨🇬" },
  { code: "+506", country: "Costa Rica",           flag: "🇨🇷" },
  { code: "+385", country: "Croatia",              flag: "🇭🇷" },
  { code: "+53",  country: "Cuba",                 flag: "🇨🇺" },
  { code: "+357", country: "Cyprus",               flag: "🇨🇾" },
  { code: "+420", country: "Czech Republic",       flag: "🇨🇿" },
  { code: "+243", country: "DR Congo",             flag: "🇨🇩" },
  { code: "+45",  country: "Denmark",              flag: "🇩🇰" },
  { code: "+253", country: "Djibouti",             flag: "🇩🇯" },
  { code: "+1809",country: "Dominican Republic",   flag: "🇩🇴" },
  { code: "+593", country: "Ecuador",              flag: "🇪🇨" },
  { code: "+20",  country: "Egypt",                flag: "🇪🇬" },
  { code: "+503", country: "El Salvador",          flag: "🇸🇻" },
  { code: "+291", country: "Eritrea",              flag: "🇪🇷" },
  { code: "+372", country: "Estonia",              flag: "🇪🇪" },
  { code: "+268", country: "Eswatini",             flag: "🇸🇿" },
  { code: "+251", country: "Ethiopia",             flag: "🇪🇹" },
  { code: "+679", country: "Fiji",                 flag: "🇫🇯" },
  { code: "+358", country: "Finland",              flag: "🇫🇮" },
  { code: "+33",  country: "France",               flag: "🇫🇷" },
  { code: "+241", country: "Gabon",                flag: "🇬🇦" },
  { code: "+220", country: "Gambia",               flag: "🇬🇲" },
  { code: "+995", country: "Georgia",              flag: "🇬🇪" },
  { code: "+49",  country: "Germany",              flag: "🇩🇪" },
  { code: "+233", country: "Ghana",                flag: "🇬🇭" },
  { code: "+30",  country: "Greece",               flag: "🇬🇷" },
  { code: "+502", country: "Guatemala",            flag: "🇬🇹" },
  { code: "+224", country: "Guinea",               flag: "🇬🇳" },
  { code: "+245", country: "Guinea-Bissau",        flag: "🇬🇼" },
  { code: "+592", country: "Guyana",               flag: "🇬🇾" },
  { code: "+509", country: "Haiti",                flag: "🇭🇹" },
  { code: "+504", country: "Honduras",             flag: "🇭🇳" },
  { code: "+36",  country: "Hungary",              flag: "🇭🇺" },
  { code: "+354", country: "Iceland",              flag: "🇮🇸" },
  { code: "+91",  country: "India",                flag: "🇮🇳" },
  { code: "+62",  country: "Indonesia",            flag: "🇮🇩" },
  { code: "+98",  country: "Iran",                 flag: "🇮🇷" },
  { code: "+964", country: "Iraq",                 flag: "🇮🇶" },
  { code: "+353", country: "Ireland",              flag: "🇮🇪" },
  { code: "+972", country: "Israel",               flag: "🇮🇱" },
  { code: "+39",  country: "Italy",                flag: "🇮🇹" },
  { code: "+225", country: "Ivory Coast",          flag: "🇨🇮" },
  { code: "+1876",country: "Jamaica",              flag: "🇯🇲" },
  { code: "+81",  country: "Japan",                flag: "🇯🇵" },
  { code: "+962", country: "Jordan",               flag: "🇯🇴" },
  { code: "+7",   country: "Kazakhstan",           flag: "🇰🇿" },
  { code: "+254", country: "Kenya",                flag: "🇰🇪" },
  { code: "+686", country: "Kiribati",             flag: "🇰🇮" },
  { code: "+965", country: "Kuwait",               flag: "🇰🇼" },
  { code: "+996", country: "Kyrgyzstan",           flag: "🇰🇬" },
  { code: "+856", country: "Laos",                 flag: "🇱🇦" },
  { code: "+371", country: "Latvia",               flag: "🇱🇻" },
  { code: "+961", country: "Lebanon",              flag: "🇱🇧" },
  { code: "+266", country: "Lesotho",              flag: "🇱🇸" },
  { code: "+231", country: "Liberia",              flag: "🇱🇷" },
  { code: "+218", country: "Libya",                flag: "🇱🇾" },
  { code: "+423", country: "Liechtenstein",        flag: "🇱🇮" },
  { code: "+370", country: "Lithuania",            flag: "🇱🇹" },
  { code: "+352", country: "Luxembourg",           flag: "🇱🇺" },
  { code: "+261", country: "Madagascar",           flag: "🇲🇬" },
  { code: "+265", country: "Malawi",               flag: "🇲🇼" },
  { code: "+60",  country: "Malaysia",             flag: "🇲🇾" },
  { code: "+960", country: "Maldives",             flag: "🇲🇻" },
  { code: "+223", country: "Mali",                 flag: "🇲🇱" },
  { code: "+356", country: "Malta",                flag: "🇲🇹" },
  { code: "+222", country: "Mauritania",           flag: "🇲🇷" },
  { code: "+230", country: "Mauritius",            flag: "🇲🇺" },
  { code: "+52",  country: "Mexico",               flag: "🇲🇽" },
  { code: "+373", country: "Moldova",              flag: "🇲🇩" },
  { code: "+976", country: "Mongolia",             flag: "🇲🇳" },
  { code: "+382", country: "Montenegro",           flag: "🇲🇪" },
  { code: "+212", country: "Morocco",              flag: "🇲🇦" },
  { code: "+258", country: "Mozambique",           flag: "🇲🇿" },
  { code: "+95",  country: "Myanmar",              flag: "🇲🇲" },
  { code: "+264", country: "Namibia",              flag: "🇳🇦" },
  { code: "+977", country: "Nepal",                flag: "🇳🇵" },
  { code: "+31",  country: "Netherlands",          flag: "🇳🇱" },
  { code: "+64",  country: "New Zealand",          flag: "🇳🇿" },
  { code: "+505", country: "Nicaragua",            flag: "🇳🇮" },
  { code: "+227", country: "Niger",                flag: "🇳🇪" },
  { code: "+234", country: "Nigeria",              flag: "🇳🇬" },
  { code: "+850", country: "North Korea",          flag: "🇰🇵" },
  { code: "+389", country: "North Macedonia",      flag: "🇲🇰" },
  { code: "+47",  country: "Norway",               flag: "🇳🇴" },
  { code: "+968", country: "Oman",                 flag: "🇴🇲" },
  { code: "+92",  country: "Pakistan",             flag: "🇵🇰" },
  { code: "+680", country: "Palau",                flag: "🇵🇼" },
  { code: "+970", country: "Palestine",            flag: "🇵🇸" },
  { code: "+507", country: "Panama",               flag: "🇵🇦" },
  { code: "+675", country: "Papua New Guinea",     flag: "🇵🇬" },
  { code: "+595", country: "Paraguay",             flag: "🇵🇾" },
  { code: "+51",  country: "Peru",                 flag: "🇵🇪" },
  { code: "+63",  country: "Philippines",          flag: "🇵🇭" },
  { code: "+48",  country: "Poland",               flag: "🇵🇱" },
  { code: "+351", country: "Portugal",             flag: "🇵🇹" },
  { code: "+974", country: "Qatar",                flag: "🇶🇦" },
  { code: "+40",  country: "Romania",              flag: "🇷🇴" },
  { code: "+7",   country: "Russia",               flag: "🇷🇺" },
  { code: "+250", country: "Rwanda",               flag: "🇷🇼" },
  { code: "+966", country: "Saudi Arabia",         flag: "🇸🇦" },
  { code: "+221", country: "Senegal",              flag: "🇸🇳" },
  { code: "+381", country: "Serbia",               flag: "🇷🇸" },
  { code: "+232", country: "Sierra Leone",         flag: "🇸🇱" },
  { code: "+65",  country: "Singapore",            flag: "🇸🇬" },
  { code: "+421", country: "Slovakia",             flag: "🇸🇰" },
  { code: "+386", country: "Slovenia",             flag: "🇸🇮" },
  { code: "+677", country: "Solomon Islands",      flag: "🇸🇧" },
  { code: "+252", country: "Somalia",              flag: "🇸🇴" },
  { code: "+27",  country: "South Africa",         flag: "🇿🇦" },
  { code: "+82",  country: "South Korea",          flag: "🇰🇷" },
  { code: "+211", country: "South Sudan",          flag: "🇸🇸" },
  { code: "+34",  country: "Spain",                flag: "🇪🇸" },
  { code: "+94",  country: "Sri Lanka",            flag: "🇱🇰" },
  { code: "+249", country: "Sudan",                flag: "🇸🇩" },
  { code: "+597", country: "Suriname",             flag: "🇸🇷" },
  { code: "+46",  country: "Sweden",               flag: "🇸🇪" },
  { code: "+41",  country: "Switzerland",          flag: "🇨🇭" },
  { code: "+963", country: "Syria",                flag: "🇸🇾" },
  { code: "+886", country: "Taiwan",               flag: "🇹🇼" },
  { code: "+992", country: "Tajikistan",           flag: "🇹🇯" },
  { code: "+255", country: "Tanzania",             flag: "🇹🇿" },
  { code: "+66",  country: "Thailand",             flag: "🇹🇭" },
  { code: "+228", country: "Togo",                 flag: "🇹🇬" },
  { code: "+676", country: "Tonga",                flag: "🇹🇴" },
  { code: "+1868",country: "Trinidad and Tobago",  flag: "🇹🇹" },
  { code: "+216", country: "Tunisia",              flag: "🇹🇳" },
  { code: "+90",  country: "Turkey",               flag: "🇹🇷" },
  { code: "+993", country: "Turkmenistan",         flag: "🇹🇲" },
  { code: "+256", country: "Uganda",               flag: "🇺🇬" },
  { code: "+380", country: "Ukraine",              flag: "🇺🇦" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+44",  country: "United Kingdom",       flag: "🇬🇧" },
  { code: "+1",   country: "United States",        flag: "🇺🇸" },
  { code: "+598", country: "Uruguay",              flag: "🇺🇾" },
  { code: "+998", country: "Uzbekistan",           flag: "🇺🇿" },
  { code: "+678", country: "Vanuatu",              flag: "🇻🇺" },
  { code: "+58",  country: "Venezuela",            flag: "🇻🇪" },
  { code: "+84",  country: "Vietnam",              flag: "🇻🇳" },
  { code: "+967", country: "Yemen",                flag: "🇾🇪" },
  { code: "+260", country: "Zambia",               flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe",             flag: "🇿🇼" },
];

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

// Phone is optional; if provided must be exactly 6–10 digits
const validatePhone = (v) => {
  if (!v || v.trim() === "") return "";
  return /^[0-9]{6,10}$/.test(v.trim())
    ? ""
    : "Please enter a valid phone number (6–10 digits).";
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
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    isdCode:   "+91",
    phone:     "",
    country:   "",
    category:  "",
    message:   "",
  });

  const [errors, setErrors] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", country: "", category: "", message: "",
  });

  const [touched, setTouched] = useState({
    firstName: false, lastName: false, email: false,
    phone: false, country: false, category: false, message: false,
  });

  const [toast, setToast] = useState(false);

  /* ── Change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      // ── THE FIX: country and isdCode live in the SAME array (COUNTRIES).
      // When a country is picked, find its entry and update both fields
      // atomically — no cross-array lookup, no name-mismatch risk ever.
      const selected = COUNTRIES.find((item) => item.country === value);
      setForm((prev) => ({
        ...prev,
        country: value,
        isdCode: selected ? selected.code : prev.isdCode,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (!touched[name]) return;

    const validators = {
      firstName: validateFirstName,
      lastName:  validateLastName,
      email:     validateEmail,
      phone:     validatePhone,
      country:   validateCountry,
      category:  validateCategory,
      message:   validateMessage,
    };
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  /* ── Blur ── */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validators = {
      firstName: validateFirstName,
      lastName:  validateLastName,
      email:     validateEmail,
      phone:     validatePhone,
      country:   validateCountry,
      category:  validateCategory,
      message:   validateMessage,
    };
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  /* ── Submit ── */
  const handleSubmit = (e) => {
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

    console.log({ ...form });
    setToast(true);
    setTimeout(() => setToast(false), 3500);

    setForm({
      firstName: "", lastName: "", email: "",
      isdCode: "+91", phone: "", country: "",
      category: "", message: "",
    });
    setErrors({
      firstName: "", lastName: "", email: "",
      phone: "", country: "", category: "", message: "",
    });
    setTouched({
      firstName: false, lastName: false, email: false,
      phone: false, country: false, category: false, message: false,
    });
  };

  /* ── Render ── */
  return (
    <section className="section enquiry-section" aria-labelledby="enquiry-heading">
      <div className="container">

        {/* TOAST */}
        {toast && (
          <div className="enquiry-toast" role="status" aria-live="polite">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Enquiry submitted! We'll get back to you shortly.
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
                <label htmlFor="firstName">First Name <span className="required-star">*</span></label>
                <input
                  id="firstName" type="text" name="firstName"
                  value={form.firstName}
                  onChange={handleChange} onBlur={handleBlur}
                  className={errors.firstName ? "input-error-border" : ""}
                  aria-describedby="firstName-error"
                />
                <FieldError id="firstName-error" message={errors.firstName} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName" type="text" name="lastName"
                  value={form.lastName}
                  onChange={handleChange} onBlur={handleBlur}
                  className={errors.lastName ? "input-error-border" : ""}
                  aria-describedby="lastName-error"
                />
                <FieldError id="lastName-error" message={errors.lastName} />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address <span className="required-star">*</span></label>
              <input
                id="email" type="text" name="email"
                value={form.email}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.email ? "input-error-border" : ""}
                aria-describedby="email-error"
                autoComplete="email"
              />
              <FieldError id="email-error" message={errors.email} />
            </div>

            {/* Country — built from COUNTRIES, same array as ISD lookup */}
            <div className="form-group">
              <label htmlFor="country">Country <span className="required-star">*</span></label>
              <select
                id="country" name="country"
                value={form.country}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.country ? "input-error-border" : ""}
                aria-describedby="country-error"
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((item, i) => (
                  <option key={i} value={item.country}>
                    {item.flag} {item.country}
                  </option>
                ))}
              </select>
              <FieldError id="country-error" message={errors.country} />
            </div>

            {/* Phone — ISD selector also built from COUNTRIES */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className={`phone-input-wrapper${errors.phone ? " input-error-border" : ""}`}>
                <select
                  name="isdCode"
                  className="isd-select"
                  value={form.isdCode}
                  onChange={handleChange}
                  aria-label="Country calling code"
                >
                  {COUNTRIES.map((item, i) => (
                    <option key={i} value={item.code}>
                      {item.flag} {item.code}
                    </option>
                  ))}
                </select>
                <div className="isd-divider" aria-hidden="true" />
                <input
                  id="phone" type="text" name="phone"
                  className="phone-number-input"
                  value={form.phone}
                  onChange={handleChange} onBlur={handleBlur}
                  aria-describedby="phone-error"
                  inputMode="numeric"
                  autoComplete="tel-national"
                />
              </div>
              <FieldError id="phone-error" message={errors.phone} />
            </div>

            {/* Product Category */}
            <div className="form-group">
              <label htmlFor="category">Product Category <span className="required-star">*</span></label>
              <select
                id="category" name="category"
                value={form.category}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.category ? "input-error-border" : ""}
                aria-describedby="category-error"
              >
                <option value="">Select Category</option>
                <option value="Apparel">Apparel</option>
                <option value="Memory Foam Products">Memory Foam Products</option>
                <option value="Copper Utensils">Copper Utensils</option>
                <option value="Handmade Cotton Bags">Handmade Cotton Bags</option>
              </select>
              <FieldError id="category-error" message={errors.category} />
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">Message <span className="required-star">*</span></label>
              <textarea
                id="message" rows="4" name="message"
                value={form.message}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.message ? "input-error-border" : ""}
                aria-describedby="message-error"
              />
              <FieldError id="message-error" message={errors.message} />
            </div>

            <button type="submit" className="btn btn--theme enquiry-submit">
              Enquire Now
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}