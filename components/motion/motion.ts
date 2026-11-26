// motion.ts — TILARA Motion Kit (vanilla, ±1 KB gzip, tanpa dependensi)
const fmt = new Intl.NumberFormat("id-ID");

function countUp(el: HTMLElement, to: number) {
  const t0 = performance.now();
  const dur = 1100;
  const step = (t: number) => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Panggil sekali di layout/rute PUBLIK (bukan area operasional). Mengembalikan fungsi cleanup. */
export function initMotion(): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal], .gap-bar, [data-count]");

  // Reduced motion / browser lama: tampilkan semuanya apa adanya (HTML sudah berisi nilai akhir).
  if (reduce || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    return () => {};
  }

  document.documentElement.classList.add("motion-ready");

  // Angka: HTML berisi nilai nyata. Animasi hanya dari 0 menuju nilai itu.
  const counts = new Map<HTMLElement, number>();
  targets.forEach((el) => {
    const to = Number(el.dataset.count);
    if (el.dataset.count !== undefined && Number.isFinite(to)) {
      counts.set(el, to);
      el.setAttribute("aria-label", fmt.format(to)); // pembaca layar tetap mendengar nilai akhir
      el.textContent = "0";
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        el.classList.add("is-in");
        const to = counts.get(el);
        if (to !== undefined) countUp(el, to);
        io.unobserve(el);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );
  targets.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    document.documentElement.classList.remove("motion-ready");
  };
}

