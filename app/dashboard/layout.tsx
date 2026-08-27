import type { ReactNode } from "react";
import Link from "next/link";
import { DashboardMobileNav, DashboardNav } from "@/components/dashboard-nav";
import { BellIcon, MenuIcon } from "@/components/icons";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const roleName = session.role === "vet" ? "Clinical workspace" : session.role === "shelter" ? "Shelter operations" : "Pet care workspace";
  return <div className="dashboard-shell dashboard-v2"><DashboardNav role={session.role} name={session.name} /><div className="dashboard-main"><header className="dashboard-topbar"><details className="dashboard-mobile-menu"><summary aria-label="Open dashboard navigation"><MenuIcon /></summary><div className="mobile-dashboard-links"><DashboardMobileNav role={session.role}/></div></details><div className="dashboard-route-context"><span>FurShield</span><strong>{roleName}</strong></div><div className="dashboard-topbar-actions"><Link className="public-site-link" href="/">View public site</Link><Link className="icon-button" href="/dashboard/notifications" aria-label="Notifications"><BellIcon /></Link><span className="topbar-avatar" aria-hidden="true">{session.name.charAt(0).toUpperCase()}</span></div></header>{children}</div></div>;
}
