// src/pages/PrivacyPolicy.jsx — Yogo Ventures
// CONTENT updated to match the Privacy Policy Word document (14 sections).
// All design, layout, SVG style, CSS classes, hero, trust strip — UNCHANGED.
import { useSEO } from "../hooks/useSEO";
import "./PrivacyPolicy.css";

/* ═══════════════════════════════════════════════════════════
   TRUST STRIP ICONS — inline SVG replacing emojis
   ═══════════════════════════════════════════════════════════ */

function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IconIndia() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function IconHandshake() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l8.42 8.42 8.42-8.42a5.4 5.4 0 0 0 0-7.65z"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT SECTION ICONS — replacing emoji in body text
   ═══════════════════════════════════════════════════════════ */

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="pp-inline-icon" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="pp-inline-icon" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="pp-inline-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   INLINE SVG ILLUSTRATIONS
   — Existing illustrations preserved, new ones added below.
   — All use identical viewBox="0 0 140 100", var(--deep) colour,
     and the same opacity / stroke / fill conventions.
   ═══════════════════════════════════════════════════════════ */

/* ── Existing illustrations (unchanged) ── */

function SvgDataCollection() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <rect x="25" y="18" width="70" height="72" rx="4" fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <rect x="50" y="12" width="20" height="12" rx="3" fill="var(--deep)" opacity="0.18"/>
      <rect x="55" y="10" width="10" height="6" rx="2" fill="var(--deep)" opacity="0.25"/>
      <rect x="33" y="34" width="54" height="7" rx="2" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1" strokeOpacity="0.2"/>
      <rect x="33" y="46" width="54" height="7" rx="2" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1" strokeOpacity="0.2"/>
      <rect x="33" y="58" width="54" height="7" rx="2" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1" strokeOpacity="0.2"/>
      <rect x="33" y="30" width="22" height="3" rx="1" fill="var(--deep)" opacity="0.25"/>
      <rect x="33" y="42" width="28" height="3" rx="1" fill="var(--deep)" opacity="0.25"/>
      <rect x="33" y="54" width="18" height="3" rx="1" fill="var(--deep)" opacity="0.25"/>
      <rect x="33" y="72" width="30" height="10" rx="3" fill="var(--deep)" opacity="0.2"/>
      <path d="M40 77 L44 81 L52 73" stroke="var(--deep)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      <circle cx="112" cy="30" r="5" fill="var(--deep)" opacity="0.12"/>
      <circle cx="120" cy="50" r="3" fill="var(--deep)" opacity="0.1"/>
      <circle cx="108" cy="65" r="4" fill="var(--deep)" opacity="0.1"/>
    </svg>
  );
}

function SvgDataUsage() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <circle cx="42" cy="52" r="22" fill="none" stroke="var(--deep)" strokeWidth="2" opacity="0.15"/>
      <circle cx="42" cy="52" r="14" fill="var(--deep)" opacity="0.08"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => (
        <rect key={i} x="39" y="28" width="6" height="8" rx="2" fill="var(--deep)" opacity="0.2"
          transform={`rotate(${deg} 42 52)`}/>
      ))}
      <circle cx="90" cy="38" r="14" fill="none" stroke="var(--deep)" strokeWidth="1.5" opacity="0.15"/>
      <circle cx="90" cy="38" r="9" fill="var(--deep)" opacity="0.07"/>
      {[0,60,120,180,240,300].map((deg, i) => (
        <rect key={i} x="87.5" y="22" width="5" height="6" rx="1.5" fill="var(--deep)" opacity="0.18"
          transform={`rotate(${deg} 90 38)`}/>
      ))}
      <circle cx="42" cy="52" r="4" fill="var(--deep)" opacity="0.3"/>
      <circle cx="90" cy="38" r="3" fill="var(--deep)" opacity="0.25"/>
      <path d="M64 50 Q72 44 76 40" stroke="var(--deep)" strokeWidth="1.8" fill="none" strokeDasharray="3 2" opacity="0.35"/>
      <rect x="96" y="58" width="30" height="30" rx="3" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <line x1="102" y1="66" x2="120" y2="66" stroke="var(--deep)" strokeWidth="1.5" opacity="0.3"/>
      <line x1="102" y1="72" x2="120" y2="72" stroke="var(--deep)" strokeWidth="1.5" opacity="0.3"/>
      <line x1="102" y1="78" x2="113" y2="78" stroke="var(--deep)" strokeWidth="1.5" opacity="0.3"/>
    </svg>
  );
}

