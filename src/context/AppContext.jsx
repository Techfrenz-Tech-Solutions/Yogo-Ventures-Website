// src/context/AppContext.js
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { VALID_PRODUCTS } from "../data/products";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── State ──────────────────────────────────────────────

  const [currency,     setCurrency]     = useState("INR");
  const [cartOpen,     setCartOpen]     = useState(false);
  const [toast,        setToast]        = useState(null);

  // ── Recently viewed — persisted to localStorage ──────────────
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem("yogo_recently_viewed");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed)
        ? parsed.filter(p => p && p.id && VALID_PRODUCTS.some(vp => vp.id === p.id))
        : [];
    } catch {
      return [];
    }
  });

  // ── Cart — persisted to localStorage ──────────────────
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("yogo_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("yogo_cart", JSON.stringify(cart));
    } catch {
      // localStorage unavailable — fail silently
    }
  }, [cart]);

  // ── Theme color — persisted to localStorage ───────────
  const [themeColor, setThemeColor] = useState(() => {
    try {
      return localStorage.getItem("yogo_theme") || "#335765";
    } catch {
      return "#335765";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("yogo_theme", themeColor);
    } catch {}
  }, [themeColor]);

  // ── Toast ─────────────────────────────────────────────
  const toastTimerRef = useRef(null);
  const showToast = useCallback(msg => {
    setToast(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2600);
  }, []);

  // ── Cart helpers ───────────────────────────────────────

  /**
   * buildCartKey — stable key per product+variant, excluding colorCustomization.
   *
   * Excluding colorCustomization means all colors of the same apparel
   * variation (same slide) share one cart row. mergeColorToCart handles
   * the per-color merge logic once they share a key.
   */
  const buildCartKey = useCallback((product, variant = {}) => {
    const { colorCustomization: _omit, ...variantWithoutColors } = variant;

    const variantEntries = Object.entries(variantWithoutColors)
      .filter(([, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}:${value.map(v => typeof v === "object" ? JSON.stringify(v) : v).join("|")}`;
        }
        if (typeof value === "object") {
          return `${key}:${JSON.stringify(value)}`;
        }
        return `${key}:${value}`;
      });

    return [product.category, product.subCategory, product.name, ...variantEntries]
      .filter(Boolean)
      .join("|");
  }, []);

  const addToCart = useCallback((product, qty = 1, variant = {}, options = {}) => {
    setCart(prev => {
      const key = buildCartKey(product, variant);
      const existing = prev.find(i => i.cartKey === key);
      if (existing) {
        return prev.map(i => i.cartKey === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty, variant, cartKey: key }];
    });
    if (!options.suppressToast) {
      showToast("Product added to cart");
    }
  }, [buildCartKey, showToast]);

  const removeFromCart = useCallback(cartKey => {
    setCart(prev => prev.filter(i => i.cartKey !== cartKey));
    showToast("Product removed from cart");
  }, [showToast]);

  const updateQty = useCallback((cartKey, delta) => {
    setCart(prev =>
      prev
        .map(i => i.cartKey === cartKey ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Replace a single cart item in-place (used by MiniCart for apparel color edits).
  const updateCartItem = useCallback((cartKey, updatedItem) => {
    setCart(prev =>
      prev.map(i => i.cartKey === cartKey ? { ...i, ...updatedItem } : i)
    );
  }, []);

  // ─────────────────────────────────────────────────────────────
  // mergeColorToCart
  //
  // Called by ProductDetailPage when the user clicks "Add to Cart"
  // on an apparel item. stableKey (built in PDP from the slide's .id)
  // groups all colors of the same variation under one cart row.
  //
  // IMAGE POLICY:
  //   • First add: resolves the best available image from cartProduct
  //     using the same fallback chain as MiniCart's getItemImage():
  //       cartProduct.image → cartProduct.images[0]
  //     This guarantees a non-null thumbnail even when product data
  //     has .image undefined but .images[] populated.
  //   • Subsequent adds (merges): image is NOT overwritten — the
  //     first-added thumbnail is preserved, matching non-apparel
  //     behavior across the entire site.
  // ─────────────────────────────────────────────────────────────
  const mergeColorToCart = useCallback((cartProduct, newColors, stableKey) => {
    setCart(prev => {
      const existing = prev.find(i => i.cartKey === stableKey);

      if (existing) {
        // ── MERGE branch: row exists — update colors + qty only ──
        // image/images are intentionally left untouched so the
        // mini-cart always shows the first-added thumbnail.
        const existingColors = existing.colorCustomization ?? [];
        let merged = [...existingColors];
        for (const nc of newColors) {
          const idx = merged.findIndex(c => c.hex === nc.hex);
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + nc.quantity };
          } else {
            merged = [...merged, nc];
          }
        }
        const newQty = merged.reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0);

        return prev.map(i =>
          i.cartKey === stableKey
            ? {
                ...i,
                // Always update image to the first slide's image (passed via cartProduct)
                image: cartProduct.image ?? i.image,
                qty: newQty,
                colorCustomization: merged,
                variant: { ...i.variant, colorCustomization: merged },
              }
            : i
        );
      }

      // ── FIRST ADD branch: create a fresh cart row ──
      // Resolve the best image available from cartProduct.
      // buildCartProductWithImage() in PDP pins cartProduct.image to
      // slides[slideIndex].image. If that field is undefined (some
      // product shapes only populate .images[]), fall back to images[0].
      const resolvedImage =
        cartProduct.image
        ?? (Array.isArray(cartProduct.images) ? cartProduct.images[0] : undefined);

      const resolvedImages = Array.isArray(cartProduct.images) && cartProduct.images.length > 0
        ? cartProduct.images
        : resolvedImage ? [resolvedImage] : [];

      const totalQty = newColors.reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0);
      return [...prev, {
        ...cartProduct,
        // Guarantee .image is always a valid URL on the stored cart entry
        image:  resolvedImage,
        images: resolvedImages,
        qty: totalQty,
        colorCustomization: newColors,
        variant: { colorCustomization: newColors },
        cartKey: stableKey,
      }];
    });
  }, []);

  // ── Wishlist — persisted to localStorage ──────────────
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("yogo_wishlist");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed.filter(id => VALID_PRODUCTS.some(p => p.id === id)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("yogo_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => {
      const isWishlisted = prev.includes(id);
      const next = isWishlisted ? prev.filter(x => x !== id) : [...prev, id];
      showToast(isWishlisted ? "Product removed from wish list" : "Product added to wish list");
      return next;
    });
  }, [showToast]);

  // ── Recently viewed ───────────────────────────────────
  const addRecentlyViewed = useCallback(product => {
    setRecentlyViewed(prev =>
      [product, ...prev.filter(p => p.id !== product.id)].slice(0, 8)
    );
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("yogo_recently_viewed", JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  // ── Derived ───────────────────────────────────────────
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce(
    (s, i) => s + (currency === "INR" ? i.price : i.usdPrice) * i.qty,
    0
  );

  // ── Theme CSS vars ────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty("--deep", themeColor);
    document.documentElement.style.setProperty("--footer-theme-primary", themeColor);
    document.documentElement.style.setProperty("--footer-theme-primary-hover", themeColor);
  }, [themeColor]);

  // ── Format price ──────────────────────────────────────
  const formatPrice = (inr, usd) =>
    currency === "INR"
      ? `₹${Number(inr).toLocaleString("en-IN")}`
      : `$${Number(usd).toFixed(2)}`;

  return (
    <AppContext.Provider
      value={{
        // Currency
        currency, setCurrency,
        formatPrice,
        // Cart
        cart, addToCart, removeFromCart, updateQty, updateCartItem, mergeColorToCart, clearCart,
        cartCount, cartTotal,
        cartOpen, setCartOpen,
        // Wishlist
        wishlist, toggleWishlist,
        // Toast
        toast, showToast,
        // Theme
        themeColor, setThemeColor,
        // Recently Viewed
        recentlyViewed, addRecentlyViewed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}