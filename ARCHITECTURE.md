# 🌊 Coastal Retreat — Website Architecture & Technical Documentation

## 1. WEBSITE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    COASTAL RETREAT v2.0                     │
│                  (React 18 + Vite 5 SPA)                    │
├─────────────┬───────────────────────┬───────────────────────┤
│  PRESENTATION│     APPLICATION       │     DATA / API        │
│   LAYER      │       LAYER           │       LAYER           │
│             │                       │                       │
│ • Pages      │ • React Router v6     │ • Static JSON data    │
│ • Components │ • Context API         │ • Sanity CMS (CMS)    │
│ • CSS Modules│ • Custom Hooks        │ • Razorpay API        │
│ • GSAP       │ • Utility functions   │ • Google Analytics    │
└─────────────┴───────────────────────┴───────────────────────┘
```

### Page Architecture
```
/ (HomePage)
  ├── HeroSection          — GSAP animated full-screen hero
  ├── CategoriesSection    — 15 photo-backed aesthetic cards
  ├── BestSellers          — 4 products from Best Seller tag
  ├── StatsSection         — Dark bg animated counters
  ├── NewArrivals          — 4 products from New tag
  ├── RecentlyViewed       — Horizontal scroll from Context
  ├── BrandsSection        — Trusted brand pills
  ├── AboutSection         — Story + stacked images
  ├── WhyUsSection         — 6-card feature grid
  └── TestimonialsSection  — Auto-advancing carousel

/shop (ShopPage)
  ├── SidebarFilters       — Category, Brand, Price, Search
  ├── SortBar              — Featured/Price/Rating sort
  └── ProductGrid          — Auto-fill grid, 200 products

/product/:id (ProductDetailPage)
  ├── Breadcrumb
  ├── ImageGallery         — Click-to-zoom, thumbnails
  ├── ProductInfo (sticky) — Variants, Qty, Add to Cart
  ├── TabbedContent        — Description/Ingredients/Reviews
  └── RelatedProducts      — Same-category grid

/checkout (CheckoutPage)
  ├── ContactForm
  ├── AddressForm
  └── OrderSummary (sticky)

/blog, /services, /about, /contact, /wishlist
```

---

## 2. COMPONENT STRUCTURE (TREE)

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Root: Router + Layout + Global modals
│
├── styles/
│   └── globals.css             # Design tokens, CSS vars, animations, utilities
│
├── data/
│   ├── products.js             # 200 products across 15 categories (static)
│   └── content.js              # Testimonials, blog, services, stats, nav links
│
├── context/
│   └── AppContext.jsx          # Cart, wishlist, currency, theme, toast, recently viewed
│
├── hooks/
│   ├── useScrollReveal.jsx     # IntersectionObserver scroll reveal
│   └── useHeaderScroll.jsx     # Sticky header shadow on scroll
│
├── utils/
│   └── helpers.jsx             # renderStars, clamp, truncate, debounce, formatNumber
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx + .css   # Logo, nav, custom search pill, currency, cart
│   │   ├── Footer.jsx + .css   # Newsletter, 4-col links, wave divider, payment pills
│   │   └── MobileNav.jsx + .css# Fixed bottom nav (Home/Shop/Cart/Wishlist/About)
│   │
│   ├── common/
│   │   ├── CustomCursor.jsx+.css   # Compass SVG cursor + spinning ring + glow trail
│   │   ├── ProductCard.jsx+.css    # Reusable card (img, wishlist, quick view, cart)
│   │   ├── QuickViewModal.jsx+.css # Centered popup: img + info + variants + CTA
│   │   ├── EnquiryModal.jsx+.css   # Entry popup with form validation
│   │   ├── CookieConsent.jsx+.css  # Bottom-right cookie banner
│   │   ├── ThemeSwitcher.jsx+.css  # 5-theme colour switcher (bottom-left)
│   │   └── Toast.jsx               # Aria-live toast notifications
│   │
│   ├── cart/
│   │   └── MiniCart.jsx + .css # Slide-in panel with qty controls + checkout
│   │
│   └── home/
│       ├── HeroSection.jsx+.css       # Full-screen hero with GSAP-ready animations
│       ├── CategoriesSection.jsx+.css # 15 aesthetic photo-backed category cards
│       ├── StatsSection.jsx           # Dark section: 4 animated stat counters
│       ├── BrandsSection.jsx          # Brand partner pills
│       ├── AboutSection.jsx           # Story + stacked images
│       ├── WhyUsSection.jsx           # 6-card USP grid
│       ├── TestimonialsSection.jsx    # Carousel with dot navigation
│       └── HomeSections.css           # Shared styles for Stats/Brands/About/Why/Testimonials
│
└── pages/
    ├── HomePage.jsx + .css           # Assembles all home sections
    ├── ShopPage.jsx + .css           # Sidebar filters + 200-product grid
    ├── ProductDetailPage.jsx + .css  # Gallery, zoom, variants, tabs, related
    ├── CheckoutPage.jsx + .css       # Contact + address form + order summary
    ├── BlogPage.jsx + .css           # Featured articles + filterable grid
    ├── ServicesPage.jsx + .css       # Service cards + CTA banner
    ├── AboutPage.jsx + .css          # Story, stats, team
    ├── ContactPage.jsx + .css        # Form + info cards
    └── WishlistPage.jsx              # Saved products grid
```

