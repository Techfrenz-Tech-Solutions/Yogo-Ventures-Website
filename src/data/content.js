// src/data/content.js — Yogo Ventures Content

export const TESTIMONIALS = [
  { id:1,  name:"Michael Turner", role:"USA", text:"The apparel were delivered exactly as promised. The fabric quality, stitching, and finishing were excellent. We look forward to a long-term partnership.",avatar:"MT"},
  { id:2,  name:"Sofia Martinez", role:"Spain", text:"Very professional team with great communication throughout the order process. The bulk shipment arrived on time, and the customization was done perfectly. Highly reliable supplier.", avatar:"SM"},
  { id:3,  name:"Ahmed Al-Farsi", role:"UAE", text:"The copper utensils exceeded our expectations in both craftsmanship and finish. The products were packed securely, and the shine and quality impressed our retail customers.", avatar:"AA"},
  { id:4,  name:"Emily Carter",   role:"Australia", text:"We were looking for authentic handcrafted copper products and this supplier delivered beautifully. The quality is premium, and the service was smooth from inquiry to shipment.", avatar:"EC"},
  { id:5,  name:"Liam Johnson",   role:"UK", text:"I own a Home Decor Store, The blue pottery pieces are stunning. The colors, detailing, and traditional craftsmanship make each item unique. Our customers loved the collection.",avatar:"LJ" },
  { id:6,  name:"Fatima Noor",    role:"Qatar", text:"Exceptional artistry and safe packaging. Every piece arrived in perfect condition. The supplier was responsive and ensured timely delivery. Truly satisfied with the experience.", avatar:"FN",},
];

import TeeImg from "../Assets/Blogs/Article1.png";
import FoamImg from "../Assets/Blogs/Article2.png";
import CopperImg from "../Assets/Blogs/Article3.png";
import HandicraftImg from "../Assets/Blogs/Article4.png";

export const BLOG_POSTS = [
  {
    id: 3,
    title: "The Everyday Essential Apparel",
    category: "Apparel",
    date: "Feb 28, 2026",
    readTime: "4 min",
    image: TeeImg,   // ✅ use local image
    excerpt:
      "Meet your new favorite apparel. Crafted from 100% premium combed cotton, this apparel offers unparalleled softness and a lightweight feel that lasts all day. Featuring a classic crew neck and a tailored fit, it’s designed to be the versatile cornerstone of your wardrobe. Whether layered or worn alone, it promises effortless style.",
    featured: true,
  },
  {
    id: 2,
    title: "The Ultimate Memory Foam Experience",
    category: "Memory Foam Products",
    date: "Mar 10, 2026",
    readTime: "5 min",
    image: FoamImg,   // ✅ use local image
    excerpt:
      "Experience the perfect intersection of science and serenity. Engineered with advanced viscoelastic technology, our memory foam doesn’t just support your body—it understands it. By reacting to your natural body heat and unique silhouette, the foam creates a personalized cradle that eliminates painful pressure points and aligns your spine instantly.",
    featured: true,
  },
  {
    id: 1,
    title: "Ancient Wisdom, Modern Wellness: The Healing Power of Copper",
    category: "Copper Utensils",
    date: "Feb 20, 2026",
    readTime: "5 min",
    image: CopperImg,  // ✅ use local image
    excerpt:
      "Return to a more mindful way of living. For centuries, copper has been revered in Ayurvedic tradition for its natural oligodynamic properties—effectively neutralizing bacteria on contact. Using pure copper utensils isn't just a style choice; it’s an investment in a cleaner, more holistic lifestyle. Infuse your daily routine with a metal that’s as beneficial to your well-being as it is beautiful to behold.",
    featured: false,
  },
  {
    id: 4,
    title: "Consciously Crafted: Beauty That Honors the Earth",
    category: "Handicraft Items",
    date: "Feb 14, 2026",
    readTime: "5 min",
    image: HandicraftImg, // ✅ use local image
    excerpt:
      "In a world of disposable fast-fashion and plastic waste, choose the beauty of the Slow Movement. Our handicrafts are made using locally sourced, natural materials and eco-friendly processes that respect the environment. By bypassing massive factory floors, these items carry a significantly lower carbon footprint and support the livelihoods of independent makers in small communities. Decorate your life with a clear conscience, knowing your purchase supports fair wages and sustainable artistry.",
    featured: false,
  },
];

