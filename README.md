# 🌊 Coastal Retreat — Premium eCommerce Platform v2.0 (Vite)

React 18 + Vite 5 eCommerce website with 100 products, aesthetic category cards, premium footer, and perfectly centered product popups.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ✅ What's New in v2.0

| Feature | Details |
|---|---|
| **100 Products** | 10 products × 10 categories (Bath, Skincare, Home Décor, Sports, Jewellery, Hair, Accessories, Wellness, Fragrance, Clothing) |
| **Aesthetic Category Cards** | Full photo-backed cards with hover zoom, gradient overlay, colour-coded accents, animated arrows |
| **Premium Footer** | Newsletter strip, social icons, trust badges, contact info, SVG wave divider, payment method pills |
| **Centered Popup** | QuickView modal uses `display:flex + align/justify: center` — perfectly centred on all screen sizes. Mobile: slides up from bottom |
| **Vite 5** | Replaced Create React App — instant HMR, 10× faster builds, native ESM |

## 📁 Folder Structure

```
coastal-retreat/
├── index.html              ← Root HTML (Vite style, with SEO meta + Schema.org)
├── vite.config.js          ← Vite config with manual chunks
├── package.json            ← React 18 + Vite 5 deps
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx            ← Entry point (ReactDOM.createRoot)
    ├── App.js              ← Router + layout + global modals
    ├── styles/
    │   └── globals.css     ← Design system, CSS vars, animations
    ├── data/
    │   ├── products.js     ← 100 products across 10 categories
    │   └── content.js      ← Testimonials, blog, services, stats
    ├── context/
    │   └── AppContext.js   ← Cart, wishlist, currency, theme
    ├── hooks/
    │   ├── useScrollReveal.js
    │   └── useHeaderScroll.js
    ├── utils/
    │   └── helpers.js
    ├── components/
    │   ├── layout/
    │   │   ├── Header.js + Header.css
    │   │   ├── Footer.js + Footer.css    ← ✨ Premium redesign
    │   │   └── MobileNav.js + MobileNav.css
    │   ├── common/
    │   │   ├── ProductCard.js + ProductCard.css
    │   │   ├── QuickViewModal.js + QuickViewModal.css  ← ✨ Centered popup
    │   │   ├── EnquiryModal.js + EnquiryModal.css
    │   │   ├── CookieConsent.js + CookieConsent.css
    │   │   ├── ThemeSwitcher.js + ThemeSwitcher.css
    │   │   ├── Toast.js
    │   │   └── CustomCursor.js + CustomCursor.css
    │   ├── cart/
    │   │   └── MiniCart.js + MiniCart.css
    │   └── home/
    │       ├── HeroSection.js + HeroSection.css
    │       ├── CategoriesSection.js + CategoriesSection.css  ← ✨ Aesthetic cards
    │       ├── StatsSection.js
    │       ├── BrandsSection.js
    │       ├── AboutSection.js
    │       ├── WhyUsSection.js
    │       ├── TestimonialsSection.js
    │       └── HomeSections.css
    └── pages/
        ├── HomePage.js + HomePage.css
        ├── ShopPage.js + ShopPage.css       ← Sidebar + 100 products
        ├── ProductDetailPage.js + .css
        ├── CheckoutPage.js + .css
        ├── BlogPage.js + .css
        ├── ServicesPage.js + .css
        ├── AboutPage.js + .css
        ├── ContactPage.js + .css
        └── WishlistPage.js
```

## 🎨 Design System

**Palette:** `#335765` (Deep) · `#74A8A4` (Mid) · `#B6D9E0` (Light) · `#DBE2DC` (Sage) · `#7F543D` (Terra)

**Fonts:** Cormorant Garamond (serif/display) + DM Sans (body)

## 🔌 CMS Integration (Sanity)
```bash
npm install @sanity/client
```
Replace `src/data/products.js` static array with a Sanity GROQ query.

## 💳 Payment (Razorpay)
Replace `handleSubmit` in `CheckoutPage.js` with the Razorpay SDK order flow.

---
*Made with 🌊 for the ocean · Coastal Retreat v2.0*
