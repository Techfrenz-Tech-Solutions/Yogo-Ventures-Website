/**
 * analytics.js — Yogo Ventures
 *
 * GTM dataLayer event helpers + GA4 gtag event wrappers.
 * All tracking flows through GTM (GTM-WRGXG2HH) → GA4 (G-4Q0TFQRYTP).
 *
 * Usage:
 *   import { trackEvent, trackPageView, trackProductView } from "../utils/analytics";
 *
 * GTM Setup Required:
 *   Create triggers in GTM for each custom event name below.
 *   Configure GA4 Event tags in GTM that fire on these custom events.
 */

// ── Core push helper ─────────────────────────────────────────────────────────

/**
 * Push a custom event to the GTM dataLayer.
 * @param {string} eventName  - GA4 recommended event name (snake_case)
 * @param {object} [params]   - Event parameters (flat object)
 */
export function trackEvent(eventName, params = {}) {
  if (!window.dataLayer) return;
  window.dataLayer.push({
    event: eventName,
    ...params,
    event_timestamp: Date.now(),
  });
}

// ── Page Tracking ─────────────────────────────────────────────────────────────

/**
 * Track a virtual page view (SPA navigation).
 * GTM trigger: Custom Event — event equals "page_view"
 */
export function trackPageView({ title, path, url }) {
  trackEvent("page_view", {
    page_title: title,
    page_path: path || window.location.pathname,
    page_location: url || window.location.href,
  });
}

// ── Scroll Tracking ───────────────────────────────────────────────────────────

/**
 * Track scroll depth milestones (25, 50, 75, 90, 100%).
 * Call once per page. Uses IntersectionObserver on sentinel divs
 * or window scroll event.
 * GTM trigger: Custom Event — event equals "scroll"
 */
export function initScrollTracking() {
  if (typeof window === "undefined") return;
  const milestones = [25, 50, 75, 90, 100];
  const fired = new Set();

  const onScroll = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const pct = Math.round((scrolled / total) * 100);

    milestones.forEach(m => {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        trackEvent("scroll", { percent_scrolled: m });
      }
    });

    if (fired.size === milestones.length) {
      window.removeEventListener("scroll", onScroll, { passive: true });
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// ── Outbound Link Tracking ────────────────────────────────────────────────────

/**
 * Track clicks on outbound links (e.g. Instagram, LinkedIn, TechFrenz).
 * GTM trigger: Custom Event — event equals "outbound_link_click"
 */
export function trackOutboundLink(url, linkText = "") {
  trackEvent("outbound_link_click", {
    link_url: url,
    link_text: linkText,
    link_domain: (() => { try { return new URL(url).hostname; } catch { return url; } })(),
  });
}

// ── Contact & Communication Events ───────────────────────────────────────────

/**
 * Track WhatsApp button click.
 * GTM trigger: Custom Event — event equals "whatsapp_click"
 */
export function trackWhatsAppClick(phoneNumber = "+919003317417") {
  trackEvent("whatsapp_click", {
    phone_number: phoneNumber,
    contact_method: "whatsapp",
  });
  // Also push as GA4 conversion
  if (window.gtag) {
    window.gtag("event", "contact", { method: "whatsapp", phone_number: phoneNumber });
  }
}

/**
 * Track phone number click.
 * GTM trigger: Custom Event — event equals "phone_click"
 */
export function trackPhoneClick(phoneNumber) {
  trackEvent("phone_click", {
    phone_number: phoneNumber,
    contact_method: "phone",
  });
}

/**
 * Track email link click.
 * GTM trigger: Custom Event — event equals "email_click"
 */
export function trackEmailClick(email) {
  trackEvent("email_click", {
    email_address: email,
    contact_method: "email",
  });
}

// ── Lead Generation / Conversion Events ──────────────────────────────────────

/**
 * Track contact form submission (lead generation).
 * GTM trigger: Custom Event — event equals "generate_lead"
 * Mark as GA4 Conversion in GA4 dashboard.
 */
export function trackFormSubmit({ formId = "contact_form", country = "", subject = "" } = {}) {
  trackEvent("generate_lead", {
    form_id: formId,
    contact_country: country,
    contact_subject: subject,
    currency: "INR",
  });
  // Fire GA4 conversion directly as well
  if (window.gtag) {
    window.gtag("event", "generate_lead", {
      send_to: "G-4Q0TFQRYTP",
      form_id: formId,
    });
  }
}

/**
 * Track Request Quote button click.
 * GTM trigger: Custom Event — event equals "request_quote"
 * Mark as GA4 Conversion in GA4 dashboard.
 */
export function trackRequestQuote({ productId, productName, category, quantity = 0 } = {}) {
  trackEvent("request_quote", {
    item_id: productId,
    item_name: productName,
    item_category: category,
    quantity: quantity,
    currency: "INR",
  });
}

/**
 * Track "Add to Cart" (enquiry cart — quotation-based model).
 * GTM trigger: Custom Event — event equals "add_to_cart"
 */
export function trackAddToCart({ productId, productName, category, quantity = 1 } = {}) {
  trackEvent("add_to_cart", {
    currency: "INR",
    items: [{
      item_id: String(productId),
      item_name: productName,
      item_category: category,
      quantity: quantity,
    }],
  });
}

// ── Product & Category View Events ───────────────────────────────────────────

/**
 * Track product detail page view.
 * GTM trigger: Custom Event — event equals "view_item"
 */
export function trackProductView({ productId, productName, category } = {}) {
  trackEvent("view_item", {
    currency: "INR",
    items: [{
      item_id: String(productId),
      item_name: productName,
      item_category: category,
    }],
  });
}

/**
 * Track product list / category page view.
 * GTM trigger: Custom Event — event equals "view_item_list"
 */
export function trackCategoryView({ category, itemCount = 0 } = {}) {
  trackEvent("view_item_list", {
    item_list_name: category,
    item_list_id: category?.toLowerCase().replace(/\s+/g, "_"),
    item_count: itemCount,
  });
}

// ── Search Events ─────────────────────────────────────────────────────────────

/**
 * Track site search.
 * GTM trigger: Custom Event — event equals "search"
 */
export function trackSearch({ term, resultCount = 0 } = {}) {
  trackEvent("search", {
    search_term: term,
    search_result_count: resultCount,
  });
}

// ── Engagement Events ─────────────────────────────────────────────────────────

/**
 * Track wishlist add/remove.
 * GTM trigger: Custom Event — event equals "add_to_wishlist" / "remove_from_wishlist"
 */
export function trackWishlist(action, { productId, productName, category } = {}) {
  const eventName = action === "add" ? "add_to_wishlist" : "remove_from_wishlist";
  trackEvent(eventName, {
    currency: "INR",
    items: [{
      item_id: String(productId),
      item_name: productName,
      item_category: category,
    }],
  });
}

/**
 * Track FAQ accordion open.
 * GTM trigger: Custom Event — event equals "faq_open"
 */
export function trackFAQOpen(question) {
  trackEvent("faq_open", { faq_question: question });
}

/**
 * Track hero slider interaction.
 * GTM trigger: Custom Event — event equals "hero_slide_change"
 */
export function trackHeroSlide(slideName, slideIndex) {
  trackEvent("hero_slide_change", {
    slide_name: slideName,
    slide_index: slideIndex,
  });
}

/**
 * Track file / catalogue download (if ever added).
 * GTM trigger: Custom Event — event equals "file_download"
 */
export function trackDownload(fileName, fileUrl) {
  trackEvent("file_download", {
    file_name: fileName,
    file_url: fileUrl,
    link_url: fileUrl,
  });
}
