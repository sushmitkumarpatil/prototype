"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import NProgress from "nprogress";

export function NProgressProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return children;
}
