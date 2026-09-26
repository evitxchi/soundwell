(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menus = Array.from(document.querySelectorAll(".nav-group"));
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  root.classList.add("has-motion");

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  function closeMenus(except) {
    menus.forEach((group) => {
      if (group !== except) {
        group.classList.remove("open");
        const button = group.querySelector(".nav-trigger");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  menus.forEach((group) => {
    const button = group.querySelector(".nav-trigger");
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !group.classList.contains("open");
      closeMenus(group);
      group.classList.toggle("open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
    group.addEventListener("mouseenter", () => {
      if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) {
        closeMenus(group);
        group.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
    group.addEventListener("mouseleave", () => {
      if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) {
        group.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-group")) closeMenus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenus();
      if (menuToggle && menuToggle.getAttribute("aria-expanded") === "true") toggleMobileMenu(false);
    }
  });

  function toggleMobileMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.classList.toggle("open", open);
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      toggleMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => toggleMobileMenu(false));
    });
  }

  const reviewSlides = [
    {
      name: "Voice over time",
      source: "RESEARCH FOCUS",
      theme: "voice",
      quote: "Can patterns in repeated short speech samples provide useful context alongside a person’s care journey?"
    },
    {
      name: "Feasible routines",
      source: "PARTICIPANT EXPERIENCE",
      theme: "routine",
      quote: "How can short phrases, reminders, and flexible schedules fit into the rhythms of everyday life?"
    },
    {
      name: "Clinical context",
      source: "CARE TEAM WORKFLOW",
      theme: "context",
      quote: "What context would help a care team decide when a closer check-in may be useful?"
    },
    {
      name: "Evidence first",
      source: "VALIDATION",
      theme: "evidence",
      quote: "How should voice-based measures be evaluated before they are considered for clinical use?"
    }
  ];

  const carousel = document.querySelector("[data-review-carousel]");
  if (carousel) {
    let activeReview = 0;
    const previous = carousel.querySelector(".previous");
    const next = carousel.querySelector(".next");
    const visual = carousel.querySelector("[data-review-visual]");
    const quote = carousel.querySelector("[data-review-quote]");
    const author = carousel.querySelector("[data-review-author]");
    const source = carousel.querySelector("[data-review-source]");
    const index = document.querySelector("[data-review-index]");
    const label = document.querySelector("[data-review-label]");

    const renderReview = () => {
      const slide = reviewSlides[activeReview];
      if (visual) visual.dataset.theme = slide.theme;
      quote.style.opacity = "0";
      window.setTimeout(() => {
        quote.textContent = slide.quote;
        author.textContent = slide.name;
        source.textContent = slide.source;
        quote.style.opacity = "1";
      }, reduceMotion ? 0 : 160);
      index.textContent = String(activeReview + 1);
      label.textContent = slide.name;
      previous.disabled = activeReview === 0;
      next.disabled = activeReview === reviewSlides.length - 1;
    };

    previous.addEventListener("click", () => {
      if (activeReview > 0) {
        activeReview -= 1;
        renderReview();
      }
    });
    next.addEventListener("click", () => {
      if (activeReview < reviewSlides.length - 1) {
        activeReview += 1;
        renderReview();
      }
    });
  }

  const demoData = [
    {
      participants: "24 invited",
      network: "Daily",
      usage: "18 / 24",
      activity: "SW-104",
      phoneStatus: "Due today",
      phoneTitle: "Daily voice check-in",
      phoneAction: "Ready to record",
      phoneProgress: "Phrase 1 of 3",
      phonePhrase: "How are you feeling today?",
      phoneSchedule: "Daily",
      phoneSaved: "Not started",
      bars: [28, 43, 39, 54, 48, 72, 60],
      meter: 18
    },
    {
      participants: "24 invited",
      network: "Daily",
      usage: "19 / 24",
      activity: "SW-117",
      phoneStatus: "Recording",
      phoneTitle: "Voice session in progress",
      phoneAction: "Listening to your voice",
      phoneProgress: "Recording phrase 1 of 3",
      phonePhrase: "Read the prompt aloud.",
      phoneSchedule: "Recording",
      phoneSaved: "00:18 elapsed",
      bars: [36, 67, 43, 80, 54, 74, 62],
      meter: 62
    },
    {
      participants: "24 invited",
      network: "Daily",
      usage: "20 / 24",
      activity: "SW-104",
      phoneStatus: "Saved",
      phoneTitle: "Session complete",
      phoneAction: "Saved for your study",
      phoneProgress: "3 phrases recorded",
      phonePhrase: "Session submitted.",
      phoneSchedule: "Complete",
      phoneSaved: "Saved just now",
      bars: [43, 51, 65, 58, 78, 66, 88],
      meter: 94
    }
  ];

  const story = document.querySelector("[data-device-story]");
  const desktopMonitor = story && story.querySelector(".desktop-monitor");
  if (desktopMonitor) {
    const monitorPlane = desktopMonitor.querySelector(".monitor-screen");
    const projectDashboard = () => {
      if (!monitorPlane) return;
      const width = monitorPlane.offsetWidth;
      const height = monitorPlane.offsetHeight;
      if (!width || !height) return;

      // Inner display corners measured from the generated monitor photograph.
      const points = [
        { x: 0.02238, y: 0.15837 },
        { x: 0.98741, y: 0 },
        { x: 0.98741, y: 0.91148 },
        { x: 0, y: 0.97129 }
      ];
      const [p0, p1, p2, p3] = points;
      const dx1 = p1.x - p2.x;
      const dx2 = p3.x - p2.x;
      const dx3 = p0.x - p1.x + p2.x - p3.x;
      const dy1 = p1.y - p2.y;
      const dy2 = p3.y - p2.y;
      const dy3 = p0.y - p1.y + p2.y - p3.y;
      const denominator = dx1 * dy2 - dx2 * dy1;
      const g = (dx3 * dy2 - dx2 * dy3) / denominator;
      const h = (dx1 * dy3 - dx3 * dy1) / denominator;
      const a = p1.x - p0.x + g * p1.x;
      const b = p3.x - p0.x + h * p3.x;
      const c = p0.x;
      const d = p1.y - p0.y + g * p1.y;
      const e = p3.y - p0.y + h * p3.y;
      const f = p0.y;
      monitorPlane.style.transform = `matrix3d(${a},${d * height / width},0,${g / width},${b * width / height},${e},0,${h / height},0,0,1,0,${c * width},${f * height},0,1)`;
    };
    projectDashboard();
    if ("ResizeObserver" in window && monitorPlane) {
      const monitorResize = new ResizeObserver(projectDashboard);
      monitorResize.observe(monitorPlane);
    }
    window.addEventListener("resize", projectDashboard);

    const revealMonitor = () => desktopMonitor.classList.add("is-visible");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealMonitor();
    } else {
      const monitorObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealMonitor();
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      monitorObserver.observe(desktopMonitor);
    }
  }
  let activeScene = -1;
  function renderScene(sceneIndex) {
    if (!story || sceneIndex === activeScene) return;
    activeScene = sceneIndex;
    const scene = demoData[sceneIndex];
    story.dataset.scene = String(sceneIndex);
    Object.entries(scene).forEach(([key, value]) => {
      if (typeof value !== "string") return;
      story.querySelectorAll(`[data-scene="${key}"]`).forEach((node) => { node.textContent = value; });
    });
    story.querySelectorAll(".chart-bars i").forEach((bar, index) => {
      bar.style.setProperty("--bar", scene.bars[index] + "%");
    });
    story.querySelectorAll(".phone-meter i").forEach((bar) => {
      bar.style.width = scene.meter + "%";
    });
  }

  let scrollFrame = 0;
  function updateScrollStory() {
    scrollFrame = 0;
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const available = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / available));
    story.style.setProperty("--story-progress", progress.toFixed(3));
    const sceneIndex = Math.min(2, Math.floor(progress * 3));
    renderScene(sceneIndex);
  }
  function requestScrollStoryUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateScrollStory);
  }

  if (story) {
    updateScrollStory();
    window.addEventListener("scroll", requestScrollStoryUpdate, { passive: true });
    window.addEventListener("resize", requestScrollStoryUpdate);
  }

  window.SoundWellShowcase = {
    updateScene(scene) {
      const current = Math.max(0, activeScene);
      Object.assign(demoData[current], scene || {});
      activeScene = -1;
      renderScene(current);
    },
    scenes: demoData
  };
})();
