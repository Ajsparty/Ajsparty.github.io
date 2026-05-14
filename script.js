(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => root.querySelectorAll(s);

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Sticky Header
  const header = $(".site-header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile nav toggle
  const navToggle = $("#navToggle");
  const mobileNav = $("#mobileNav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.style.display = open ? "none" : "block";
      mobileNav.setAttribute("aria-hidden", String(open));
    });

    mobileNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      navToggle.setAttribute("aria-expanded", "false");
      mobileNav.style.display = "none";
      mobileNav.setAttribute("aria-hidden", "true");
    });
  }

  // Smooth scroll
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='#']");
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });

  // Resume buttons
  const resumeBtn = $("#resumeBtn");
  const resumeBtnMobile = $("#resumeBtnMobile");
  const resumeHref = "./resume.pdf";
  [resumeBtn, resumeBtnMobile].forEach(btn => {
    if (!btn) return;
    btn.href = resumeHref;
  });

  // Mailto
  window.siteMailto = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const to = "Swenso44@msu.edu";
    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    return false;
  };

  // ===== Starfield =====
  const canvas = $("#stars");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let W = 0, H = 0, dpr = 1;
    const stars = [];
    const shooters = [];

    const cfg = {
      starCount: 160,
      driftX: 0.025,
      driftY: 0.015,
      twinkle: 0.0022,
      shooterChancePerMs: 0.00012,
      accent: [255, 42, 0],
    };

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      W = Math.floor(window.innerWidth);
      H = Math.floor(window.innerHeight);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      for (let i = 0; i < cfg.starCount; i++) stars.push(makeStar(true));
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function makeStar(randomPos = false) {
      const x = randomPos ? rand(0, W) : rand(-50, W + 50);
      const y = randomPos ? rand(0, H) : rand(-50, H + 50);
      const r = rand(0.6, 1.8);
      const a = rand(0.25, 0.95);
      const sp = rand(0.4, 1.4);
      const hue = rand(0, 1) < 0.18 ? "accent" : "white";
      return { x, y, r, a, sp, t: rand(0, 1000), hue };
    }

    function spawnShooter() {
      const x = rand(-W * 0.2, W * 0.5);
      const y = rand(-H * 0.1, H * 0.3);
      const vx = rand(1.2, 1.8);
      const vy = rand(0.7, 1.2);
      const life = rand(500, 900);
      shooters.push({ x, y, vx, vy, life, age: 0 });
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(48, now - last);
      last = now;
      ctx.clearRect(0, 0, W, H);

      const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
      g.addColorStop(0, "rgba(255,42,0,0.06)");
      g.addColorStop(0.45, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.t += dt;
        s.x += cfg.driftX * dt * s.sp;
        s.y += cfg.driftY * dt * s.sp;
        if (s.x > W + 60) s.x = -60;
        if (s.y > H + 60) s.y = -60;

        const tw = 0.6 + 0.4 * Math.sin(s.t * cfg.twinkle * 10);
        const alpha = Math.max(0, Math.min(1, s.a * tw));

        if (s.hue === "accent") {
          ctx.fillStyle = `rgba(${cfg.accent[0]},${cfg.accent[1]},${cfg.accent[2]},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(245,245,245,${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.random() < cfg.shooterChancePerMs * dt) spawnShooter();

      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.age += dt;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;

        const p = sh.age / sh.life;
        const fade = p < 0.2 ? (p / 0.2) : (p > 0.85 ? (1 - p) / 0.15 : 1);
        const a = Math.max(0, Math.min(1, fade));

        const tail = 220;
        const tx = sh.x - sh.vx * tail;
        const ty = sh.y - sh.vy * tail;

        const grad = ctx.createLinearGradient(tx, ty, sh.x, sh.y);
        grad.addColorStop(0, "rgba(255,42,0,0)");
        grad.addColorStop(0.55, `rgba(255,42,0,${0.18 * a})`);
        grad.addColorStop(1, `rgba(255,122,102,${0.65 * a})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,200,190,${0.85 * a})`;
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        if (sh.age >= sh.life || sh.x > W + 400 || sh.y > H + 400) shooters.splice(i, 1);
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(frame);
  }

  // ===== Scroll Animations + Skill Bars =====
  const animateOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Animate skill bars
          if (entry.target.id === "skills") {
            $$(".fill", entry.target).forEach(bar => {
              const width = bar.style.width;
              bar.style.width = "0";
              setTimeout(() => {
                bar.style.width = width;
              }, 50);
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    $$(".section, .card, .experience-item, .testimonial-card").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      observer.observe(el);
    });

    // Make visible class
    const style = document.createElement("style");
    style.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
  };

  // ===== Project Filtering =====
  const initFilters = () => {
    const filterBtns = $$(".filter-btn");
    const cards = $$(".cards .card");

    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        cards.forEach(card => {
          if (filter === "all") {
            card.style.display = "block";
          } else {
            card.style.display = card.dataset.category === filter ? "block" : "none";
          }
        });
      });
    });
  };

  // ===== Enhanced Modal =====
  const initModals = () => {
    const modal = $("#demo-modal");
    if (!modal) return;

    const closeBtn = modal.querySelector(".close");
    const modalTitle = $("#modal-title");
    const modalCode = $("#modal-code");
    const modalExtra = $("#modal-extra");

    // Demo content
    const demos = {
      "student-success": {
        title: "Student Success Predictor - Key Code",
        code: `model = RandomForestRegressor(n_estimators=300, max_depth=12)
model.fit(X_train, y_train)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Streamlit prediction interface
st.slider("Study Time (hours/week)", 0, 10, 5)`
      },
      "stock": {
        title: "Live Portfolio Simulator",
        code: `// Interactive demo powered by Chart.js
// Adjust sliders to see real-time portfolio rebalancing` ,
        extra: `<div style="margin-top:20px">
          <label>Risk Tolerance: <input type="range" id="risk" min="1" max="10" value="5"></label>
          <canvas id="portfolioChart" width="400" height="200"></canvas>
        </div>`
      }
    };

    $$(".demo-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const project = btn.dataset.project;
        const demo = demos[project] || { title: "Demo", code: "// Demo code coming soon" };

        modalTitle.textContent = demo.title;
        modalCode.textContent = demo.code;
        modalExtra.innerHTML = demo.extra || "";
        modal.style.display = "block";

        // Initialize simple stock chart if needed
        if (project === "stock") {
          setTimeout(() => {
            const ctx = document.getElementById("portfolioChart");
            if (ctx && window.Chart) {
              new Chart(ctx, {
                type: "pie",
                data: {
                  labels: ["Tech", "Finance", "Energy", "Healthcare"],
                  datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: ["#ff2a00", "#ff7a66", "#f5f5f5", "#a1a1aa"]
                  }]
                }
              });
            }
          }, 300);
        }
      });
    });

    // Close modal
    const closeModal = () => modal.style.display = "none";
    closeBtn.onclick = closeModal;

    window.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") closeModal();
    });
  };

  // Initialize everything
  window.addEventListener("load", () => {
    animateOnScroll();
    initFilters();
    initModals();
  });
})();