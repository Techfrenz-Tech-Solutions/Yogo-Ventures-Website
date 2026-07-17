/**
 * useContentProtection.js — Yogo Ventures
 *
 * Disables the right-click context menu ONLY on <img> elements.
 * All other right-click behaviour (links, text, empty space) works normally.
 *
 * Also prevents dragging images out of the browser.
 *
 * Call once in App.jsx — useContentProtection()
 */

import { useEffect } from "react";

export function useContentProtection() {
  useEffect(() => {

    // Block right-click context menu only when clicking directly on an <img>
    const handleContextMenu = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    // Block dragging images to desktop / other tabs
    const handleDragStart = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart",   handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart",   handleDragStart);
    };
  }, []);
}
