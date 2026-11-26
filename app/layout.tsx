import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TILARA | Disaster & Humanitarian Aid Transparency Platform",
  description:
    "Visibility for the Unreached. Memantau kondisi wilayah terdampak, memetakan kebutuhan masyarakat, dan memastikan distribusi bantuan fisik dapat ditelusuri secara transparan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[2000] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--tilara-navy)] focus:text-white focus:text-xs focus:font-bold focus:outline-none focus:ring-2 focus:ring-white"
        >
          Lompat ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
