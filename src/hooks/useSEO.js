/**
 * useSEO.js — Yogo Ventures
 *
 * Dynamic SEO meta tag management for React SPA.
 * Since this project uses Vite (no SSR), we manipulate <head> directly via
 * the DOM. This is fully compatible with Google's JavaScript rendering.
 *
 * Usage:
 *   useSEO({ title, description, canonical, ogImage, schema })
 *
 * Why this matters:
 *   Without per-page meta tags every page shares the same title/description,
 *   which Google treats as duplicate content — hurting rankings for all pages
 *   except the homepage. This hook fixes that without adding react-helmet.
 */

import { useEffect } from "react";

const SITE_NAME    = "Yogo Ventures";
const SITE_URL     = "https://www.yogoventures.com";
const DEFAULT_IMG  = `${SITE_URL}/Hero1.png`;
const DEFAULT_DESC = "Yogo Ventures is India's trusted B2B wholesale supplier of premium fashion apparel, copper utensils, memory foam products, and authentic Indian handicrafts.";

/**
 * Helper: set or create a <meta> tag.
 * attr  = attribute name to match on, e.g. "name" or "property"
 * value = attribute value, e.g. "description" or "og:title"
 */
function setMeta(attr, value, content) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Helper: set or update a <link rel="…"> tag. */
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Helper: inject or update a JSON-LD <script> block.
 * Uses data-schema-id to avoid duplicates across navigations.
 */
function setSchema(id, schemaObj) {
  let el = document.querySelector(`script[data-schema-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-schema-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schemaObj, null, 2);
}

function removeSchema(id) {
  const el = document.querySelector(`script[data-schema-id="${id}"]`);
  if (el) el.remove();
}

/**
 * Build the full page title.
 *
 * Rules:
 *  - If title already begins with "Yogo Ventures" (any casing) → use as-is
 *  - Otherwise prefix with "Yogo Ventures | "
 *  - No title provided → fallback to homepage default
 *
 * This prevents double-branding like:
 *   "Yogo Ventures | Yogo Ventures | Shop All Products…"   ← old bug
 */
function buildTitle(title) {
  if (!title) {
    return "Yogo Ventures | Fashion, Memory Foam, Copper Utensils & Handicrafts";
  }
  if (/^yogo ventures/i.test(title.trim())) {
    return title.trim();
  }
  return `Yogo Ventures | ${title}`;
}

/**
 * Main hook
 *
 * @param {object}  params
 * @param {string}  params.title        — Page-specific title segment
 * @param {string}  params.description  — Meta description (120–160 chars)
 * @param {string}  params.canonical    — Full canonical URL for this page
 * @param {string}  [params.ogImage]    — OG image URL (defaults to Hero1.png)
 * @param {string}  [params.ogType]     — OG type (default: "website")
 * @param {string}  [params.robots]     — Robots directive
 * @param {object}  [params.schema]     — JSON-LD schema object to inject
 * @param {string}  [params.schemaId]   — Unique ID for the schema block
 * @param {Array}   [params.breadcrumb] — [{name, url}] for BreadcrumbList schema
 * @param {string}  [params.keywords]   — Page-specific meta keywords
 */
export function useSEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogImage = DEFAULT_IMG,
  ogType = "website",
  robots = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  schema = null,
  schemaId = null,
  breadcrumb = null,
  keywords = null,
}) {
  useEffect(() => {
    const fullTitle = buildTitle(title);

    // ── Document title ────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Primary meta tags ─────────────────────────────────────────────────
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    if (keywords) {
      setMeta("name", "keywords", keywords);
    }

    // ── Canonical URL ─────────────────────────────────────────────────────
    if (canonical) {
      setLink("canonical", canonical);
    }

    // ── Open Graph ────────────────────────────────────────────────────────
    setMeta("property", "og:title",       fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url",         canonical || `${SITE_URL}/`);
    setMeta("property", "og:image",       ogImage);
    setMeta("property", "og:image:alt",   `${SITE_NAME} — ${title || "B2B Wholesale Marketplace India"}`);
    setMeta("property", "og:type",        ogType);
    setMeta("property", "og:site_name",   SITE_NAME);
    setMeta("property", "og:locale",      "en_IN");

    // ── Twitter / X Card ──────────────────────────────────────────────────
    setMeta("name", "twitter:card",        "summary_large_image");
    setMeta("name", "twitter:title",       fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image",       ogImage);
    setMeta("name", "twitter:image:alt",   `${SITE_NAME} — ${title || "B2B Wholesale Marketplace India"}`);

    // ── Page-specific JSON-LD schema ──────────────────────────────────────
    if (schema && schemaId) {
      setSchema(schemaId, schema);
    } else if (schemaId) {
      removeSchema(schemaId);
    }

    // ── BreadcrumbList schema ─────────────────────────────────────────────
    if (breadcrumb && breadcrumb.length > 0) {
      setSchema("page-breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "item": item.url,
        })),
      });
    } else {
      removeSchema("page-breadcrumb");
    }

    // ── Virtual page view — GTM dataLayer ────────────────────────────────
    // Fires on every SPA navigation so GTM GA4 tag picks it up correctly.
    if (window.dataLayer) {
      window.dataLayer.push({
        event:          "page_view",
        page_title:     fullTitle,
        page_location:  canonical || window.location.href,
        page_path:      window.location.pathname + window.location.search,
      });
    }

    // ── Cleanup on unmount / route change ─────────────────────────────────
    return () => {
      if (schemaId) removeSchema(schemaId);
      removeSchema("page-breadcrumb");
    };
  }, [title, description, canonical, ogImage, ogType, robots, schema, schemaId, breadcrumb, keywords]);
}

export default useSEO;
