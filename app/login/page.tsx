import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk ke Sistem | TILARA",
  description: "Akses masuk akun relawan, verifikator, dan administrator TILARA.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center p-4 py-12">
      <Suspense fallback={<div className="text-xs text-[var(--color-text-muted)]">Memuat formulir masuk...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