function SvgCookies() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <rect x="12" y="14" width="90" height="68" rx="5" fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <rect x="12" y="14" width="90" height="14" rx="5" fill="var(--deep)" opacity="0.12"/>
      <circle cx="22" cy="21" r="3" fill="var(--deep)" opacity="0.25"/>
      <circle cx="31" cy="21" r="3" fill="var(--deep)" opacity="0.2"/>
      <circle cx="40" cy="21" r="3" fill="var(--deep)" opacity="0.15"/>
      <rect x="48" y="17" width="48" height="8" rx="2" fill="var(--white)" opacity="0.5"/>
      <rect x="18" y="64" width="78" height="14" rx="3" fill="var(--deep)" opacity="0.15"/>
      <rect x="22" y="67" width="36" height="4" rx="1" fill="var(--deep)" opacity="0.25"/>
      <rect x="76" y="66" width="14" height="10" rx="2" fill="var(--deep)" opacity="0.3"/>
      <line x1="79" y1="69" x2="87" y2="73" stroke="var(--white)" strokeWidth="1.5" opacity="0.8"/>
      <line x1="87" y1="69" x2="79" y2="73" stroke="var(--white)" strokeWidth="1.5" opacity="0.8"/>
      <circle cx="118" cy="52" r="18" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <circle cx="112" cy="47" r="3" fill="var(--deep)" opacity="0.25"/>
      <circle cx="120" cy="44" r="2" fill="var(--deep)" opacity="0.2"/>
      <circle cx="123" cy="54" r="2.5" fill="var(--deep)" opacity="0.25"/>
      <circle cx="115" cy="57" r="2" fill="var(--deep)" opacity="0.2"/>
      <circle cx="118" cy="62" r="2" fill="var(--deep)" opacity="0.18"/>
    </svg>
  );
}

function SvgSecurity() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <rect x="12" y="20" width="56" height="14" rx="3" fill="var(--deep)" opacity="0.12" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.25"/>
      <rect x="12" y="38" width="56" height="14" rx="3" fill="var(--deep)" opacity="0.12" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.25"/>
      <rect x="12" y="56" width="56" height="14" rx="3" fill="var(--deep)" opacity="0.12" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.25"/>
      <circle cx="56" cy="27" r="2.5" fill="#22c55e" opacity="0.5"/>
      <circle cx="50" cy="27" r="2.5" fill="#22c55e" opacity="0.35"/>
      <circle cx="56" cy="45" r="2.5" fill="#22c55e" opacity="0.5"/>
      <circle cx="50" cy="45" r="2.5" fill="#f59e0b" opacity="0.4"/>
      <circle cx="56" cy="63" r="2.5" fill="#22c55e" opacity="0.5"/>
      <path d="M90 18 L126 30 L126 58 Q126 82 90 90 Q54 82 54 58 L54 30 Z"
        fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.22"/>
      <rect x="78" y="52" width="24" height="20" rx="3" fill="var(--deep)" opacity="0.22"/>
      <path d="M82 52 L82 44 Q82 36 90 36 Q98 36 98 44 L98 52"
        fill="none" stroke="var(--deep)" strokeWidth="2.5" strokeOpacity="0.4" strokeLinecap="round"/>
      <circle cx="90" cy="61" r="3.5" fill="var(--deep)" opacity="0.45"/>
      <line x1="90" y1="64" x2="90" y2="69" stroke="var(--deep)" strokeWidth="2" opacity="0.4"/>
    </svg>
  );
}

