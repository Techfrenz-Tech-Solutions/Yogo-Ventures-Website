// src/components/common/BottomNav.jsx
// Shows on all screen sizes ≤ 1024px via CSS.
// Contains: Home · Shop · Cart · Wishlist · Services · Contact
// (Cart + Wishlist moved here from header)

import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import "./BottomNav.css";

const ACTIVE_COLOR = "#335765";

function hexToRgbChannels(hex) {
  const clean = hex.replace("#", "");
  const full  = clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean;
  return `${parseInt(full.slice(0,2),16)}, ${parseInt(full.slice(2,4),16)}, ${parseInt(full.slice(4,6),16)}`;
}

export default function BottomNav() {
  const { wishlist, cartCount, setCartOpen } = useApp();
  const navigate = useNavigate();
  const wishlistCount = wishlist.length;
  const rgb = hexToRgbChannels(ACTIVE_COLOR);

  const themeVars = {
    "--bn-active":                ACTIVE_COLOR,
    "--bn-active-glow":           `rgba(${rgb}, 0.50)`,
    "--bn-active-glow-faint":     `rgba(${rgb}, 0.20)`,
    "--bn-active-border":         `rgba(${rgb}, 0.35)`,
    "--bn-active-bg-start":       `rgba(${rgb}, 0.22)`,
    "--bn-active-bg-end":         `rgba(${rgb}, 0.08)`,
    "--bn-hover-bg":              `rgba(${rgb}, 0.10)`,
    "--bn-hover-glow":            `rgba(${rgb}, 0.20)`,
    "--bn-hover-border":          `rgba(${rgb}, 0.18)`,
    "--bn-hover-icon":            ACTIVE_COLOR,
    "--bn-icon-drop-shadow":      `rgba(${rgb}, 0.75)`,
    "--bn-icon-drop-shadow-hover":`rgba(${rgb}, 0.40)`,
  };

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation" style={themeVars}>
      <div className="bottom-nav__track">

        {/* Home */}
        <NavLink to="/" end
          className={({ isActive }) => `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`}
        >
          <span className="bottom-nav__icon-wrap">
            <span className="bottom-nav__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
            </span>
            <span className="bottom-nav__glow"/>
          </span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        {/* Shop */}
        <NavLink to="/shop"
          className={({ isActive }) => `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`}
        >
          <span className="bottom-nav__icon-wrap">
            <span className="bottom-nav__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </span>
            <span className="bottom-nav__glow"/>
          </span>
          <span className="bottom-nav__label">Shop</span>
        </NavLink>

        {/* Cart — action button (not a NavLink) */}
        <button
          className="bottom-nav__item bottom-nav__item--action"
          onClick={() => setCartOpen(true)}
          aria-label={`Cart — ${cartCount} items`}
        >
          <span className="bottom-nav__icon-wrap" style={{ position: "relative" }}>
            <span className="bottom-nav__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h2l1.5 9h11l1.5-6H6"/>
                <path d="M5.5 12H17a1 1 0 0 1 1 1v1H5l.5-2z"/>
                <circle cx="8"  cy="19" r="1.5" fill="currentColor" stroke="none"/>
                <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </span>
            <span className="bottom-nav__glow"/>
            {cartCount > 0 && (
              <span className="bn-badge" aria-label={`${cartCount} items in cart`}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </span>
          <span className="bottom-nav__label">Cart</span>
        </button>

        {/* Wishlist */}
        <NavLink to="/wishlist"
          className={({ isActive }) => `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`}
          aria-label={`Wishlist — ${wishlistCount} items`}
        >
          <span className="bottom-nav__icon-wrap" style={{ position: "relative" }}>
            <span className="bottom-nav__icon">
              <svg viewBox="0 0 24 24" width="22" height="22"
                fill={wishlistCount > 0 ? "#ef4444" : "none"}
                stroke={wishlistCount > 0 ? "#ef4444" : "currentColor"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </span>
            <span className="bottom-nav__glow"/>
            {wishlistCount > 0 && (
              <span className="bn-badge bn-badge--wish" aria-label={`${wishlistCount} items in wishlist`}>
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </span>
          <span className="bottom-nav__label">Wishlist</span>
        </NavLink>

        {/* Contact */}
        <NavLink to="/contact"
          className={({ isActive }) => `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`}
        >
          <span className="bottom-nav__icon-wrap">
            <span className="bottom-nav__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </span>
            <span className="bottom-nav__glow"/>
          </span>
          <span className="bottom-nav__label">Contact</span>
        </NavLink>

      </div>
    </nav>
  );
}
