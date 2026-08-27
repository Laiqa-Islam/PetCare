import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata:Metadata={title:"Checkout"};
export default function Page(){return <PublicShell><CheckoutForm/></PublicShell>}
