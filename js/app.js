/* ============================================
   Carol Partidas — Real Estate Website
   GSAP + Lenis + ScrollTrigger
   Normal-flow layout with reveal animations
   ============================================ */

// ---- Lenis Smooth Scroll ----
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ---- Loader ----
function initLoader() {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");
  const images = [...document.querySelectorAll("img")];

  let loaded = 0;
  const total = Math.max(images.length, 1);

  function update() {
    loaded++;
    bar.style.width = Math.round((loaded / total) * 100) + "%";
  }

  if (images.length === 0) {
    bar.style.width = "100%";
  } else {
    images.forEach((img) =>
      img.decode().then(update).catch(update)
    );
  }

  // Min display time then fade out
  setTimeout(() => {
    bar.style.width = "100%";
    setTimeout(() => {
      gsap.to(loader, {
        opacity: 0, duration: 0.5,
        onComplete: () => loader.remove(),
      });
    }, 300);
  }, 800);
}

// ---- Header scroll effect ----
function initHeader() {
  const header = document.querySelector(".header");
  ScrollTrigger.create({
    start: "top -60",
    onUpdate: () => {
      header.classList.toggle("scrolled", window.scrollY > 60);
    },
  });
}

// ---- Hero animations ----
function initHero() {
  const tl = gsap.timeline({ delay: 0.8 });

  tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.5, ease: "power3.out" })
    .from(".hero-title", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
    .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
    .from(".hero-actions", { y: 20, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.2")
    .from(".hero-social", { y: 15, opacity: 0, duration: 0.4, ease: "power3.out" }, "-=0.2")
    .from(".hero-photo-shape", { x: 40, opacity: 0, duration: 0.7, ease: "power2.out" }, 0.6)
    .from(".hero-photo-frame", { y: 40, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.7)
    .from(".hero-floating-card", { y: 20, opacity: 0, scale: 0.9, duration: 0.5, ease: "back.out(1.5)" }, 1.1);
}

// ---- Reveal on scroll (IntersectionObserver + class toggle) ----
function initReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ---- Counter animations ----
function initCounters() {
  const stats = document.querySelectorAll(".stat");

  ScrollTrigger.create({
    trigger: ".stats-bar",
    start: "top 80%",
    once: true,
    onEnter: () => {
      stats.forEach((stat) => {
        const numEl = stat.querySelector(".stat-num");
        const target = parseInt(stat.dataset.value);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: "power1.out",
          onUpdate: () => {
            numEl.textContent = Math.round(obj.val);
          },
        });
      });
    },
  });
}

// ---- Marquee ----
function initMarquee() {
  const track = document.querySelector(".marquee-track");
  if (!track) return;

  gsap.to(track, {
    xPercent: -50,
    duration: 20,
    ease: "none",
    repeat: -1,
  });
}

// ---- Animated house SVG ----
function initHouseAnimation() {
  const svg = document.querySelector(".house-svg");
  if (!svg) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top 70%",
      once: true,
    },
  });

  // Draw ground
  tl.from(".house-ground", { scaleX: 0, transformOrigin: "center", duration: 0.4, ease: "power2.out" })
    // Build house body from bottom up
    .from(".house-body", { scaleY: 0, transformOrigin: "bottom", duration: 0.6, ease: "back.out(1.2)" }, 0.2)
    // Roof drops in
    .from(".house-roof, .house-roof-fill", { y: -30, opacity: 0, duration: 0.5, ease: "bounce.out" }, 0.6)
    // Chimney rises
    .from(".house-chimney", { scaleY: 0, transformOrigin: "bottom", duration: 0.3, ease: "power2.out" }, 0.8)
    // Door appears
    .from(".house-door", { scaleY: 0, transformOrigin: "bottom", duration: 0.4, ease: "power3.out" }, 0.9)
    .from(".house-doorknob", { scale: 0, duration: 0.2, ease: "back.out(3)" }, 1.2)
    // Windows pop in
    .from(".house-window", { scale: 0, transformOrigin: "center", duration: 0.3, stagger: 0.1, ease: "back.out(2)" }, 1.0)
    .from(".house-window-cross", { opacity: 0, duration: 0.2, stagger: 0.05 }, 1.3)
    // Trees grow
    .from(".house-tree-trunk", { scaleY: 0, transformOrigin: "bottom", duration: 0.3, stagger: 0.1, ease: "power2.out" }, 1.2)
    .from(".house-tree-top, .house-tree-top2", { scale: 0, transformOrigin: "center bottom", duration: 0.4, stagger: 0.08, ease: "back.out(1.5)" }, 1.4)
    // Path fades in
    .from(".house-path", { opacity: 0, duration: 0.3 }, 1.5)
    // Heart appears
    .from(".house-heart", { scale: 0, transformOrigin: "center", duration: 0.4, ease: "back.out(3)" }, 1.7)
    // Window glow pulse
    .to(".window-glow", { opacity: 0.08, duration: 0.8, stagger: 0.15, ease: "power1.inOut", yoyo: true, repeat: -1 }, 1.8);
}

// ---- Georgia parallax ----
function initParallax() {
  const bgImg = document.querySelector(".georgia-bg-img");
  if (!bgImg) return;

  gsap.to(bgImg, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".georgia-banner",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

// ---- Contact Form ----
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("formStatus");
    const btn = form.querySelector(".btn");
    btn.textContent = "Enviando...";
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(
        "https://n8n.srv906468.hstgr.cloud/webhook/carol-website-leads",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        status.textContent = "¡Mensaje enviado! Me pondré en contacto pronto.";
        status.style.color = "#7B0A3E";
        form.reset();
      } else {
        throw new Error("Server error");
      }
    } catch {
      status.textContent = "Algo salió mal. Llámame al (678) 516-4544.";
      status.style.color = "#e53e3e";
    } finally {
      btn.textContent = "Enviar Mensaje";
      btn.disabled = false;
    }
  });
}

// ---- Smooth anchors ----
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
}

// ---- Hamburger ----
function initHamburger() {
  const btn = document.querySelector(".hamburger");
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
  initHeader();
  initHero();
  initReveal();
  initCounters();
  initMarquee();
  initHouseAnimation();
  initParallax();
  initContactForm();
  initAnchors();
  initHamburger();
});