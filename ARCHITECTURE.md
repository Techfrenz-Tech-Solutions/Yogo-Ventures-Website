# YoGo Ventures — Architecture & Technical Documentation

## 1. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   YOGO VENTURES v2.0                         │
│              (React 18 + Vite 5 SPA)                         │
├──────────────────┬──────────────────────┬────────────────────┤
│  PRESENTATION    │    APPLICATION        │   DATA / API       │
│  LAYER           │    LAYER              │   LAYER            │
│                  │                       │                    │
│  • Pages         │  • React Router v6    │  • REST Backend    │
│  • Components    │  • Context API        │  • Google Analytics│
│  • CSS Modules   │  • Custom Hooks       │  • Google Tag Mgr  │
│  • GSAP          │  • useSEO Hook        │  • PWA Manifest    │
└──────────────────┴──────────────────────┴────────────────────┘
```

---

## 2. Page Structure

```
/ (HomePage)
  ├── HeroSection            — 4-slide carousel with auto-advance
  ├── CategoriesSection      — DB-driven category cards with product rotation
  ├── BestSellersSection     — API-fetched best selling products
  ├── NewArrivalsSection     — API-fetched new arrival products
  ├── SourcingCTA            — B2B sourcing call-to-action block
  ├── WhyUsSection           — 6 B2B value proposition cards
  ├── TestimonialsSection    — Auto-advancing testimonial carousel
  ├── FAQSection             — Accordion FAQ with analytics tracking
  └── EnquirySection         — Inline enquiry form with country/category API

/shop (ShopPage)
  ├── HeroStrip              — Category pill quick-filter
  ├── Sidebar                — Category + subcategory radios, product search
  ├── SortBar                — Featured / A–Z / Z–A sort
  └── ProductGrid            — DB-driven product grid

/product/:id (ProductDetailPage)
  ├── Breadcrumb             — Home > Shop > Category > Product
  ├── ImageGallery           — Inner-zoom on hover/tap, thumbnail strip
  ├── ProductInfo            — Quantity input, Get Quote CTA, wishlist
  ├── ColourCustomization    — Spectrum picker (Apparel only)
  ├── B2BContent             — Fabrics, print techniques, order flow (Apparel)
  └── YouMayAlsoLike         — Same-category related products

/checkout (CheckoutPage)
  └── EnquiryCartSummary     — Cart items, quantities, submit enquiry

/services (ServicesPage)
  ├── HeroBanner
  ├── ServiceCards           — 6 sourcing service cards
  ├── AudienceSection        — Who this is for
  ├── HowToUseSteps          — 4-step process
  ├── WhyChooseSection       — 6 key advantages
  └── ContactCTA

/contact (ContactPage)
  ├── HeroStrip
  ├── ContactForm            — First/last name, email, country (DB), phone, subject, message
  └── InfoCards              — Address, email, phone, hours

/PrivacyPolicy               — 14-section privacy policy
/TermOfuse                   — Terms and conditions
/wishlist                    — Saved product grid
```

---

## 3. Component Tree

```
src/
├── main.jsx
├── App.jsx                        ← Router + layout + global modals + GSAP setup
│
├── styles/
│   └── globals.css                ← Design tokens, CSS vars, animations, utilities
│
├── data/
│   └── content.js                 ← Testimonials, blog posts, nav links, stats, services
│
├── context/
│   └── AppContext.jsx             ← Cart, wishlist, toast, cart open/close, recently viewed
│
├── hooks/
│   ├── useSEO.js                  ← Per-page meta, OG, Twitter, JSON-LD, keywords
│   ├── useScrollReveal.jsx        ← IntersectionObserver scroll reveal
│   ├── useHeaderScroll.jsx        ← Sticky header shadow trigger
│   ├── useProducts.jsx            ← Products from backend API with cache
│   └── useCategories.jsx          ← Categories + subcategories from backend API
│
├── utils/
│   ├── Api.js                     ← Axios instance — base URL from VITE_API_URL env
│   ├── analytics.js               ← GTM dataLayer push + GA4 event helpers
│   └── imageUrl.js                ← Constructs full image URLs from backend storage paths
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx + .css      ← Logo, desktop nav, search, cart, wishlist, theme toggle
│   │   └── Footer.jsx + .css      ← Brand col, shop links, sitemap, help, contact address
│   │
│   ├── common/
│   │   ├── BottomNav.jsx + .css   ← Mobile fixed bottom navigation (≤768px)
│   │   ├── MiniCart.jsx           ← Slide-in enquiry cart panel
│   │   ├── ScrollUp.jsx           ← Back-to-top button
│   │   ├── Toast.jsx              ← Aria-live toast notifications
│   │   ├── SiteLoader.jsx         ← First-visit loading screen (session-once)
│   │   └── ParticlesBackground.jsx← tsParticles ambient background
│   │
│   ├── cart/
│   │   └── MiniCart.jsx + .css
│   │
│   └── home/
│       ├── HeroSection.jsx + .css         ← 4-slide auto-carousel with pill dots
│       ├── CategoriesSection.jsx + .css   ← DB category cards with product photo rotation
│       ├── WhyUsSection.jsx               ← 6-card B2B USP grid
│       ├── TestimonialsSection.jsx        ← Marquee testimonial carousel
│       ├── FAQSection.jsx + .css          ← Accordion, GA4 tracking on open
│       ├── EnquirySection.jsx + .css      ← Inline enquiry form
│       ├── StatsSection.jsx               ← Animated stat counters
│       └── HomeSections.css               ← Shared home section styles
│
└── pages/
    ├── HomePage.jsx + .css
    ├── ShopPage.jsx + .css
    ├── ProductDetailPage.jsx + .css
    ├── ColorCustomization.css
    ├── CheckoutPage.jsx + .css
    ├── ServicesPage.jsx + .css
    ├── ContactPage.jsx + .css
    ├── WishlistPage.jsx
    ├── PrivacyPolicy.jsx + .css
    └── TermOfuse.jsx + .css
