/**
 * Фон: сеть частиц + «молнии» от курсора к ближайшим точкам.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("bgParticles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles = [];
  let w = 0;
  let h = 0;
  let dpr = 1;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let mxSmooth = mx;
  let mySmooth = my;

  function particleCount() {
    const narrow = window.innerWidth < 640;
    const divisor = narrow ? 28000 : 15500;
    const cap = narrow ? 48 : 105;
    const floor = narrow ? 26 : 42;
    const n = Math.round((window.innerWidth * window.innerHeight) / divisor);
    return Math.max(floor, Math.min(n, cap));
  }

  function spawn() {
    particles = [];
    const n = particleCount();
    const speed = reducedMotion ? 0 : 0.28;
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed
      });
    }
  }

  function resize() {
    const mobile = window.innerWidth < 600;
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  window.addEventListener("resize", resize);

  window.addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  function isDark() {
    return document.body.classList.contains("is-inverted");
  }

  function rgba(alpha) {
    if (isDark()) {
      return `rgba(238,238,238,${alpha})`;
    }
    return `rgba(18,18,18,${alpha})`;
  }

  function maxLinkDist() {
    return Math.min(128, w * 0.11);
  }

  function cursorLinkDist() {
    return maxLinkDist() * 2.35;
  }

  function bounceParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) {
        p.x = 0;
        p.vx *= -1;
      } else if (p.x > w) {
        p.x = w;
        p.vx *= -1;
      }
      if (p.y < 0) {
        p.y = 0;
        p.vy *= -1;
      } else if (p.y > h) {
        p.y = h;
        p.vy *= -1;
      }
    }
  }

  function drawLightning(x0, y0, x1, y1, alpha, seed, t) {
    let midX;
    let midY;
    if (reducedMotion) {
      midX = (x0 + x1) / 2;
      midY = (y0 + y1) / 2;
    } else {
      midX =
        (x0 + x1) / 2 +
        Math.sin(seed + t * 8) * 26 +
        Math.sin(seed * 3 - t * 5) * 11;
      midY =
        (y0 + y1) / 2 +
        Math.cos(seed * 1.31 + t * 7) * 21 +
        Math.cos(seed * 2.07 + t * 6) * 9;
    }

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(midX, midY);
    ctx.lineTo(x1, y1);

    ctx.strokeStyle = rgba(alpha * 0.4);
    ctx.lineWidth = 2.4;
    ctx.stroke();

    ctx.strokeStyle = rgba(alpha);
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  let rafId = 0;

  function tick() {
    if (document.hidden) {
      rafId = 0;
      return;
    }

    ctx.clearRect(0, 0, w, h);

    const smooth = reducedMotion ? 0.35 : 0.14;
    mxSmooth += (mx - mxSmooth) * smooth;
    mySmooth += (my - mySmooth) * smooth;

    const dark = isDark();
    const linkD = maxLinkDist();
    const curD = cursorLinkDist();
    const t = performance.now() * 0.0028;

    if (!reducedMotion) {
      bounceParticles();
    }

    const n = particles.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < linkD) {
          const alpha = (1 - d / linkD) * (dark ? 0.2 : 0.14);
          ctx.strokeStyle = rgba(alpha);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < n; i++) {
      const p = particles[i];
      const d = Math.hypot(mxSmooth - p.x, mySmooth - p.y);
      if (d < curD && d > 0.5) {
        const falloff = 1 - d / curD;
        const alpha = falloff * (dark ? 0.58 : 0.4);
        drawLightning(mxSmooth, mySmooth, p.x, p.y, alpha, i * 1.618, t);
      }
    }

    const dotA = dark ? 0.38 : 0.3;
    const dotR = dark ? 1.45 : 1.2;
    ctx.fillStyle = rgba(dotA);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(tick);
  }

  resize();
  rafId = window.requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && rafId === 0) {
      rafId = window.requestAnimationFrame(tick);
    }
  });
})();