function SvgThirdParty() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <circle cx="70" cy="50" r="14" fill="var(--deep)" opacity="0.14" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.25"/>
      <circle cx="70" cy="50" r="6" fill="var(--deep)" opacity="0.25"/>
      <circle cx="22" cy="24" r="10" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <circle cx="118" cy="24" r="10" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <circle cx="22" cy="76" r="10" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <circle cx="118" cy="76" r="10" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <circle cx="70" cy="12" r="8" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <circle cx="70" cy="88" r="8" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <line x1="56" y1="42" x2="32" y2="30" stroke="var(--deep)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.25"/>
      <line x1="84" y1="42" x2="108" y2="30" stroke="var(--deep)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.25"/>
      <line x1="56" y1="58" x2="32" y2="70" stroke="var(--deep)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.25"/>
      <line x1="84" y1="58" x2="108" y2="70" stroke="var(--deep)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.25"/>
      <line x1="70" y1="36" x2="70" y2="20" stroke="var(--deep)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.25"/>
      <line x1="70" y1="64" x2="70" y2="80" stroke="var(--deep)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.25"/>
    </svg>
  );
}

function SvgRights() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <circle cx="36" cy="28" r="14" fill="var(--deep)" opacity="0.12"/>
      <path d="M14 68 Q36 50 58 68" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <rect x="66" y="16" width="60" height="70" rx="4" fill="var(--deep)" opacity="0.06" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.18"/>
      {[22, 34, 46, 58, 70].map((y, i) => (
        <g key={i}>
          <rect x="72" y={y} width="6" height="6" rx="1.5" fill="var(--deep)" opacity="0.15" stroke="var(--deep)" strokeWidth="1" strokeOpacity="0.3"/>
          <path d={`M73 ${y+3} L74.5 ${y+4.5} L77 ${y+1.5}`} stroke="var(--deep)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          <rect x="82" y={y+1} width="36" height="4" rx="1" fill="var(--deep)" opacity={0.18 - i * 0.02}/>
        </g>
      ))}
    </svg>
  );
}

function SvgRetention() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <rect x="14" y="18" width="64" height="66" rx="4" fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <rect x="14" y="18" width="64" height="16" rx="4" fill="var(--deep)" opacity="0.15"/>
      <rect x="28" y="12" width="6" height="12" rx="3" fill="var(--deep)" opacity="0.3"/>
      <rect x="58" y="12" width="6" height="12" rx="3" fill="var(--deep)" opacity="0.3"/>
      {[0,1,2,3,4].map(row =>
        [0,1,2,3,4,5,6].map(col => (
          <rect key={`${row}-${col}`} x={18 + col * 9} y={40 + row * 9} width="7" height="7" rx="1"
            fill="var(--deep)" opacity={row === 1 && col === 3 ? 0.4 : 0.08}/>
        ))
      )}
      <circle cx="108" cy="50" r="26" fill="var(--deep)" opacity="0.07" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <circle cx="108" cy="50" r="2.5" fill="var(--deep)" opacity="0.35"/>
      <line x1="108" y1="50" x2="108" y2="32" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
      <line x1="108" y1="50" x2="120" y2="56" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line key={i}
          x1={108 + 20 * Math.cos((deg - 90) * Math.PI / 180)}
          y1={50 + 20 * Math.sin((deg - 90) * Math.PI / 180)}
          x2={108 + 24 * Math.cos((deg - 90) * Math.PI / 180)}
          y2={50 + 24 * Math.sin((deg - 90) * Math.PI / 180)}
          stroke="var(--deep)" strokeWidth={i % 3 === 0 ? 2 : 1} opacity="0.2"/>
      ))}
    </svg>
  );
}

function SvgContact() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      <rect x="12" y="26" width="70" height="52" rx="4" fill="var(--deep)" opacity="0.1" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.22"/>
      <path d="M12 30 L47 54 L82 30" stroke="var(--deep)" strokeWidth="1.8" fill="none" opacity="0.3"/>
      <line x1="12" y1="78" x2="34" y2="56" stroke="var(--deep)" strokeWidth="1.2" opacity="0.2"/>
      <line x1="82" y1="78" x2="60" y2="56" stroke="var(--deep)" strokeWidth="1.2" opacity="0.2"/>
      <path d="M108 22 Q108 16 116 16 Q124 16 124 22 L126 44 Q130 48 130 52 L102 52 Q102 48 106 44 Z"
        fill="var(--deep)" opacity="0.12" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.22"/>
      <path d="M112 52 Q112 58 116 58 Q120 58 120 52" fill="var(--deep)" opacity="0.2"/>
      <circle cx="124" cy="20" r="5" fill="#ef4444" opacity="0.5"/>
      <path d="M84 52 Q94 46 100 42" stroke="var(--deep)" strokeWidth="1.5" fill="none" strokeDasharray="3 2" opacity="0.3"/>
      <polygon points="98,38 104,42 99,46" fill="var(--deep)" opacity="0.3"/>
    </svg>
  );
}

