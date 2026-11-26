import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "TILARA | Disaster & Humanitarian Aid Transparency Platform",
  description:
    "Visibility for the Unreached. Memantau kondisi wilayah terdampak, memetakan kebutuhan masyarakat, dan memastikan distribusi bantuan fisik dapat ditelusuri secara transparan.",
=======
  title: "TRASEC | Humanitarian Intelligence Platform",
  description: "Platform transparansi kebutuhan dan bantuan relawan di Indonesia",
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[2000] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--tilara-navy)] focus:text-white focus:text-xs focus:font-bold focus:outline-none focus:ring-2 focus:ring-white"
=======
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1400] focus:px-4 focus:py-2 focus:rounded focus:bg-[var(--color-secondary)] focus:text-white focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]"
>>>>>>> a63b074cf39d1bfa4bc9900720436a223cf040e3
        >
          Lompat ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
