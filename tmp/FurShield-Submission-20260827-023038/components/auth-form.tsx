"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login, register, type AuthState } from "@/app/actions/auth";
import { ArrowIcon } from "./icons";

const initialState: AuthState = undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  return <form className="auth-form" action={action}><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /></div><div className="field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>{state?.error ? <p className="form-error" role="alert">{state.error}</p> : null}<button className="button button-primary" disabled={pending}>{pending ? "Signing in…" : <>Log in <ArrowIcon /></>}</button><p className="form-switch">New to FurShield? <Link href="/register">Create an account</Link></p></form>;
}

export function RegisterForm() {
  const [role, setRole] = useState("owner");
  const [state, action, pending] = useActionState(register, initialState);
  const error = (name: string) => state?.fieldErrors?.[name]?.[0];
  return <form className="auth-form" action={action}><fieldset><legend>I&apos;m joining as</legend><div className="role-grid">{[["owner","Pet owner"],["vet","Veterinarian"],["shelter","Animal shelter"]].map(([value,label]) => <label className="role-option" key={value}><input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value)} /><span>{label}</span></label>)}</div></fieldset>{role === "shelter" ? <div className="field"><label htmlFor="shelterName">Shelter name</label><input id="shelterName" name="shelterName" required />{error("shelterName") ? <small className="field-error">{error("shelterName")}</small> : null}</div> : null}<div className="field"><label htmlFor="name">{role === "shelter" ? "Contact person" : "Full name"}</label><input id="name" name="name" autoComplete="name" required />{error("name") ? <small className="field-error">{error("name")}</small> : null}</div>{role === "vet" ? <div className="field"><label htmlFor="specialization">Specializations</label><input id="specialization" name="specialization" placeholder="e.g. small animal medicine, dermatology" /></div> : null}<div className="field"><label htmlFor="reg-email">Email address</label><input id="reg-email" name="email" type="email" autoComplete="email" required />{error("email") ? <small className="field-error">{error("email")}</small> : null}</div><div className="field"><label htmlFor="phone">Contact number</label><input id="phone" name="phone" type="tel" autoComplete="tel" required />{error("phone") ? <small className="field-error">{error("phone")}</small> : null}</div><div className="field"><label htmlFor="address">Address</label><textarea id="address" name="address" autoComplete="street-address" required />{error("address") ? <small className="field-error">{error("address")}</small> : null}</div><div className="field"><label htmlFor="reg-password">Password</label><input id="reg-password" name="password" type="password" autoComplete="new-password" required /><small>At least 8 characters</small>{error("password") ? <small className="field-error">{error("password")}</small> : null}</div>{state?.error ? <p className="form-error" role="alert">{state.error}</p> : null}<button className="button button-primary" disabled={pending}>{pending ? "Creating your space…" : <>Create account <ArrowIcon /></>}</button><p className="form-switch">Already have an account? <Link href="/login">Log in</Link></p></form>;
}
