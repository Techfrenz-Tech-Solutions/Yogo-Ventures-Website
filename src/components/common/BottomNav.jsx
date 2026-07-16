// src/components/common/BottomNav.jsx — Mobile bottom navigation bar (no hamburger)
// Shows only on screens ≤ 768 px via CSS

import { NavLink } from "react-router-dom";
import "./BottomNav.css";

// Site's single default accent color (was previously user-selectable via a
// theme picker, now removed — this matches that picker's default, "Deep
// Teal", which is also the site's static --deep CSS variable).
const ACTIVE_COLOR = "#335765";

const NAV_ITEMS = [
  {
    label: "Home",
    to: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    label: "Shop",
    to: "/shop",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: "Services",
    to: "/services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        <path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07" />
      </svg>
    ),
  },
  {
    label: "Contact",
    to: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

/**
 * Converts a hex colour like "#38BDF8" into an "r, g, b" string
 * so we can use it inside rgba() in CSS variables.
 */
function hexToRgbChannels(hex) {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export default function BottomNav() {
  // We expose ACTIVE_COLOR as --bn-active and derive a glow rgba from its channels.
  const rgb = hexToRgbChannels(ACTIVE_COLOR);

  const themeVars = {
    "--bn-active": ACTIVE_COLOR,
    "--bn-active-glow": `rgba(${rgb}, 0.50)`,
    "--bn-active-glow-faint": `rgba(${rgb}, 0.20)`,
    "--bn-active-border": `rgba(${rgb}, 0.35)`,
    "--bn-active-bg-start": `rgba(${rgb}, 0.22)`,
    "--bn-active-bg-end": `rgba(${rgb}, 0.08)`,
    "--bn-hover-bg": `rgba(${rgb}, 0.10)`,
    "--bn-hover-glow": `rgba(${rgb}, 0.20)`,
    "--bn-hover-border": `rgba(${rgb}, 0.18)`,
    "--bn-hover-icon": ACTIVE_COLOR,
    "--bn-icon-drop-shadow": `rgba(${rgb}, 0.75)`,
    "--bn-icon-drop-shadow-hover": `rgba(${rgb}, 0.40)`,
  };

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation" style={themeVars}>
      <div className="bottom-nav__track">
        {NAV_ITEMS.map(({ label, to, icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`
            }
          >
            <span className="bottom-nav__icon-wrap">
              <span className="bottom-nav__icon">{icon}</span>
              <span className="bottom-nav__glow" />
            </span>
            <span className="bottom-nav__label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}