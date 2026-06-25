// StatsSection — Cormorant Garamond italic for everything
import { STATS } from "../../data/content";
import "./HomeSections.css";

export function StatsSection() {
  return (
    <section className="stats-section section--dark" aria-label="Business statistics">
      <div className="container stats-grid">
        {STATS.map((s, i) => (
          <div key={s.label} className={`stat-item reveal reveal-delay-${i + 1}`}>
            <span className="stat-item__value">{s.value}</span>
            <span className="stat-item__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
