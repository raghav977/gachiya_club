"use client";

import { useState, useEffect } from "react";

/**
 * Custom debounce hook for search inputs
 * @param {string} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {string} - The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
