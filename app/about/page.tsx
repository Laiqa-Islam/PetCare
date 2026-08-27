import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { HeartIcon, ShieldIcon, UsersIcon } from "@/components/icons";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return <PublicShell><section className="page-hero"><div className="shell"><p className="eyebrow">About FurShield</p><h1>Better care begins with a shared picture.</h1><p>We connect pet owners, veterinarians, and shelters around accurate records, thoughtful coordination, and responsible animal care.</p></div></section><section className="content-section shell prose-layout"><div><h2>Why we exist</h2><p>Pet care details often live in paper files, chat threads, calendars, and memory. FurShield gives each pet one organized story that the right people can safely act on.</p><p>The platform supports everyday owners, clinical follow-up, shelter care, and adoption coordination while keeping each role focused on the information it needs.</p></div><div className="values-grid"><article><ShieldIcon /><h3>Trust by design</h3><p>Private records and role-aware access are foundational.</p></article><article><HeartIcon /><h3>Care before clicks</h3><p>Every workflow should reduce friction around an animal&apos;s wellbeing.</p></article><article><UsersIcon /><h3>Shared responsibility</h3><p>Owners, vets, and shelters contribute different parts of the same picture.</p></article></div></section></PublicShell>;
}
