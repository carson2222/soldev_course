import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solana money sender",
  description: "Easily send SOL between wallets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
