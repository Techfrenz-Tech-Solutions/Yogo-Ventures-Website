import { useState, useEffect } from "react";
import Api from "../utils/Api";
import { storageUrl } from "../utils/imageUrl";

// Normalizes a real product_master row into the same field shape the rest of
// the site (cart, wishlist, product cards) already expects: id/name/category/
// subCategory/image/images/description/stock. No price/sizes/colors — the
// backend doesn't model those, so callers should not rely on them.
//
// Variation images now come from the product_images table (an ordered
// array under row.variation_images — see itemMasterController.getProducts)
// rather than the fixed image1..image5 columns, so an admin can attach any
// number of them. The image1..image5 fields still exist on older API
// responses/rows, so they're kept as a fallback for a moment mid-rollout —
// not because the backend still writes them for new products.
function normalizeProduct(row) {
  const variationPaths = Array.isArray(row.variation_images) && row.variation_images.length > 0
    ? [...row.variation_images].sort((a, b) => a.sort_order - b.sort_order).map(v => v.image_path)
    : [row.image1, row.image2, row.image3, row.image4, row.image5].filter(Boolean);

  const images = [row.index_image, ...variationPaths]
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
