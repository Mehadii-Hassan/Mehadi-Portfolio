/*
 * ============================================================
 *  MAIN.JS — navbar, scroll reveal, counters, 3D tilt, cursor
 *  glow, scroll progress, command palette, and all DOM
 *  rendering driven by data.js.
 * ============================================================ */

"use strict";

(function initMain() {
  const rfm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ----------------------------------------------------------
   *  0. Theme toggle (dark / light), saved in localStorage.
   * ---------------------------------------------------------- */
  const rootEl = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function isLightTheme() {
    return rootEl.getAttribute("data-theme") === "light";
  }
  function applyThemeUI() {
    if (themeToggle) {
      // aria-pressed reflects "light is active".
      themeToggle.setAttribute("aria-pressed", isLightTheme() ? "true" : "false");
      themeToggle.setAttribute(
        "aria-label",
        isLightTheme() ? "Switch to dark mode" : "Switch to light mode"
      );
    }
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const light = !isLightTheme();
      // Set or remove the attribute ("light" adds it, else the default dark).
      if (light) rootEl.setAttribute("data-theme", "light");
      else rootEl.removeAttribute("data-theme");
      try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
      applyThemeUI();
    });
  }
  applyThemeUI();

  /* ----------------------------------------------------------
   *  1. Warn about unfilled URLs in data.js
   * ---------------------------------------------------------- */
  function checkPlaceholders() {
    const allUrls = [];
    // Walk every object/array in data.js recursively for strings with "YOUR_".
    Object.keys(LINKS).forEach((k) => {
      if (typeof LINKS[k] === "string") allUrls.push(LINKS[k]);
    });
    skills.forEach((g) => g.items.forEach((i) => i)); // (skills have no URLs)
    projects.forEach((p) => { allUrls.push(p.github, p.demo); });
    certifications.forEach((c) => allUrls.push(c.link));

    allUrls.forEach((url) => {
      if (url && url.indexOf("YOUR_") !== -1) {
        console.warn("[portfolio] Placeholder URL not set:", url);
      }
    });
  }
  checkPlaceholders();

  // Set canonical href from data.js (if it's a real URL).
  const canonical = document.getElementById("canonical");
  if (canonical && LINKS.canonical && LINKS.canonical.indexOf("YOUR_") === -1) {
    canonical.href = LINKS.canonical;
  }

  /* ----------------------------------------------------------
   *  2. Navbar: build links, mobile menu, scrolled state,
   *     active-section highlighting.
   * ---------------------------------------------------------- */
  const navLinks = document.getElementById("nav-links");
  const mobileMenu = document.getElementById("mobile-menu");
  navLinks.innerHTML = "";
  mobileMenu.innerHTML = "";

  DATA.nav.forEach((item) => {
    // Desktop link.
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.target;
    a.textContent = item.label;
    a.setAttribute("data-nav", item.target.substring(1));
    li.appendChild(a);
    navLinks.appendChild(li);

    // Mobile link.
    const ma = document.createElement("a");
    ma.href = item.target;
    ma.textContent = item.label;
    ma.addEventListener("click", closeMobileMenu);
    mobileMenu.appendChild(ma);
  });

  // Mobile hamburger toggle.
  const hamburger = document.getElementById("hamburger");
  function openMobileMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMobileMenu() : openMobileMenu();
  });

  // Navbar scrolled style.
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  // Active-section highlighting while scrolling.
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = Array.from(document.querySelectorAll("#nav-links a[data-nav]"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach((a) => {
          a.classList.toggle("active", a.dataset.nav === id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));

  /* ----------------------------------------------------------
   *  3. Hero: name, avail text, typing roles, streaming intro,
   *     social icons.
   * ---------------------------------------------------------- */
  document.getElementById("hero-name").textContent = DATA.profile.name;
  document.getElementById("logo-text").textContent = DATA.profile.monogram;

  // Social icon buttons (GitHub, LinkedIn, Email, Phone).
  const heroSocial = document.getElementById("hero-social");
  const socialBtns = [
    { icon: "github", url: LINKS.github, label: "GitHub" },
    { icon: "linkedin", url: LINKS.linkedin, label: "LinkedIn" },
    { icon: "phone", url: "tel:" + PROFILE.phone.replace(/\s|\(|\)|\.|-/g, ""), label: "Phone" },
    { icon: "mail", url: LINKS.email, label: "Email" }
  ];
  socialBtns.forEach((s) => {
    if (!s.url || s.url.indexOf("YOUR_") !== -1) return;
    const btn = document.createElement("a");
    btn.className = "icon-btn";
    btn.href = s.url;
    // tel: and mailto: links shouldn't open a new tab.
    if (!/^(tel:|mailto:)/.test(s.url)) {
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    }
    btn.setAttribute("aria-label", s.label);
    btn.innerHTML = icon(s.icon) || "";
    heroSocial.appendChild(btn);
  });

  // Rotating typing roles.
  const roleEl = document.getElementById("typed-role");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  function typeLoop() {
    const current = DATA.heroTyping[roleIndex];
    if (rfm) {
      // Reduced motion: show all roles statically, one per line.
      if (roleIndex === 0) document.querySelector(".type-cursor").remove();
      const line = document.createElement("span");
      line.style.display = "block";
      line.textContent = current;
      roleEl.appendChild(line);
      roleIndex++;
      if (roleIndex >= DATA.heroTyping.length) return; // done after showing all
      setTimeout(typeLoop, 1200);
      return;
    }

    // Normal typing/deleting animation.
    if (deleting) {
      roleEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % DATA.heroTyping.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 40);
    } else {
      roleEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 70);
    }
  }
  typeLoop();

  // Stream the hero intro when the page loads (after boot).
  const heroStreamEl = document.getElementById("hero-stream");
  const streamHero = () =>
    streamText(heroStreamEl, DATA.heroIntro, { cursor: true })
      .then(() => streamText.immediate(heroStreamEl, DATA.heroIntro));

  /* ----------------------------------------------------------
   *  5. Scroll reveal (fade-up, staggered).
   * ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Stagger children if present.
        const stagger = entry.target.dataset.stagger;
        const kids = Array.from(entry.target.children);
        kids.forEach((k, i) => {
          if (stagger && !rfm) {
            k.style.transitionDelay = (i * 0.06) + "s";
          }
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Observe every .reveal element, including ones added later by JS.
  // (A Set of observed elements makes it safe to call this repeatedly.)
  const observedReveals = new Set();
  function observeReveals() {
    document.querySelectorAll(".reveal").forEach((el) => {
      if (!observedReveals.has(el)) {
        observedReveals.add(el);
        revealObserver.observe(el);
      }
    });
  }
  observeReveals();

  /* ----------------------------------------------------------
   *  6. About: stream text when the section enters + quick facts.
   * ---------------------------------------------------------- */
  const aboutStreamEl = document.getElementById("about-stream");
  document.getElementById("fact-location").textContent = DATA.profile.location;
  document.getElementById("fact-education").textContent = DATA.education.school;
  document.getElementById("fact-focus").textContent = DATA.profile.focus.join(", ");

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        streamText(aboutStreamEl, DATA.aboutText, { cursor: false });
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  aboutObserver.observe(aboutStreamEl);

  /* ----------------------------------------------------------
   *  7. Skills: bento grid + chips + marquee.
   * ---------------------------------------------------------- */
  const skillsGrid = document.getElementById("skills-grid");
  DATA.skills.forEach((group, gi) => {
    const card = document.createElement("article");
    card.className = "skill-card glass reveal";

    const head = document.createElement("div");
    head.className = "skill-head";
    const iconBox = document.createElement("div");
    iconBox.className = "skill-icon";
    iconBox.innerHTML = icon(group.icon) || icon("code");
    const h3 = document.createElement("h3");
    h3.textContent = group.group;
    head.appendChild(iconBox);
    head.appendChild(h3);

    const chips = document.createElement("div");
    chips.className = "chips";
    group.items.forEach((item, ci) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      chip.style.transitionDelay = (ci * 0.04) + "s";
      chips.appendChild(chip);
    });

    card.appendChild(head);
    card.appendChild(chips);
    skillsGrid.appendChild(card);
  });

  // Pop chips in with stagger after the card is revealed.
  const chipsPopObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Each chip already has its own transitionDelay via inline style.
        // (In reduced-motion the CSS forces them visible anyway.)
        entry.target.querySelectorAll(".chip").forEach((c) => c.classList.add("pop"));
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".skill-card").forEach((c) => chipsPopObserver.observe(c));

  // Marquee rows: all tech names, split into two halves running opposite ways.
  const allTech = DATA.skills.flatMap((g) => g.items);
  const half = Math.ceil(allTech.length / 2);
  const row1 = allTech.slice(0, half);
  const row2 = allTech.slice(half).concat(allTech.slice(0, half)); // pad to loop cleanly

  const m1 = document.getElementById("marquee-1");
  const m2 = document.getElementById("marquee-2");
  function fillMarquee(el, items) {
    const strip = document.createElement("div");
    strip.className = "marquee-inner";
    items.concat(items).forEach((t) => {
      const span = document.createElement("span");
      span.className = "marquee-item";
      const dot = document.createElement("span");
      dot.textContent = "●";
      span.appendChild(dot);
      span.appendChild(document.createTextNode(t));
      strip.appendChild(span);
    });
    el.appendChild(strip);
  }
  fillMarquee(m1, row1);
  fillMarquee(m2, row2);

  /* ----------------------------------------------------------
   *  8. Projects: bento grid with pipeline strips + buttons.
   * ---------------------------------------------------------- */
  const projectsGrid = document.getElementById("projects-grid");
  DATA.projects.forEach((p, pi) => {
    const card = document.createElement("article");
    card.className = "project-card glass reveal";
    card.dataset.tilt = "";

    const num = document.createElement("span");
    num.className = "project-num";
    num.textContent = "0" + (pi + 1);

    const h3 = document.createElement("h3");
    h3.textContent = p.title;
    const sub = document.createElement("p");
    sub.className = "project-sub";
    sub.textContent = p.subtitle;
    const sum = document.createElement("p");
    sum.className = "project-summary";
    sum.textContent = p.summary;

    const bullets = document.createElement("ul");
    bullets.className = "project-bullets";
    p.bullets.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = b;
      bullets.appendChild(li);
    });

    const tags = document.createElement("div");
    tags.className = "project-tags";
    p.tags.forEach((t) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = t;
      chip.style.opacity = "1";
      chip.style.transform = "none";
      tags.appendChild(chip);
    });

    // Pipeline strip with traveling glow dot.
    const pipeline = document.createElement("div");
    pipeline.className = "pipeline";
    p.flow.forEach((node, ni) => {
      if (ni > 0) {
        const link = document.createElement("span");
        link.className = "pipe-link";
        pipeline.appendChild(link);
      }
      const box = document.createElement("span");
      box.className = "pipe-node";
      box.textContent = node;
      pipeline.appendChild(box);
    });

    // Action buttons.
    const actions = document.createElement("div");
    actions.className = "project-actions";
    const gh = document.createElement("a");
    gh.className = "btn btn-outline btn-sm";
    gh.href = p.github;
    gh.target = "_blank";
    gh.rel = "noopener noreferrer";
    gh.setAttribute("aria-label", p.title + " on GitHub");
    gh.innerHTML = icon("github") + "GitHub";
    actions.appendChild(gh);
    if (p.demo && p.demo.indexOf("YOUR_") === -1) {
      const demo = document.createElement("a");
      demo.className = "btn btn-primary btn-sm";
      demo.href = p.demo;
      demo.target = "_blank";
      demo.rel = "noopener noreferrer";
      demo.innerHTML = icon("external") + "Live Demo";
      actions.appendChild(demo);
    }

    card.appendChild(num);
    card.appendChild(h3);
    card.appendChild(sub);
    card.appendChild(sum);
    card.appendChild(bullets);
    card.appendChild(tags);
    card.appendChild(pipeline);
    card.appendChild(actions);
    projectsGrid.appendChild(card);
  });

  // 3D tilt + spotlight on project cards.
  document.querySelectorAll(".project-card").forEach((card) => {
    if (rfm || isTouch) return;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      const rx = ((y / rect.height) * -6) + 3;
      const ry = ((x / rect.width) * 6) - 3;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ----------------------------------------------------------
   *  9. Education timeline.
   * ---------------------------------------------------------- */
  const timeline = document.getElementById("timeline");

  // Education node.
  const eduItem = document.createElement("div");
  eduItem.className = "tl-item reveal";
  const eduDot = document.createElement("span");
  eduDot.className = "tl-dot";
  const eduCard = document.createElement("div");
  eduCard.className = "tl-card glass";
  const eduH3 = document.createElement("h3");
  eduH3.textContent = DATA.education.school;
  const eduMeta = document.createElement("div");
  eduMeta.className = "tl-meta";
  eduMeta.textContent = "Bachelor's Degree";
  const eduDeg = document.createElement("p");
  eduDeg.textContent = DATA.education.degree;
  eduCard.appendChild(eduH3);
  eduCard.appendChild(eduMeta);
  eduCard.appendChild(eduDeg);
  eduItem.appendChild(eduDot);
  eduItem.appendChild(eduCard);
  timeline.appendChild(eduItem);

  // Certification nodes.
  DATA.certifications.forEach((c) => {
    const item = document.createElement("div");
    item.className = "tl-item reveal";
    const dot = document.createElement("span");
    dot.className = "tl-dot";
    const card = document.createElement("div");
    card.className = "tl-card glass";
    const h3 = document.createElement("h3");
    h3.textContent = c.title;
    const meta = document.createElement("div");
    meta.className = "tl-meta";
    meta.textContent = c.issuer;
    const link = document.createElement("a");
    link.className = "cert-btn";
    link.textContent = "View Certificate";
    if (c.link && c.link.indexOf("YOUR_") === -1) {
      link.href = c.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      // Placeholder not set — disable.
      link.style.opacity = "0.5";
      link.style.pointerEvents = "none";
      link.setAttribute("aria-disabled", "true");
    }
    link.innerHTML = icon("external") + "View Certificate";
    card.appendChild(h3);
    card.appendChild(meta);
    card.appendChild(link);
    item.appendChild(dot);
    item.appendChild(card);
    timeline.appendChild(item);
  });

  // Timeline line draws itself as the user scrolls through it.
  const tlLine = document.getElementById("timeline-line");
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const rect = timeline.getBoundingClientRect();
        const fromTop = rect.top;
        const vh = window.innerHeight;
        const pct = Math.max(0, Math.min(100, ((vh - fromTop) / rect.height) * 100));
        tlLine.style.height = pct + "%";
      }
    });
  }, { threshold: [0, 0.1, 0.5, 1] });
  tlObserver.observe(timeline);
  // Update during scroll for a smooth draw.
  window.addEventListener("scroll", () => {
    if (timeline.getBoundingClientRect().top < window.innerHeight) {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const pct = Math.max(0, Math.min(100, ((vh - rect.top) / rect.height) * 100));
      tlLine.style.height = pct + "%";
    }
  }, { passive: true });

  /* ----------------------------------------------------------
   *  10. Contact cards + footer.
   * ---------------------------------------------------------- */
  const contactGrid = document.getElementById("contact-grid");

  function contactCard(title, iconName, text, href, opts) {
    opts = opts || {};
    const card = document.createElement("div");
    card.className = "contact-card glass reveal";
    const btn = document.createElement("a");
    btn.className = "icon-btn";
    btn.setAttribute("aria-label", title);
    if (opts.onClick) {
      btn.href = "#";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        opts.onClick();
      });
    } else if (href) {
      btn.href = href;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
    }
    btn.innerHTML = icon(iconName) || "";
    const t = document.createElement("h3");
    t.textContent = title;
    const p = document.createElement("p");
    p.textContent = text;
    card.appendChild(btn);
    card.appendChild(t);
    card.appendChild(p);
    contactGrid.appendChild(card);
    return btn;
  }

  // Email card: click-to-copy + a mailto button with prefilled subject.
  const emailLinkBtn = contactCard(
    "Email",
    "copy",
    PROFILE.email,
    null,
    { onClick: () => copyEmail() }
  );
  // Add a visible "Send email" mailto button with a prefilled subject.
  const mailCard = emailLinkBtn.closest(".contact-card");
  const mailBtn = document.createElement("a");
  mailBtn.className = "btn btn-outline btn-sm";
  mailBtn.href = "mailto:" + PROFILE.email + "?subject=" + encodeURIComponent("Hello " + PROFILE.name);
  mailBtn.setAttribute("aria-label", "Send an email to " + PROFILE.name);
  mailBtn.innerHTML = icon("mail") + "Send email";
  mailCard.appendChild(mailBtn);

  // LinkedIn card.
  contactCard("LinkedIn", "linkedin", LINKS.linkedin, LINKS.linkedin, {
    href: LINKS.linkedin
  });

  // GitHub card. If placeholder, still show but disabled.
  const ghCard = contactCard("GitHub", "github", LINKS.github, LINKS.github, { href: LINKS.github });
  if (LINKS.github.indexOf("YOUR_") !== -1) {
    ghCard.href = "#";
    ghCard.style.opacity = "0.5";
    ghCard.style.pointerEvents = "none";
  }

  // Phone/WhatsApp card (shown when showPhone is true).
  if (DATA.profile.showPhone) {
    const waNum = PROFILE.phone.replace(/\D/g, "");           // e.g. 8801757399837
    const telHref = "tel:" + PROFILE.phone.replace(/\s|\(|\)|\.|-/g, "");

    const pCard = document.createElement("div");
    pCard.className = "contact-card glass reveal";

    // WhatsApp icon button (the main link).
    const pBtn = document.createElement("a");
    pBtn.className = "icon-btn";
    pBtn.href = "https://wa.me/" + waNum;
    pBtn.target = "_blank";
    pBtn.rel = "noopener noreferrer";
    pBtn.setAttribute("aria-label", "WhatsApp " + PROFILE.phone);
    pBtn.innerHTML = icon("phone") || "";
    pCard.appendChild(pBtn);

    const pTitle = document.createElement("h3");
    pTitle.textContent = "Phone";
    pCard.appendChild(pTitle);

    const pText = document.createElement("p");
    pText.textContent = PROFILE.phone;
    pCard.appendChild(pText);

    // Call + WhatsApp action buttons.
    const pActions = document.createElement("div");
    pActions.className = "project-actions";
    pActions.style.justifyContent = "center";

    const callBtn = document.createElement("a");
    callBtn.className = "btn btn-outline btn-sm";
    callBtn.href = telHref;
    callBtn.innerHTML = icon("phone") + "Call";
    pActions.appendChild(callBtn);

    const waBtn = document.createElement("a");
    waBtn.className = "btn btn-primary btn-sm";
    waBtn.href = "https://wa.me/" + waNum;
    waBtn.target = "_blank";
    waBtn.rel = "noopener noreferrer";
    waBtn.innerHTML = icon("mail") + "WhatsApp";
    pActions.appendChild(waBtn);

    pCard.appendChild(pActions);
    contactGrid.appendChild(pCard);
  }

  // Download CV card.
  const cvA = document.createElement("a");
  cvA.className = "btn btn-outline btn-sm center";
  cvA.href = LINKS.resume;
  cvA.setAttribute("download", "Md__Mehadi_Hassan.pdf");
  cvA.style.justifyContent = "center";
  cvA.textContent = "Download CV";
  const cvCardWrap = document.createElement("div");
  cvCardWrap.className = "contact-card glass reveal";
  cvCardWrap.style.gap = "10px";
  const cvBtn = document.createElement("a");
  cvBtn.className = "icon-btn";
  cvBtn.href = LINKS.resume;
  cvBtn.setAttribute("download", "Md__Mehadi_Hassan.pdf");
  cvBtn.setAttribute("aria-label", "Download CV");
  cvBtn.innerHTML = icon("download") || "";
  cvCardWrap.appendChild(cvBtn);
  cvCardWrap.appendChild(cvA);
  const t = document.createElement("h3");
  t.textContent = "Download CV";
  cvCardWrap.appendChild(t);
  contactGrid.appendChild(cvCardWrap);

  // Copy-to-clipboard helper with toast.
  function copyEmail() {
    navigator.clipboard.writeText(PROFILE.email).then(() => {
      showToast("Email copied");
    }).catch(() => {
      // Fallback for non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Email copied");
    });
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  // Footer: links + year + back-to-top.
  const footerLinks = document.getElementById("footer-links");
  DATA.nav.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.target;
    a.textContent = item.label;
    footerLinks.appendChild(a);
  });
  const year = new Date().getFullYear();
  document.getElementById("footer-note").textContent = "© Powered By - " + PROFILE.name;
  document.getElementById("back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: rfm ? "auto" : "smooth" });
  });

  /* ----------------------------------------------------------
   *  11. Boot screen.
   * ---------------------------------------------------------- */
  const boot = document.getElementById("boot");
  const bootText = document.getElementById("boot-text");
  const bootLines = [
    "> initializing portfolio...",
    "> loading agents... [ok]",
    "> connecting to vector store... [ok]",
    "> ready"
  ];

  // Skip boot if already shown this session, or reduced motion.
  let bootSkipped = sessionStorage.getItem("booted") === "1" || rfm;

  function endBoot() {
    boot.classList.add("hidden");
    sessionStorage.setItem("booted", "1");
    // Start hero stream after boot fades.
    setTimeout(streamHero, 600);
  }

  // Skip on click / keypress.
  function skipBoot() {
    if (bootSkipped) return;
    bootSkipped = true;
    endBoot();
  }
  boot.addEventListener("click", skipBoot);
  window.addEventListener("keydown", function (e) {
    if (bootSkipped) return;
    if (e.key) skipBoot();
  });

  if (bootSkipped) {
    boot.style.display = "none";
    setTimeout(streamHero, 200);
  } else {
    // Stream boot lines.
    let chain = Promise.resolve();
    bootLines.forEach((line) => {
      chain = chain.then(() => {
        if (bootSkipped) return Promise.resolve();
        bootText.textContent = line;
        return new Promise((r) => setTimeout(r, 320));
      });
    });
    chain.then(() => {
      if (bootSkipped) return;
      endBoot();
    });
  }

  /* ----------------------------------------------------------
   *  12. 3D tilt on the hero photo + cursor spotlight.
   * ---------------------------------------------------------- */
  const photoTilt = document.getElementById("photo-tilt");
  if (photoTilt && !rfm && !isTouch) {
    photoTilt.addEventListener("mousemove", (e) => {
      const rect = photoTilt.getBoundingClientRect();
      const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
      const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      photoTilt.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    });
    photoTilt.addEventListener("mouseleave", () => {
      photoTilt.style.transform = "";
    });
  }

  // Cursor spotlight.
  const spotlight = document.getElementById("spotlight");
  if (spotlight && !isTouch) {
    window.addEventListener("mousemove", (e) => {
      spotlight.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
    });
  } else if (spotlight) {
    spotlight.style.display = "none";
  }

  /* ----------------------------------------------------------
   *  13. Scroll progress bar.
   * ---------------------------------------------------------- */
  const progress = document.getElementById("scroll-progress");
  function updateProgress() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    progress.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ----------------------------------------------------------
   *  14. Command palette (Ctrl/Cmd + K).
   * ---------------------------------------------------------- */
  const overlay = document.getElementById("palette-overlay");
  const palInput = document.getElementById("palette-input");
  const palList = document.getElementById("palette-list");
  let palOpen = false;
  let palIndex = 0;
  let palItems = [];

  // Palette actions (jump / open). Built from data.js.
  function buildPalette(filter) {
    const f = (filter || "").trim().toLowerCase();
    const actions = [];

    DATA.nav.forEach((n) => actions.push({ label: "Go to " + n.label, type: "nav", value: n.target, icon: "arrow" }));
    actions.push({ label: "Open GitHub", type: "link", value: LINKS.github, icon: "github" });
    actions.push({ label: "Open LinkedIn", type: "link", value: LINKS.linkedin, icon: "linkedin" });
    actions.push({ label: "Copy email address", type: "copy", value: PROFILE.email, icon: "copy" });
    actions.push({ label: "Download CV", type: "download", value: LINKS.resume, icon: "download" });

    return actions.filter((a) => !f || a.label.toLowerCase().includes(f));
  }

  function renderPalette(items, idx) {
    palList.innerHTML = "";
    palIndex = idx;
    items.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "palette-item" + (i === idx ? " active" : "");
      li.innerHTML = icon(item.icon) + "<span>" + item.label + "</span>";
      li.setAttribute("role", "option");
      li.addEventListener("click", () => runPaletteItem(item));
      palList.appendChild(li);
    });
    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "palette-item";
      li.textContent = "No matching commands";
      palList.appendChild(li);
    }
  }

  function runPaletteItem(item) {
    closePalette();
    switch (item.type) {
      case "nav":
        document.querySelector(item.value).scrollIntoView({ behavior: rfm ? "auto" : "smooth" });
        break;
      case "link":
        window.open(item.value, "_blank", "noopener noreferrer");
        break;
      case "copy":
        copyEmail();
        break;
      case "download":
        const a = document.createElement("a");
        a.href = LINKS.resume;
        a.download = "Md__Mehadi_Hassan.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        break;
    }
  }

  function openPalette() {
    palOpen = true;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    palItems = buildPalette("");
    renderPalette(palItems, 0);
    palInput.value = "";
    setTimeout(() => palInput.focus(), 30);
  }
  function closePalette() {
    palOpen = false;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  // Keyboard shortcut.
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palOpen ? closePalette() : openPalette();
    }
    if (e.key === "Escape" && palOpen) closePalette();
  });

  // Filter as you type.
  palInput.addEventListener("input", () => {
    palItems = buildPalette(palInput.value);
    renderPalette(palItems, 0);
  });

  // Arrow keys + Enter.
  palInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      palIndex = (palIndex + 1) % Math.max(1, palItems.length);
      renderPalette(palItems, palIndex);
      scrollPaletteItemIntoView();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      palIndex = (palIndex - 1 + palItems.length) % Math.max(1, palItems.length);
      renderPalette(palItems, palIndex);
      scrollPaletteItemIntoView();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = palItems[palIndex];
      if (item) runPaletteItem(item);
    }
  });

  function scrollPaletteItemIntoView() {
    const items = palList.querySelectorAll(".palette-item");
    if (items[palIndex]) items[palIndex].scrollIntoView({ block: "nearest" });
  }

  // Focus trapping while open.
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && palOpen) {
      // Keep focus within the palette (input ↔ list).
      e.preventDefault();
      if (document.activeElement === palInput) {
        const items = palList.querySelectorAll(".palette-item");
        if (items[palIndex]) items[palIndex].focus();
      } else {
        palInput.focus();
      }
    }
  });

  // Close on overlay backdrop click.
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePalette();
  });

  // The Ctrl K button in the navbar.
  document.getElementById("ctrlk-btn").addEventListener("click", () => {
    palOpen ? closePalette() : openPalette();
  });

  // Re-scan for reveals added during rendering above (skill/project/contact
  // cards are created dynamically, so observe them once they exist).
  observeReveals();
})();