// TestimonialsSection — star rating right of name, transparent quote top-right
import { TESTIMONIALS } from "../../data/content";
import { renderStars } from "../../utils/helpers";
import "./HomeSections.css";

export function TestimonialsSection() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="section" aria-labelledby="testimonials-heading">
      <div className="container">
        <header className="section-header reveal">
          <span className="section-tag">Customer Love</span>
          <h2 className="section-title" id="testimonials-heading">What Our Customers Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it, hear what our happy customers have to say about their experience with us.
          </p>
        </header>
      </div>
      <div className="testimonials-marquee-wrap" aria-label="Customer testimonials">
        <div className="testimonials-marquee-track">
          {doubled.map((t, i) => (
            <article key={i} className="testimonial-marquee-card" aria-label={`Review by ${t.name}`}>
              {/* Transparent big quote — top right */}
              <div className="testimonial-marquee-card__big-quote" aria-hidden="true">"</div>
              <p className="testimonial-marquee-card__text">"{t.text}"</p>
              <footer className="testimonial-marquee-card__footer">
                <div className="testimonial-marquee-card__avatar" aria-hidden="true">{t.avatar}</div>
                <div className="testimonial-marquee-card__author-info">
                  <p className="testimonial-marquee-card__name">{t.name}</p>
                  <p className="testimonial-marquee-card__role">{t.role}</p>
                </div>
                {/* Star rating — RIGHT side of name */}
                <div className="testimonial-marquee-card__stars" aria-label={`${t.rating} stars`}>
                  {renderStars(t.rating)}
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
