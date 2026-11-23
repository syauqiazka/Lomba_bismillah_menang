/**
 * ==============================================================================
 * KINDORA - INTERACTIVE LOGIC & ANIMATIONS
 * ==============================================================================
 * Controls UI state, IntersectionObserver count-ups, carousels, modals, & tabs.
 */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.KINDORA_DATA;
  if (!data) {
    console.error("KINDORA_DATA not found. Make sure data.js is loaded first.");
    return;
  }

  initBrandElements(data);
  initStickyNavbar();
  initMobileMenu();
  initScrollAnimations();
  initNumberCountUps();
  initProgressBars();
  initMissionVisionTabs(data);
  initFaqAccordion();
  initCausesCarousel();
  initProgramsSlider();
  initDonationModal();
  initVideoModal();
  initNewsletterForm();
});

/**
 * 1. Brand Elements & Text injection
 */
function initBrandElements(data) {
  // Brand name in titles / watermarks
  document.querySelectorAll("[data-brand-name]").forEach(el => {
    el.textContent = data.brand.name;
  });

  // Topbar info
  const topPhone = document.querySelector("#topbar-phone");
  if (topPhone) {
    topPhone.textContent = data.topBar.phone;
    topPhone.href = `tel:${data.topBar.phone.replace(/[^0-9+]/g, "")}`;
  }

  const topEmail = document.querySelector("#topbar-email");
  if (topEmail) {
    topEmail.textContent = data.topBar.email;
    topEmail.href = `mailto:${data.topBar.email}`;
  }
}

/**
 * 2. Sticky Navbar with elevation on scroll
 */
function initStickyNavbar() {
  const navbar = document.querySelector("#main-navbar");
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add("bg-white/95", "backdrop-blur-md", "shadow-sm", "border-b", "border-neutral-200/60");
      navbar.classList.remove("bg-white", "bg-transparent");
    } else {
      navbar.classList.remove("shadow-sm", "border-b", "border-neutral-200/60");
      navbar.classList.add("bg-white");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector("#mobile-menu-toggle");
  const mobileDrawer = document.querySelector("#mobile-drawer");
  const closeBtn = document.querySelector("#mobile-drawer-close");
  const overlay = document.querySelector("#mobile-drawer-overlay");
  const links = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !mobileDrawer) return;

  const openDrawer = () => {
    mobileDrawer.classList.remove("translate-x-full");
    if (overlay) overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    mobileDrawer.classList.add("translate-x-full");
    if (overlay) overlay.classList.add("hidden");
    document.body.style.overflow = "";
  };

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);
  links.forEach(link => link.addEventListener("click", closeDrawer));
}

/**
 * 4. IntersectionObserver Fade-up on scroll
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach(el => observer.observe(el));
}

/**
 * 5. Animated Count-Up Numbers
 */
function initNumberCountUps() {
  const countElements = document.querySelectorAll("[data-counter-target]");
  if (!countElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-counter-target"), 10);
          const suffix = el.getAttribute("data-counter-suffix") || "";
          const prefix = el.getAttribute("data-counter-prefix") || "";
          const duration = 1600;
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
          };

          requestAnimationFrame(updateCount);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  countElements.forEach(el => observer.observe(el));
}

/**
 * 6. Animated Donation Progress Bars
 */
function initProgressBars() {
  const bars = document.querySelectorAll("[data-progress-percent]");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const percent = bar.getAttribute("data-progress-percent");
          bar.style.width = `${percent}%`;
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.25 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/**
 * 7. Mission & Vision Tab Switcher
 */
function initMissionVisionTabs(data) {
  const tabMission = document.querySelector("#tab-btn-mission");
  const tabVision = document.querySelector("#tab-btn-vision");
  const tabContent = document.querySelector("#tab-text-content");

  if (!tabMission || !tabVision || !tabContent) return;

  tabMission.addEventListener("click", () => {
    tabMission.classList.add("bg-[#F5B800]", "text-neutral-900", "shadow-sm");
    tabMission.classList.remove("bg-white", "text-neutral-600");
    tabVision.classList.remove("bg-[#F5B800]", "text-neutral-900", "shadow-sm");
    tabVision.classList.add("bg-white", "text-neutral-600");

    tabContent.style.opacity = "0";
    setTimeout(() => {
      tabContent.textContent = data.missionVision.missionText;
      tabContent.style.opacity = "1";
    }, 150);
  });

  tabVision.addEventListener("click", () => {
    tabVision.classList.add("bg-[#F5B800]", "text-neutral-900", "shadow-sm");
    tabVision.classList.remove("bg-white", "text-neutral-600");
    tabMission.classList.remove("bg-[#F5B800]", "text-neutral-900", "shadow-sm");
    tabMission.classList.add("bg-white", "text-neutral-600");

    tabContent.style.opacity = "0";
    setTimeout(() => {
      tabContent.textContent = data.missionVision.visionText;
      tabContent.style.opacity = "1";
    }, 150);
  });
}

/**
 * 8. FAQ Accordion (Smooth slide & chevron toggle)
 */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-accordion-item");
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".accordion-content");
    const icon = item.querySelector(".faq-icon");

    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = content.classList.contains("open");

      // Close all others
      items.forEach(other => {
        const otherContent = other.querySelector(".accordion-content");
        const otherIcon = other.querySelector(".faq-icon");
        if (otherContent && otherContent !== content) {
          otherContent.classList.remove("open");
          if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
        }
      });

      // Toggle current
      if (isOpen) {
        content.classList.remove("open");
        if (icon) icon.style.transform = "rotate(0deg)";
      } else {
        content.classList.add("open");
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

/**
 * 9. Causes Carousel Navigation
 */
function initCausesCarousel() {
  const container = document.querySelector("#causes-grid-container");
  const prevBtn = document.querySelector("#causes-carousel-prev");
  const nextBtn = document.querySelector("#causes-carousel-next");

  if (!container || !prevBtn || !nextBtn) return;

  const scrollAmount = 360;

  prevBtn.addEventListener("click", () => {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

/**
 * 10. Programs Slider Navigation & Dots
 */
function initProgramsSlider() {
  const slider = document.querySelector("#programs-slider");
  const dotsContainer = document.querySelector("#programs-slider-dots");
  if (!slider) return;

  const slides = slider.querySelectorAll(".program-slide");
  if (!slides.length) return;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.className = `w-2.5 h-2.5 rounded-full transition-all ${
        idx === 0 ? "bg-[#F5B800] w-7" : "bg-neutral-300"
      }`;
      dot.setAttribute("aria-label", `Slide ${idx + 1}`);
      dot.addEventListener("click", () => {
        slides[idx].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsContainer.appendChild(dot);
    });

    // Update active dot on scroll
    slider.addEventListener("scroll", () => {
      const scrollLeft = slider.scrollLeft;
      const slideWidth = slides[0].offsetWidth;
      const activeIndex = Math.round(scrollLeft / slideWidth);

      const dots = dotsContainer.querySelectorAll("button");
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.className = "w-7 h-2.5 rounded-full bg-[#F5B800] transition-all";
        } else {
          dot.className = "w-2.5 h-2.5 rounded-full bg-neutral-300 transition-all";
        }
      });
    }, { passive: true });
  }
}

