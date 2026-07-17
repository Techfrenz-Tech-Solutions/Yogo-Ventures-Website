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

const SITE_NAME    = "YoGo Ventures";
const SITE_URL     = "https://www.yogoventures.com";
const DEFAULT_IMG  = `${SITE_URL}/Logo.png`;
const DEFAULT_DESC = "YoGo Ventures is a trusted B2B wholesale marketplace in India offering premium fashion apparel, copper utensils, memory foam products, and authentic Indian handicrafts.";

/**
 * Helper: set or create a <meta> tag by name attribute.
 * Avoids duplicates by finding the existing tag first.
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

/**
 * Helper: set or create a <link> tag.
 */
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
 * Uses a data-schema-id attribute to avoid duplicates.
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
 * Main hook
 *
 * @param {object} params
 * @param {string}  params.title       — Full page title (no need to append site name, it's done here)
 * @param {string}  params.description — Meta description (120–160 chars ideal)
 * @param {string}  params.canonical   — Full canonical URL
 * @param {string}  [params.ogImage]   — OG image URL (falls back to Logo.png)
 * @param {string}  [params.ogType]    — OG type (default: "website")
 * @param {string}  [params.robots]    — Robots directive (default: "index, follow")
 * @param {object}  [params.schema]    — Single JSON-LD schema object, or null to remove
 * @param {string}  [params.schemaId]  — Unique ID for the schema block (required if schema provided)
 * @param {Array}   [params.breadcrumb] — Array of {name, url} for BreadcrumbList schema
 * @param {string}  [params.keywords]  — Page-specific meta keywords (comma-separated string)
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
    const fullTitle = title ? `YoGo Ventures | ${title}` : "YoGo Ventures | Fashion, Memory Foam, Copper Utensils & Handicrafts";

    // ── Document title ────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Standard meta tags ────────────────────────────────────────────────
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    if (keywords) {
      setMeta("name", "keywords", keywords);
    }

    // ── Canonical ─────────────────────────────────────────────────────────
    if (canonical) {
      setLink("canonical", canonical);
    }

    // ── Open Graph ────────────────────────────────────────────────────────
    setMeta("property", "og:title",       fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url",         canonical || `${SITE_URL}/`);
    setMeta("property", "og:image",       ogImage);
    setMeta("property", "og:image:alt",   fullTitle);
    setMeta("property", "og:type",        ogType);
    setMeta("property", "og:site_name",   SITE_NAME);
    setMeta("property", "og:locale",      "en_IN");

    // ── Twitter Card ──────────────────────────────────────────────────────
    setMeta("name", "twitter:card",        "summary_large_image");
    setMeta("name", "twitter:title",       fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image",       ogImage);
    setMeta("name", "twitter:image:alt",   fullTitle);

    // ── Page-specific JSON-LD schema ──────────────────────────────────────
    if (schema && schemaId) {
      setSchema(schemaId, schema);
    } else if (schemaId) {
      removeSchema(schemaId);
    }

    // ── BreadcrumbList schema ─────────────────────────────────────────────
    if (breadcrumb && breadcrumb.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "item": item.url,
        })),
      };
      setSchema("page-breadcrumb", breadcrumbSchema);
    } else {
      removeSchema("page-breadcrumb");
    }

    // ── Track page view in GTM / GA4 ─────────────────────────────────────
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "page_view",
        page_title: fullTitle,
        page_location: canonical || window.location.href,
        page_path: window.location.pathname,
      });
    }

    // ── Cleanup: restore homepage meta on unmount ─────────────────────────
    return () => {
      if (schemaId) removeSchema(schemaId);
      removeSchema("page-breadcrumb");
    };
  }, [title, description, canonical, ogImage, ogType, robots, schema, schemaId, breadcrumb, keywords]);
}

export default useSEO;
