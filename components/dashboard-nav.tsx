"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import type { UserRole } from "@/lib/models";
import {
  BellIcon,
  Brand,
  CalendarIcon,
  FileIcon,
  HeartIcon,
  HomeIcon,
  LogOutIcon,
  PawIcon,
  StethoscopeIcon,
  UsersIcon,
} from "./dashboard-nav-icons";

type NavItem = { href: string; label: string; icon: typeof HomeIcon };

const common: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: HomeIcon },
  { href: "/dashboard/notifications", label: "Notifications", icon: BellIcon },
];
const owner: NavItem[] = [
  { href: "/dashboard/pets", label: "My pets", icon: PawIcon },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarIcon },
  { href: "/dashboard/records", label: "Health records", icon: FileIcon },
  { href: "/dashboard/adoption", label: "Adoption", icon: HeartIcon },
  { href: "/dashboard/reviews", label: "Ratings & feedback", icon: UsersIcon },
];
const vet: NavItem[] = [
  { href: "/dashboard/appointments", label: "Schedule", icon: CalendarIcon },
  { href: "/dashboard/patients", label: "Patient records", icon: StethoscopeIcon },
  { href: "/dashboard/profile", label: "Profile & availability", icon: UsersIcon },
];
const shelter: NavItem[] = [
  { href: "/dashboard/listings", label: "Adoption listings", icon: HeartIcon },
  { href: "/dashboard/shelter-care", label: "Care logs", icon: PawIcon },
  { href: "/dashboard/interests", label: "Adopter interest", icon: UsersIcon },
];

function roleLabel(role: UserRole) {
  return role === "vet" ? "Veterinarian workspace" : role === "shelter" ? "Shelter workspace" : "Owner workspace";
}

function getLinks(role: UserRole) {
  const primary = role === "owner" ? owner : role === "vet" ? vet : shelter;
  return [common[0], ...primary, common[1]];
}

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function NavigationLinks({ role, compact = false }: { role: UserRole; compact?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className={compact ? "dashboard-mobile-nav" : "dashboard-primary-nav"} aria-label="Dashboard navigation">
      {getLinks(role).map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link href={href} key={href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
            <Icon />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardNav({ role, name }: { role: UserRole; name: string }) {
  const initials = name.split(" ").slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brand"><Brand /></div>
      <div className="workspace-label"><span>Care operations</span><strong>{roleLabel(role)}</strong></div>
      <NavigationLinks role={role} />
      <div className="dashboard-account">
        <div className="user-stamp">
          <span>{initials}</span>
          <div><strong>{name}</strong><small>{roleLabel(role)}</small></div>
        </div>
        <form action={logout}><button><LogOutIcon /><span>Log out</span></button></form>
      </div>
    </aside>
  );
}

export function DashboardMobileNav({ role }: { role: UserRole }) {
  return <NavigationLinks role={role} compact />;
}
