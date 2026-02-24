"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export default function ZibalTrust() {
  const { theme } = useTheme();
  const zibalTrustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (zibalTrustRef.current && !zibalTrustRef.current.innerHTML) {
      const script = document.createElement("script");
      script.src = `https://zibal.ir/trust/scripts/zibal-trust-v4.js?theme=${theme === "dark" ? "dark" : "light"}`;
      script.type = "text/javascript";
      script.async = true;
      zibalTrustRef.current.appendChild(script);
    }

    return () => {
      if (zibalTrustRef.current) {
        zibalTrustRef.current.innerHTML = "";
      }
    };
  }, []);

  // حذف min-h-10 برای تراز شدن بهتر با اینماد
  return <div ref={zibalTrustRef} className="inline h-25 w-25" />;
}
