(function () {
  "use strict";

  /** F5 / обновление на подстранице → главная (с заставкой). Переход по меню без перезагрузки не трогаем. */
  {
    const file = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const subpages = ["about.html", "projects.html", "skills.html", "contact.html"];
    if (subpages.includes(file)) {
      let isReload = false;
      try {
        const nav = performance.getEntriesByType("navigation")[0];
        if (nav && nav.type === "reload") isReload = true;
      } catch (_) {}
      try {
        if (!isReload && performance.navigation && performance.navigation.type === 1) {
          isReload = true;
        }
      } catch (_) {}
      if (isReload) {
        try {
          window.sessionStorage.setItem("portfolio-show-splash", "1");
        } catch (_) {}
        window.location.replace("index.html");
        return;
      }
    }
  }

  /** Вращение бегущей обводки: см. CSS (--ring-rotate-duration, @keyframes portfolio-ring-rotate). */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Переход на главную по клику (меню «Главная» и т.д.) — без заставки; referrer часто пустой из‑за браузера / file:// */
  const SKIP_SPLASH_ONCE = "portfolio-skip-splash-once";
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      const raw = (link.getAttribute("href") || "").trim();
      if (!raw || raw.startsWith("#") || raw.toLowerCase().startsWith("javascript:")) return;
      try {
        const u = new URL(raw, window.location.href);
        if (u.protocol !== "http:" && u.protocol !== "https:" && u.protocol !== "file:") return;
        const file = (u.pathname.split("/").pop() || "").toLowerCase();
        if (file === "index.html") {
          try {
            window.sessionStorage.setItem(SKIP_SPLASH_ONCE, "1");
          } catch (_) {}
        }
      } catch (_) {
        if (/^(\.\/)?index\.html(\?|#|$)/i.test(raw.split("?")[0])) {
          try {
            window.sessionStorage.setItem(SKIP_SPLASH_ONCE, "1");
          } catch (_) {}
        }
      }
    },
    true
  );

  // ----------------------------
  // Данные: Давид Миралиев (подставь свои ссылки в href ниже)
  // ----------------------------
  const data = {
    /** Окно «Написать» в Gmail (пользователь вводит тему и текст письма) */
    emailHref:
      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
      encodeURIComponent("miralievdavid69@gmail.com"),
    tgHref: "https://t.me/szhoxice",
    /** Подписи в блоке контактов (видимый текст) */
    contactDisplay: {
      email: "miralievdavid69@gmail.com",
      telegram: "@szhoxice · t.me/szhoxice"
    },
    heroKicker: "портфолио",
    projects: [
      {
        title: "HelpOnWheels",
        year: "2025",
        desc:
          "HelpOnWheels помогает водителям находить друг друга: кто-то оставляет заявку о помощи, кто-то рядом может её принять. Простая верификация, заявки с картой и фото, рейтинг волонтёров — чтобы помощь была быстрой и честной.",
        tags: ["telegram", "водители", "карта"],
        bullets: [
          "Логика диалога и состояний в мессенджере: от заявки о помощи до принятия её водителем рядом",
          "Акцент на скорость ответа и ясные формулировки — карта, фото и статусы без лишних шагов",
          "Доработки по обратной связи: рейтинг волонтёров, верификация и уточнения по заявкам"
        ],
        demoLink: "https://t.me/HelpOnWheels_bot",
        coverImage: "assets/images/how.jpg"
      },
      {
        title: "МДПС Verify",
        year: "2025",
        desc:
          "МДПС Verify — это дверь в беседу: сначала подписка на новостной канал, затем одно нажатие «Я не робот», после чего бот даёт приглашение в чат. Так вы отсекаете ботов и держите беседу среди тех, кто в теме.",
        tags: ["telegram", "verify", "антиспам"],
        bullets: [
          "Цепочка доступа: новостной канал → подтверждение «Я не робот» → приглашение в чат",
          "Минимум шагов для живого человека и максимум барьеров для ботов и автоматизации",
          "Аудитория «в теме»: сначала канал, потом беседа — без лишнего шума в чате"
        ],
        demoLink: "https://t.me/mdps_kapcha_bot",
        coverImage: "assets/images/mdps.jpg"
      },
      {
        title: "Сайты на заказ",
        year: "2023 — сейчас",
        desc:
          "Личные сайты и лендинги под задачу заказчика: вёрстка, анимации, тёмные темы и аккуратная типографика — как это портфолио.",
        tags: ["html", "css", "js"],
        bullets: [
          "От ТЗ до выкладки: структура, тексты, визуал",
          "Адаптив и внимание к деталям интерфейса",
          "Готовность поддерживать и дорабатывать после запуска"
        ],
        demoLink: "https://t.me/szhoxice",
        coverImage: "assets/images/sait.jpg"
      }
    ],
    skills: [
      { name: "Python", level: 0.9 },
      { name: "Telegram Bot API", level: 0.92 },
      { name: "Сценарии и FSM в ботах", level: 0.88 },
      { name: "Async / вебхуки", level: 0.85 },
      { name: "Верификация и антиспам", level: 0.86 },
      { name: "HTML / CSS / JS (сайты)", level: 0.87 }
    ]
  };

  // ----------------------------
  // Init
  // ----------------------------
  document.documentElement.style.scrollBehavior = "smooth";

  const contactPageLinks = $$(".contact__links .contactLink");
  if (contactPageLinks.length >= 2) {
    contactPageLinks[0].href = data.emailHref;
    contactPageLinks[0].target = "_blank";
    contactPageLinks[0].rel = "noopener noreferrer";
    contactPageLinks[0].setAttribute(
      "aria-label",
      "Написать письмо на miralievdavid69@gmail.com в Gmail"
    );
    contactPageLinks[1].href = data.tgHref;
    contactPageLinks[1].target = "_blank";
    contactPageLinks[1].rel = "noopener noreferrer";
    const cd = data.contactDisplay;
    if (cd) {
      const vals = $$(".contactLink__value", contactPageLinks[0].parentElement);
      if (vals[0]) vals[0].textContent = cd.email;
      if (vals[1]) vals[1].textContent = cd.telegram;
    }
  }

  // Тема (инверсия)
  const themeToggle = $("#themeToggle");
  const STORAGE_KEY = "bw-inverted";
  const applyTheme = (inverted) => {
    document.body.classList.toggle("is-inverted", Boolean(inverted));
  };
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  // По умолчанию — тёмная тема; если пользователь переключал — помним выбор.
  applyTheme(savedTheme === null ? true : savedTheme === "1");
  themeToggle?.addEventListener("click", () => {
    const next = !document.body.classList.contains("is-inverted");
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  });

  // Курсор
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursor = $(".cursor");
    const dot = $(".cursor__dot");
    const ring = $(".cursor__ring");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    window.addEventListener("pointermove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    window.addEventListener("pointerdown", () => {
      ring?.style && (ring.style.opacity = "0.65");
    });
    window.addEventListener("pointerup", () => {
      ring?.style && (ring.style.opacity = "");
    });

    const raf = () => {
      const k = 0.18; // smoothing factor
      x += (targetX - x) * k;
      y += (targetY - y) * k;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
      rafId = window.requestAnimationFrame(raf);
    };

    let rafId = window.requestAnimationFrame(raf);

    const setHover = (on) => document.body.classList.toggle("is-hovering", on);
    const hoverEls = $$("[data-cursor-link]");

    for (const el of hoverEls) {
      el.addEventListener("pointerenter", () => setHover(true));
      el.addEventListener("pointerleave", () => setHover(false));
    }
  }

  // HERO back parallax
  const heroBack = $(".hero__back");
  if (heroBack && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    let mx = 0;
    let my = 0;
    const onMove = (e) => {
      const rect = heroBack.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx = (e.clientX - cx) / rect.width;
      my = (e.clientY - cy) / rect.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const animate = () => {
      const tx = mx * 18;
      const ty = my * 14;
      heroBack.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }

  // ----------------------------
  // Scroll reveal
  // ----------------------------
  const splitTitleSelector = ".hero__title[data-animate='split'], .split-heading[data-animate='split']";

  const animateSplitTitle = () => {
    $$(splitTitleSelector).forEach((title) => {
      const lines = $$(".hero__titleLine", title);
      lines.forEach((line) => {
        if (line.querySelector("span")) return;
        const wrapper = document.createElement("span");
        while (line.firstChild) wrapper.appendChild(line.firstChild);
        line.appendChild(wrapper);
      });
    });
  };
  animateSplitTitle();

  const revealTargets = $$("[data-animate='fade'], [data-animate='rise'], [data-animate='reveal']");
  const splitTitles = $$(splitTitleSelector);
  const aboutPage = document.body.classList.contains("page-about");

  const attachScrollReveal = () => {
    revealTargets.forEach((el, idx) => {
      if (prefersReducedMotion) {
        el.style.transitionDelay = "0ms";
        return;
      }
      const step = aboutPage ? 95 : 35;
      const cap = aboutPage ? 520 : 240;
      el.style.transitionDelay = `${Math.min(idx * step, cap)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");

          if (splitTitles.includes(entry.target)) {
            const lines = $$(".hero__titleLine", entry.target);
            lines.forEach((line, i) => {
              line.style.transitionDelay = `${i * 140}ms`;
            });
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    for (const el of revealTargets) observer.observe(el);
    splitTitles.forEach((t) => observer.observe(t));

    /* после заставки (главная) или сразу — помечаем элементы в зоне видимости */
    window.requestAnimationFrame(() => {
      revealTargets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          el.classList.add("is-visible");
        }
      });
      splitTitles.forEach((title) => {
        const r = title.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          title.classList.add("is-visible");
          const lines = $$(".hero__titleLine", title);
          lines.forEach((line, i) => {
            line.style.transitionDelay = `${i * 140}ms`;
          });
        }
      });
    });
  };

  /* Заставка: только вход на сайт / обновление (F5), не переход по «Главная» с подстраницы */
  const splashOverlay = $("#splashOverlay");
  const SPLASH_FLAG = "portfolio-show-splash";

  const shouldShowSplash = () => {
    if (!splashOverlay) return false;
    try {
      if (window.sessionStorage.getItem(SKIP_SPLASH_ONCE) === "1") {
        window.sessionStorage.removeItem(SKIP_SPLASH_ONCE);
        return false;
      }
    } catch (_) {}
    try {
      if (window.sessionStorage.getItem(SPLASH_FLAG) === "1") {
        window.sessionStorage.removeItem(SPLASH_FLAG);
        return true;
      }
    } catch (_) {}

    let navType = "";
    try {
      const nav = performance.getEntriesByType("navigation")[0];
      if (nav && nav.type) navType = nav.type;
    } catch (_) {}
    if (!navType && typeof performance !== "undefined" && performance.navigation) {
      navType = performance.navigation.type === 1 ? "reload" : "navigate";
    }

    if (navType === "reload") return true;

    if (navType === "back_forward") return false;

    if (navType === "navigate") {
      const ref = (document.referrer || "").toLowerCase();
      const fromOurSite =
        ref.includes("about.html") ||
        ref.includes("projects.html") ||
        ref.includes("skills.html") ||
        ref.includes("contact.html") ||
        ref.includes("index.html");
      if (fromOurSite) return false;
      return true;
    }

    /* старые браузеры / нет PerformanceNavigationTiming — ориентируемся на referrer */
    {
      const ref = (document.referrer || "").toLowerCase();
      const fromOurSite =
        ref.includes("about.html") ||
        ref.includes("projects.html") ||
        ref.includes("skills.html") ||
        ref.includes("contact.html") ||
        ref.includes("index.html");
      return !fromOurSite;
    }
  };

  /** Средний цвет по полосам с краёв изображения — фон заставки как у фото (светлая тема). */
  function sampleImageBackdropColor(img) {
    try {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return null;
      const c = document.createElement("canvas");
      c.width = iw;
      c.height = ih;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      const strip = Math.max(2, Math.round(Math.min(iw, ih) * 0.07));
      const chunks = [];
      const pull = (x, y, w, h) => {
        if (w < 1 || h < 1) return;
        const data = ctx.getImageData(x, y, w, h).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          n++;
        }
        if (n) chunks.push({ r: r / n, g: g / n, b: b / n });
      };
      pull(0, 0, iw, strip);
      pull(0, ih - strip, iw, strip);
      pull(0, 0, strip, ih);
      pull(iw - strip, 0, strip, ih);
      if (!chunks.length) return null;
      let R = 0;
      let G = 0;
      let B = 0;
      chunks.forEach((ch) => {
        R += ch.r;
        G += ch.g;
        B += ch.b;
      });
      R /= chunks.length;
      G /= chunks.length;
      B /= chunks.length;
      const hx = (v) =>
        Math.min(255, Math.max(0, Math.round(v)))
          .toString(16)
          .padStart(2, "0");
      return `#${hx(R)}${hx(G)}${hx(B)}`;
    } catch (_) {
      return null;
    }
  }

  if (splashOverlay && shouldShowSplash()) {
    const splashImg = $("#splashLogo");
    const hideSplash = () => {
      splashOverlay.style.display = "none";
      document.body.classList.remove("is-splashing");
      document.body.style.overflow = "";
      document.documentElement.style.removeProperty("--splash-light-bg");
      attachScrollReveal();
    };

    if (splashImg) {
      splashImg.alt = "";
      const inverted = document.body.classList.contains("is-inverted");
      splashImg.src = inverted
        ? "assets/images/david.jpg"
        : "assets/images/david1.jpg";

      if (inverted) {
        document.body.classList.add("is-splashing");
        document.body.style.overflow = "hidden";
        window.setTimeout(hideSplash, 500);
      } else {
        const startLightSplash = () => {
          const hex = sampleImageBackdropColor(splashImg);
          if (hex) {
            document.documentElement.style.setProperty("--splash-light-bg", hex);
          }
          document.body.classList.add("is-splashing");
          document.body.style.overflow = "hidden";
          window.setTimeout(hideSplash, 500);
        };
        if (splashImg.complete && splashImg.naturalWidth) {
          startLightSplash();
        } else {
          splashImg.addEventListener("load", startLightSplash, { once: true });
          splashImg.addEventListener(
            "error",
            () => {
              document.documentElement.style.removeProperty("--splash-light-bg");
              document.body.classList.add("is-splashing");
              document.body.style.overflow = "hidden";
              window.setTimeout(hideSplash, 500);
            },
            { once: true }
          );
        }
      }
    } else {
      document.body.classList.add("is-splashing");
      document.body.style.overflow = "hidden";
      window.setTimeout(hideSplash, 500);
    }
  } else {
    if (splashOverlay) {
      splashOverlay.style.display = "none";
    }
    attachScrollReveal();
  }

  // ----------------------------
  // Render projects + skills
  // ----------------------------
  const projectsGrid = $("#projectsGrid");
  const skillsList = $("#skillsList");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (m) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
      return map[m] || m;
    });
  }

  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";

    for (const p of data.projects) {
      const card = document.createElement("div");
      card.className = "projectCard";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Открыть проект: ${p.title}`);
      card.dataset.project = p.title;

      const coverHtml = p.coverImage
        ? `<div class="projectCard__cover"><img src="${esc(p.coverImage)}" alt="" loading="lazy" width="640" height="400" /></div>`
        : "";

      card.innerHTML = `
        <div class="projectCard__anim" aria-hidden="true"></div>
        ${coverHtml}
        <div class="projectCard__top">
          <h3 class="projectCard__title">${esc(p.title)}</h3>
          <div class="projectCard__year">${esc(p.year)}</div>
        </div>
        <p class="projectCard__desc">${esc(p.desc)}</p>
        <div class="projectCard__tags" aria-label="Теги проекта">
          ${p.tags.map((t) => `<span class="projectCard__tag">${esc(t)}</span>`).join("")}
        </div>
      `;

      card.addEventListener("click", () => openProject(p));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProject(p);
        }
      });

      projectsGrid.appendChild(card);
    }
  }

  function renderSkills() {
    if (!skillsList) return;
    skillsList.innerHTML = "";
    for (const s of data.skills) {
      const el = document.createElement("div");
      el.className = "skill";
      el.style.setProperty("--fill", s.level);
      el.innerHTML = `
        <div class="skill__row">
          <div class="skill__name">${esc(s.name)}</div>
          <div class="skill__level mono">${Math.round(s.level * 100)}%</div>
        </div>
        <div class="skill__bar" aria-hidden="true">
          <div class="skill__fill"></div>
        </div>
      `;
      skillsList.appendChild(el);
    }
  }

  renderProjects();
  renderSkills();

  // ----------------------------
  // Modal logic
  // ----------------------------
  const overlay = $("#projectModalOverlay");
  const modal = $("#projectModal");
  const closeBtn = $("#modalClose");
  const modalEyebrow = $("#modalEyebrow");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalTags = $("#modalTags");
  const modalBullets = $("#modalBullets");
  const modalDemoLink = $("#modalDemoLink");
  const modalCoverImg = $("#modalCoverImg");
  const modalPreviewLines = $("#modalPreviewLines");

  let activeProject = null;

  /* Возврат из bfcache / сбой: не оставлять body overflow:hidden без открытой модалки */
  window.addEventListener(
    "pageshow",
    () => {
      if (modal && !modal.classList.contains("is-open")) {
        document.body.style.overflow = "";
      }
    },
    { passive: true }
  );

  function setModalOpen(open) {
    if (!modal) return;
    modal.classList.toggle("is-open", open);
    overlay?.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    modal.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function openProject(p) {
    if (!modal) return;
    activeProject = p;
    modalEyebrow.textContent = `Проект · ${p.year}`;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalTags.innerHTML = p.tags
      .map((t) => `<span class="projectCard__tag">${esc(t)}</span>`)
      .join("");

    modalBullets.innerHTML = p.bullets.map((b) => `<li>${esc(b)}</li>`).join("");

    if (modalCoverImg) {
      if (p.coverImage) {
        modalCoverImg.src = p.coverImage;
        modalCoverImg.alt = `${p.title} — обложка`;
        modalCoverImg.removeAttribute("hidden");
        modalPreviewLines?.classList.add("is-hidden");
      } else {
        modalCoverImg.removeAttribute("src");
        modalCoverImg.setAttribute("hidden", "");
        modalCoverImg.alt = "";
        modalPreviewLines?.classList.remove("is-hidden");
      }
    }

    modalDemoLink.setAttribute("href", p.demoLink || "#");
    modalDemoLink.style.pointerEvents = p.demoLink ? "auto" : "none";
    const demoLabel = modalDemoLink?.querySelector(".btn__label");
    if (demoLabel) {
      demoLabel.textContent =
        p.demoLink && String(p.demoLink).includes("t.me/") ? "В Telegram" : "Ссылка";
    }

    setModalOpen(true);

    // Анимация входа (на телефоне полноэкранная модалка — свои transform в CSS)
    const modalFullBleed = window.matchMedia("(max-width: 600px)").matches;
    if (!prefersReducedMotion && modal.animate && !modalFullBleed) {
      modal.animate(
        [
          { opacity: 0, transform: "translate3d(-50%, -48%, 0) scale(.98)" },
          { opacity: 1, transform: "translate3d(-50%, -50%, 0) scale(1)" }
        ],
        { duration: 240, easing: "cubic-bezier(.2,.85,.25,1)", fill: "forwards" }
      );
    }
  }

  function closeProject() {
    activeProject = null;
    setModalOpen(false);
  }

  overlay?.addEventListener("click", closeProject);
  closeBtn?.addEventListener("click", closeProject);
  if (modal) {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeProject();
    });
  }

})();

