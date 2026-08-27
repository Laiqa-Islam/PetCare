import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { ArrowIcon } from "@/components/icons";
import { careArticles } from "@/lib/demo-data";
import { siteMedia } from "@/lib/media";

type Props={params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const article=careArticles.find(item=>item.slug===slug);return article?{title:article.title,description:article.summary}:{title:"Care guide"}}

export default async function CareArticlePage({params}:Props){
  const{slug}=await params;
  const article=careArticles.find(item=>item.slug===slug);
  if(!article)notFound();
  const related=careArticles.filter(item=>item.slug!==article.slug&&(item.category===article.category||item.mediaType===article.mediaType)).slice(0,2);
  return <PublicShell><main className="blog-detail"><header className="blog-hero"><div className="shell blog-hero-grid"><div><Link className="blog-back" href="/care">← Care library</Link><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p>{article.summary}</p><div className="blog-meta"><span>{article.meta}</span><span>Reviewed for everyday pet care</span></div></div><Image src={siteMedia.care[article.slug]} alt={`${article.title} guide`} width={760} height={560} priority unoptimized/></div></header><div className="shell blog-layout"><article className="blog-prose">
    <p className="article-intro">Good care comes from noticing patterns, making gradual changes, and knowing when professional help is needed.</p>
    {article.mediaType==="video"&&article.mediaUrl?<><h2>Watch the veterinary discussion</h2><div className="video-embed blog-video"><iframe src={article.mediaUrl} title={article.title} loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen/><small>Source: {article.source||"Veterinary education"}</small></div></>:null}
    {article.mediaType==="faq"&&article.faqs?<><h2>Common questions</h2><div className="article-faqs">{article.faqs.map((faq)=><details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div></>:null}
    {article.mediaType==="article"&&article.body?article.body.map((paragraph,index)=><section key={paragraph}><h2>{index===0?"What to focus on":"Turn observations into a useful routine"}</h2><p>{paragraph}</p></section>):null}
    <aside className="clinical-note"><strong>When to call a veterinarian</strong><p>Seek professional advice for sudden changes, pain, breathing difficulty, persistent vomiting or diarrhea, collapse, seizures, inability to urinate, or anything that feels urgent.</p></aside>
  </article><aside className="related-guides"><p className="eyebrow">Continue learning</p><h2>Related care guides</h2>{related.map(item=><Link href={`/care/${item.slug}`} key={item.slug}><Image src={siteMedia.care[item.slug]} alt="" width={180} height={120} unoptimized/><span><small>{item.category}</small><strong>{item.title}</strong><em>{item.meta}</em></span><ArrowIcon/></Link>)}</aside></div></main></PublicShell>;
}
