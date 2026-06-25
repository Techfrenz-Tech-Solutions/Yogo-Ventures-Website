// AboutSection — logo in small box, single large image
import { Link } from "react-router-dom";
import "./HomeSections.css";

// Using Categories image instead of About image
import aboutImage from "../../Assets/Categories/Category1.png";

export function AboutSection() {
  return (
    <section className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-grid">
          
          {/* IMAGE SECTION — logo small box + large image */}
          <div className="about-img-stack reveal">

            {/* LARGE IMAGE */}
            <div className="about-collage">
              <img
                src={aboutImage}
                alt="Yogo Ventures Products"
                className="about-collage__img"
              />
            </div>

            {/* SMALL BOX: Yogo logo from PUBLIC folder */}
            <div className="about-logo-box">
              <img
                src="/Logo.png"
                alt="Yogo Ventures"
                className="about-logo-box__img"
              />
              <p className="about-logo-box__tagline">Since 2019</p>
            </div>

          </div>

          {/* TEXT */}
          <div className="reveal reveal-delay-2">
            <span className="about-badge about-badge--yogo">
              Since 2019 — Chennai
            </span>

            <h2
              className="section-title"
              id="about-heading"
              style={{ textAlign: "left", marginTop: "12px" }}
            >
              Our Story
              <br />
              <em style={{ fontStyle: "italic" }}>Rooted in India</em>
            </h2>

            <p className="about-desc">
              We are a leading supplier of apparel, memory foam cushions, copper utensils, and handcrafted products, thoughtfully brought together from across India’s diverse regions. 

Each product reflects the strength of its origin — manufactured from areas known for their specialization and craftsmanship in that category. This ensures authenticity, consistent quality, and products that carry a true sense of purpose and heritage. 

We also understand that every brand is unique. That’s why we offer flexible customization and branding options, including printing your logo on products, helping you create something that truly represents your identity. 

Our goal goes beyond supplying products. We aim to build meaningful, long-term relationships through trust, reliability, and a genuine commitment to your growth. 
            </p>


            <Link
              to="/about"
              className="btn btn-primary"
              style={{
                marginTop: "28px",
                textDecoration: "none",
                display: "inline-flex",
              }}
            >
              Discover Our Story
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}