import Link from "next/link";
import { getSession } from "@/lib/session";
import { Brand } from "./brand";
import { BagIcon, MenuIcon } from "./icons";

const links = [["Care library", "/care"], ["Find a vet", "/vets"], ["Adopt", "/adopt"], ["Shop", "/products"]] as const;

export async function SiteHeader() {
  const session = await getSession();
  return <header className="site-header"><div className="shell header-inner"><Brand /><nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="header-actions"><Link className="icon-button desktop-only" href="/products#cart" aria-label="View cart"><BagIcon /></Link>{session ? <Link className="button button-small button-primary" href="/dashboard">My dashboard</Link> : <><Link className="text-link desktop-only" href="/login">Log in</Link><Link className="button button-small button-primary" href="/register">Join FurShield</Link></>}<details className="mobile-menu"><summary className="icon-button" aria-label="Open menu"><MenuIcon /></summary><nav aria-label="Mobile navigation">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href={session ? "/dashboard" : "/login"}>{session ? "My dashboard" : "Log in"}</Link></nav></details></div></div></header>;
}
