import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowIcon, CalendarIcon, FileIcon, HeartIcon, PawIcon, SearchIcon, ShieldIcon, StethoscopeIcon } from "@/components/icons";
import { adoptablePets, careArticles, vets } from "@/lib/demo-data";
import { siteMedia } from "@/lib/media";

export default function Home() {
  return <div className="public-site"><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader /><main id="main-content">
    <section className="hero"><div className="shell hero-grid"><div className="hero-copy">
      <p className="eyebrow"><span /> Personal care record · PK</p><h1>Care has a memory. <em>Keep it intact.</em></h1>
      <p className="hero-lede">One living record for health history, daily routines, appointments, adoption, and the people trusted with your animal&apos;s care.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/register">Start a pet record <ArrowIcon /></Link><Link className="button button-ghost" href="/vets"><SearchIcon /> Find a veterinarian</Link></div>
      <div className="trust-row"><p><strong>Built around the animal</strong><br />Useful to owners, vets, and shelters without mixing their responsibilities.</p></div>
    </div><div className="hero-visual" aria-label="Example of a pet care profile">
      <div className="orbit orbit-one"><ShieldIcon /><span>Records protected</span></div><div className="orbit orbit-two"><CalendarIcon /><span>Vaccine due in 12 days</span></div>
      <div className="pet-portrait"><Image className="hero-pet-image" src={siteMedia.heroPet} alt="Mochi, a cat with a FurShield care profile" width={700} height={700} priority unoptimized/><div className="portrait-label"><div><small>CARE PROFILE</small><strong>Mochi</strong><span>Indoor cat · 3 years</span></div><span className="status-dot">Healthy</span></div></div>
      <div className="care-card"><div className="care-card-head"><span><PawIcon /> Today&apos;s care</span><small>3 of 4</small></div><div className="progress"><i /></div><ul><li className="done">Morning meal <span>7:30</span></li><li className="done">Medication <span>8:00</span></li><li>Evening play <span>18:30</span></li></ul></div>
    </div></div><div className="hero-wave" /></section>

    <section className="section section-intro shell"><div><p className="eyebrow">A clearer care routine</p><h2>Less searching. More noticing.</h2></div><p>Everything important stays connected to the right pet, person, and point in time—so the next decision starts with the full picture.</p></section>
    <section className="shell feature-grid">
      <Link className="feature-card feature-large" href="/dashboard/pets"><span className="feature-icon"><FileIcon /></span><div><p className="kicker">HEALTH LEDGER</p><h3>A living record, not a paper trail</h3><p>Vaccinations, treatments, allergies, lab reports, insurance, and milestones form one readable timeline.</p><span className="inline-link">Organize pet records <ArrowIcon /></span></div><div className="mini-timeline"><span /><div><small>12 AUG</small><strong>Annual wellness visit</strong><p>Weight steady · Vaccines current</p></div><span /><div><small>02 MAY</small><strong>Lab report added</strong><p>Bloodwork · PDF document</p></div></div></Link>
      <Link className="feature-card" href="/vets"><span className="feature-icon peach"><StethoscopeIcon /></span><p className="kicker">VET CARE</p><h3>Book with context</h3><p>Find the right specialty and share relevant history with the vet handling the appointment.</p><span className="inline-link">Browse veterinarians <ArrowIcon /></span></Link>
      <Link className="feature-card" href="/adopt"><span className="feature-icon lavender"><HeartIcon /></span><p className="kicker">ADOPTION</p><h3>Make room for a new story</h3><p>Explore shelter pets with clear health and care status, then send a thoughtful interest form.</p><span className="inline-link">Meet adoptable pets <ArrowIcon /></span></Link>
    </section>

    <section className="section tinted-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Trusted help, nearby</p><h2>Care from people who listen</h2></div><Link className="button button-ghost" href="/vets">View all veterinarians <ArrowIcon /></Link></div><div className="vet-row">{vets.map((vet, index) => <article className="vet-card" key={vet.id}><Image className="vet-photo" src={siteMedia.vets[index]} alt={`${vet.name} veterinary profile`} width={180} height={180} unoptimized/><div><p className="rating">★ {vet.rating}</p><h3>{vet.name}</h3><p>{vet.specialty}</p><small>{vet.experience} years · {vet.location}</small><Link href={`/vets?book=${vet.id}`}>Next: {vet.next} <ArrowIcon /></Link></div></article>)}</div></div></section>

    <section className="section shell"><div className="section-heading"><div><p className="eyebrow">Care library</p><h2>Small lessons for everyday care</h2></div><Link className="inline-link" href="/care">Explore the library <ArrowIcon /></Link></div><div className="article-grid">{careArticles.slice(0,3).map((article) => <Link className="article-card" href={`/care/${article.slug}`} key={article.slug}><div className={`article-art ${article.tone}`}><Image src={siteMedia.care[article.slug]} alt="" width={520} height={300} unoptimized /></div><div><span>{article.category}</span><h3>{article.title}</h3><p>{article.summary}</p><small>{article.meta}</small></div></Link>)}</div></section>

    <section className="section adoption-strip"><div className="shell adoption-layout"><div><p className="eyebrow light">Looking for a companion?</p><h2>Four hopeful faces.<br />One could be waiting for you.</h2><p>Shelter listings include care notes and health status so you can begin the conversation with confidence.</p><Link className="button button-light" href="/adopt">Explore adoption <HeartIcon /></Link></div><div className="pet-stack">{adoptablePets.slice(0,3).map((pet, i) => <Link href={`/adopt#${pet.id}`} className={`pet-polaroid pet-${i + 1}`} key={pet.id}><div style={{background:pet.color}}><Image src={siteMedia.adoption[i]} alt={`${pet.name}, ${pet.breed}`} width={420} height={460} unoptimized/></div><strong>{pet.name}</strong><span>{pet.breed}</span></Link>)}</div></div></section>
    <section className="section shell final-cta"><div className="cta-mark"><ShieldIcon size={40} /></div><div><p className="eyebrow">Your pet&apos;s story starts here</p><h2>Build a care space as unique as they are.</h2><p>Free to begin. Add one pet or the whole family.</p></div><Link className="button button-primary" href="/register">Create an account <ArrowIcon /></Link></section>
  </main><SiteFooter /></div>;
}