export const SERVICES = [
  { id:1, icon:"🎁", title:"Custom Gift Hampers",           desc:"Curated gift boxes featuring handicrafts, copper items, and premium products — perfect for corporate gifting, weddings, and festivals." },
  { id:2, icon:"🚚", title:"Pan-India Express Delivery",    desc:"We deliver to all 28 states and 8 union territories. Orders above ₹999 qualify for free delivery with full tracking." },
  { id:3, icon:"🤝", title:"Artisan Partnership Programme", desc:"We partner directly with artisans and self-help groups across Tamil Nadu to ensure fair wages and authentic craftsmanship." },
  { id:4, icon:"↩️", title:"Hassle-Free Returns",           desc:"30-day no-questions return policy. If you're not 100% satisfied, we'll refund or replace — no paperwork, no fuss." },
  { id:5, icon:"📦", title:"Bulk & Wholesale Orders",       desc:"Special pricing for bulk orders of handicrafts, copper utensils, and apparel. Ideal for retailers, corporates, and NGOs." },
  { id:6, icon:"🎓", title:"Product Authenticity Guarantee",desc:"Every handicraft and copper product comes with a certificate of authenticity verifying the artisan's origin and craft tradition." },
];

export const WHY_US = [
  { icon:"🏺", title:"Authentic Indian Craftsmanship",  desc:"Every product is handpicked from verified artisans. We guarantee 100% authentic handcrafted items sourced directly from the makers." },
  { icon:"⚡", title:"Fast & Reliable Delivery",         desc:"Pan-India delivery with same-day dispatch on orders placed before 2 PM. Real-time tracking on every shipment." },
  { icon:"✅", title:"Quality Certified Products",       desc:"All products pass strict quality checks. Copper items are certified food-safe; memory foam meets ISI standards; fabrics are OEKO-TEX certified." },
  { icon:"💰", title:"Best Price Guarantee",             desc:"We work directly with artisans and manufacturers — no middlemen, no markup. If you find it cheaper, we'll match the price." },
  { icon:"🌱", title:"Supporting Local Communities",     desc:"Purchasing from Yogo Ventures directly empowers artisan families and self-help groups across rural Tamil Nadu and India." },
  { icon:"🛡️", title:"Secure & Trusted Shopping",        desc:"100% secure payments, encrypted checkout, 30-day returns, and a dedicated customer support team available 7 days a week." },
];

export const STATS = [
  { value:"5+",   label:"Years in Business" },
  { value:"25K+", label:"Happy Customers" },
  { value:"50+",  label:"Artisan Partners" },
  { value:"500+", label:"Products" },
];

export const NAV_LINKS = [
  { label:"Home",     path:"/" },
  { label:"Shop",     path:"/shop" },
  { label:"Services", path:"/services" },
  { label:"Contact",  path:"/contact" },
];

export const THEMES = [
  { name:"Deep Teal",  color:"#335765" },
  { name:"Terracotta", color:"#7F543D" },
  { name:"Forest",     color:"#2D5016" },
  { name:"Plum",       color:"#4A2545" },
  { name:"Navy",       color:"#1A4A6B" },
];

export const TRUSTED_BRANDS = [
  { name:"Craftsvilla",   logo:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&q=80" },
  { name:"FabIndia",      logo:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=120&q=80" },
  { name:"Jaypore",       logo:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120&q=80" },
  { name:"Amala Earth",   logo:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&q=80" },
  { name:"Desi Krafts",   logo:"https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=120&q=80" },
  { name:"iTokri",        logo:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=120&q=80" },
  { name:"Tana Bana",     logo:"https://images.unsplash.com/photo-1549989476-69a92fa57c36?w=120&q=80" },
  { name:"Okhai",         logo:"https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=120&q=80" },
  { name:"CopperKing",    logo:"https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&q=80" },
  { name:"SleepWell",     logo:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=120&q=80" },
];
