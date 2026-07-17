# YoGo Ventures — B2B Marketplace Website

React 18 + Vite 5 quotation-based B2B marketplace for premium Fashion, Memory Foam Products, Copper Utensils, and Indian Handicrafts.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Overview

| Property        | Detail                                      |
|-----------------|---------------------------------------------|
| Framework       | React 18 + Vite 5                           |
| Routing         | React Router DOM v6                         |
| Styling         | CSS Custom Properties + Component CSS       |
| Animation       | GSAP + ScrollTrigger                        |
| State           | React Context API                           |
| Backend API     | REST API via Axios (`src/utils/Api.js`)     |
| Analytics       | Google Analytics 4 + Google Tag Manager     |
| SEO             | Custom `useSEO` hook + JSON-LD schemas      |
| Deployment      | Docker + nginx (static SPA)                 |

---

## Navigation Structure

| Route            | Page                  | Description                              |
|------------------|-----------------------|------------------------------------------|
| `/`              | Home                  | Hero, categories, best sellers, FAQ      |
| `/shop`          | Shop                  | Product catalogue with sidebar filters   |
| `/product/:id`   | Product Detail        | Images, description, get quote           |
| `/checkout`      | Checkout              | Enquiry cart summary                     |
| `/services`      | Services              | Sourcing, private label, bulk orders     |
| `/contact`       | Contact               | Enquiry form + business info             |
| `/wishlist`      | Wishlist              | Saved products                           |
| `/PrivacyPolicy` | Privacy Policy        | Data protection policy                   |
| `/TermOfuse`     | Terms & Conditions    | Terms of use                             |

---

## Product Categories

| Category             | Description                                    |
|----------------------|------------------------------------------------|
| Apparel              | Polo shirts, round-neck tees, hoodies          |
| Memory Foam Products | Pillows, car neck rest, wedge, contour cushions|
| Copper Utensils      | Bottles, cups, thali sets, kitchenware         |
| Handicraft Items     | Home decor, blue pottery, tote bags, etc.      |

---

## Folder Structure

```
Yogo-Ventures-Website/
├── index.html                  ← Root HTML — SEO meta, JSON-LD schemas, GTM
├── vite.config.js              ← Vite build config with manual chunks
├── package.json
├── Dockerfile                  ← Multi-stage production build
├── nginx.conf                  ← SPA routing + security headers + caching
├── .env.example                ← Environment variable template
├── public/
│   ├── robots.txt              ← Crawl rules
│   ├── sitemap.xml             ← XML sitemap with image extensions
│   ├── manifest.json           ← PWA manifest
│   ├── favicon.png
│   └── [Hero/Logo images]
└── src/
    ├── main.jsx
    ├── App.jsx                 ← Router + layout + global components
    ├── styles/
    │   └── globals.css         ← Design system, CSS vars, animations
    ├── data/
    │   └── content.js          ← Testimonials, blog posts, nav links, stats
    ├── context/
    │   └── AppContext.jsx      ← Cart, wishlist, toast, recently viewed
    ├── hooks/
    │   ├── useSEO.js           ← Dynamic per-page meta + JSON-LD injection
    │   ├── useScrollReveal.jsx
    │   ├── useHeaderScroll.jsx
    │   ├── useProducts.jsx     ← Product data from backend API
    │   └── useCategories.jsx   ← Category data from backend API
    ├── utils/
    │   ├── Api.js              ← Axios instance with base URL from env
    │   ├── analytics.js        ← GTM dataLayer + GA4 event helpers
    │   └── imageUrl.js         ← Backend storage image URL builder
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx + .css
    │   │   └── Footer.jsx + .css
    │   ├── common/
    │   │   ├── BottomNav.jsx + .css
    │   │   ├── MiniCart related
    │   │   ├── ScrollUp.jsx
    │   │   ├── Toast.jsx
    │   │   ├── SiteLoader.jsx
    │   │   └── ParticlesBackground.jsx
    │   ├── cart/
    │   │   └── MiniCart.jsx + .css
    │   └── home/
    │       ├── HeroSection.jsx + .css
    │       ├── CategoriesSection.jsx + .css
    │       ├── WhyUsSection.jsx
    │       ├── TestimonialsSection.jsx
    │       ├── FAQSection.jsx + .css
    │       ├── EnquirySection.jsx + .css
    │       └── HomeSections.css
    └── pages/
        ├── HomePage.jsx + .css
        ├── ShopPage.jsx + .css
        ├── ProductDetailPage.jsx + .css
        ├── CheckoutPage.jsx + .css
        ├── ServicesPage.jsx + .css
        ├── ContactPage.jsx + .css
        ├── WishlistPage.jsx
        ├── PrivacyPolicy.jsx + .css
        └── TermOfuse.jsx + .css
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

See `.env.example` for all required variables. Never commit `.env` to version control.

---

## Docker Deployment

```bash
# Build production image
docker build -t yogo-ventures-website .

# Run container
docker run -d \
  --name yogo-ventures-website \
  --restart unless-stopped \
  -p 80:80 \
  yogo-ventures-website
```

The Dockerfile uses a multi-stage build:
- **Stage 1** — `node:20-alpine` installs dependencies and runs `vite build`
- **Stage 2** — `nginx:alpine` serves the static `dist/` output

---

## SEO Features

- Per-page dynamic `<title>`, meta description, canonical, and Open Graph via `useSEO` hook
- JSON-LD schemas: `Organization`, `WebSite`, `SiteNavigationElement`, `BreadcrumbList`, `LocalBusiness`, `Product`, `CollectionPage`, `FAQPage`, `Service`
- XML sitemap with image extensions submitted to Google Search Console
- Structured robots.txt with bot-specific rules
- Google Analytics 4 (`G-4Q0TFQRYTP`) + Google Tag Manager (`GTM-WRGXG2HH`)
- Full GTM event tracking: page views, scroll depth, leads, product views, search, wishlist, add-to-cart

---

## Analytics Events

All events are in `src/utils/analytics.js`:

| Event              | Trigger                              |
|--------------------|--------------------------------------|
| `page_view`        | Every route change                   |
| `scroll`           | 25 / 50 / 75 / 90 / 100% depth       |
| `generate_lead`    | Contact form + enquiry form submit   |
| `request_quote`    | Get Quote button click               |
| `add_to_cart`      | Add to enquiry cart                  |
| `view_item`        | Product detail page load             |
| `view_item_list`   | Category / shop page load            |
| `search`           | Search query submitted               |
| `add_to_wishlist`  | Wishlist toggle                      |
| `phone_click`      | Phone number link click              |
| `email_click`      | Email link click                     |
| `whatsapp_click`   | WhatsApp link click                  |
| `faq_open`         | FAQ accordion opened                 |

---

## Design System

**Brand Palette:**

| Token         | Value     | Usage                                    |
|---------------|-----------|------------------------------------------|
| `--deep`      | `#335765` | Primary CTAs, header, links              |
| `--mid`       | `#74A8A4` | Accents, hover states, badges            |
| `--light`     | `#B6D9E0` | Background tints, tags                   |
| `--sage`      | `#DBE2DC` | Borders, subtle fills                    |
| `--terra`     | `#7F543D` | Secondary CTAs, accent highlights        |
| `--off-white` | `#F4F8F8` | Page background                          |
| `--dark`      | `#1A2E35` | Body text, headings                      |
| `--muted`     | `#5A7A82` | Secondary text, placeholders             |

**Fonts:** Cormorant Garamond (display/serif) + DM Sans (body/UI)

---

*Yogo Ventures Website v2.0*
