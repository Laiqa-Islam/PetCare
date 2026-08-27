"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type CartItem = { id:string; name:string; price:number; imageUrl:string; category:string; pet:string; stock:number; quantity:number };
type ProductInput = Omit<CartItem,"quantity">;
type CartContextValue = { items:CartItem[]; count:number; subtotal:number; hydrated:boolean; add:(product:ProductInput)=>void; decrement:(id:string)=>void; setQuantity:(id:string,quantity:number)=>void; remove:(id:string)=>void; clear:()=>void };

const CartContext=createContext<CartContextValue|null>(null);
const storageKey="furshield-cart-v1";
const cartEvent="furshield-cart-change";
const emptyCart:CartItem[]=[];
let cachedRaw:string|null=null;
let cachedCart:CartItem[]=emptyCart;

function readCart(){if(typeof window==="undefined")return emptyCart;const raw=window.localStorage.getItem(storageKey)||"[]";if(raw===cachedRaw)return cachedCart;try{const parsed=JSON.parse(raw);cachedRaw=raw;cachedCart=Array.isArray(parsed)?parsed:emptyCart;return cachedCart}catch{cachedRaw=raw;cachedCart=emptyCart;return cachedCart}}
function subscribe(callback:()=>void){window.addEventListener("storage",callback);window.addEventListener(cartEvent,callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener(cartEvent,callback)}}
function writeCart(update:(current:CartItem[])=>CartItem[]){const next=update(readCart());window.localStorage.setItem(storageKey,JSON.stringify(next));window.dispatchEvent(new Event(cartEvent))}

export function CartProvider({children}:{children:ReactNode}){
  const items=useSyncExternalStore(subscribe,readCart,()=>emptyCart);
  const add=useCallback((product:ProductInput)=>writeCart(current=>{const existing=current.find(item=>item.id===product.id);if(existing)return current.map(item=>item.id===product.id?{...item,quantity:Math.min(item.quantity+1,item.stock)}:item);return[...current,{...product,quantity:1}]}),[]);
  const decrement=useCallback((id:string)=>writeCart(current=>current.flatMap(item=>item.id!==id?[item]:item.quantity>1?[{...item,quantity:item.quantity-1}]:[])),[]);
  const setQuantity=useCallback((id:string,quantity:number)=>writeCart(current=>current.map(item=>item.id===id?{...item,quantity:Math.max(1,Math.min(Math.floor(quantity)||1,item.stock))}:item)),[]);
  const remove=useCallback((id:string)=>writeCart(current=>current.filter(item=>item.id!==id)),[]);
  const clear=useCallback(()=>writeCart(()=>[]),[]);
  const value=useMemo(()=>({items,count:items.reduce((sum,item)=>sum+item.quantity,0),subtotal:items.reduce((sum,item)=>sum+item.price*item.quantity,0),hydrated:true,add,decrement,setQuantity,remove,clear}),[items,add,decrement,setQuantity,remove,clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart must be used within CartProvider");return value}