---

## 3. RECOMMENDED TECHNOLOGY STACK

### Core Framework
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| React              | 18.3.x    | UI framework with concurrent features     |
| Vite               | 5.3.x     | Build tool — 10× faster than CRA          |
| React Router DOM   | 6.24.x    | Client-side routing with data loaders     |

### Styling
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| CSS Custom Props   | Native    | Design tokens, theming, dark mode         |
| CSS Modules        | Built-in  | Component-scoped styles                   |
| PostCSS + Autoprefixer | Latest | Cross-browser CSS                        |

### Animation
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| GSAP               | 3.12.x    | Hero animations, ScrollTrigger, parallax  |
| @gsap/react        | 2.1.x     | React-aware GSAP hooks                    |
| CSS Animations     | Native    | Micro-interactions, reveals, transitions  |

### State Management
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| React Context API  | Built-in  | Global: cart, wishlist, currency, theme   |
| useState/useReducer| Built-in  | Component-local state                     |

### CMS (Headless)
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| Sanity Studio      | v3        | Products, blogs, testimonials, services   |
| @sanity/client     | 6.x       | API queries (GROQ)                        |

### SEO & Performance
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| react-helmet-async | 1.3.x     | Dynamic meta tags per page                |
| vite-plugin-sitemap| latest    | Auto XML sitemap generation               |
| Web Vitals         | 3.x       | Core Web Vitals tracking                  |

### Payment & Analytics
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| Razorpay SDK       | 1.x       | INR payments, UPI, cards                  |
| Stripe             | 3.x       | International USD/card payments           |
| Google Analytics 4 | gtag.js   | User behaviour, conversions               |

### Development Tools
| Technology         | Version   | Purpose                                   |
|--------------------|-----------|-------------------------------------------|
| ESLint             | 8.x       | Code quality                              |
| Prettier           | 3.x       | Code formatting                           |
| Vitest             | 1.x       | Unit testing                              |
| Playwright         | 1.x       | E2E testing                               |

---

## 4. FOLDER ORGANISATION (FULL TREE)

