import { useEffect, useState, useRef } from "react";
import "./SiteLoader.css";

/* ── E-commerce floating particles ── */
const ECOM_PARTICLES = [
  {
    id: "p0", left: "5%", cls: "ep-cart ep-teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.72L22 6H6"/>
      </svg>
    )
  },
  {
    id: "p1", left: "12%", cls: "ep-tag ep-sand",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    )
  },
  {
    id: "p2", left: "21%", cls: "ep-box ep-terra",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    )
  },
  {
    id: "p3", left: "33%", cls: "ep-star ep-sage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )
  },
  {
    id: "p4", left: "44%", cls: "ep-bag ep-mid",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    )
  },
  {
    id: "p5", left: "56%", cls: "ep-heart ep-rose",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )
  },
  {
    id: "p6", left: "67%", cls: "ep-card ep-teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    )
  },
  {
    id: "p7", left: "76%", cls: "ep-gift ep-sand",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
      </svg>
    )
  },
  {
    id: "p8", left: "85%", cls: "ep-truck ep-terra",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    )
  },
  {
    id: "p9", left: "93%", cls: "ep-coupon ep-sage",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 5H3a2 2 0 00-2 2v3a2 2 0 000 4v3a2 2 0 002 2h18a2 2 0 002-2v-3a2 2 0 000-4V7a2 2 0 00-2-2z"/>
        <line x1="9" y1="10" x2="9" y2="10"/><line x1="15" y1="14" x2="15" y2="14"/>
        <line x1="9" y1="14" x2="15" y2="10"/>
      </svg>
    )
  },
  {
    id: "p10", left: "28%", cls: "ep-pct ep-mid",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19"/>
        <circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
      </svg>
    )
  },
  {
    id: "p11", left: "50%", cls: "ep-return ep-rose",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
      </svg>
    )
  },
];

const CHECKPOINTS    = [25, 50, 75, 100];
// ── CHANGED: 150 ms pause per checkpoint (4 × 150 = 600 ms total pauses)
// Combined with the faster tick below this keeps total runtime ≈ 2 seconds.
const PAUSE_DURATION = 150;

// ── CHANGED: no random-stall branches; larger increments so the bar
// travels 0 → 100 in roughly 28 ticks × 50 ms ≈ 1 400 ms + 600 ms pauses ≈ 2 s.
function nextProgress(current) {
  const r = Math.random();
  if (current < 30)  return current + (r * 6  + 2);    // 2 – 8 % per tick
  if (current < 60)  return current + (r * 5  + 2);    // 2 – 7 %
  if (current < 80)  return current + (r * 4  + 1.5);  // 1.5 – 5.5 %
  if (current < 92)  return current + (r * 3  + 1);    // 1 – 4 %
  if (current < 99)  return current + 2;
  return 100;
}

export default function SiteLoader() {
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef    = useRef(0);
  const pausedRef      = useRef(false);
  const checkpointsHit = useRef(new Set());

  useEffect(() => {
    // ── CHANGED: 50 ms tick (was 80 ms) for a snappier bar
    const id = setInterval(() => {
      if (pausedRef.current) return;

      const current = progressRef.current;

      // Check if we just crossed (or landed on) a checkpoint
      const hit = CHECKPOINTS.find(
        cp => current < cp && nextProgress(current) >= cp
      );

      if (hit) {
        // Snap exactly to the checkpoint
        const snapped = hit;
        progressRef.current = snapped;
        setProgress(snapped);

        if (!checkpointsHit.current.has(snapped)) {
          checkpointsHit.current.add(snapped);
          pausedRef.current = true;

          setTimeout(() => {
            pausedRef.current = false;
            if (snapped === 100) {
              clearInterval(id);
              setTimeout(() => setVisible(false), 450);
            }
          }, PAUSE_DURATION);
        }
        return;
      }

      if (current >= 100) {
        clearInterval(id);
        return;
      }

      const next = Math.min(nextProgress(current), 100);
      progressRef.current = next;
      setProgress(next);
    }, 50); // ← was 80 ms

    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const pct = Math.round(progress);
  const truckLeft = `calc(${progress}% - ${(progress / 100) * 60}px)`;

  return (
    <div className="site-loader">
      <div className="ecom-particles" aria-hidden="true">
        {ECOM_PARTICLES.map(({ id, left, cls, icon }) => (
          <div key={id} className={`ecom-particle ${cls}`} style={{ left }}>
            {icon}
          </div>
        ))}
      </div>

      <div className="site-loader__center">
        <img src="/Logo.png" alt="Yogo Ventures" className="site-loader__logo" />
      </div>

      <div className="site-loader__bottom">
        <div className="loader-stage">
          <div className="truck" style={{ left: truckLeft }} aria-hidden="true">
            <img src="Truck.png" alt="" />
          </div>

          <div
            className="loading-bar"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="loading-fill" style={{ width: `${progress}%` }}>
              {pct > 8 && (
                <span className="loading-percent">{pct}%</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}