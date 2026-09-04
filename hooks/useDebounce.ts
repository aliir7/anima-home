"use client";

import { useEffect, useState } from "react";

/**
 * مقدار ورودی را با تاخیر مشخص‌شده debounce می‌کند — مناسب برای
 * inputهای جستجو تا با هر keystroke بلافاصله navigation/فچ اتفاق نیفتد.
 */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