/* ── NEW illustrations — same style as above ── */

function SvgIntroduction() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      {/* Document outline */}
      <rect x="26" y="10" width="60" height="78" rx="4" fill="var(--deep)" opacity="0.07" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      {/* Folded corner */}
      <path d="M70 10 L86 26 L70 26 Z" fill="var(--deep)" opacity="0.14"/>
      {/* Title line */}
      <rect x="34" y="36" width="44" height="5" rx="2" fill="var(--deep)" opacity="0.28"/>
      {/* Body lines */}
      <rect x="34" y="47" width="40" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.15"/>
      <rect x="34" y="55" width="36" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.13"/>
      <rect x="34" y="63" width="42" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.12"/>
      <rect x="34" y="71" width="28" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.10"/>
      {/* Checkmark badge (top-right) */}
      <circle cx="112" cy="34" r="15" fill="var(--deep)" opacity="0.09" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <path d="M103 34 L109 40 L121 26" stroke="var(--deep)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.45"/>
      {/* Small decorative dots */}
      <circle cx="110" cy="74" r="4" fill="var(--deep)" opacity="0.09"/>
      <circle cx="120" cy="82" r="3" fill="var(--deep)" opacity="0.07"/>
    </svg>
  );
}

function SvgScope() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      {/* Concentric target rings */}
      <circle cx="56" cy="50" r="40" fill="none" stroke="var(--deep)" strokeWidth="1.2" opacity="0.10"/>
      <circle cx="56" cy="50" r="28" fill="none" stroke="var(--deep)" strokeWidth="1.2" opacity="0.15"/>
      <circle cx="56" cy="50" r="16" fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.22"/>
      <circle cx="56" cy="50" r="6"  fill="var(--deep)" opacity="0.28"/>
      {/* Crosshairs */}
      <line x1="56" y1="8"  x2="56" y2="92" stroke="var(--deep)" strokeWidth="1" opacity="0.09" strokeDasharray="3 3"/>
      <line x1="14" y1="50" x2="98" y2="50" stroke="var(--deep)" strokeWidth="1" opacity="0.09" strokeDasharray="3 3"/>
      {/* Item list right side */}
      <circle cx="106" cy="28" r="3" fill="var(--deep)" opacity="0.22"/>
      <rect x="114" y="25" width="20" height="4" rx="1.5" fill="var(--deep)" opacity="0.2"/>
      <circle cx="106" cy="42" r="3" fill="var(--deep)" opacity="0.2"/>
      <rect x="114" y="39" width="16" height="4" rx="1.5" fill="var(--deep)" opacity="0.18"/>
      <circle cx="106" cy="56" r="3" fill="var(--deep)" opacity="0.18"/>
      <rect x="114" y="53" width="18" height="4" rx="1.5" fill="var(--deep)" opacity="0.16"/>
      <circle cx="106" cy="70" r="3" fill="var(--deep)" opacity="0.16"/>
      <rect x="114" y="67" width="14" height="4" rx="1.5" fill="var(--deep)" opacity="0.14"/>
    </svg>
  );
}

