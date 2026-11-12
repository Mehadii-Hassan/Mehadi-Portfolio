/*
 * ============================================================
 *  BACKGROUND.JS — animated canvas neural-network background.
 *  Slow-moving particles connected by faint lines, gentle mouse
 *  parallax. Uses requestAnimationFrame, pauses when the tab is
 *  hidden, ~60 particles desktop / ~30 mobile.
 * ============================================================ */

"use strict";

(function initBackground() {
  // Reduced motion: skip the animation entirely.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  // Safety: if 2D canvas is unavailable, skip the background.
  if (!ctx) return;

  // Decide particle count + speed from screen size.
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const PARTICLE_COUNT = isMobile ? 30 : 60;
  const CONNECT_DIST = isMobile ? 130 : 160;
  const SPEED = isMobile ? 0.2 : 0.3;

  let particles = [];
  let width = 0;
  let height = 0;
  let mouseX = 0;
  let mouseY = 0;
  let rafId = null;

  // Build the particle list.
  function resetParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.8 + 0.6   // small dot radius
      });
    }
  }

  // Size the canvas to the viewport (device pixels for sharpness).
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    resetParticles();
  }

  // Draw one frame.
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Update + draw particles, applying gentle mouse parallax.
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move toward mouse slightly (parallax pull).
      p.x += p.vx + (mouseX - width / 2) * 0.00002;
      p.y += p.vy + (mouseY - height / 2) * 0.00002;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.55)";
      ctx.fill();

      // Connection lines to other particles.
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = "rgba(34, 211, 238, " + alpha + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  // Pause drawing when the tab is hidden, resume when visible.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      rafId = requestAnimationFrame(draw);
    }
  });

  // Track mouse for parallax (desktop only).
  window.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Start on resize-safe schedule.
  window.addEventListener("resize", resize);
  resize();
  rafId = requestAnimationFrame(draw);
})();