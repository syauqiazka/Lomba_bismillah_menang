"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StoryScrollEngineProps {
  rootRef: RefObject<HTMLDivElement | null>;
}

/**
 * Mesin GSAP + ScrollTrigger yang dimuat lazy hanya pada halaman cerita publik.
 * Mengikuti gsap-react & gsap-scrolltrigger skill: useGSAP + scope + gsap.matchMedia().
 */
export default function StoryScrollEngine({ rootRef }: StoryScrollEngineProps) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          ok: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 900px)",
        },
        (ctx) => {
          const { ok, desktop } = ctx.conditions as { ok: boolean; desktop: boolean };
          if (!ok) return;

          // 1. Progres baca naratif antarbagian pada bilah tipis atas
          const progressEl = rootRef.current?.querySelector("[data-gsap='scroll-progress']");
          if (progressEl && rootRef.current) {
            gsap.to(progressEl, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            });
          }

          // 2. Bab cerita berurutan ([data-chapter] / [data-chapter-item])
          gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((chapter) => {
            const items = chapter.querySelectorAll("[data-chapter-item]");
            if (!items.length) return;
            gsap.from(items, {
              y: 28,
              autoAlpha: 0,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.1,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: chapter, start: "top 78%", once: true },
            });
          });

          // 3. Desktop (>= 900px): media sticky halus & langkah konteks 5W+1H
          if (desktop) {
            gsap.utils.toArray<HTMLElement>("[data-chapter-media]").forEach((media) => {
              gsap.fromTo(
                media,
                { scale: 1.06 },
                {
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: media.closest("[data-chapter]") ?? media,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              );
            });

            const storySteps = rootRef.current?.querySelectorAll("[data-gsap='story-step']");
            if (storySteps && storySteps.length > 0) {
              gsap.from(storySteps, {
                y: 12,
                autoAlpha: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: "power2.out",
                clearProps: "transform,opacity,visibility",
                scrollTrigger: {
                  trigger: storySteps[0],
                  start: "top 86%",
                  once: true,
                },
              });
            }
          }
        }
      );

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return null;
}

