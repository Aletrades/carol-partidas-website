/* ============================================
   Carol Partidas — Real Estate Website
   GSAP + Lenis + ScrollTrigger
   ============================================ */

// ---- Lenis Smooth Scroll ----
const lenis = new Lenis({
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ---- Loader ----
async function initLoader() {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");
  const pct = document.getElementById("loader-percent");
  const images = [...document.querySelectorAll("img")];

  if (images.length === 0) {
    bar.style.width = "100%";
    pct.textContent = "100%";
  } else {
    let loaded = 0;
    await Promise.all(
      images.map((img) =>
        img
          .decode()
          .then(() => {
            loaded++;
            const p = Math.round((loaded / images.length) * 100);
            bar.style.width = p + "%";
            pct.textContent = p + "%";
          })
          .catch(() => {
            loaded++;
          })
      )
    );
  }

  await new Promise((r) => setTimeout(r, 300));
  gsap.to(loader, {
    opacity: 0,
    duration: 0.4,
    onComplete: () => loader.remove(),
  });
}

// ---- Hero Parallax + CTA ----
function initHeroParallax() {
  const heroBg = document.querySelector(".hero-bg");
  const heroWords = document.querySelectorAll(".hero-heading .word");
  const heroTagline = document.querySelector(".hero-tagline");
  const heroLabel = document.querySelector(".hero-content .section-label");
  const heroCta = document.querySelector(".hero-cta");

  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-standalone",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  if (heroLabel) {
    gsap.from(heroLabel, {
      y: 15,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.15,
    });
  }

  if (heroWords.length) {
    gsap.from(heroWords, {
      y: 50,
      opacity: 0,
      stagger: 0.07,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.3,
    });
  }

  if (heroTagline) {
    gsap.from(heroTagline, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.7,
    });
  }

  if (heroCta) {
    gsap.from(heroCta, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.9,
    });
  }
}

// ---- Header background on scroll ----
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  ScrollTrigger.create({
    start: "top -80",
    onUpdate: (self) => {
      if (self.direction === 1 && window.scrollY > 80) {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(12px)";
        header.style.boxShadow = "0 1px 0 rgba(0, 0, 0, 0.08)";
      } else if (window.scrollY <= 80) {
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
        header.style.boxShadow = "none";
      }
    },
  });
}

// ---- Section Animation System ----
function setupSections() {
  const scrollContainer = document.getElementById("scroll-container");
  if (!scrollContainer) return;

  const totalHeight = scrollContainer.offsetHeight;

  document.querySelectorAll(".scroll-section").forEach((section) => {
    const enter = parseFloat(section.dataset.enter) / 100;
    const leave = parseFloat(section.dataset.leave) / 100;
    const midpoint = (enter + leave) / 2;

    section.style.top = midpoint * totalHeight + "px";

    setupSectionAnimation(section, scrollContainer, enter, leave);
  });
}

function setupSectionAnimation(section, scrollContainer, enter, leave) {
  const type = section.dataset.animation;
  const persist = section.dataset.persist === "true";
  const children = section.querySelectorAll(
    ".section-label, .section-heading, .section-body, .agent-photo-full, .agent-certs, .listings-grid, .testimonials-list, .contact-form, .stat, .stats-grid, .listings-side-text, .contact-socials"
  );

  if (!children.length) return;

  const tl = gsap.timeline({ paused: true });

  switch (type) {
    case "fade-up":
      tl.from(children, {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
      });
      break;
    case "slide-left":
      tl.from(children, {
        x: -60,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
      });
      break;
    case "slide-right":
      tl.from(children, {
        x: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
      });
      break;
    case "scale-up":
      tl.from(children, {
        scale: 0.9,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
      });
      break;
    case "rotate-in":
      tl.from(children, {
        y: 30,
        rotation: 2,
        opacity: 0,
        stagger: 0.07,
        duration: 0.5,
        ease: "power3.out",
      });
      break;
    case "stagger-up":
      tl.from(children, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out",
      });
      break;
    case "clip-reveal":
      tl.from(children, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power4.inOut",
      });
      break;
  }

  let hasPlayed = false;

  ScrollTrigger.create({
    trigger: scrollContainer,
    start: "top top",
    end: "bottom bottom",
    scrub: false,
    onUpdate: (self) => {
      const p = self.progress;
      if (p >= enter && p <= leave) {
        const localProgress = (p - enter) / (leave - enter);
        section.style.opacity = 1;

        if (localProgress >= 0.05 && !hasPlayed) {
          tl.play();
          hasPlayed = true;
          // Trigger counters when stats section becomes visible
          if (section.classList.contains("section-stats")) {
            animateCounters(section);
          }
        }

        if (!persist && localProgress > 0.85 && hasPlayed) {
          tl.reverse();
          hasPlayed = false;
        }
      } else if (!persist) {
        if (p < enter) {
          section.style.opacity = 0;
          tl.progress(0).pause();
          hasPlayed = false;
        }
        if (p > leave) {
          section.style.opacity = 0;
        }
      }
    },
  });
}

// ---- Counter Animations ----
function animateCounters(statsSection) {
  statsSection.querySelectorAll(".stat-number").forEach((el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = "true";

    const target = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || "0");
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.5,
      ease: "power1.out",
      onUpdate: () => {
        el.textContent = decimals === 0 ? Math.round(obj.val) : obj.val.toFixed(decimals);
      },
    });
  });
}

// ---- Horizontal Marquee (continuous loop + scroll boost) ----
function initMarquee() {
  document.querySelectorAll(".marquee-wrap").forEach((el) => {
    const textEl = el.querySelector(".marquee-text");
    if (!textEl) return;

    gsap.to(textEl, {
      xPercent: -50,
      duration: 12,
      ease: "none",
      repeat: -1,
    });

    gsap.to(textEl, {
      x: "-=300",
      ease: "none",
      scrollTrigger: {
        trigger: document.getElementById("scroll-container"),
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  });
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("formStatus");
    const btn = form.querySelector(".cta-button");

    btn.textContent = "Enviando...";
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("https://n8n.srv906468.hstgr.cloud/webhook/carol-website-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        status.textContent = "¡Mensaje enviado! Me pondré en contacto pronto.";
        status.style.color = "#7B0A3E";
        form.reset();
      } else {
        throw new Error("Server error");
      }
    } catch {
      status.textContent = "Algo salió mal. Llámame directamente al (678) 516-4544.";
      status.style.color = "#e53e3e";
    } finally {
      btn.textContent = "Enviar Mensaje";
      btn.disabled = false;
    }
  });
}

// ---- Smooth scroll anchors ----
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
}

// ---- Mobile Hamburger Menu ----
function initHamburger() {
  const btn = document.querySelector(".nav-hamburger");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("active");
      links.classList.remove("open");
    });
  });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initHeroParallax();
  initHeaderScroll();
  setupSections();
  initMarquee();
  initContactForm();
  initSmoothAnchors();
  initHamburger();
});