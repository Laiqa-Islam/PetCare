"use client";

import Link from "next/link";
import { BagIcon } from "./icons";
import { useCart } from "./cart-provider";

export function CartLink(){const{count}=useCart();return <Link className="icon-button cart-link" href="/cart" aria-label={`View cart, ${count} item${count===1?"":"s"}`}><BagIcon/>{count>0?<span aria-hidden="true">{count>99?"99+":count}</span>:null}</Link>}
