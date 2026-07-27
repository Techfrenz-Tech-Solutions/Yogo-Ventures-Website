// src/pages/TermsAndConditions.jsx
import { useState, useEffect, useRef } from "react";
import { useSEO } from "../hooks/useSEO";
import "./TermOfuse.css";

/* ─── Style helpers — ALL colors read CSS variables at paint time ─── */
/* This ensures illustrations, icons, and accents all shift when the
   theme changes (e.g. footer color picker updates --primary / --dark). */

const S = {
  primary:     { fill: "var(--primary)" },
  primaryLow:  { fill: "var(--primary)", opacity: 0.15 },
  primaryMid:  { fill: "var(--primary)", opacity: 0.45 },
  primaryHigh: { fill: "var(--primary)", opacity: 0.7 },
  dark:        { fill: "var(--dark)" },
  darkLow:     { fill: "var(--dark)", opacity: 0.08 },
  darkMid:     { fill: "var(--dark)", opacity: 0.2 },
  darkHigh:    { fill: "var(--dark)", opacity: 0.7 },
  illusBg:     { fill: "var(--illus-bg)" },
  illusBorder: { fill: "var(--illus-border)" },
  white:       { fill: "#ffffff" },
  muted:       { fill: "var(--muted)" },
  mid:         { fill: "var(--mid)" },
};

const sp  = (extra = {}) => ({ stroke: "var(--primary)",      fill: "none", ...extra });
const sb  = (extra = {}) => ({ stroke: "var(--illus-border)", fill: "none", ...extra });
const sd  = (extra = {}) => ({ stroke: "var(--dark)",         fill: "none", ...extra });

/* ── Inline SVG icon components — all strokes read --primary / --dark ── */
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="7" cy="7" r="6.5" style={{ fill: "var(--primary)", opacity: 0.15 }}/>
    <path d="M4 7l2.2 2.2L10 5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCross = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="7" cy="7" r="6.5" style={{ fill: "#dc2626", opacity: 0.1 }}/>
    <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="8" cy="8" r="7" stroke="var(--primary)" strokeWidth="1.5" fill="none"/>
    <path d="M8 7v4" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="8" cy="5" r="0.9" fill="var(--primary)"/>
  </svg>
);

/* ── Contact SVG Icons — stroke reads --primary ── */
const IconBuilding = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"
      stroke="var(--primary)" fill="none" strokeWidth="1.8"/>
    <rect x="7"  y="7"  width="3" height="3" rx="0.5" style={{ fill: "var(--primary)", opacity: 0.6 }}/>
    <rect x="14" y="7"  width="3" height="3" rx="0.5" style={{ fill: "var(--primary)", opacity: 0.6 }}/>
    <rect x="7"  y="13" width="3" height="3" rx="0.5" style={{ fill: "var(--primary)", opacity: 0.6 }}/>
    <rect x="14" y="13" width="3" height="3" rx="0.5" style={{ fill: "var(--primary)", opacity: 0.6 }}/>
    <rect x="10" y="17" width="4" height="4" rx="0.5" style={{ fill: "var(--dark)", opacity: 0.4 }}/>
  </svg>
);

const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2"
      stroke="var(--primary)" fill="none" strokeWidth="1.8"/>
    <path d="M2 7l10 7 10-7" stroke="var(--primary)"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="var(--primary)" fill="none" strokeWidth="1.8"/>
    <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"
      stroke="var(--primary)" fill="none" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M3 12h18" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

