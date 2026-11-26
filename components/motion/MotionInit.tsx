"use client";

// MotionInit.tsx — pasang di halaman/layout PUBLIK saja (dilarang di area operasional)
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./motion.css";
import { initMotion } from "./motion";

export default function MotionInit() {
  const pathname = usePathname();
  useEffect(() => initMotion(), [pathname]);
  return null;
}

