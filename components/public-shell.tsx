import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PublicShell({ children }: { children: ReactNode }) {
  return <div className="public-site"><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></div>;
}
