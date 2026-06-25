// src/components/common/CookieConsent.js
import "./CookieConsent.css";

export default function CookieConsent({ onAccept, onDecline }) {
  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      {/* Cookie Icon */}
      <div className="cookie-banner__icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 1010 10c0-.34-.02-.67-.05-1A5 5 0 0117 6a5 5 0 01-5-4zm-3 7a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm6 1a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-2 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
        </svg>
      </div>

      <h3 className="cookie-banner__title">Cookie Preferences</h3>

      <p className="cookie-banner__text">
        We use cookies to enhance your browsing experience and personalise
        your coastal journey. You can accept all or decline non-essential
        cookies.
      </p>

      <div className="cookie-banner__actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={onAccept}
        >
          Accept All
        </button>

        <button
          className="btn btn-ghost btn-sm"
          onClick={onDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
}