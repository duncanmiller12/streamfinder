import { useState, useEffect } from "react";

/**
 * Returns a debounced version of `value` that only updates after `delay` ms
 * of inactivity.  Useful for delaying search-as-you-type API calls.
 *
 * @param value  The raw (live) value to debounce.
 * @param delay  Milliseconds to wait before updating the returned value.
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
