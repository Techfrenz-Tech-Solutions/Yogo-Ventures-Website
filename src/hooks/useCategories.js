import { useState, useEffect } from "react";
import Api from "../utils/Api";

// Fetches real categories + sub-categories from the backend.
// Returns categories as plain name strings, and subCategoriesByCategory as
// { [categoryName]: string[] } for building a dependent filter tree.
export function useCategories() {
  const [categories, setCategories]     = useState([]);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState({});
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      Api.get('/category/categorydropdown'),
      Api.get('/subcategory/sub-categorylist'),
    ])
      .then(([catRes, subRes]) => {
        if (cancelled) return;

        const catRows = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data ?? []);
        setCategories(catRows.map(c => c.category_name).filter(Boolean));

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