```
coastal-retreat/
│
├── index.html                    # Root HTML (Vite) — SEO meta, OG tags, Schema.org
├── vite.config.js                # Vite config — manual chunks, port 3000
├── package.json                  # Dependencies
├── .env.example                  # Environment variable template
├── .gitignore
│
├── public/
│   ├── robots.txt                # Crawl rules
│   ├── sitemap.xml               # XML sitemap
│   ├── manifest.json             # PWA manifest
│   └── favicon.svg               # SVG favicon
│
└── src/
    ├── main.jsx                  # ReactDOM.createRoot entry
    ├── App.jsx                   # Root + BrowserRouter + AppProvider
    │
    ├── styles/
    │   └── globals.css           # CSS design system
    │
    ├── data/
    │   ├── products.js           # 200 products / 15 categories (static/CMS)
    │   └── content.js            # Testimonials, blog, services, nav
    │
    ├── context/
    │   └── AppContext.jsx        # Global state provider
    │
    ├── hooks/
    │   ├── useScrollReveal.jsx
    │   └── useHeaderScroll.jsx
    │
    ├── utils/
    │   └── helpers.jsx
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   ├── Header.css
    │   │   ├── Footer.jsx
    │   │   ├── Footer.css
    │   │   ├── MobileNav.jsx
    │   │   └── MobileNav.css
    │   │
    │   ├── common/
    │   │   ├── CustomCursor.jsx      # Compass SVG cursor
    │   │   ├── CustomCursor.css
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductCard.css
    │   │   ├── QuickViewModal.jsx    # Centered popup
    │   │   ├── QuickViewModal.css
    │   │   ├── EnquiryModal.jsx
    │   │   ├── EnquiryModal.css
    │   │   ├── CookieConsent.jsx
    │   │   ├── CookieConsent.css
    │   │   ├── ThemeSwitcher.jsx
    │   │   ├── ThemeSwitcher.css
    │   │   └── Toast.jsx
    │   │
    │   ├── cart/
    │   │   ├── MiniCart.jsx
    │   │   └── MiniCart.css
    │   │
    │   └── home/
    │       ├── HeroSection.jsx
    │       ├── HeroSection.css
    │       ├── CategoriesSection.jsx
    │       ├── CategoriesSection.css
    │       ├── StatsSection.jsx
    │       ├── BrandsSection.jsx
    │       ├── AboutSection.jsx
    │       ├── WhyUsSection.jsx
    │       ├── TestimonialsSection.jsx
    │       └── HomeSections.css
    │
    └── pages/
        ├── HomePage.jsx
        ├── HomePage.css
        ├── ShopPage.jsx
        ├── ShopPage.css
        ├── ProductDetailPage.jsx
        ├── ProductDetailPage.css
        ├── CheckoutPage.jsx
        ├── CheckoutPage.css
        ├── BlogPage.jsx
        ├── BlogPage.css
        ├── ServicesPage.jsx
        ├── ServicesPage.css
        ├── AboutPage.jsx
        ├── AboutPage.css
        ├── ContactPage.jsx
        ├── ContactPage.css
        └── WishlistPage.jsx
```

---

## 5. ANIMATION STRATEGY

### Tier 1 — CSS Animations (Zero-cost, always on)
Used for: Component entry, hover effects, micro-interactions
```css
/* Scroll reveal — IntersectionObserver triggers .visible */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Staggered delays */
.reveal-delay-1 { transition-delay: 100ms; }
.reveal-delay-2 { transition-delay: 200ms; }
```

### Tier 2 — GSAP + ScrollTrigger (Hero & Key Sections)
```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Hero text animation
gsap.from(".hero__title", {
  y: 80, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.3
});

// Hero background parallax
gsap.to(".hero__bg", {
  yPercent: 35,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
});

// Stats counter animation
gsap.from(".stat-item__value", {
  textContent: 0,
  duration: 2,
  snap: { textContent: 1 },
  scrollTrigger: { trigger: ".stats-section", start: "top 75%" }
});

// Product card stagger
gsap.from(".product-card", {
  y: 40, opacity: 0, stagger: 0.08, duration: 0.6,
  scrollTrigger: { trigger: ".products-grid", start: "top 80%" }
});

// Smooth page transitions
gsap.to(".page-enter", {
  opacity: 1, y: 0, duration: 0.5, ease: "power2.out"
});
```

### Tier 3 — Custom Cursor Animation
```
- Compass SVG: instant position via CSS transform
- Spinning ring: 6s CSS rotation, lerp-smoothed position via rAF
- Glow trail: slowest lerp (t=0.055), radial gradient glow
- Hover state: ring accelerates (1.5s), compass rotates 45°
- Click state: quick scale(0.7) pulse
```

### Animation Performance Rules
1. Only animate `transform` and `opacity` (GPU-composited)
2. Use `will-change: transform` only on actively animating elements
3. `requestAnimationFrame` loop for cursor smoothness
4. ScrollTrigger `scrub: 1` for smooth parallax
5. Respect `prefers-reduced-motion: reduce` — all animations disabled

---

## 6. SEO OPTIMISATION STRATEGY

