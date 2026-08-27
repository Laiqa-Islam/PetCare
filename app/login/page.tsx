import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() { return <main className="form-page"><section className="form-side"><Brand /><div className="form-title"><p className="eyebrow">Welcome back</p><h1>Pick up where care left off.</h1><p>Access your pets, appointments, shelter work, or clinical schedule.</p></div><LoginForm /></section><aside className="form-art"><blockquote>“Good care is a thousand small details, remembered at the right time.”</blockquote><p>FurShield keeps those details close.</p></aside></main>; }
