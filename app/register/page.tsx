import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { RegisterForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() { return <main className="form-page"><section className="form-side"><Brand /><div className="form-title"><p className="eyebrow">Create your care space</p><h1>Start with the role you play.</h1><p>Each dashboard is shaped around what pet owners, veterinarians, and shelters need to do.</p></div><RegisterForm /></section><aside className="form-art"><blockquote>Every paw and wing deserves a shield of thoughtful care.</blockquote><p>One secure place. Three collaborating roles. Better continuity.</p></aside></main>; }
