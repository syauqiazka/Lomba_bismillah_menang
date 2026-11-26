"use client";

// SiteHeader.tsx — header publik TILARA (hanya untuk halaman publik, bukan area operasional).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./site-header.css";

type Props = {
  /** overlay: transparan di atas hero GELAP lalu solid saat scroll. solid: halaman lain. */
  variant?: "overlay" | "solid";
  isAuthenticated?: boolean;
  /** Teks siap tampil dari server, mis. "26 Nov 2026, 08:10 WIB". Jangan dikarang. */
  lastUpdated?: string;
  /** Dari konfigurasi. Jangan dikarang; bila kosong tidak ditampilkan. */
  contactEmail?: string;
};

const NAV = [
  { href: "/peta", label: "Peta" },
  { href: "/laporan", label: "Laporan" },
  { href: "/dashboard", label: "Statistik" },
  { href: "/tentang", label: "Tentang" },
];

function Logo() {
  return (
    <svg className="logo-mark" viewBox="0 0 200 200" width="38" height="38" fill="none" aria-hidden="true">
      <g transform="translate(5 5) scale(1.8)">
        <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50 7 C60 7 65 13 74 12 C85 11 91 18 91 29 C91 38 98 44 94 55 C91 64 94 72 85 80 C77 87 77 96 66 98 C56 100 50 107 39 101 C30 96 21 99 15 90 C9 82 10 72 5 64 C0 55 7 46 8 37 C9 26 17 20 28 20 C37 20 41 7 50 7 Z" />
          <path d="M50 17 C59 17 64 22 72 22 C80 22 83 29 82 37 C81 45 89 49 86 57 C83 65 85 72 77 78 C70 83 70 90 62 90 C54 90 49 98 41 92 C34 87 27 91 22 83 C18 77 19 69 14 62 C10 55 16 48 17 40 C18 31 24 29 33 29 C40 29 43 17 50 17 Z" />
          <path d="M50 28 C57 28 61 33 67 32 C74 32 76 38 74 45 C73 51 80 54 77 61 C75 67 76 72 69 76 C63 80 62 86 56 83 C50 81 47 90 41 83 C35 78 31 82 28 75 C25 69 27 64 22 58 C19 53 24 48 25 42 C26 36 32 38 38 37 C43 36 44 28 50 28 Z" />
        </g>
        <circle className="logo-dot" cx="50" cy="55" r="6.4" />
      </g>
    </svg>
  );
}

const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const PHONE = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z";
const USER = "M20 21a8 8 0 0 0-16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z";
const BURGER = "M4 7h16M4 12h16M4 17h16";
const CLOSE = "M6 6l12 12M18 6L6 18";

export default function SiteHeader({
  variant = "overlay",
  isAuthenticated = false,
  lastUpdated,
  contactEmail,
}: Props) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparan → solid: IntersectionObserver pada sentinel (tanpa listener scroll, tanpa re-render)
  useEffect(() => {
    const header = headerRef.current;
    const sentinel = sentinelRef.current;
    if (!header) return;
    if (variant === "solid" || !sentinel || !("IntersectionObserver" in window)) {
      header.dataset.scrolled = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        header.dataset.scrolled = String(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [variant]);

  // Tutup menu mobile saat pindah halaman
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const account = isAuthenticated
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/login", label: "Masuk" };

  const openMenu = () => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <div ref={sentinelRef} className="header-sentinel" aria-hidden="true" />
      <noscript>
        <style>{`.site-header{color:#172b3a}.site-header__main::before{opacity:1}.site-header::before{opacity:0}`}</style>
      </noscript>

      <header
        ref={headerRef}
        className="site-header"
        data-variant={variant}
        data-scrolled={variant === "solid" ? "true" : "false"}
      >
        {variant === "overlay" && (
          <div className="site-header__util">
            <div className="hdr-container">
              <span>
                {lastUpdated
                  ? `Data terverifikasi diperbarui ${lastUpdated}`
                  : "Transparansi bantuan fisik untuk wilayah terdampak bencana"}
              </span>
              <span className="util-links">
                <Link href="/tentang#metodologi">Metodologi verifikasi</Link>
                {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
              </span>
            </div>
          </div>
        )}

        <div className="site-header__main">
          <div className="hdr-container site-header__row">
            <Link href="/" className="brand" aria-label="TILARA, beranda">
              <Logo />
              <span className="brand__text">
                <span className="brand__name">TILARA</span>
                <span className="brand__tag">Visibility for the Unreached</span>
              </span>
            </Link>

            <nav aria-label="Utama" className="nav">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav__link"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="actions">
              <Link href="/darurat" className="hdr-btn hdr-btn--danger">
                <Icon d={PHONE} size={16} />
                <span>Darurat</span>
              </Link>
              <Link href="/lapor" className="hdr-btn hdr-btn--primary">Lapor</Link>
              <Link href={account.href} className="icon-btn account" aria-label={account.label}>
                <Icon d={USER} />
              </Link>
              <button
                type="button"
                className="icon-btn burger"
                aria-label="Buka menu"
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                onClick={openMenu}
              >
                <Icon d={BURGER} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <dialog
        id="menu-mobile"
        ref={dialogRef}
        className="menu-dialog"
        aria-label="Menu navigasi"
        onClose={() => setMenuOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="menu-inner">
          <div className="menu-top">
            <Link href="/" className="brand" aria-label="TILARA, beranda" onClick={closeMenu}>
              <Logo />
              <span className="brand__name">TILARA</span>
            </Link>
            <button type="button" className="icon-btn" aria-label="Tutup menu" onClick={closeMenu}>
              <Icon d={CLOSE} />
            </button>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="menu-link"
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Link href={account.href} className="menu-link" onClick={closeMenu}>
            {account.label}
          </Link>
          <div className="menu-cta">
            <Link href="/darurat" className="hdr-btn hdr-btn--danger" onClick={closeMenu}>
              <Icon d={PHONE} size={16} />
              <span>Darurat</span>
            </Link>
            <Link href="/lapor" className="hdr-btn hdr-btn--primary" onClick={closeMenu}>
              Lapor
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}