function SvgExternalLinks() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      {/* Main document box */}
      <rect x="14" y="22" width="54" height="56" rx="5" fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <rect x="22" y="34" width="38" height="4" rx="1.5" fill="var(--deep)" opacity="0.22"/>
      <rect x="22" y="43" width="30" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.15"/>
      <rect x="22" y="51" width="34" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.13"/>
      <rect x="22" y="59" width="26" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.11"/>
      {/* External box */}
      <rect x="82" y="14" width="44" height="44" rx="5" fill="var(--deep)" opacity="0.09" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      {/* Arrow (external link) */}
      <path d="M93 47 L104 36" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.42"/>
      <polyline points="98,36 104,36 104,42" fill="none" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.42"/>
      {/* Dashed connector */}
      <path d="M68 50 Q76 50 82 36" stroke="var(--deep)" strokeWidth="1.5" fill="none" strokeDasharray="3 2" opacity="0.28"/>
      {/* Warning info badge */}
      <circle cx="108" cy="74" r="13" fill="var(--deep)" opacity="0.09" stroke="var(--deep)" strokeWidth="1.2" strokeOpacity="0.2"/>
      <line x1="108" y1="68" x2="108" y2="74" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      <circle cx="108" cy="78" r="1.8" fill="var(--deep)" opacity="0.4"/>
    </svg>
  );
}

function SvgInternational() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      {/* Globe outline */}
      <circle cx="70" cy="50" r="38" fill="var(--deep)" opacity="0.05" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.18"/>
      {/* Meridians */}
      <ellipse cx="70" cy="50" rx="14" ry="38" fill="none" stroke="var(--deep)" strokeWidth="1" opacity="0.12"/>
      <ellipse cx="70" cy="50" rx="26" ry="38" fill="none" stroke="var(--deep)" strokeWidth="1" opacity="0.10"/>
      {/* Parallels */}
      <line x1="32" y1="50" x2="108" y2="50" stroke="var(--deep)" strokeWidth="1" opacity="0.12"/>
      <path d="M36 30 Q70 25 104 30" fill="none" stroke="var(--deep)" strokeWidth="1" opacity="0.10"/>
      <path d="M36 70 Q70 75 104 70" fill="none" stroke="var(--deep)" strokeWidth="1" opacity="0.10"/>
      {/* India pin */}
      <circle cx="84" cy="46" r="5" fill="var(--deep)" opacity="0.3"/>
      <path d="M84 51 L84 58" stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
      {/* Transfer arrows — left */}
      <path d="M10 44 Q16 44 16 38" stroke="var(--deep)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.22"/>
      <path d="M10 56 Q16 56 16 62" stroke="var(--deep)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.22"/>
      {/* Transfer arrows — right */}
      <path d="M130 44 Q124 44 124 38" stroke="var(--deep)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.22"/>
      <path d="M130 56 Q124 56 124 62" stroke="var(--deep)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.22"/>
    </svg>
  );
}

function SvgChildren() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      {/* Shield */}
      <path d="M70 12 L110 27 L110 61 Q110 88 70 96 Q30 88 30 61 L30 27 Z"
        fill="var(--deep)" opacity="0.07" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      {/* Person head */}
      <circle cx="70" cy="43" r="10" fill="var(--deep)" opacity="0.18"/>
      {/* Person body arc */}
      <path d="M54 76 Q54 60 70 58 Q86 60 86 76" fill="var(--deep)" opacity="0.14"/>
      {/* Age-restriction circle (top-right) */}
      <circle cx="114" cy="22" r="13" fill="var(--deep)" opacity="0.09" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.22"/>
      {/* X across circle */}
      <line x1="107" y1="15" x2="121" y2="29" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.32"/>
      <line x1="121" y1="15" x2="107" y2="29" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.32"/>
      {/* Small decorative element */}
      <circle cx="22" cy="26" r="7" fill="var(--deep)" opacity="0.08"/>
      <line x1="18" y1="26" x2="26" y2="26" stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" opacity="0.25"/>
      <line x1="22" y1="22" x2="22" y2="30" stroke="var(--deep)" strokeWidth="1.8" strokeLinecap="round" opacity="0.25"/>
    </svg>
  );
}

