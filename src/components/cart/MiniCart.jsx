// src/components/cart/MiniCart.jsx
// IMAGE FIX for apparel:
//
// Root cause: item.image on apparel cart entries is correctly set by
// buildCartProductWithImage() in ProductDetailPage to slides[slideIndex].image.
// However if the slide product's .image field is undefined/null (e.g. the
// product data uses .images[0] instead of .image as the primary field),
// item.image ends up empty and the mini-cart shows a broken image.
//
// Fix: getItemImage() now walks a thorough fallback chain for apparel:
//   1. item.image            ← pinned variation thumbnail (primary)
//   2. item.images?.[0]      ← first entry in gallery array
//   3. item.variant?.image   ← image stored on the variant object
//   4. colorCustomization[0].image  ← per-colour swatch image
//   5. item.variants?.[0]?.image    ← first entry in variants array
// For non-apparel the chain is the same but shorter (item.image only,
// same as original).
//
// No design or structure changes — only getItemImage() is updated.

import { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import "./MiniCart.css";

/* ─────────────────── helpers ─────────────────────────────────────────────*/
function getRawColors(item) {
  return item.colorCustomization?.length > 0
    ? item.colorCustomization
    : item.variant?.colorCustomization ?? [];
}

function isApparel(item) {
  return getRawColors(item).length > 0;
}

/**
 * Returns the thumbnail URL to display in the mini-cart row.
 *
 * APPAREL (Polo / Round Neck / Hoodies):
 *   Walks the following chain, returning the first truthy value:
 *     1. item.image           — pinned by buildCartProductWithImage() in
 *                               ProductDetailPage to slides[slideIndex].image,
 *                               the exact URL rendered in the PDP thumb strip.
 *     2. item.images?.[0]     — first entry in the stored gallery array;
 *                               covers products where .image is absent but
 *                               .images[] is populated.
 *     3. item.variant?.image  — image stored directly on the variant object,
 *                               used by some product data shapes.
 *     4. colors[0]?.image     — first colour-swatch image as last resort.
 *     5. item.variants?.[0]?.image — first entry in a variants array.
 *
 * NON-APPAREL:
 *   Always item.image — unchanged from original behaviour.
 */
function getItemImage(item) {
  if (isApparel(item)) {
    const colors = getRawColors(item);
    return (
      item.image                      // ← PRIMARY: pinned variation thumbnail
      ?? item.images?.[0]             // ← gallery array fallback
      ?? item.variant?.image          // ← variant-level image fallback
      ?? colors[0]?.image             // ← colour swatch image fallback
      ?? item.variants?.[0]?.image    // ← variants array fallback
    );
  }
  return item.image;
}

/* ─────────────────── Per-item quantity input (non-apparel) ───────────────*/
function CartItemQty({ item, updateQty }) {
  const [inputVal, setInputVal] = useState(String(item.qty));
  const ctxQty = item.qty;

  const handleChange = useCallback((e) => setInputVal(e.target.value), []);

  const commit = useCallback(() => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      const delta = parsed - ctxQty;
      if (delta !== 0) updateQty(item.cartKey, delta);
      setInputVal(String(parsed));
    } else {
      setInputVal(String(ctxQty));
    }
  }, [inputVal, ctxQty, item.cartKey, updateQty]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") e.target.blur();
  }, []);

  return (
    <div className="cart-item__qty">
      <input
        type="number"
        className="cart-item__qty-input cart-item__qty-input--normal"
        value={inputVal}
        min={1}
        aria-label={`Quantity for ${item.name}`}
        onChange={handleChange}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

/* ─────────────────── Apparel color list (self-contained) ─────────────────
 * Owns a local copy of colors so every remove / qty edit re-renders
 * the total immediately. Pushes the final state up via onColorsChange.
 */
function ApparelColors({ item, onColorsChange, onRemoveItem }) {
  const [colors, setColors] = useState(() => getRawColors(item));

  // If the cart item is replaced from outside (e.g. page refresh), re-sync
  useEffect(() => {
    setColors(getRawColors(item));
  }, [item.cartKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalQty = colors.reduce((sum, c) => sum + c.quantity, 0);

  function handleQtyChange(idx, raw) {
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1) return;
    const updated = colors.map((c, i) => (i === idx ? { ...c, quantity: parsed } : c));
    setColors(updated);
    onColorsChange(updated);
  }

  function handleRemove(idx) {
    if (colors.length <= 1) {
      onRemoveItem();
      return;
    }
    const updated = colors.filter((_, i) => i !== idx);
    setColors(updated);
    onColorsChange(updated);
  }

  return (
    <div className="cart-item__colors">
      {colors.map((color, idx) => (
        <ColorRow
          key={`${color.hex}-${idx}`}
          color={color}
          onQtyChange={(raw) => handleQtyChange(idx, raw)}
          onRemove={() => handleRemove(idx)}
        />
      ))}
      {/* Read-only total */}
      <div className="cart-color-total">
        <span className="cart-color-total__label">Total qty</span>
        <span className="cart-color-total__value">{totalQty}</span>
      </div>
    </div>
  );
}

/* ─────────────────── Single color row ────────────────────────────────────*/
function ColorRow({ color, onQtyChange, onRemove }) {
  const [inputVal, setInputVal] = useState(String(color.quantity));

  // Sync if parent resets color (e.g. after external cart update)
  useEffect(() => {
    setInputVal(String(color.quantity));
  }, [color.quantity]);

  const commit = useCallback(() => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      onQtyChange(parsed);
    } else {
      setInputVal(String(color.quantity));
    }
  }, [inputVal, color.quantity, onQtyChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") e.target.blur();
  }, []);

  return (
    <div className="cart-color-item">
      <span
        className="cart-color-dot"
        style={{ backgroundColor: color.hex }}
        title={color.name}
      />
      <span className="cart-color-name">{color.name}</span>
      <span className="cart-color-hex">({color.hex.toUpperCase()})</span>

      <div className="cart-item__qty cart-color-qty-wrap">
        <input
          type="number"
          className="cart-item__qty-input"
          value={inputVal}
          min={1}
          aria-label={`Quantity for color ${color.name}`}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        className="cart-color-remove"
        onClick={onRemove}
        aria-label={`Remove ${color.name}`}
        title="Remove this color"
      >✕</button>
    </div>
  );
}

