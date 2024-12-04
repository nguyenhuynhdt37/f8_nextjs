"use client";
import { useEffect, useState } from "react";

export const useClientCookie = (): string | null => {
  const [cookieHeader, setCookieHeader] = useState<string | null>(null);

  useEffect(() => {
    const allCookies = document.cookie;
    if (!allCookies) {
      setCookieHeader(null);
    } else {
      setCookieHeader(allCookies);
    }
  }, []);

  return cookieHeader;
};
