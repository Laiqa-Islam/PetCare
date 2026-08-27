import Link from "next/link";
import { logout } from "@/app/actions/auth";
import type { UserRole } from "@/lib/models";
import { BellIcon, Brand, CalendarIcon, FileIcon, HeartIcon, HomeIcon, LogOutIcon, PawIcon, StethoscopeIcon, UsersIcon } from "./dashboard-nav-icons";

const common = [{ href: "/dashboard", label: "Overview", icon: HomeIcon }, { href: "/dashboard/notifications", label: "Notifications", icon: BellIcon }];
const owner = [{ href: "/dashboard/pets", label: "My pets", icon: PawIcon }, { href: "/dashboard/appointments", label: "Appointments", icon: CalendarIcon }, { href: "/dashboard/records", label: "Health records", icon: FileIcon }, { href: "/dashboard/adoption", label: "Adoption", icon: HeartIcon }, { href: "/dashboard/reviews", label: "Ratings & feedback", icon: UsersIcon }];
const vet = [{ href: "/dashboard/appointments", label: "Schedule", icon: CalendarIcon }, { href: "/dashboard/patients", label: "Pet histories", icon: StethoscopeIcon }, { href: "/dashboard/profile", label: "Profile & availability", icon: UsersIcon }];
const shelter = [{ href: "/dashboard/listings", label: "Adoption listings", icon: HeartIcon }, { href: "/dashboard/shelter-care", label: "Care logs", icon: PawIcon }, { href: "/dashboard/interests", label: "Adopter interest", icon: UsersIcon }];

export function DashboardNav({ role, name }: { role: UserRole; name: string }) {
  const links = [...common.slice(0,1), ...(role === "owner" ? owner : role === "vet" ? vet : shelter), ...common.slice(1)];
  return <aside className="dashboard-sidebar"><Brand /><div className="user-stamp"><span>{name.charAt(0)}</span><div><strong>{name}</strong><small>{role === "vet" ? "Veterinarian" : role === "shelter" ? "Animal shelter" : "Pet owner"}</small></div></div><nav>{links.map(({href,label,icon:Icon}) => <Link href={href} key={href}><Icon />{label}</Link>)}</nav><form action={logout}><button><LogOutIcon /> Log out</button></form></aside>;
}
