// src/pages/BlogDetailPage.jsx — Yogo Ventures
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BLOG_POSTS } from "../data/content";
import { useApp } from "../context/AppContext";
import "./BlogDetailPage.css";

export default function BlogDetailPage() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const { themeColor } = useApp();

  const post = BLOG_POSTS.find(p => String(p.id) === String(id));

  // Related posts — same category, excluding current
  const related = BLOG_POSTS
    .filter(p => p.category === post?.category && String(p.id) !== String(id))
    .slice(0, 3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // ── 404 state ──
  if (!post) {
    return (
      <main className="page-enter bdet-notfound">
        <h1>Article not found</h1>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <button
          className="bdet-back-btn"
          style={{ background: themeColor }}
          onClick={() => navigate("/blog")}
        >
          ← Back to Journal
        </button>
      </main>
    );
  }

  return (
    <main className="page-enter bdet">

      {/* ── HERO — matches ContactPage banner style, color synced with themeColor ── */}
      <section className="page-hero bdet__hero" style={{ background: themeColor }}>
        <div className="container">
          <span
            className="section-tag"
            style={{ background: "rgba(182,217,224,0.2)", color: "var(--light)" }}
          >
            {post.category}
          </span>
          <h1 className="page-hero__title">{post.title}</h1>
          <div className="bdet__meta">
            <span>{post.date}</span>
            <span className="bdet__meta-dot">·</span>
            <span>{post.readTime} read</span>
          </div>
          <Link to="/blog" className="bdet__breadcrumb">← Back to Journal</Link>
        </div>
      </section>

      {/* ── BODY ── */}
      <section className="section bdet__body-section">
        <div className="container bdet__layout">

          {/* Main content */}
          <article className="bdet__content">
            {/* Excerpt lead */}
            <p className="bdet__lead">{post.excerpt}</p>

            {/* Full body — render if available, otherwise graceful fallback */}
            {post.body ? (
              <div
                className="bdet__prose"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            ) : (
              <div className="bdet__prose">
                <p>
                  At YoGo Ventures, we believe every product should carry meaning — crafted
                  with care, sourced responsibly, and designed to enrich your everyday life.
                  This article explores the story behind <strong>{post.title}</strong> and
                  what makes it a standout choice in our collection.
                </p>
                <h2>Why It Matters</h2>
                <p>
                  Our commitment to quality starts at the source. We work directly with
                  trusted manufacturers and artisans across India's most specialised
                  production hubs — ensuring every item meets our standards before it
                  reaches your hands.
                </p>
                <h2>What Sets It Apart</h2>
                <p>
                  From premium materials to meticulous finishing, the {post.category} range
                  is built to last. Whether you're investing in everyday comfort or a
                  timeless piece of craftsmanship, this collection delivers exceptional
                  value without compromise.
                </p>
                <h2>Explore the Collection</h2>
                <p>
                  Ready to discover more? Browse our full range of {post.category} products
                  and find the perfect fit for your lifestyle.
                </p>
              </div>
            )}

            {/* CTA to shop */}
            <div className="bdet__shop-cta">
              <p className="bdet__shop-cta-text">
                Interested in our {post.category} collection?
              </p>
              <button
                className="bdet__shop-btn"
                style={{ background: themeColor }}
                onClick={() =>
                  navigate(`/shop?category=${encodeURIComponent(post.category)}`)
                }
              >
                Shop {post.category} →
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="bdet__sidebar">
            <div className="bdet__sidebar-card">
              <h3 className="bdet__sidebar-heading">About This Article</h3>
              <ul className="bdet__sidebar-list">
                <li>
                  <span className="bdet__sidebar-label">Category</span>
                  <span className="bdet__sidebar-value">{post.category}</span>
                </li>
                <li>
                  <span className="bdet__sidebar-label">Published</span>
                  <span className="bdet__sidebar-value">{post.date}</span>
                </li>
                <li>
                  <span className="bdet__sidebar-label">Read Time</span>
                  <span className="bdet__sidebar-value">{post.readTime}</span>
                </li>
              </ul>
            </div>

            {related.length > 0 && (
              <div className="bdet__sidebar-card">
                <h3 className="bdet__sidebar-heading">Related Articles</h3>
                <div className="bdet__related-list">
                  {related.map(r => (
                    <button
                      key={r.id}
                      className="bdet__related-item"
                      onClick={() => navigate(`/blog/${r.id}`)}
                    >
                      <img
                        src={r.image}
                        alt={r.title}
                        className="bdet__related-img"
                        loading="lazy"
                      />
                      <div className="bdet__related-body">
                        <p className="bdet__related-title">{r.title}</p>
                        <p className="bdet__related-meta">{r.readTime} read</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </section>

    </main>
  );
}