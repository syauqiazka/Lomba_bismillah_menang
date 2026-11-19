"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { loginAction, registerAction } from "@/app/actions/auth-actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleQuickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);

    startTransition(async () => {
      const res = await loginAction({ email: demoEmail, password: demoPass });
      if (!res.ok) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(`Berhasil masuk sebagai ${res.data.user.name} (${res.data.user.role})`);
        setTimeout(() => {
          router.push(nextUrl);
          router.refresh();
        }, 600);
      }
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await loginAction({ email, password });
      if (!res.ok) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(`Berhasil masuk sebagai ${res.data.user.name}`);
        setTimeout(() => {
          router.push(nextUrl);
          router.refresh();
        }, 600);
      }
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await registerAction({
        name,
        email: regEmail,
        phone: phone || undefined,
        password: regPassword,
      });

      if (!res.ok) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage("Pendaftaran akun relawan berhasil! Mengalihkan ke sistem...");
        setTimeout(() => {
          router.push(nextUrl);
          router.refresh();
        }, 800);
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-forest-main)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
        {/* Header Title */}
        <div className="p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] text-center">
          <div className="w-10 h-10 rounded-full bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] flex items-center justify-center mx-auto mb-2">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-[var(--color-text-main)]">
            {mode === "LOGIN" ? "Masuk ke Sistem TRASEC" : "Daftar Akun Relawan"}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Humanitarian Intelligence Platform • Akses Terpadu
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-md p-1 bg-slate-200/60 mt-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("LOGIN");
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded transition-all flex items-center justify-center gap-1.5 ${
                mode === "LOGIN"
                  ? "bg-white text-[var(--color-text-main)] shadow-xs"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("REGISTER");
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded transition-all flex items-center justify-center gap-1.5 ${
                mode === "REGISTER"
                  ? "bg-white text-[var(--color-text-main)] shadow-xs"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Relawan</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="m-5 p-3 rounded bg-[var(--color-brick-bg)] border border-[var(--color-brick-border)] text-xs text-[var(--color-brick-main)] flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="m-5 p-3 rounded bg-[var(--color-forest-bg)] border border-[var(--color-forest-border)] text-xs text-[var(--color-forest-main)] flex items-start gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {mode === "LOGIN" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="login-email" className="block font-semibold text-[var(--color-text-main)] mb-1">
                  Alamat Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block font-semibold text-[var(--color-text-main)] mb-1">
                  Kata Sandi:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-md bg-[var(--color-forest-main)] text-white font-bold hover:bg-[var(--color-forest-dark)] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Masuk Sekarang</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="reg-name" className="block font-semibold text-[var(--color-text-main)] mb-1">
                  Nama Lengkap:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap sesuai identitas"
                    className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block font-semibold text-[var(--color-text-main)] mb-1">
                  Alamat Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-phone" className="block font-semibold text-[var(--color-text-main)] mb-1">
                  Nomor Telepon / WhatsApp (Opsional):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-pass" className="block font-semibold text-[var(--color-text-main)] mb-1">
                  Kata Sandi (Min. 8 karakter, 1 kapital, 1 angka):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-pass"
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full pl-9 pr-3 py-2 border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-md bg-[var(--color-forest-main)] text-white font-bold hover:bg-[var(--color-forest-dark)] transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Daftar Sebagai Relawan</span>
              </button>
            </form>
          )}
        </div>

        {/* Demo Fast Login Pills (Untuk Evaluator & Juri Lomba) */}
        <div className="p-4 bg-[var(--color-bg-base)] border-t border-[var(--color-border-subtle)] space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-forest-main)]" />
            <span>Pilihan Akun Uji Coba Cepat (Evaluasi Juri)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("admin@trasec.id", "AdminTrasec2026!")}
              className="p-2 rounded bg-white border border-[var(--color-border-subtle)] hover:border-purple-500 text-left transition-all"
            >
              <div className="font-bold text-purple-900">👑 Admin Sistem</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">admin@trasec.id</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("verifikator.komunitas@trasec.id", "Verifikator2026!")}
              className="p-2 rounded bg-white border border-[var(--color-border-subtle)] hover:border-[var(--color-forest-main)] text-left transition-all"
            >
              <div className="font-bold text-[var(--color-forest-main)]">🔍 Verifikator Komunitas</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">verifikator.komunitas@trasec.id</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("pmi.verifikator@trasec.id", "Verifikator2026!")}
              className="p-2 rounded bg-white border border-[var(--color-border-subtle)] hover:border-[var(--color-forest-main)] text-left transition-all"
            >
              <div className="font-bold text-[var(--color-forest-main)]">🏢 Verifikator Lembaga (PMI)</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">pmi.verifikator@trasec.id</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin("dewi.relawan@trasec.id", "Relawan2026!")}
              className="p-2 rounded bg-white border border-[var(--color-border-subtle)] hover:border-blue-500 text-left transition-all"
            >
              <div className="font-bold text-blue-900">🤝 Relawan Terpercaya</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">dewi.relawan@trasec.id</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

