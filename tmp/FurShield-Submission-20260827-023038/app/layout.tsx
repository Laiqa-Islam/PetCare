import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "FurShield — Care, kept together", template: "%s · FurShield" },
  description: "Manage pet health records, appointments, care routines, adoption, and essential products in one thoughtful place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
