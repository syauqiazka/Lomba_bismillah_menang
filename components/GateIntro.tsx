import "./gate-intro.css";

/**
 * Gate Intro TILARA — dua panel membuka ke kiri & kanan.
 * - Murni CSS (0 KB JavaScript animasi), hanya transform + opacity.
 * - Tampil sekali per sesi, hanya di beranda "/".
 * - Memakai simbol resmi tilara-symbol.svg (tanpa menggambar ulang logo).
 */

const SKIP_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem("tilara-intro")){d.dataset.intro="seen"}else{sessionStorage.setItem("tilara-intro","1")}}catch(e){}`;

function OfficialMark() {
  return (
    <svg viewBox="0 0 200 200" width="84" height="84" fill="none" aria-hidden="true">
      <g transform="translate(5 5) scale(1.8)" color="currentColor">
        <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            pathLength={1}
            d="M50 7 C60 7 65 13 74 12 C85 11 91 18 91 29 C91 38 98 44 94 55 C91 64 94 72 85 80 C77 87 77 96 66 98 C56 100 50 107 39 101 C30 96 21 99 15 90 C9 82 10 72 5 64 C0 55 7 46 8 37 C9 26 17 20 28 20 C37 20 41 7 50 7 Z"
          />
          <path
            pathLength={1}
            d="M50 17 C59 17 64 22 72 22 C80 22 83 29 82 37 C81 45 89 49 86 57 C83 65 85 72 77 78 C70 83 70 90 62 90 C54 90 49 98 41 92 C34 87 27 91 22 83 C18 77 19 69 14 62 C10 55 16 48 17 40 C18 31 24 29 33 29 C40 29 43 17 50 17 Z"
          />
          <path
            pathLength={1}
            d="M50 28 C57 28 61 33 67 32 C74 32 76 38 74 45 C73 51 80 54 77 61 C75 67 76 72 69 76 C63 80 62 86 56 83 C50 81 47 90 41 83 C35 78 31 82 28 75 C25 69 27 64 22 58 C19 53 24 48 25 42 C26 36 32 38 38 37 C43 36 44 28 50 28 Z"
          />
        </g>
        <circle cx="50" cy="55" r="6.4" fill="#246B50" />
      </g>
    </svg>
  );
}

function LogoBlock() {
  return (
    <div className="gate-logo">
      <OfficialMark />
      <span className="gate-word">TILARA</span>
      <span className="gate-tag">Visibility for the Unreached</span>
    </div>
  );
}

export default function GateIntro() {
  return (
    <>
      <script>{SKIP_SCRIPT}</script>
      <div className="gate-intro" aria-hidden="true">
        <div className="gate-panel gate-panel--l">
          <LogoBlock />
        </div>
        <div className="gate-panel gate-panel--r">
          <LogoBlock />
        </div>
        <div className="gate-seam" />
      </div>
    </>
  );
}

