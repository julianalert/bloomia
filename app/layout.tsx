import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloomia — Your Personalized Menopause Management Protocol",
  description:
    "A $27 AI-generated, deeply personalized menopause management protocol delivered to your inbox.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
