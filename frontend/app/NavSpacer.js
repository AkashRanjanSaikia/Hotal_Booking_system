"use client";

import { usePathname } from "next/navigation";

export default function NavSpacer() {
  const pathname = usePathname() || "";

  // hide spacer on pages that should render full-bleed under the navbar
  // - auth pages
  // - the root landing page
  // - hotel detail pages (e.g. /hotels/[id])
  const hideSpacer =
    pathname.startsWith("/auth/") || pathname === "/" || pathname.startsWith("/hotels/");

  if (hideSpacer) return null;

  return <div aria-hidden className="h-20" />;
}
