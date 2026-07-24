/**
 * useProducts.js — Yogo Ventures
 *
 * Returns the shared product list from AppContext.
 * Products are fetched ONCE at app startup in AppContext and shared
 * across every component — no duplicate network calls.
 *
 * Previously each component that called useProducts() triggered its
 * own independent API request, which meant:
 *   - WishlistPage had an empty list until its own fetch completed
 *   - Header search, ShopPage, ProductDetailPage, WishlistPage all
 *     made separate /product/productlist calls
 *
 * Now all components read from the same cached list.
 */
import { useApp } from "../context/AppContext";

export function useProducts() {
  const { products, productsLoading } = useApp();
  return { products, loading: productsLoading };
}
