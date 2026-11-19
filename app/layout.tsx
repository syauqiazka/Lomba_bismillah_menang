import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humanitarian Intelligence Platform",
  description: "Platform transparansi kebutuhan dan bantuan relawan di Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
