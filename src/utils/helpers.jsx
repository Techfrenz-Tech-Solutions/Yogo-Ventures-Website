// src/utils/helpers.js

/** Clamp a number between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Render ★ / ☆ rating string */
export const renderStars = (rating) => {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return "★".repeat(full) + "☆".repeat(empty);
};

/** Truncate text to a max character length */
export const truncate = (str, maxLen = 120) =>
  str.length > maxLen ? str.slice(0, maxLen).trimEnd() + "…" : str;

/** Debounce a function */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Format number with locale */
export const formatNumber = (n) => Number(n).toLocaleString("en-IN");
