import type { ReactNode } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard-nav";
import { BellIcon, MenuIcon } from "@/components/icons";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  return <div className="dashboard-shell"><DashboardNav role={session.role} name={session.name} /><div className="dashboard-main"><header className="dashboard-topbar"><details><summary aria-label="Open dashboard navigation"><MenuIcon /></summary><div className="mobile-dashboard-links"><Link href="/dashboard">Overview</Link><Link href="/dashboard/appointments">Appointments</Link><Link href="/dashboard/notifications">Notifications</Link></div></details><span>FurShield care space</span><Link className="icon-button" href="/dashboard/notifications" aria-label="Notifications"><BellIcon /></Link></header>{children}</div></div>;
}
