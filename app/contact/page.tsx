import type {Metadata} from "next";
import {PublicShell} from "@/components/public-shell";
import {ContactForm} from "@/components/contact-form";
import {MapPinIcon} from "@/components/icons";

export const metadata:Metadata={title:"Contact us"};
export default function ContactPage(){return <PublicShell><section className="page-hero"><div className="shell"><p className="eyebrow">Contact us</p><h1>Tell us what your care journey needs.</h1><p>Questions about the portal, shelter onboarding, or veterinarian access? Send the team a note.</p></div></section><section className="content-section shell contact-grid"><ContactForm/><div className="map-card"><iframe className="map-frame" title="FurShield office area map" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=67.02%2C24.84%2C67.09%2C24.90&amp;layer=mapnik"/><h2>FurShield team</h2><p><MapPinIcon/> Shahrah-e-Faisal, Karachi, Pakistan</p><p>hello@furshield.example<br/>+92 21 0000 0000</p><small>Monday–Friday · 9:00 AM–6:00 PM</small></div></section></PublicShell>}