/* ─────────────────── MiniCart ────────────────────────────────────────────*/
export default function MiniCart() {
  const {
    cart, cartOpen, setCartOpen,
    removeFromCart, updateQty, updateCartItem, cartCount,
    themeColor,
  } = useApp();

  const navigate = useNavigate();

  if (!cartOpen) return null;

  function handleEnquiry() {
    setCartOpen(false);
    navigate("/checkout");
  }

  /* Push updated color array back into context/cart */
  function handleColorsChange(item, updatedColors) {
    const newTotalQty = updatedColors.reduce((sum, c) => sum + c.quantity, 0);
    const updatedItem = {
      ...item,
      qty: newTotalQty,
      colorCustomization: updatedColors,
      ...(item.variant && {
        variant: { ...item.variant, colorCustomization: updatedColors },
      }),
    };
    if (updateCartItem) updateCartItem(item.cartKey, updatedItem);
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        className="overlay"
        onClick={() => setCartOpen(false)}
        role="button"
        aria-label="Close cart"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setCartOpen(false)}
      />

      {/* PANEL */}
      <aside className="mini-cart" aria-label="Shopping cart" role="complementary">
        <header className="mini-cart__header">
          <h2 className="mini-cart__title">
            Your Cart
            {cartCount > 0 && (
              <span className="mini-cart__count">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>
            )}
          </h2>
          <button className="close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </header>

        <div className="mini-cart__body">
          {cart.length === 0 ? (
            <div className="mini-cart__empty">
              <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="var(--border)"
                strokeWidth="1.5" style={{ display: "block", margin: "0 auto" }}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <h3 className="mini-cart__empty-title">Your cart is empty</h3>
              <p className="mini-cart__empty-text">
                Discover Our Apparel, Memory Foam Products, Copper Utensils, Authentic Handicrafts and More.
              </p>
              <Link
                to="/shop"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: "20px", textDecoration: "none" }}
                onClick={() => setCartOpen(false)}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="mini-cart__items">
              {cart.map(item => {
                const imgSrc = getItemImage(item);
                return (
                  <li key={item.cartKey} className="cart-item">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="cart-item__img"
                        loading="lazy"
                        onError={e => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      /* Placeholder shown when no image URL is available at all */
                      <div className="cart-item__img cart-item__img--placeholder" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none"
                          stroke="var(--border)" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}

                    <div className="cart-item__details">
                      <p className="cart-item__name">{item.name}</p>

                      {/* ── APPAREL: per-color rows with live total ── */}
                      {isApparel(item) && (
                        <ApparelColors
                          item={item}
                          onColorsChange={(updatedColors) => handleColorsChange(item, updatedColors)}
                          onRemoveItem={() => removeFromCart(item.cartKey)}
                        />
                      )}

                      {/* ── NON-APPAREL: normal editable qty ── */}
                      {!isApparel(item) && (
                        <div className="cart-item__controls">
                          <CartItemQty item={item} updateQty={updateQty} />
                        </div>
                      )}
                    </div>

                    {/* Remove whole item */}
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.cartKey)}
                      aria-label={`Remove ${item.name} from cart`}
                    >✕</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <footer className="mini-cart__footer">
            <p className="mini-cart__note">
              Contact us for pricing — enquiries welcome for bulk orders
            </p>
            <button
              type="button"
              className="mini-cart__enquiry-btn"
              onClick={handleEnquiry}
              style={{ backgroundColor: themeColor }}
            >
              Proceed to Enquiry →
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}