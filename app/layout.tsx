import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";
import "./public-redesign.css";

export const metadata: Metadata = {
  title: { default: "FurShield — Care, kept together", template: "%s · FurShield" },
  description: "Manage pet health records, appointments, care routines, adoption, and essential products in one thoughtful place.",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
