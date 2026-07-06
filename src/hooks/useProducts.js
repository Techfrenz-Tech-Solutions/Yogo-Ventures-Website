import { useState, useEffect } from "react";
import Api from "../utils/Api";
import { storageUrl } from "../utils/imageUrl";

// Normalizes a real product_master row into the same field shape the rest of
// the site (cart, wishlist, product cards) already expects: id/name/category/
// subCategory/image/images/description/stock. No price/sizes/colors — the
// backend doesn't model those, so callers should not rely on them.
function normalizeProduct(row) {
  const images = [row.index_image, row.image1, row.image2, row.image3, row.image4, row.image5]
    .filter(Boolean)
    .map(storageUrl);

  return {
    id: row.id,
    code: row.product_code,
    name: row.product_name,
    category: row.category_name,
    subCategory: row.sub_category_name,
    description: row.product_description,
    image: images[0] ?? "",
    images,
    stock: true,
  };
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    Api.get('/product/productlist')
      .then(res => {
        if (cancelled) return;
        const rows = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setProducts(rows.map(normalizeProduct));
      })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { products, loading };
}
