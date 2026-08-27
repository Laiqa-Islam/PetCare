import type { Metadata } from "next";
import { ProductCatalog } from "@/components/product-catalog";
import { PublicShell } from "@/components/public-shell";
import { products as demoProducts } from "@/lib/demo-data";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/lib/models";

export const metadata: Metadata = { title: "Pet essentials" };

export default async function ProductsPage() {
  let items=demoProducts;try{await connectToDatabase();const docs=await Product.find().sort({featured:-1,name:1}).lean();if(docs.length)items=docs.map((item,index)=>({id:String(item._id),name:String(item.name),category:String(item.category),price:Number(item.price),rating:Number(item.rating||0),stock:Number(item.stock||0),pet:Array.isArray(item.petTypes)&&item.petTypes.length?item.petTypes.join(" / "):"All pets",accent:["#dbeee7","#f6dfcf","#dce8f5","#eee6f6"][index%4]}))}catch{}
  return <PublicShell><section className="page-hero"><div className="shell"><p className="eyebrow">Pet essentials</p><h1>Useful things, chosen with care.</h1><p>Browse food, grooming, toys, accessories, health supplies, and training aids. Add products to your cart and try the complete checkout with a clearly marked test payment.</p></div></section><section className="content-section shell"><ProductCatalog items={items}/></section></PublicShell>;
}
