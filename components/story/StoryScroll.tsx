"use client";

import dynamic from "next/dynamic";
import { useRef, type ReactNode } from "react";

const StoryScrollEngine = dynamic(() => import("./StoryScrollEngine"), {
  ssr: false,
});

/**
 * Pembungkus bab cerita (story-first) untuk rute publik naratif.
 * Konten HTML tetap di-SSR penuh (terbaca tanpa JS), sedangkan GSAP + ScrollTrigger
 * dimuat lazy sebagai chunk terpisah di client.
 */
export default function StoryScroll({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  return (
    <div ref={root}>
      <StoryScrollEngine rootRef={root} />
      {children}
    </div>
  );
}

