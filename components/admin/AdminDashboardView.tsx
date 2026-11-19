"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  RefreshCw,
  Search,
} from "lucide-react";
import type { AdminDashboardData, AdminUserData, AdminOrgData } from "@/lib/admin-queries";
import { updateUserRoleAction, verifyOrganizationAction } from "@/app/actions/admin-actions";

interface AdminDashboardViewProps {
  initialData: AdminDashboardData;
}

export function AdminDashboardView({ initialData }: AdminDashboardViewProps) {
  const [users, setUsers] = useState<AdminUserData[]>(initialData.users);
  const [orgs, setOrgs] = useState<AdminOrgData[]>(initialData.organizations);
  const [activeTab, setActiveTab] = useState<"USERS" | "ORGS">("USERS");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, newRole: "ADMIN" | "VERIFIKATOR" | "RELAWAN") => {
    startTransition(async () => {
      const res = await updateUserRoleAction({ userId, role: newRole });
      if (!res.ok) {
        setNotification({ type: "error", message: res.message });
      } else {
        setNotification({ type: "success", message: res.data.message });
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    });
  };

  const handleToggleVerifiedVolunteer = (userId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    startTransition(async () => {
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser) return;

      const res = await updateUserRoleAction({
        userId,
        role: targetUser.role,
        isVerifiedVolunteer: nextStatus,
      });

      if (!res.ok) {
        setNotification({ type: "error", message: res.message });
      } else {
        setNotification({
          type: "success",
          message: `Status relawan terpercaya ${targetUser.name} diubah menjadi ${nextStatus ? "AKTIF" : "NONAKTIF"}.`,
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isVerifiedVolunteer: nextStatus } : u))
        );
      }
    });
  };

  const handleToggleOrgVerification = (orgId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    startTransition(async () => {
      const res = await verifyOrganizationAction({
        organizationId: orgId,
        isVerified: nextStatus,
      });

      if (!res.ok) {
        setNotification({ type: "error", message: res.message });
      } else {
        setNotification({ type: "success", message: res.data.message });
        setOrgs((prev) =>
          prev.map((o) =>
            o.id === orgId
              ? { ...o, isVerified: nextStatus, verifiedAt: nextStatus ? new Date() : null }
              : o
          )
        );
      }
    });
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const filteredOrgs = orgs.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.type.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-forest-main)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Peta</span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-900 border border-purple-200">
            Akses Tingkat Administrator Sistem
          </span>
        </div>

        {/* Title Card */}
        <div className="bg-white p-6 rounded-lg border border-[var(--color-border-subtle)] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-900" />
              <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight">
                Panel Administrasi & Manajemen Sistem
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
              Pengaturan peran pengguna (RBAC), akreditasi lembaga resmi, dan pemantauan integritas data.
            </p>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            role="status"
            aria-live="polite"
            className={`p-3 rounded-md text-xs font-medium border flex items-center justify-between ${
              notification.type === "success"
                ? "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border-[var(--color-forest-border)]"
                : "bg-[var(--color-brick-bg)] text-[var(--color-brick-main)] border-[var(--color-brick-border)]"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:opacity-75"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Total Pengguna
            </span>
            <div className="text-2xl font-black font-mono text-[var(--color-text-main)] mt-1">
              {initialData.systemStats.totalUsers}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Laporan Terdaftar
            </span>
            <div className="text-2xl font-black font-mono text-[var(--color-text-main)] mt-1">
              {initialData.systemStats.totalReports}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-forest-main)]">
              Laporan Terverifikasi
            </span>
            <div className="text-2xl font-black font-mono text-[var(--color-forest-main)] mt-1">
              {initialData.systemStats.totalVerifiedReports}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
              Lembaga Resmi
            </span>
            <div className="text-2xl font-black font-mono text-purple-900 mt-1">
              {initialData.systemStats.totalOrganizations}
            </div>
          </div>
        </div>

        {/* Main Workspace Tabs & Search */}
        <div className="bg-white rounded-lg border border-[var(--color-border-subtle)] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("USERS")}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === "USERS"
                    ? "bg-[var(--color-forest-main)] text-white"
                    : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-100"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Manajemen Pengguna ({users.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ORGS")}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === "ORGS"
                    ? "bg-[var(--color-forest-main)] text-white"
                    : "bg-white text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] hover:bg-slate-100"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Verifikasi Lembaga ({orgs.length})</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--color-text-muted)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, tipe..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[var(--color-border-subtle)] rounded-md focus:outline-none focus:border-[var(--color-forest-main)]"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {activeTab === "USERS" ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
                  <tr>
                    <th className="p-3 font-semibold">Nama & Email</th>
                    <th className="p-3 font-semibold">Peran Sistem (RBAC)</th>
                    <th className="p-3 font-semibold">Status Relawan Terpercaya</th>
                    <th className="p-3 font-semibold text-center">Kontribusi</th>
                    <th className="p-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[var(--color-text-main)]">{user.name}</div>
                        <div className="text-[11px] font-mono text-[var(--color-text-muted)]">
                          {user.email} {user.phone && `• ${user.phone}`}
                        </div>
                      </td>

                      <td className="p-3">
                        <select
                          value={user.role}
                          disabled={isPending}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value as "ADMIN" | "VERIFIKATOR" | "RELAWAN")
                          }
                          className="px-2 py-1 rounded text-xs font-bold border border-[var(--color-border-subtle)] bg-white focus:outline-none focus:border-[var(--color-forest-main)] cursor-pointer"
                        >
                          <option value="RELAWAN">RELAWAN</option>
                          <option value="VERIFIKATOR">VERIFIKATOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>

                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleToggleVerifiedVolunteer(user.id, user.isVerifiedVolunteer)}
                          disabled={isPending}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                            user.isVerifiedVolunteer
                              ? "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border-[var(--color-forest-border)]"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {user.isVerifiedVolunteer ? "✓ Terpercaya (+20 skor)" : "Belum Diverifikasi"}
                        </button>
                      </td>

                      <td className="p-3 text-center text-[11px] font-mono text-[var(--color-text-muted)]">
                        {user.reportsCount} Laporan • {user.aidsCount} Bantuan
                      </td>

                      <td className="p-3 text-right">
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                          Terdaftar: {new Date(user.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-bg-base)] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
                  <tr>
                    <th className="p-3 font-semibold">Nama Lembaga Kemanusiaan</th>
                    <th className="p-3 font-semibold">Tipe Entitas</th>
                    <th className="p-3 font-semibold">Status Akreditasi</th>
                    <th className="p-3 font-semibold text-center">Anggota Aktif</th>
                    <th className="p-3 font-semibold text-right">Aksi Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {filteredOrgs.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-[var(--color-text-main)]">
                        {org.name}
                      </td>

                      <td className="p-3 text-[var(--color-text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold">
                          {org.type}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            org.isVerified
                              ? "bg-[var(--color-forest-bg)] text-[var(--color-forest-main)] border border-[var(--color-forest-border)]"
                              : "bg-[var(--color-amber-bg)] text-[var(--color-amber-main)] border border-[var(--color-amber-border)]"
                          }`}
                        >
                          {org.isVerified ? "✓ Resmi Terverifikasi (OFFICIAL)" : "Belum Diverifikasi"}
                        </span>
                      </td>

                      <td className="p-3 text-center font-mono font-bold text-xs">
                        {org.membersCount} Verifikator
                      </td>

                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleOrgVerification(org.id, org.isVerified)}
                          disabled={isPending}
                          className={`px-3 py-1.5 rounded text-xs font-bold text-white transition-colors flex items-center gap-1.5 ml-auto ${
                            org.isVerified
                              ? "bg-[var(--color-brick-main)] hover:bg-[var(--color-brick-dark)]"
                              : "bg-[var(--color-forest-main)] hover:bg-[var(--color-forest-dark)]"
                          } disabled:opacity-50`}
                        >
                          {isPending && <RefreshCw className="w-3 h-3 animate-spin" />}
                          <span>{org.isVerified ? "Batalkan Verifikasi" : "Verifikasi Resmi Lembaga"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

