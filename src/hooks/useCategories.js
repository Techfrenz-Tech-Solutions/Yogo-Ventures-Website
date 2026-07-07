import { useState, useEffect } from "react";
import Api from "../utils/Api";

// Fetches real categories + sub-categories from the backend.
// Returns categories as plain name strings sorted by DB id (ascending),
// and subCategoriesByCategory as { [categoryName]: string[] }.
export function useCategories() {
  const [categories, setCategories]                       = useState([]);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState({});
  const [loading, setLoading]                             = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      Api.get('/country/categorydropdown'),
      Api.get('/subcategory/sub-categorylist'),
    ])
      .then(([catRes, subRes]) => {
        if (cancelled) return;

        const catRows = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data ?? []);
        // Sort by id ascending — matches DB insertion order (ids 8,9,10,11…)
        const sorted = [...catRows].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        setCategories(sorted.map(c => c.category_name).filter(Boolean));

        const subRows = Array.isArray(subRes.data) ? subRes.data : (subRes.data?.data ?? []);
        const grouped = {};
        subRows.forEach(s => {
          if (!s.category_name || !s.sub_category_name) return;
          if (!grouped[s.category_name]) grouped[s.category_name] = [];
          grouped[s.category_name].push(s.sub_category_name);
        });
        setSubCategoriesByCategory(grouped);
      })
      .catch(() => {
        if (cancelled) return;
        setCategories([]);
        setSubCategoriesByCategory({});
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { categories, subCategoriesByCategory, loading };
}