/**
 * 11. Interactive Donation Modal
 */
function initDonationModal() {
  const modal = document.querySelector("#donation-modal");
  const overlay = document.querySelector("#donation-modal-overlay");
  const closeBtn = document.querySelector("#donation-modal-close");
  const triggerBtns = document.querySelectorAll(".btn-donate-trigger");
  const amountBtns = document.querySelectorAll(".donation-amount-btn");
  const customAmountInput = document.querySelector("#custom-donation-amount");
  const confirmBtn = document.querySelector("#confirm-donation-btn");
  const receiptState = document.querySelector("#donation-receipt-state");
  const formState = document.querySelector("#donation-form-state");

  if (!modal) return;

  let selectedAmount = 50;

  const openModal = (causeName = "Emergency Relief Fund") => {
    modal.classList.remove("hidden");
    if (formState) formState.classList.remove("hidden");
    if (receiptState) receiptState.classList.add("hidden");
    const causeTitleEl = document.querySelector("#modal-cause-title");
    if (causeTitleEl) causeTitleEl.textContent = causeName;
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const cause = btn.getAttribute("data-cause-title") || "Universal Relief Fund";
      openModal(cause);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  // Amount selector
  amountBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      amountBtns.forEach(b => {
        b.classList.remove("bg-[#F5B800]", "text-neutral-900", "border-[#F5B800]");
        b.classList.add("bg-neutral-50", "text-neutral-700", "border-neutral-200");
      });
      btn.classList.add("bg-[#F5B800]", "text-neutral-900", "border-[#F5B800]");
      btn.classList.remove("bg-neutral-50", "text-neutral-700", "border-neutral-200");
      selectedAmount = parseInt(btn.getAttribute("data-amount"), 10);
      if (customAmountInput) customAmountInput.value = "";
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener("input", (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        amountBtns.forEach(b => {
          b.classList.remove("bg-[#F5B800]", "text-neutral-900", "border-[#F5B800]");
          b.classList.add("bg-neutral-50", "text-neutral-700", "border-neutral-200");
        });
        selectedAmount = val;
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", (e) => {
      e.preventDefault();
      confirmBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-neutral-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      `;

      setTimeout(() => {
        confirmBtn.innerHTML = "Complete Donation";
        if (formState) formState.classList.add("hidden");
        if (receiptState) {
          receiptState.classList.remove("hidden");
          const receiptAmountEl = document.querySelector("#receipt-amount");
          if (receiptAmountEl) receiptAmountEl.textContent = `$${selectedAmount.toLocaleString()}`;
        }
      }, 900);
    });
  }
}

/**
 * 12. Video Modal Popup
 */
function initVideoModal() {
  const playBtn = document.querySelector("#video-play-btn");
  const modal = document.querySelector("#video-modal");
  const closeBtn = document.querySelector("#video-modal-close");
  const overlay = document.querySelector("#video-modal-overlay");

  if (!playBtn || !modal) return;

  const openVideo = () => {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeVideo = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  playBtn.addEventListener("click", openVideo);
  if (closeBtn) closeBtn.addEventListener("click", closeVideo);
  if (overlay) overlay.addEventListener("click", closeVideo);
}

/**
 * 13. Newsletter Form Handler
 */
function initNewsletterForm() {
  const form = document.querySelector("#newsletter-form");
  const input = document.querySelector("#newsletter-email");
  const message = document.querySelector("#newsletter-success");

  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim() && input.value.includes("@")) {
      input.value = "";
      if (message) {
        message.classList.remove("hidden");
        setTimeout(() => message.classList.add("hidden"), 4000);
      }
    }
  });
}
