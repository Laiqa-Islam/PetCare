"use server";

import mongoose from "mongoose";
import { checkoutSchema } from "@/lib/order-validation";
import { connectToDatabase } from "@/lib/db";
import { Order, Product } from "@/lib/models";
import { getSession } from "@/lib/session";
import { sendEmail } from "@/lib/email";

export type CheckoutState={error?:string;fieldErrors?:Record<string,string[]>;success?:boolean;orderNumber?:string};

export async function placeOrder(_state:CheckoutState,formData:FormData):Promise<CheckoutState>{
  let items:unknown=[];
  try{items=JSON.parse(String(formData.get("items")||"[]"))}catch{return{error:"The cart data could not be read. Return to the cart and try again."}}
  const parsed=checkoutSchema.safeParse({...Object.fromEntries(formData),items});
  if(!parsed.success)return{fieldErrors:parsed.error.flatten().fieldErrors,error:"Review the highlighted checkout fields."};
  await connectToDatabase();
  const ids=parsed.data.items.map(item=>item.productId).filter(id=>mongoose.isValidObjectId(id));
  if(ids.length!==parsed.data.items.length)return{error:"One or more cart items are no longer available."};
  const products=await Product.find({_id:{$in:ids}}).lean();
  const productMap=new Map(products.map(product=>[String(product._id),product]));
  const orderItems=[];
  for(const requested of parsed.data.items){
    const product=productMap.get(requested.productId);
    if(!product)return{error:"One or more cart items are no longer available."};
    if(Number(product.stock)<requested.quantity)return{error:`Only ${String(product.stock)} ${String(product.name)} item(s) are available.`};
    orderItems.push({productId:product._id,name:String(product.name),price:Number(product.price),quantity:requested.quantity,imageUrl:String(product.imageUrl||"")});
  }
  const subtotal=Number(orderItems.reduce((sum,item)=>sum+item.price*item.quantity,0).toFixed(2));
  const session=await getSession();
  const orderNumber=`FS-${new Date().toISOString().slice(0,10).replaceAll("-","")}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  await Order.create({orderNumber,userId:session?.userId,customer:{name:parsed.data.name,email:parsed.data.email,phone:parsed.data.phone,address:parsed.data.address,city:parsed.data.city},items:orderItems,subtotal,paymentMethod:parsed.data.paymentMethod,paymentStatus:parsed.data.paymentMethod==="test_card"?"paid_test":"pending",cardLast4:parsed.data.paymentMethod==="test_card"?"4242":undefined,status:"placed"});
  await sendEmail({to:parsed.data.email,subject:`FurShield test order ${orderNumber}`,text:`Your test order ${orderNumber} was placed successfully. Total: $${subtotal.toFixed(2)}. Payment: ${parsed.data.paymentMethod==="test_card"?"dummy card approved":"cash on delivery"}. No real payment was processed.`});
  return{success:true,orderNumber};
}
