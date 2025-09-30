"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

import NProgress from "nprogress";

function NProgressContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return children;
}

export function NProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <NProgressContent>{children}</NProgressContent>
    </Suspense>
  );
}