/* ── Illustration SVGs — all accent colors via var(--primary) / var(--dark) ── */
const illustrations = {
  1: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="30" width="240" height="160" rx="14" style={S.illusBg}
        stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="64" y="54" width="100" height="10" rx="5" style={{ fill:"var(--primary)", opacity:0.7 }}/>
      <rect x="64" y="74"  width="160" height="7" rx="3.5" style={S.illusBorder}/>
      <rect x="64" y="90"  width="140" height="7" rx="3.5" style={S.illusBorder}/>
      <rect x="64" y="106" width="150" height="7" rx="3.5" style={S.illusBorder}/>
      <rect x="64" y="130" width="80"  height="28" rx="8" style={S.dark}/>
      <rect x="155" y="130" width="80" height="28" rx="8" style={{ fill:"var(--primary)", opacity:0.85 }}/>
      <circle cx="264" cy="54" r="16" style={{ fill:"var(--primary)", opacity:0.15 }}/>
      <path d="M258 54l4 4 8-8" style={sp()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  2: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="160" cy="110" r="72" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <path d="M100 110 Q160 60 220 110 Q160 160 100 110Z" style={{ fill:"var(--dark)", opacity:0.08 }}/>
      <circle cx="160" cy="110" r="28" style={{ fill:"var(--primary)", opacity:0.2 }}/>
      <circle cx="160" cy="110" r="12" style={S.primary}/>
      <rect x="60"  y="44" width="56" height="20" rx="6" style={S.dark}/>
      <rect x="204" y="44" width="56" height="20" rx="6" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="60"  y="156" width="56" height="20" rx="6" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="204" y="156" width="56" height="20" rx="6" style={{ fill:"var(--primary)", opacity:0.7 }}/>
      <line x1="116" y1="54"  x2="148" y2="102" style={sd()} strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="204" y1="54"  x2="172" y2="102" style={sb()} strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="116" y1="166" x2="148" y2="118" style={sb()} strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="204" y1="166" x2="172" y2="118" style={sp({ opacity:0.7 })} strokeWidth="1.5" strokeDasharray="4 3"/>
    </svg>
  ),
  3: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="200" height="140" rx="12" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="80" y="60" width="160" height="24" rx="6" style={{ fill:"var(--dark)", opacity:0.08 }}/>
      <circle cx="96" cy="72"  r="8" style={{ fill:"var(--primary)", opacity:0.7 }}/>
      <rect x="112" y="68"  width="80"  height="8" rx="4" style={S.illusBorder}/>
      <rect x="80"  y="96"  width="160" height="24" rx="6" style={{ fill:"var(--dark)", opacity:0.04 }}/>
      <circle cx="96" cy="108" r="8" style={{ fill:"var(--dark)", opacity:0.2 }}/>
      <rect x="112" y="104" width="100" height="8" rx="4" style={S.illusBorder}/>
      <rect x="80"  y="132" width="160" height="24" rx="6" style={{ fill:"var(--dark)", opacity:0.04 }}/>
      <circle cx="96" cy="144" r="8" style={{ fill:"var(--dark)", opacity:0.2 }}/>
      <rect x="112" y="140" width="120" height="8" rx="4" style={S.illusBorder}/>
      <rect x="220" y="152" width="30"  height="14" rx="5" style={S.primary}/>
    </svg>
  ),
  4: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="160" y1="28" x2="160" y2="192" style={sb()} strokeWidth="2"/>
      {[30,54,78,102,126,150,174].map((y, i) => (
        <g key={i}>
          <circle cx="160" cy={y+12} r="10"
            style={i === 0 ? S.primary : { fill:"var(--illus-bg)", stroke:"var(--illus-border)" }}
            strokeWidth="1.5"/>
          <text x={i%2===0?"148":"172"} y={y+17} fontSize="9"
            style={S.mid} textAnchor={i%2===0?"end":"start"}>Step {i+1}</text>
        </g>
      ))}
    </svg>
  ),
  5: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50"  y="30" width="100" height="130" rx="10" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="170" y="60" width="100" height="130" rx="10" style={{ fill:"var(--dark)", opacity:0.06 }} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="62" y="50"  width="76" height="52" rx="6" style={{ fill:"var(--illus-border)", opacity:0.6 }}/>
      <rect x="62" y="112" width="50" height="7" rx="3.5" style={{ fill:"var(--primary)", opacity:0.7 }}/>
      <rect x="62" y="126" width="70" height="6" rx="3" style={S.illusBorder}/>
      <rect x="62" y="140" width="60" height="6" rx="3" style={S.illusBorder}/>
      <rect x="182" y="80"  width="76" height="52" rx="6" style={{ fill:"var(--primary)", opacity:0.18 }}/>
      <rect x="182" y="142" width="50" height="7" rx="3.5" style={{ fill:"var(--dark)", opacity:0.3 }}/>
      <rect x="182" y="156" width="70" height="6" rx="3" style={S.illusBorder}/>
      <defs>
        <marker id="arr5" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6Z" style={S.primary}/>
        </marker>
      </defs>
      <path d="M150 90 L170 90" style={sp()} strokeWidth="2" strokeDasharray="3 2" markerEnd="url(#arr5)"/>
    </svg>
  ),
  6: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50"  y="80" width="50" height="100" rx="6" style={{ fill:"var(--primary)", opacity:0.2 }}/>
      <rect x="115" y="55" width="50" height="125" rx="6" style={{ fill:"var(--primary)", opacity:0.45 }}/>
      <rect x="180" y="35" width="50" height="145" rx="6" style={{ fill:"var(--primary)", opacity:0.7 }}/>
      <rect x="245" y="20" width="30" height="160" rx="6" style={{ fill:"var(--dark)", opacity:0.7 }}/>
      <text x="75"  y="196" fontSize="9" style={S.muted} textAnchor="middle">Small</text>
      <text x="140" y="196" fontSize="9" style={S.muted} textAnchor="middle">Med</text>
      <text x="205" y="196" fontSize="9" style={S.muted} textAnchor="middle">Large</text>
      <text x="260" y="196" fontSize="9" style={S.muted} textAnchor="middle">Bulk</text>
      <text x="44"  y="185" fontSize="8" style={S.illusBorder}>MOQ</text>
    </svg>
  ),
  7: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="50" width="140" height="100" rx="12" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="110" y="70" width="100" height="60" rx="6" style={{ fill:"var(--illus-border)", opacity:0.5 }}/>
      <circle cx="160" cy="100" r="18" style={{ fill:"var(--primary)", opacity:0.2 }}/>
      <path d="M152 100 l6 6 12-12" style={sp()} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M160 150 L160 170 M140 170 L180 170" style={sb()} strokeWidth="2" strokeLinecap="round"/>
      <rect x="120" y="172" width="80" height="16" rx="6" style={{ fill:"var(--dark)", opacity:0.08 }}/>
    </svg>
  ),
  8: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="40" width="220" height="140" rx="12" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="70"  y="60" width="80" height="50" rx="8" style={{ fill:"var(--dark)", opacity:0.08 }}/>
      <rect x="170" y="60" width="80" height="50" rx="8" style={{ fill:"var(--primary)", opacity:0.15 }}/>
      <text x="110" y="91" fontSize="11" style={{ fill:"var(--dark)", opacity:0.5 }} textAnchor="middle">Advance</text>
      <text x="210" y="91" fontSize="11" style={{ fill:"var(--primary)", opacity:0.8 }} textAnchor="middle">Balance</text>
      <rect x="70" y="124" width="180" height="8" rx="4" style={S.illusBorder}/>
      <rect x="70" y="124" width="90"  height="8" rx="4" style={{ fill:"var(--dark)", opacity:0.3 }}/>
      <text x="160" y="160" fontSize="10" style={S.muted} textAnchor="middle">Payment milestone timeline</text>
    </svg>
  ),
  9: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="160" cy="110" r="75" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <path d="M160 50 A60 60 0 0 1 220 110" style={sp()} strokeWidth="8" strokeLinecap="round"/>
      <path d="M220 110 A60 60 0 0 1 160 170" style={sb()} strokeWidth="8" strokeLinecap="round"/>
      <path d="M160 170 A60 60 0 0 1 100 110" style={sd({ opacity:0.2 })} strokeWidth="8" strokeLinecap="round"/>
      <path d="M100 110 A60 60 0 0 1 160 50" style={sb({ opacity:0.4 })} strokeWidth="8" strokeLinecap="round"/>
      <circle cx="160" cy="110" r="32" style={S.white}/>
      <text x="160" y="106" fontSize="9" style={S.mid} textAnchor="middle">Timeline</text>
      <text x="160" y="120" fontSize="9" style={S.primary} textAnchor="middle">Estimate</text>
    </svg>
  ),
  10: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 150 Q90 90 160 110 Q230 130 270 70" style={sp()} strokeWidth="2.5" strokeDasharray="6 3"/>
      <circle cx="50"  cy="150" r="8" style={S.dark}/>
      <circle cx="160" cy="110" r="8" style={{ fill:"var(--primary)", opacity:0.6 }}/>
      <circle cx="270" cy="70"  r="8" style={S.primary}/>
      <rect x="38"  y="158" width="24" height="10" rx="3" style={{ fill:"var(--dark)", opacity:0.6 }}/>
      <rect x="148" y="118" width="24" height="10" rx="3" style={{ fill:"var(--primary)", opacity:0.4 }}/>
      <rect x="258" y="78"  width="24" height="10" rx="3" style={{ fill:"var(--primary)", opacity:0.6 }}/>
      <text x="42"  y="188" fontSize="8" style={S.muted}>Origin</text>
      <text x="148" y="140" fontSize="8" style={S.muted}>Transit</text>
      <text x="254" y="100" fontSize="8" style={S.muted}>Destination</text>
      <path d="M80 170 Q100 150 120 160" style={sb()} strokeWidth="1.5"/>
    </svg>
  ),
  11: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="200" height="140" rx="12" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="80" y="62" width="160" height="6" rx="3" style={S.illusBorder}/>
      <rect x="80" y="76" width="120" height="6" rx="3" style={S.illusBorder}/>
      <rect x="80" y="100" width="160" height="30" rx="6"
        style={{ fill:"var(--primary)", opacity:0.1 }} stroke="var(--primary)" strokeWidth="1" strokeDasharray="4 2"/>
      <path d="M152 115 l6 6 12-12" style={sp()} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="180" y="120" fontSize="9" style={S.primary}>QC Pass</text>
      <rect x="80"  y="144" width="80" height="20" rx="6" style={{ fill:"var(--dark)", opacity:0.08 }}/>
      <rect x="170" y="144" width="70" height="20" rx="6" style={{ fill:"var(--primary)", opacity:0.15 }}/>
    </svg>
  ),
  12: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="160" cy="100" r="65" fill="#fff5f5" stroke="#fca5a5" strokeWidth="1.5"/>
      <path d="M135 100 l18 18 32-36" stroke="#ef4444" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" opacity=".4"/>
      <path d="M130 75 L190 125 M190 75 L130 125" stroke="#ef4444" strokeWidth="2.5"
        strokeLinecap="round" opacity=".15"/>
      <circle cx="160" cy="100" r="28" fill="white" stroke="#fca5a5" strokeWidth="1"/>
      <text x="160" y="97"  fontSize="8" fill="#dc2626" textAnchor="middle">No Returns</text>
      <text x="160" y="108" fontSize="8" fill="#dc2626" textAnchor="middle">No Refunds</text>
      <rect x="80" y="178" width="160" height="14" rx="5" fill="#fee2e2"/>
      <text x="160" y="189" fontSize="8" fill="#dc2626" textAnchor="middle">After production starts</text>
    </svg>
  ),
  13: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="40" width="140" height="110" rx="10" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="108" y="58" width="104" height="74" rx="6" style={S.white} stroke="var(--illus-border)" strokeWidth="1"/>
      <text x="160" y="100" fontSize="22" textAnchor="middle" style={{ fill:"var(--primary)", opacity:0.3 }}>™</text>
      <path d="M110 160 L130 185 M160 160 L160 185 M210 160 L190 185" style={sb()} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="100" y="185" width="120" height="10" rx="4" style={{ fill:"var(--dark)", opacity:0.08 }}/>
      <text x="160" y="193" fontSize="7" style={S.muted} textAnchor="middle">Buyer's IP remains their property</text>
    </svg>
  ),
  14: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="70"  y="60" width="80" height="100" rx="8" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="170" y="80" width="80" height="80"  rx="8" style={{ fill:"var(--dark)", opacity:0.07 }} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <text x="110" y="116" fontSize="9" style={S.mid}     textAnchor="middle">Order</text>
      <text x="110" y="128" fontSize="9" style={S.primary} textAnchor="middle">Value</text>
      <text x="210" y="126" fontSize="8" style={S.muted}   textAnchor="middle">Max</text>
      <text x="210" y="138" fontSize="8" style={S.muted}   textAnchor="middle">Liability</text>
      <defs>
        <marker id="a14" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6Z" style={S.primary}/>
        </marker>
      </defs>
      <path d="M150 110 L170 110" style={sp()} strokeWidth="2" markerEnd="url(#a14)"/>
    </svg>
  ),
  15: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 160 Q100 80 160 100 Q220 120 260 60" style={sb()} strokeWidth="2"/>
      <path d="M100 190 Q130 140 160 150 Q190 160 220 120" style={sp({ opacity:0.6 })} strokeWidth="2" strokeDasharray="5 3"/>
      <circle cx="160" cy="100" r="30" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <text x="160" y="97"  fontSize="8" style={S.mid} textAnchor="middle">Force</text>
      <text x="160" y="109" fontSize="8" style={S.mid} textAnchor="middle">Majeure</text>
    </svg>
  ),
  16: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="200" height="130" rx="14" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="80" y="60" width="160" height="20" rx="6" style={{ fill:"var(--dark)", opacity:0.06 }}/>
      <rect x="80" y="88"  width="100" height="8" rx="4" style={S.illusBorder}/>
      <rect x="80" y="104" width="130" height="8" rx="4" style={S.illusBorder}/>
      <rect x="80" y="120" width="80"  height="8" rx="4" style={S.illusBorder}/>
      <circle cx="246" cy="140" r="18" fill="#fee2e2"/>
      <path d="M240 140 l4 4 8-8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
      <text x="94"  y="73" fontSize="9" style={S.primary}>yogo</text>
      <text x="116" y="73" fontSize="9" style={{ fill:"var(--dark)", opacity:0.4 }}>ventures.com</text>
    </svg>
  ),
  17: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="70" y="50" width="180" height="120" rx="12" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <circle cx="160" cy="40" r="16" style={S.dark}/>
      <path d="M155 40 l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="90" y="72" width="140" height="8" rx="4" style={S.illusBorder}/>
      <rect x="90" y="88" width="100" height="8" rx="4" style={S.illusBorder}/>
      <rect x="100" y="110" width="120" height="36" rx="8" style={S.white} stroke="var(--illus-border)" strokeWidth="1"/>
      <path d="M130 128 l8 0 M142 128 l8 0 M154 128 l8 0 M166 128 l8 0" style={sp({ opacity:0.4 })} strokeWidth="3" strokeLinecap="round"/>
      <text x="160" y="162" fontSize="8" style={S.muted} textAnchor="middle">Encrypted · Confidential</text>
    </svg>
  ),
  18: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="160" cy="130" rx="100" ry="50" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <ellipse cx="160" cy="130" rx="65" ry="32" style={S.white} stroke="var(--illus-border)" strokeWidth="1"/>
      <ellipse cx="160" cy="130" rx="30" ry="15" style={{ fill:"var(--primary)", opacity:0.15 }}/>
      <path d="M160 80 L160 40" style={sb()} strokeWidth="1.5" strokeDasharray="3 2"/>
      <circle cx="160" cy="36" r="6" style={{ fill:"var(--primary)", opacity:0.6 }}/>
      <text x="160" y="132" fontSize="9" style={S.dark} textAnchor="middle" fontWeight="600">Chennai</text>
      <text x="160" y="144" fontSize="8" style={S.muted} textAnchor="middle">Tamil Nadu, India</text>
    </svg>
  ),
  19: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="70" y="50" width="180" height="120" rx="12" style={S.illusBg} stroke="var(--illus-border)" strokeWidth="1.5"/>
      <rect x="90" y="72" width="140" height="10" rx="5" style={{ fill:"var(--primary)", opacity:0.4 }}/>
      <rect x="90" y="90"  width="140" height="8" rx="4" style={S.illusBorder}/>
      <rect x="90" y="106" width="100" height="8" rx="4" style={S.illusBorder}/>
      <rect x="90" y="122" width="120" height="8" rx="4" style={S.illusBorder}/>
      <path d="M210 148 L230 148 L220 162Z" style={{ fill:"var(--primary)", opacity:0.6 }}/>
      <rect x="90" y="144" width="60" height="16" rx="5" style={{ fill:"var(--dark)", opacity:0.08 }}/>
      <text x="120" y="156" fontSize="8" style={S.muted} textAnchor="middle">v2.0 · 2026</text>
    </svg>
  ),
  20: (
    <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="40" width="200" height="140" rx="14" style={S.dark}/>
      <rect x="80" y="62" width="100" height="12" rx="4" style={{ fill:"var(--primary)", opacity:0.7 }}/>
      <rect x="80" y="84"  width="160" height="7" rx="3.5" fill="white" opacity=".12"/>
      <rect x="80" y="100" width="140" height="7" rx="3.5" fill="white" opacity=".12"/>
      <rect x="80" y="120" width="160" height="30" rx="8" style={{ fill:"var(--primary)", opacity:0.9 }}/>
      <text x="160" y="140" fontSize="10" fill="white" textAnchor="middle" fontWeight="600">Get in Touch →</text>
    </svg>
  ),
};

