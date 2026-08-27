import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-grid"><div><Brand compact /><p>One thoughtful place for records, care, appointments, adoption, and everyday essentials.</p></div><div><h2>Explore</h2><Link href="/care">Care library</Link><Link href="/vets">Veterinarians</Link><Link href="/adopt">Adoption</Link><Link href="/products">Products</Link></div><div><h2>FurShield</h2><Link href="/about">About us</Link><Link href="/contact">Contact us</Link><Link href="/feedback">Community feedback</Link><Link href="/register">Create account</Link></div><div><h2>Need guidance?</h2><p>Talk with a qualified veterinarian for diagnosis or urgent health concerns.</p><Link className="footer-cta" href="/vets">Find a vet nearby</Link></div></div><div className="shell footer-bottom"><span>© 2026 FurShield</span><span>Built for every paw, wing, and whisker.</span></div></footer>;
}
