import type { Metadata } from "next";
import Image from "next/image";
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
      <div className="filter-bar top-gap"><a className={`filter-chip ${selected === "All" ? "active" : ""}`} href="/care">All</a>{careCategories.map((item) => <a className={`filter-chip ${selected === item ? "active" : ""}`} href={`/care?category=${item}`} key={item}>{item}</a>)}</div>
      <div className="card-grid">{visible.map((article) => <article className="catalog-card" id={article.slug} key={article.slug}>
        <div className={`article-art ${article.tone}`}><Image src={siteMedia.care[article.slug]} alt={`${article.title} care guide`} width={520} height={300} unoptimized /></div>
        <div className="catalog-body"><div className="meta-row"><span>{article.category}</span><span>{article.meta}</span></div><h2>{article.title}</h2><p>{article.summary}</p><details className="guide-details"><summary>{article.mediaType === "video" ? "Watch video" : article.mediaType === "faq" ? "Open FAQs" : "Read guide"}</summary>{article.mediaType === "video" && article.mediaUrl ? <div className="video-embed"><iframe src={article.mediaUrl} title={article.title} loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /><small>Source: {article.source || "Veterinary education"}</small></div> : null}{article.mediaType === "faq" && article.faqs ? <div className="faq-list">{article.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div> : null}{article.mediaType === "article" && article.body ? article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}</details></div>
      </article>)}</div>
      {!visible.length ? <div className="empty-note">No care guides match that search. Try a broader topic.</div> : null}
    </section>
  </PublicShell>;
}
