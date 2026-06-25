// src/components/common/ThemeSwitcher.jsx — Individual color dots, 3D animation
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { THEMES } from "../../data/content";
import "./ThemeSwitcher.css";

export default function ThemeSwitcher() {
  const { themeColor, setThemeColor } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-switcher" role="group" aria-label="Theme colour">
      {/* Individual color dots — always visible when open, 3D flip animation */}
      <div className={`theme-dots-wrap${open ? " open" : ""}`}>
        {THEMES.map((t, i) => (
          <button
            key={t.color}
            className={`theme-dot-btn${themeColor === t.color ? " active" : ""}`}
            style={{
              "--dot-color": t.color,
              "--dot-delay": `${i * 0.06}s`,
            }}
            onClick={() => { setThemeColor(t.color); setOpen(false); }}
            aria-label={`Set theme to ${t.name}`}
            title={t.name}
          />
        ))}
      </div>

      {/* Toggle: palette SVG icon */}
      <button
        className="theme-toggle-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Change theme colour"
        style={{ "--dot-color": themeColor }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="1.5" fill="var(--dot-color)" stroke="none"/>
          <circle cx="17.5" cy="10.5" r="1.5" fill="#F59E0B" stroke="none"/>
          <circle cx="8.5"  cy="7.5"  r="1.5" fill="#2D5016" stroke="none"/>
          <circle cx="6.5"  cy="12.5" r="1.5" fill="#4A2545" stroke="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-.5c0-.55-.45-1-1-1h-1c-2.76 0-5-2.24-5-5 0-3.87 4.03-7 9-7 3.87 0 7 2.24 7 5.5 0 2.49-1.79 4.5-4 4.5-.55 0-1-.45-1-1v-3c0-.55-.45-1-1-1h-1c-.55 0-1 .45-1 1v3c0 .55-.45 1-1 1H9"/>
        </svg>
      </button>
    </div>
  );
}
