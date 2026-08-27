"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BagIcon } from "./icons";
import { useCart } from "./cart-provider";
import { products as demoProducts } from "@/lib/demo-data";
import { siteMedia } from "@/lib/media";

type CatalogProduct={id:string;name:string;category:string;price:number;rating:number;stock:number;pet:string;accent:string;description?:string;imageUrl?:string};

export function ProductCatalog({items=demoProducts}:{items?:CatalogProduct[]}) {
  const products=items;
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const {items:cartItems,count,subtotal,add,decrement}=useCart();
  const cart=new Map(cartItems.map(item=>[item.id,item.quantity]));
  const categories = ["All", ...new Set(products.map((item) => item.category))];
  const filtered = useMemo(() => {
    const rows=products.filter((item)=>(category === "All"||item.category===category)&&(!query||`${item.name} ${item.category} ${item.pet}`.toLowerCase().includes(query.toLowerCase())));
    return [...rows].sort((a,b)=>sort==="price-low"?a.price-b.price:sort==="price-high"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);
  }, [category,query,sort,products]);

  return <>
    <div className="catalog-tools"><div className="search-field"><input aria-label="Search products" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search products or pet type"/></div><select aria-label="Sort products" value={sort} onChange={(event)=>setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Highest rated</option></select></div>
    <div className="section-heading compact-heading"><div className="filter-bar" aria-label="Product categories">{categories.map((item) => <button className={`filter-chip ${item === category ? "active" : ""}`} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><a className="cart-summary" href="/cart"><BagIcon /><strong>{count} items</strong><span>${subtotal.toFixed(2)}</span></a></div>
    <div className="card-grid">{filtered.map((item) => <article className="catalog-card" key={item.id}>
      <div className="catalog-art" style={{background:item.accent}}><Image src={item.imageUrl||siteMedia.products[item.category]||siteMedia.heroPet} alt={`${item.name} product`} width={520} height={300} unoptimized /></div>
      <div className="catalog-body"><div className="meta-row"><span>{item.category} · {item.pet}</span><span>★ {item.rating}</span></div><h2>{item.name}</h2><p>{item.stock} in stock · Add items now and complete a test checkout from your cart.</p><div className="meta-row"><span className="price">${item.price.toFixed(2)}</span><span>{cart.get(item.id) ? `Qty ${cart.get(item.id)}` : "Not in cart"}</span></div><div className="card-actions"><button className="button button-primary" disabled={item.stock<1||cart.get(item.id)===item.stock} onClick={() => add({id:item.id,name:item.name,price:item.price,imageUrl:item.imageUrl||siteMedia.products[item.category]||siteMedia.heroPet,category:item.category,pet:item.pet,stock:item.stock})}>{item.stock<1?"Out of stock":cart.get(item.id)===item.stock?"Stock limit reached":"Add to cart"}</button>{cart.get(item.id) ? <button className="button button-ghost" aria-label={`Remove one ${item.name}`} onClick={() => decrement(item.id)}>Remove one</button> : null}</div></div>
    </article>)}</div>
  </>;
}