```

---

## 4. Technology Stack

### Core
| Technology       | Version  | Purpose                                  |
|------------------|----------|------------------------------------------|
| React            | 18.3.x   | UI framework                             |
| Vite             | 5.3.x    | Build tool — fast HMR, ESM native        |
| React Router DOM | 6.24.x   | Client-side SPA routing                  |

### Styling & Animation
| Technology       | Version  | Purpose                                  |
|------------------|----------|------------------------------------------|
| CSS Custom Props | Native   | Design tokens, theming, dark/light mode  |
| GSAP             | 3.12.x   | Page transitions, scroll reveals         |
| ScrollTrigger    | 3.12.x   | Scroll-based animations                  |
| tsParticles      | 3.x      | Ambient particle background              |

### State & Data
| Technology       | Version  | Purpose                                  |
|------------------|----------|------------------------------------------|
| React Context    | Built-in | Cart, wishlist, toast, global UI state   |
| Axios            | 1.x      | HTTP client for backend API              |
| useSEO hook      | Custom   | Dynamic head meta + JSON-LD per route    |

### Analytics & SEO
| Technology              | Purpose                                       |
|-------------------------|-----------------------------------------------|
| Google Analytics 4      | User behaviour, conversions, engagement       |
| Google Tag Manager      | Event tracking, tag management                |
| JSON-LD Schemas         | Organization, WebSite, Product, FAQ, Service  |
| Custom `analytics.js`   | Typed GTM dataLayer event helpers             |

### Build & Deployment
| Technology   | Purpose                                           |
|--------------|---------------------------------------------------|
| Vite build   | Minified static output with content-hashed assets |
| Docker       | Multi-stage container — node build + nginx serve  |
| nginx        | SPA routing, gzip, security headers, caching      |

---

## 5. SEO Architecture

### Per-Page Meta — `useSEO` Hook
Every route calls `useSEO()` which dynamically updates:
- `document.title` — format: `Yogo Ventures | {Page Title}`
- `<meta name="description">`
- `<meta name="keywords">`
- `<link rel="canonical">`
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card (`twitter:title`, `twitter:description`, `twitter:image`)
- Page-specific JSON-LD schema (injected as `<script type="application/ld+json">`)
- `BreadcrumbList` schema (auto-generated from `breadcrumb` param)
- GTM `page_view` dataLayer push

### JSON-LD Schemas in `index.html` (Global)
| Schema Type             | Purpose                                          |
|-------------------------|--------------------------------------------------|
| `Organization`          | Brand entity, logo, contacts, social profiles    |
| `WebSite`               | Site search, publisher reference                 |
| `WebSite.hasPart`       | SiteNavigationElement — drives Google Sitelinks  |
| `BreadcrumbList`        | Site hierarchy for Sitelinks eligibility         |
| `LocalBusiness`         | Address, hours, geo coordinates                  |
| `ItemList`              | Product category list                            |
| `FAQPage`               | FAQ rich result accordion in Google Search       |

### JSON-LD Schemas per Page (via `useSEO`)
| Page             | Schema                |
|------------------|-----------------------|
| Home             | `WebPage`             |
| Shop             | `CollectionPage`      |
| Product Detail   | `Product` + `Offer`   |
| Services         | `Service` + `OfferCatalog` |
| Contact          | `ContactPage`         |

---

## 6. Analytics Architecture

All tracking flows through GTM → GA4.

### GTM Container: `GTM-WRGXG2HH`
### GA4 Property: `G-4Q0TFQRYTP`

### Event Reference (`src/utils/analytics.js`)

| Function               | GA4 Event Name        | Marked as Conversion |
|------------------------|-----------------------|----------------------|
| `trackPageView`        | `page_view`           |                      |
| `initScrollTracking`   | `scroll`              |                      |
| `trackFormSubmit`      | `generate_lead`       | ✅                    |
| `trackRequestQuote`    | `request_quote`       | ✅                    |
| `trackAddToCart`       | `add_to_cart`         |                      |
| `trackProductView`     | `view_item`           |                      |
| `trackCategoryView`    | `view_item_list`      |                      |
| `trackSearch`          | `search`              |                      |
| `trackWishlist`        | `add_to_wishlist`     |                      |
| `trackPhoneClick`      | `phone_click`         |                      |
| `trackEmailClick`      | `email_click`         |                      |
| `trackWhatsAppClick`   | `whatsapp_click`      |                      |
| `trackFAQOpen`         | `faq_open`            |                      |
| `trackOutboundLink`    | `outbound_link_click` |                      |

---

## 7. Performance Strategy

### Core Web Vitals Targets
| Metric | Target | Implementation                              |
|--------|--------|---------------------------------------------|
| LCP    | < 2.5s | Hero image `fetchpriority="high"`, preconnect to API |
| INP    | < 200ms| `content-visibility: auto` on off-screen sections   |
| CLS    | < 0.1  | Explicit image `width`/`height`, no font flash       |

### Build Optimisation
- Manual Vite chunks: `vendor-react`, `vendor-router`, `vendor-gsap`, `vendor-particles`
- Content-hashed filenames for immutable 1-year caching
- No source maps in production

### nginx Caching Strategy
| Asset Type      | Cache Policy                |
|-----------------|-----------------------------|
| `index.html`    | `no-cache, must-revalidate` |
| `/assets/*`     | `max-age=31536000, immutable` |
| Images          | `max-age=2592000` (30 days) |
| Fonts           | `max-age=31536000, immutable` |
| `sitemap.xml`   | `max-age=86400` (1 day)     |

---

## 8. Design System

### Brand Palette
| Token         | Value     | Usage                                 |
|---------------|-----------|---------------------------------------|
| `--deep`      | `#335765` | Primary CTAs, header, active states   |
| `--mid`       | `#74A8A4` | Accents, hover borders, section tags  |
| `--light`     | `#B6D9E0` | Background tints, pills, tags         |
| `--sage`      | `#DBE2DC` | Borders, subtle fills                 |
| `--terra`     | `#7F543D` | Secondary CTAs, accent highlights     |
| `--off-white` | `#F4F8F8` | Page background                       |
| `--dark`      | `#1A2E35` | Headings, body text                   |
| `--muted`     | `#5A7A82` | Secondary text, placeholders          |

### Typography
| Font                | Role          | Weights         |
|---------------------|---------------|-----------------|
| Cormorant Garamond  | Display/serif | 300, 400, 500, 600 (+ italic) |
| DM Sans             | Body/UI       | 300, 400, 500, 600 |

### Z-Index Scale
| Token        | Value | Layer               |
|--------------|-------|---------------------|
| `--z-base`   | 1     | Normal content      |
| `--z-raised` | 10    | Cards on hover      |
| `--z-dropdown`| 100  | Dropdowns, tooltips |
| `--z-sticky` | 200  | Header              |
| `--z-overlay`| 500  | Modals backdrop     |
| `--z-modal`  | 600  | Modal content       |
| `--z-toast`  | 700  | Toast notifications |

---

## 9. Deployment

### Docker
Multi-stage build — `node:20-alpine` builds the Vite bundle, `nginx:alpine` serves it.

```bash
docker build -t yogo-ventures-website .
docker run -d --name yogo-ventures-website --restart unless-stopped -p 80:80 yogo-ventures-website
```

### nginx
Handles SPA routing (`try_files $uri /index.html`), gzip compression, security response headers, and long-term immutable caching for hashed assets.

---

*Yogo Ventures Website v2.0*