const sections = [
  { id: 1, title: "Introduction", content: `Welcome to YoGo Ventures ("Company", "we", "our", or "us"). By accessing or using our website, you agree to comply with and be bound by these Terms & Conditions. YoGo Ventures operates as a B2B sourcing and export service provider, connecting international buyers with Indian manufacturers.` },
  {
    id: 2, title: "Nature of Business", content: "YoGo Ventures operates exclusively as a B2B platform, providing bulk sourcing and export services — not as an e-commerce store.",
    bullets: { does: ["Operates exclusively as a B2B platform", "Provides bulk sourcing and export services", "Does not function as an e-commerce store"], doesNot: ["Products cannot be purchased directly from the website. All orders are handled through inquiry and quotation.", "Display fixed pricing as it varies based on bulk order requirements.", "All transactions are conducted through custom quotations and agreements."] },
  },
  {
    id: 3, title: "Eligibility", content: "By using this website, you confirm that:",
    bullets: { plain: ["You are a business entity, importer, or authorized representative", "You intend to engage in bulk/wholesale purchasing", "You are legally capable of entering into binding contracts"] },
    footer: "We reserve the right to decline inquiries that do not align with our business model.",
  },
  {
    id: 4, title: "Inquiry & Quotation Process", content: "All orders follow a structured process:",
    steps: ["Inquiry submitted via website/email", "Requirement discussion with proper Incoterms", "Proforma invoice issued", "Sampling (if required)", "Payment terms agreed by both parties", "Order confirmation", "Production initiation", "Tax Invoice issued after full payment", "Product shipped"],
    note: "Quotations are valid for a limited period only. Prices may vary based on order quantity, raw material cost, customization requirements, material specifications, packaging, and destination country.",
  },
  { id: 5, title: "Product Information & Customization", content: "All product images and descriptions are for reference only. Customization options include design, size, material/fabric, and branding. Final specifications are confirmed during the quotation stage.", footer: "YoGo Ventures does not guarantee identical replication of products shown on the website unless explicitly agreed in writing." },
  { id: 6, title: "Minimum Order Quantity (MOQ)", bullets: { plain: ["Orders are subject to minimum order quantities (MOQ)", "MOQ varies depending on product category and customization level", "Final MOQ will be communicated during the quotation process"] } },
  { id: 7, title: "Samples", bullets: { plain: ["Samples may be provided upon request", "Sample costs, shipping charges, and timelines will be communicated separately", "Samples are for evaluation purposes only and may vary slightly from bulk production"] } },
  { id: 8, title: "Orders & Payment Terms", content: "Orders are confirmed only after mutual agreement on specifications and acceptance of quotation. Payment typically includes advance payment and balance before shipment. Failure to complete payment may result in delay in production or cancellation of order." },
  { id: 9, title: "Production & Delivery", content: "Production timelines are estimates, not guarantees. Delays may occur due to raw material availability, manufacturing constraints, or logistics/customs issues. YoGo Ventures is not liable for delays caused by external factors beyond our control." },
  { id: 10, title: "Shipping & Export", content: "All shipments are handled as export transactions. Buyers are responsible for import regulations in their country, customs duties and taxes, and compliance requirements. Shipping terms (FOB, CIF, etc.) should be provided during requirement discussion." },
  { id: 11, title: "Quality & Inspection", content: "Quality standards will be agreed upon during order confirmation. Buyers may request pre-production samples or third-party inspection at their own cost." },
  { id: 12, title: "Returns, Refunds & Cancellations", content: "No payment refund requests are accepted once production has started. No returns after goods reach the buyer's country. Buyers may arrange third-party inspection before shipment at their own cost. Order cancellations are subject to the stage of production and costs incurred." },
  { id: 13, title: "Intellectual Property", content: "Logos, designs, or branding provided by the buyer remain their property. Buyers are responsible for ensuring they have rights to use submitted designs. YoGo Ventures is not liable for trademark violations or copyright infringement from buyer-supplied materials." },
  { id: 14, title: "Limitation of Liability", content: "YoGo Ventures shall not be liable for indirect or consequential damages, loss of business, profits, or reputation, or delays caused by third parties. Our liability is limited to the value of the order agreed upon." },
  { id: 15, title: "Force Majeure", content: "We are not responsible for failure or delay due to events beyond our control, including natural disasters, government restrictions, war, strikes, pandemics, or supply chain disruptions." },
  { id: 16, title: "Website Use", content: "You agree not to misuse the website, submit false or misleading inquiries, or attempt unauthorized access. All content on this website is the property of YoGo Ventures and may not be copied without permission." },
  { id: 17, title: "Confidentiality", content: "All business discussions, quotations, and product details are considered confidential. Both parties agree not to disclose sensitive information without consent." },
  { id: 18, title: "Governing Law & Jurisdiction", content: "These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts located in Chennai, Tamil Nadu, India." },
  { id: 19, title: "Amendments", content: "YoGo Ventures reserves the right to update or modify these Terms at any time without prior notice. Continued use of the website constitutes acceptance of updated terms." },
  { id: 20, title: "Contact Information", contact: true },
];

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function SectionRow({ section, index }) {
  const [ref, inView] = useInView();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`tnc-row ${isEven ? "tnc-row--normal" : "tnc-row--reverse"} ${inView ? "tnc-row--visible" : ""}`}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.4)}s` }}
    >
      <div className="tnc-row__text">
        <div className="tnc-row__num">{String(section.id).padStart(2, "0")}</div>
        <h2 className="tnc-row__title">{section.title}</h2>

        {section.content && <p className="tnc-row__body">{section.content}</p>}

        {section.bullets?.does && (
          <div className="tnc-two-col">
            <div className="tnc-col tnc-col--yes">
              <p className="tnc-col__label">We do</p>
              {section.bullets.does.map((b, i) => (
                <div key={i} className="tnc-bullet tnc-bullet--yes">
                  <span className="tnc-bullet__icon"><IconCheck /></span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <div className="tnc-col tnc-col--no">
              <p className="tnc-col__label">We do not</p>
              {section.bullets.doesNot.map((b, i) => (
                <div key={i} className="tnc-bullet tnc-bullet--no">
                  <span className="tnc-bullet__icon"><IconCross /></span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section.bullets?.plain && (
          <ul className="tnc-list">
            {section.bullets.plain.map((b, i) => (
              <li key={i} className="tnc-list__item">
                <span className="tnc-list__dot" />{b}
              </li>
            ))}
          </ul>
        )}

        {section.steps && (
          <ol className="tnc-steps">
            {section.steps.map((s, i) => (
              <li key={i} className="tnc-steps__item">
                <span className="tnc-steps__num">{i + 1}</span><span>{s}</span>
              </li>
            ))}
          </ol>
        )}

        {section.note && (
          <div className="tnc-note">
            <span className="tnc-note__icon"><IconInfo /></span>
            <p>{section.note}</p>
          </div>
        )}

        {section.footer && <p className="tnc-row__footer-note">{section.footer}</p>}

        {section.contact && (
          <div className="tnc-contact">
            <div className="tnc-contact__row">
              <span className="tnc-contact__icon"><IconBuilding /></span>
              <span><strong>YoGo Ventures</strong></span>
            </div>
            <div className="tnc-contact__row">
              <span className="tnc-contact__icon"><IconEmail /></span>
              <span>Email: <a href="mailto:support@yogoventures.com" className="tnc-link">support@yogoventures.com</a></span>
            </div>
            <div className="tnc-contact__row">
              <span className="tnc-contact__icon"><IconGlobe /></span>
              <span>Website: <a href="https://yogoventures.com" className="tnc-link">www.yogoventures.com</a></span>
            </div>
          </div>
        )}
      </div>

      <div className="tnc-row__illustration">
        <div className="tnc-illus-wrap">
          {illustrations[section.id]}
        </div>
      </div>
    </div>
  );
}

export default function TermsAndConditions() {
  useSEO({
    title: "Terms of Use — Terms & Conditions",
    description: "Read the Terms of Use for Yogo Ventures B2B marketplace. Understand the conditions governing product sourcing, quotation requests, and use of our platform.",
    canonical: "https://www.yogoventures.com/TermOfuse",
    keywords: "Yogo Ventures terms of use, B2B wholesale terms India, export company terms conditions",
    robots: "index, follow, noarchive",
    breadcrumb: [
      { name: "Home",         url: "https://www.yogoventures.com/" },
      { name: "Terms of Use", url: "https://www.yogoventures.com/TermOfuse" },
    ],
  });

  return (
    <main className="tnc-page page-enter" id="main-content" aria-label="Yogo Ventures Terms of Use">
      <section className="tnc-hero">
        <div className="tnc-hero__bg-circle" aria-hidden="true" />
        <div className="tnc-hero__bg-circle tnc-hero__bg-circle--2" aria-hidden="true" />
        <div className="tnc-hero__inner">
          <p className="tnc-hero__eyebrow">Yogo Ventures · B2B Export Platform</p>
          <h1 className="tnc-hero__title">Terms of Use</h1>
          <p className="tnc-hero__date">Effective Date: <strong>2026</strong></p>
          <p className="tnc-hero__sub">
            Please read these terms carefully before engaging with Yogo Ventures.
            By accessing our platform or submitting an inquiry, you agree to the
            following conditions governing our B2B sourcing and export services.
          </p>
          <div className="tnc-hero__badge">
            <span className="tnc-hero__badge-num">20</span>
            <span className="tnc-hero__badge-label">Clauses</span>
          </div>
        </div>
      </section>

      <div className="tnc-sections">
        {sections.map((section, i) => (
          <SectionRow key={section.id} section={section} index={i} />
        ))}
      </div>

      <div className="tnc-page-footer">
        <p>By using our website or submitting an inquiry, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
        <p className="tnc-page-footer__copy">© 2026 YoGo Ventures. All rights reserved.</p>
      </div>
    </main>
  );
}