### Technical SEO
```html
<!-- index.html — Applied globally -->
<title>Coastal Retreat — 200+ Premium Coastal Products</title>
<meta name="description" content="200+ handcrafted products…" />
<link rel="canonical" href="https://www.coastalretreat.in/" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:image" content="…og-image.jpg" />

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Coastal Retreat",
  "offers": { "@type": "AggregateOffer", "offerCount": "200" }
}
</script>
```

### Per-Page SEO (react-helmet-async)
```jsx
import { Helmet } from "react-helmet-async";

// Product Detail Page
<Helmet>
  <title>{product.name} — {product.brand} | Coastal Retreat</title>
  <meta name="description" content={product.description.slice(0, 160)} />
  <script type="application/ld+json">{JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": { "@type": "Brand", "name": product.brand },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.stock ? "InStock" : "OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews
    }
  })}</script>
</Helmet>
```

### SEO Checklist
- ✅ Semantic HTML5 (header, main, nav, article, section, footer)
- ✅ ARIA labels on all interactive elements
- ✅ ALT text on all images
- ✅ robots.txt with allowed/disallowed paths
- ✅ XML sitemap with priority weights
- ✅ Open Graph + Twitter Card meta tags
- ✅ Schema.org: OnlineStore, Product, BreadcrumbList, Review
- ✅ Canonical URLs
- ✅ 404 page with navigation
- ✅ Mobile-first responsive design (Core Web Vitals)
- ✅ Lazy loading images (`loading="lazy"`)
- ✅ Preconnect for Google Fonts
- ✅ PWA manifest.json

### Core Web Vitals Targets
| Metric | Target | Implementation                          |
|--------|--------|-----------------------------------------|
| LCP    | < 2.5s | Hero image preload, code splitting      |
| FID    | < 100ms| React concurrent, debounced handlers    |
| CLS    | < 0.1  | Explicit image dimensions, font loading |
| FCP    | < 1.8s | Vite code splitting, asset compression  |

---

## 7. CMS INTEGRATION STRATEGY

### Chosen CMS: Sanity v3 (Headless)

**Why Sanity:**
- Real-time collaborative editing
- GROQ query language (more powerful than GraphQL for this use case)
- Image transformations via CDN (crop, resize, WebP auto-conversion)
- Free tier sufficient for this project

### Setup
```bash
# Install Sanity Studio
npm create sanity@latest -- --template clean --project coastal-retreat

# Install client in React project
npm install @sanity/client @sanity/image-url
```

### Sanity Schema (Content Types)
```js
// schemas/product.js
export default {
  name: 'product', type: 'document',
  fields: [
    { name: 'name',        type: 'string'  },
    { name: 'brand',       type: 'string'  },
    { name: 'category',    type: 'string'  },
    { name: 'price',       type: 'number'  },
    { name: 'usdPrice',    type: 'number'  },
    { name: 'image',       type: 'image',  options: { hotspot: true } },
    { name: 'images',      type: 'array',  of: [{ type: 'image' }] },
    { name: 'rating',      type: 'number'  },
    { name: 'reviews',     type: 'number'  },
    { name: 'stock',       type: 'boolean' },
    { name: 'tag',         type: 'string'  },
    { name: 'description', type: 'text'    },
    { name: 'ingredients', type: 'array',  of: [{ type: 'string' }] },
    { name: 'sizes',       type: 'array',  of: [{ type: 'string' }] },
    { name: 'colors',      type: 'array',  of: [{ type: 'string' }] },
  ]
}

// schemas/blog.js, schemas/testimonial.js, schemas/service.js (similar)
```

### GROQ Queries
```js
// src/lib/sanity.js
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = source => builder.image(source);

// Fetch all products
export const getProducts = () =>
  client.fetch(`*[_type == "product"] | order(name asc) {
    _id, name, brand, category, price, usdPrice,
    "image": image.asset->url,
    rating, reviews, stock, tag, description, ingredients, sizes, colors
  }`);

// Fetch single product
export const getProduct = id =>
  client.fetch(`*[_type == "product" && _id == $id][0]`, { id });

// Fetch blog posts
export const getBlogPosts = () =>
  client.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id, title, category, publishedAt, readTime,
    "image": mainImage.asset->url,
    excerpt, featured
  }`);
