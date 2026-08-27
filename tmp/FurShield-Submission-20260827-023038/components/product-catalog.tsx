"use client";

import { useMemo, useState } from "react";
import { BagIcon, PawIcon } from "./icons";
import { products as demoProducts } from "@/lib/demo-data";

type CatalogProduct={id:string;name:string;category:string;price:number;rating:number;stock:number;pet:string;accent:string;description?:string};
export function ProductCatalog({items=demoProducts}:{items?:CatalogProduct[]}) {
  const products=items;
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<Record<string, number>>({});
  const categories = ["All", ...new Set(products.map((item) => item.category))];
  const filtered = useMemo(() => {
    const rows=products.filter((item)=>(category === "All"||item.category===category)&&(!query||`${item.name} ${item.category} ${item.pet}`.toLowerCase().includes(query.toLowerCase())));
    return [...rows].sort((a,b)=>sort==="price-low"?a.price-b.price:sort==="price-high"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);
  }, [category,query,sort,products]);
  const count = Object.values(cart).reduce((sum, value) => sum + value, 0);
  const total = products.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);
  return <>
    <div className="catalog-tools"><div className="search-field"><input aria-label="Search products" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search products or pet type"/></div><select aria-label="Sort products" value={sort} onChange={(event)=>setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Highest rated</option></select></div><div className="section-heading compact-heading"><div className="filter-bar" aria-label="Product categories">{categories.map((item) => <button className={`filter-chip ${item === category ? "active" : ""}`} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="cart-summary" id="cart"><BagIcon /><strong>{count} items</strong><span>${total.toFixed(2)}</span></div></div>
    <div className="card-grid">{filtered.map((item) => <article className="catalog-card" key={item.id}><div className="catalog-art" style={{background:item.accent}}><PawIcon size={52}/></div><div className="catalog-body"><div className="meta-row"><span>{item.category} · {item.pet}</span><span>★ {item.rating}</span></div><h2>{item.name}</h2><p>{item.stock} in stock · Product ordering is recorded without payment or delivery.</p><div className="meta-row"><span className="price">${item.price.toFixed(2)}</span><span>{cart[item.id] ? `Qty ${cart[item.id]}` : "Not in cart"}</span></div><div className="card-actions"><button className="button button-primary" onClick={() => setCart((current) => ({...current,[item.id]:(current[item.id] ?? 0)+1}))}>Add to cart</button>{cart[item.id] ? <button className="button button-ghost" aria-label={`Remove one ${item.name}`} onClick={() => setCart((current) => ({...current,[item.id]:Math.max(0,(current[item.id] ?? 0)-1)}))}>Remove</button> : null}</div></div></article>)}</div>
  </>;
}
