import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { CartPage } from "@/components/cart-page";

export const metadata:Metadata={title:"Your cart"};
export default function Page(){return <PublicShell><CartPage/></PublicShell>}