```

### Data Flow with CMS
```
Sanity Studio (Editor)
         ↓ (GROQ query via CDN)
  @sanity/client (React)
         ↓
  React Context (AppContext)
         ↓
  Components (ProductCard, ShopPage, etc.)
```

---

## 8. PERFORMANCE OPTIMISATION TECHNIQUES

### Build Optimisation (Vite)
```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          gsap:   ['gsap'],
          sanity: ['@sanity/client', '@sanity/image-url'],
        }
      }
    }
  }
});
```

### Image Optimisation
```jsx
// Lazy load all product images
<img src={product.image} alt={product.name} loading="lazy" />

// Sanity: auto WebP + resize
const imgUrl = urlFor(product.image).width(500).format('webp').url();

// Hero: explicit preload in index.html
<link rel="preload" as="image" href="/hero-bg.webp" />
```

### Code Splitting
```jsx
// Lazy-load heavy pages
import { lazy, Suspense } from 'react';
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const BlogPage          = lazy(() => import('./pages/BlogPage'));

<Suspense fallback={<div>Loading...</div>}>
  <Route path="/product/:id" element={<ProductDetailPage />} />
</Suspense>
```

### React Optimisations
```jsx
// Memoize expensive computations
const filteredProducts = useMemo(() =>
  PRODUCTS.filter(p => { /* filter logic */ }),
  [category, brand, priceMax, searchQ]
);

// Memoize callbacks
const addToCart = useCallback((product, qty) => { /* ... */ }, []);

// Virtualise long product lists (react-window)
import { FixedSizeList } from 'react-window';
```

### Font Loading
```html
<!-- Preconnect + preload critical fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=..." />
```

---

## 9. COLOUR PALETTE & DESIGN TOKENS

| Token         | Value     | Usage                                        |
|---------------|-----------|----------------------------------------------|
| `--deep`      | `#335765` | Primary CTAs, header, interactive elements   |
| `--mid`       | `#74A8A4` | Accents, hover borders, badges               |
| `--light`     | `#B6D9E0` | Background tints, category cards, tags       |
| `--sage`      | `#DBE2DC` | Borders, subtle fills, alt backgrounds       |
| `--terra`     | `#7F543D` | Prices, secondary CTAs, cursor N-needle      |
| `--off-white` | `#F4F8F8` | Page background                              |
| `--dark`      | `#1A2E35` | Body text, headings                          |
| `--muted`     | `#5A7A82` | Secondary text, labels, placeholders         |

---

## 10. PRODUCT CATEGORIES (200 Products / 15 Categories)

| Category       | Products | ID Range  | Brand(s)                          |
|----------------|----------|-----------|-----------------------------------|
| Bath & Body    | 14       | 1–14      | OceanCraft, PureCoast, AquaLux    |
| Skincare       | 14       | 15–28     | PureCoast, MarineGlow, AquaLux    |
| Home Décor     | 14       | 29–42     | SeaBreeze Co, TideHome            |
| Sports & Surf  | 14       | 43–56     | WaveRider, SaltAir                |
| Jewellery      | 14       | 57–70     | CoralBay, DeepBlue                |
| Hair Care      | 14       | 71–84     | SaltAir, AquaLux, MarineGlow      |
| Accessories    | 14       | 85–98     | TideHome, CoralBay, SaltAir       |
| Wellness       | 14       | 99–112    | CoralBay, SeaBreeze Co, PureCoast |
| Fragrance      | 14       | 113–126   | AquaLux, DeepBlue, SaltAir        |
| Clothing       | 14       | 127–140   | TideHome, CoralBay, WaveRider     |
| Groceries      | 14       | 141–154   | HarvestCo, PureCoast              |
| Cosmetics      | 14       | 155–168   | GlowLab                           |
| Electronics    | 14       | 169–182   | TechWave                          |
| Footwear       | 14       | 183–196   | StepCoast, WaveRider              |
| Arrangements   | 4        | 197–200   | BloomAtelier                      |

---

*Coastal Retreat v2.0 — Built with 🌊 for the ocean*
*Architecture by Claude Sonnet 4.6 | March 2025*
