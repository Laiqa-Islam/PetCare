import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { SearchIcon } from "@/components/icons";
import { careArticles, careCategories } from "@/lib/demo-data";
import { siteMedia } from "@/lib/media";

export const metadata: Metadata = { title: "Care library" };

export default async function CarePage({ searchParams }: PageProps<"/care">) {
  const { category = "All", q = "" } = await searchParams;
  const selected = typeof category === "string" ? category : "All";
  const query = typeof q === "string" ? q.toLowerCase() : "";
  const visible = careArticles.filter((article) =>
    (selected === "All" || article.category === selected)
    && (!query || `${article.title} ${article.summary} ${article.category}`.toLowerCase().includes(query)),
  );

  return <PublicShell>
    <section className="page-hero"><div className="shell"><p className="eyebrow">Expert-informed guidance</p><h1>Care knowledge for the moments between visits.</h1><p>Browse feeding, hygiene, exercise, health, and training guidance. Articles support everyday care and never replace a veterinarian&apos;s diagnosis.</p></div></section>
    <section className="content-section shell">
      <form className="search-field" method="get"><SearchIcon /><input aria-label="Search care library" name="q" defaultValue={typeof q === "string" ? q : ""} placeholder="Search topics, species, or questions" /><button aria-label="Search">Search</button></form>
      <div className="filter-bar top-gap"><Link className={`filter-chip ${selected === "All" ? "active" : ""}`} href="/care">All</Link>{careCategories.map((item) => <Link className={`filter-chip ${selected === item ? "active" : ""}`} href={`/care?category=${item}`} key={item}>{item}</Link>)}</div>
      <div className="card-grid blog-grid">{visible.map((article) => <article className="catalog-card blog-card" id={article.slug} key={article.slug}>
        <Link href={`/care/${article.slug}`} aria-label={`Read ${article.title}`}><div className={`article-art ${article.tone}`}><Image src={siteMedia.care[article.slug]} alt={`${article.title} care guide`} width={520} height={300} unoptimized /></div></Link>
        <div className="catalog-body"><div className="meta-row"><span>{article.category}</span><span>{article.meta}</span></div><h2><Link href={`/care/${article.slug}`}>{article.title}</Link></h2><p>{article.summary}</p><Link className="inline-link" href={`/care/${article.slug}`}>{article.mediaType==="video"?"Watch guide":article.mediaType==="faq"?"Read questions":"Read article"} →</Link></div>
      </article>)}</div>
      {!visible.length ? <div className="empty-note">No care guides match that search. Try a broader topic.</div> : null}
    </section>
  </PublicShell>;
}