function SvgPolicyUpdates() {
  return (
    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" className="pp-section__svg" aria-hidden="true">
      {/* Document */}
      <rect x="14" y="12" width="60" height="76" rx="4" fill="var(--deep)" opacity="0.07" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.2"/>
      <rect x="14" y="12" width="60" height="15" rx="4" fill="var(--deep)" opacity="0.13"/>
      {/* Document lines */}
      <rect x="22" y="36" width="44" height="4" rx="1.5" fill="var(--deep)" opacity="0.22"/>
      <rect x="22" y="46" width="38" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.15"/>
      <rect x="22" y="55" width="42" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.13"/>
      <rect x="22" y="64" width="30" height="3.5" rx="1.5" fill="var(--deep)" opacity="0.11"/>
      {/* Circular refresh arrow */}
      <path d="M106 26 A24 24 0 1 1 84 48" fill="none" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" opacity="0.28"/>
      <polyline points="79,42 84,48 90,44" fill="none" stroke="var(--deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.28"/>
      {/* Mini calendar */}
      <rect x="92" y="62" width="30" height="26" rx="3" fill="var(--deep)" opacity="0.09" stroke="var(--deep)" strokeWidth="1" strokeOpacity="0.2"/>
      <line x1="92" y1="70" x2="122" y2="70" stroke="var(--deep)" strokeWidth="1" opacity="0.18"/>
      <rect x="97" y="57" width="4" height="9" rx="2" fill="var(--deep)" opacity="0.22"/>
      <rect x="113" y="57" width="4" height="9" rx="2" fill="var(--deep)" opacity="0.22"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO BANNER — UNCHANGED
   ═══════════════════════════════════════════════════════════ */
function PrivacyHero() {
  const LEFT_CX  = 110;
  const RIGHT_CX = 790;
  const CY       = 120;
  const radii    = [90, 70, 50, 32];
  const spokes   = [0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5];

  return (
    <div className="pp-hero" aria-hidden="true">
      <svg viewBox="0 0 900 240" xmlns="http://www.w3.org/2000/svg"
        className="pp-hero__svg" preserveAspectRatio="xMidYMid slice">
        <rect width="900" height="240" fill="var(--deep)" opacity="0.05"/>

        <g className="pp-hero-bloom pp-hero-bloom--left">
          {radii.map((r, i) => (
            <circle key={i} cx={LEFT_CX} cy={CY} r={r}
              fill="none" stroke="var(--deep)" strokeWidth="1"
              opacity={0.06 + i * 0.04}/>
          ))}
          {spokes.map((deg, i) => (
            <line key={i}
              x1={LEFT_CX + 34 * Math.cos(deg * Math.PI / 180)}
              y1={CY      + 34 * Math.sin(deg * Math.PI / 180)}
              x2={LEFT_CX + 88 * Math.cos(deg * Math.PI / 180)}
              y2={CY      + 88 * Math.sin(deg * Math.PI / 180)}
              stroke="var(--deep)" strokeWidth="0.8" opacity="0.08"/>
          ))}
        </g>

        <g className="pp-hero-bloom pp-hero-bloom--right">
          {radii.map((r, i) => (
            <circle key={i} cx={RIGHT_CX} cy={CY} r={r}
              fill="none" stroke="var(--deep)" strokeWidth="1"
              opacity={0.06 + i * 0.04}/>
          ))}
          {spokes.map((deg, i) => (
            <line key={i}
              x1={RIGHT_CX + 34 * Math.cos(deg * Math.PI / 180)}
              y1={CY       + 34 * Math.sin(deg * Math.PI / 180)}
              x2={RIGHT_CX + 88 * Math.cos(deg * Math.PI / 180)}
              y2={CY       + 88 * Math.sin(deg * Math.PI / 180)}
              stroke="var(--deep)" strokeWidth="0.8" opacity="0.08"/>
          ))}
        </g>

        <path d="M450 40 L500 58 L500 100 Q500 130 450 142 Q400 130 400 100 L400 58 Z"
          fill="var(--deep)" opacity="0.08" stroke="var(--deep)" strokeWidth="1.5" strokeOpacity="0.15"/>
        <rect x="434" y="84" width="32" height="24" rx="4" fill="var(--deep)" opacity="0.14"/>
        <path d="M438 84 L438 76 Q438 68 450 68 Q462 68 462 76 L462 84"
          fill="none" stroke="var(--deep)" strokeWidth="3" strokeOpacity="0.25" strokeLinecap="round"/>
        <circle cx="450" cy="95" r="4" fill="var(--deep)" opacity="0.3"/>
        <line x1="0" y1="238" x2="900" y2="238" stroke="var(--deep)" strokeWidth="1" opacity="0.12"/>
      </svg>

      <div className="pp-hero__content">
        <span className="pp-hero__tag">Yogo Ventures · Global B2B Export Platform</span>
        <h1 className="pp-hero__title">Privacy Policy</h1>
        <p className="pp-hero__sub">
          Effective Date: {new Date().getFullYear()} &nbsp;·&nbsp;
          Last Updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTIONS — updated to match the Privacy Policy Word doc
   14 sections, same structure as before.
   ═══════════════════════════════════════════════════════════ */
const SECTIONS = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    Illustration: SvgIntroduction,
    body: `YoGo Ventures ("Company", "we", "our", or "us") respects your privacy and is committed to protecting your personal and business information.

This Privacy Policy explains how we collect, use, and safeguard information when you visit our website or submit an inquiry.`,
  },
  {
    id: "scope",
    number: "02",
    title: "Scope of This Policy",
    Illustration: SvgScope,
    body: `This policy applies to:

• Website visitors
• Business inquiries submitted through forms
• Email or direct communication with YoGo Ventures

This website is intended for B2B (business-to-business) users only.`,
  },
  {
    id: "data-collection",
    number: "03",
    title: "Information We Collect",
    Illustration: SvgDataCollection,
    body: `A. Information You Provide
When you submit an inquiry or contact us, we may collect:

• Name
• Company name
• Email address
• Phone number (including WhatsApp)
• Country and location
• Product requirements and specifications
• Any additional business-related details you provide

B. Automatically Collected Information
When you visit our website, we may collect:

• IP address
• Browser type
• Device information
• Pages visited
• Date and time of access

This helps us improve website performance and user experience.`,
  },
  {
    id: "data-usage",
    number: "04",
    title: "How We Use Your Information",
    Illustration: SvgDataUsage,
    body: `We use collected information to:

• Respond to your inquiries
• Understand your product requirements
• Provide quotations and business proposals
• Communicate regarding orders, samples, or services
• Improve our website and services
• Maintain internal business records

We do not use your information for irrelevant marketing or spam.`,
  },
  {
    id: "data-sharing",
    number: "05",
    title: "Data Sharing & Disclosure",
    Illustration: SvgThirdParty,
    body: `We do not sell, rent, or trade your personal or business information.

We may share your information only when necessary:

• With logistics or shipping partners (for export coordination)
• When required by law or legal authorities

All sharing is done strictly for business execution purposes.`,
  },
  {
    id: "data-security",
    number: "06",
    title: "Data Security",
    Illustration: SvgSecurity,
    body: `We take reasonable measures to protect your information, including:

• Secured storage of data
• Restricted access to authorized personnel
• Protection against unauthorized access or misuse

However, no method of transmission over the internet is 100% secure.`,
  },
  {
    id: "cookies",
    number: "07",
    title: "Cookies & Tracking Technologies",
    Illustration: SvgCookies,
    body: `Our website may use cookies to:

• Enhance user experience
• Analyze website traffic
• Improve functionality

You can choose to disable cookies through your browser settings.`,
  },
  {
    id: "data-retention",
    number: "08",
    title: "Data Retention",
    Illustration: SvgRetention,
    body: `We retain your information only for as long as necessary to:

• Fulfill business purposes
• Maintain records
• Comply with legal obligations`,
  },
  {
    id: "your-rights",
    number: "09",
    title: "Your Rights",
    Illustration: SvgRights,
    body: `Depending on your location, you may have the right to:

• Request access to your data
• Request correction of inaccurate information
• Request deletion of your data

To exercise these rights, please contact us at privacy@yogoventures.com. We respond within 30 business days.`,
  },
  {
    id: "third-party-links",
    number: "10",
    title: "Third-Party Links",
    Illustration: SvgExternalLinks,
    body: `Our website may contain links to third-party websites.

We are not responsible for the privacy practices of those websites.`,
  },
  {
    id: "international-users",
    number: "11",
    title: "International Users",
    Illustration: SvgInternational,
    body: `As we serve global clients:

• Your information may be processed in India
• By using our website, you consent to this transfer and processing in India`,
  },
  {
    id: "childrens-privacy",
    number: "12",
    title: "Children's Privacy",
    Illustration: SvgChildren,
    body: `Our services are strictly intended for business users.

We do not knowingly collect information from individuals under 18 years of age.`,
  },
  {
    id: "policy-updates",
    number: "13",
    title: "Updates to This Policy",
    Illustration: SvgPolicyUpdates,
    body: `We may update this Privacy Policy from time to time.

Changes will be posted on this page with an updated date.`,
  },
  {
    id: "contact",
    number: "14",
    title: "Contact Us",
    Illustration: SvgContact,
    isContact: true,
  },
];

const TRUST_POINTS = [
  { Icon: IconLock,      label: "SSL Secured Platform" },
  { Icon: IconIndia,     label: "Indian Export Compliant" },
  { Icon: IconHandshake, label: "B2B Only — No Retail Data" },
  { Icon: IconShield,    label: "GDPR Aware" },
];

function ContactBody() {
  return (
    <div className="pp-section__body pp-contact-body">
      <p>
        If you have any questions regarding this Privacy Policy, please contact:
      </p>
      <ul className="pp-contact-list">
        <li>
          <span className="pp-contact-icon"><IconMapPin /></span>
          YoGo Ventures, Trichy, Tamil Nadu, India
        </li>
        <li>
          <span className="pp-contact-icon"><IconMail /></span>
          <a href="mailto:support@yogoventures.com.">support@yogoventures.com.</a>
        </li>
        <li>
          <span className="pp-contact-icon"><IconGlobe /></span>
          <a href="https://www.yogoventures.com" target="_blank" rel="noreferrer">www.yogoventures.com</a>
        </li>
      </ul>
      <p>We are committed to transparent, respectful, and secure handling of all business data entrusted to us.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE — structure unchanged
   ═══════════════════════════════════════════════════════════ */
export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy — How We Protect Your Data",
    description: "Read Yogo Ventures' Privacy Policy. We are committed to protecting your personal information and data privacy in compliance with applicable laws.",
    canonical: "https://www.yogoventures.com/PrivacyPolicy",
    keywords: "Yogo Ventures privacy policy, data protection B2B India, wholesale supplier privacy",
    robots: "index, follow, noarchive",
    breadcrumb: [
      { name: "Home",           url: "https://www.yogoventures.com/" },
      { name: "Privacy Policy", url: "https://www.yogoventures.com/PrivacyPolicy" },
    ],
  });

  return (
    <main className="pp-page page-enter" id="main-content" aria-label="Yogo Ventures Privacy Policy">
      <PrivacyHero />

      <div className="pp-trust-strip">
        {TRUST_POINTS.map(({ Icon, label }) => (
          <div key={label} className="pp-trust-item">
            <span className="pp-trust-icon"><Icon /></span>
            <span className="pp-trust-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="pp-intro">
          <p>
            YoGo Ventures is a global B2B sourcing and export platform headquartered in Trichy, India.
            This Privacy Policy explains how we collect, use, and safeguard the information you share
            when visiting our website or submitting an inquiry. By using our platform, you agree to the
            practices described in this policy.
          </p>
        </div>

        <div className="pp-sections">
          {SECTIONS.map(({ id, number, title, Illustration, body, isContact }) => (
            <section key={id} id={id} className="pp-section">
              <div className="pp-section__visual">
                <Illustration />
                <span className="pp-section__number">{number}</span>
              </div>
              <div className="pp-section__text">
                <h2 className="pp-section__title">{title}</h2>
                {isContact
                  ? <ContactBody />
                  : <p className="pp-section__body">{body}</p>
                }
              </div>
            </section>
          ))}
        </div>

        <div className="pp-footer-note">
          <div className="pp-footer-note__icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <strong>Your business data is safe with us.</strong>
            <p>
              YoGo Ventures handles all sourcing inquiries with strict confidentiality.
              Questions? <a href="/contact">Contact our team</a> or email{" "}
              <a href="mailto:support@yogoventures.com">support@yogoventures.com</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}