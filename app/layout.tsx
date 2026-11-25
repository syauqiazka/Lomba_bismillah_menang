import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRASEC | Humanitarian Intelligence Platform",
  description: "Platform transparansi kebutuhan dan bantuan relawan di Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1400] focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--color-secondary)] focus:text-white focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
        >
          Lompat ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
