/* ==========================================================================
   Wander Co. — Interactions
   1. Sticky header state
   2. Mobile navigation
   3. Active nav link on scroll
   4. Scroll reveal animations
   5. Experience panels
   6. Destination details dialog
   7. Newsletter form validation
   8. Small helpers (placeholder links, year)
   ========================================================================== */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const body = document.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Sticky header state ------------------------------------------------ */
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* 2. Mobile navigation -------------------------------------------------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");

  const setMenu = (open) => {
    body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      const firstLink = menu.querySelector("a");
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener("click", () => {
    setMenu(!body.classList.contains("menu-open"));
  });

  // Close the menu when a link inside it is chosen
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Reset if the viewport grows past the mobile breakpoint
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* 3. Active nav link on scroll ----------------------------------------- */
  const navLinks = document.querySelectorAll(".nav__link");
  const trackedSections = ["home", "destinations", "experiences", "about"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  /* 4. Scroll reveal animations ------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Stagger siblings that appear together (cards, list items)
          const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
          const index = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* 5. Experience panels (expanding gallery on desktop) ------------------ */
  const panels = document.querySelectorAll(".exp-panel");

  const activatePanel = (panel) => {
    panels.forEach((p) => p.classList.toggle("is-active", p === panel));
  };

  panels.forEach((panel) => {
    panel.addEventListener("mouseenter", () => activatePanel(panel));
    panel.addEventListener("focus", () => activatePanel(panel));
    panel.addEventListener("click", () => activatePanel(panel));
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activatePanel(panel);
      }
    });
  });

  /* 6. Destination details dialog ---------------------------------------- */
  // General travel guidance only — no prices, availability or bookings.
  const destinations = {
    kyoto: {
      name: "Kyoto",
      country: "Japan",
      image: "photo-1493976040374-85c8e12f0c0e",
      alt: "Traditional wooden houses lining a stone lane toward Yasaka Pagoda in Kyoto at dusk",
      text: "Japan's former imperial capital is a city of quiet courtyards, wooden machiya townhouses and more than a thousand years of craft and ritual. It rewards travellers who slow down.",
      season: "Spring (Mar–Apr) and autumn (Oct–Nov)",
      ideal: "Culture, gardens, food and slow city walks",
      highlights: [
        "Early-morning walks through the Arashiyama bamboo grove",
        "A tea ceremony in a traditional townhouse",
        "Evening wanders through the lanes of Gion and Higashiyama",
      ],
    },
    bali: {
      name: "Bali",
      country: "Indonesia",
      image: "photo-1537996194471-e657df975ab4",
      alt: "Pura Ulun Danu Beratan temple reflected in a misty lake in Bali",
      text: "Beyond its beaches, Bali is an island of water temples, volcanic lakes and emerald rice terraces, where daily offerings and ceremonies shape the rhythm of life.",
      season: "Dry season (Apr–Oct)",
      ideal: "Wellbeing, culture, nature and gentle adventure",
      highlights: [
        "Sunrise at the lakeside temple of Ulun Danu Beratan",
        "Walking the rice terraces of Jatiluwih",
        "Craft villages and rainforest paths around Ubud",
      ],
    },
    "swiss-alps": {
      name: "Swiss Alps",
      country: "Switzerland",
      image: "photo-1530122037265-a5f1f91d3b99",
      alt: "Alpine village of Lauterbrunnen beneath sheer cliffs and snow-capped peaks",
      text: "Glacier-carved valleys, car-free mountain villages and scenic railways make the Swiss Alps one of the most rewarding places on earth to explore on foot.",
      season: "Summer (Jun–Sep) for hiking; winter (Dec–Mar) for snow",
      ideal: "Hiking, rail journeys and mountain retreats",
      highlights: [
        "Waterfalls of the Lauterbrunnen valley",
        "Scenic rail journeys through the Bernese Oberland",
        "Hut-to-hut hiking on high alpine trails",
      ],
    },
    cappadocia: {
      name: "Cappadocia",
      country: "Türkiye",
      image: "photo-1641128324972-af3212f0f6bd",
      alt: "Hot-air balloons drifting over the rock formations of Cappadocia",
      text: "In central Anatolia, wind and time have sculpted soft volcanic rock into chimneys, valleys and cave homes — a landscape best seen at first light.",
      season: "Spring (Apr–Jun) and autumn (Sep–Oct)",
      ideal: "Landscapes, history, photography and hiking",
      highlights: [
        "Sunrise as balloons rise over Göreme",
        "Hiking through the Rose and Love valleys",
        "Exploring ancient underground cities and rock-cut churches",
      ],
    },
    queenstown: {
      name: "Queenstown",
      country: "New Zealand",
      image: "photo-1469521669194-babb45599def",
      alt: "Lake Wakatipu and surrounding mountains near Queenstown under drifting cloud",
      text: "Set on the shores of Lake Wakatipu and ringed by the Southern Alps, Queenstown is a gateway to Fiordland, alpine walks and some of New Zealand's most striking scenery.",
      season: "Summer (Dec–Feb) for walking; winter (Jun–Aug) for snow",
      ideal: "Adventure, road trips and big landscapes",
      highlights: [
        "Lakeside walks along Lake Wakatipu",
        "A day journey into Milford Sound",
        "Ridge hikes and views across The Remarkables",
      ],
    },
    "raja-ampat": {
      name: "Raja Ampat",
      country: "Indonesia",
      image: "photo-1516690561799-46d8f74f9abf",
      alt: "Green karst islands rising from a turquoise lagoon in Raja Ampat",
      text: "An archipelago of hundreds of jungle-covered islands off West Papua, Raja Ampat sits at the heart of the Coral Triangle and is remarkable for its reefs and marine life.",
      season: "October to April, when seas are typically calmer",
      ideal: "Snorkelling, diving and remote island stays",
      highlights: [
        "Snorkelling over vibrant, shallow coral reefs",
        "The viewpoint above the Piaynemo karst islands",
        "Homestays hosted by local Papuan families",
      ],
    },
  };

  const dialog = document.getElementById("dest-dialog");
  const dialogEls = {
    img: document.getElementById("dialog-img"),
    country: document.getElementById("dialog-country"),
    title: document.getElementById("dialog-title"),
    text: document.getElementById("dialog-text"),
    season: document.getElementById("dialog-season"),
    ideal: document.getElementById("dialog-ideal"),
    highlights: document.getElementById("dialog-highlights"),
    cta: document.getElementById("dialog-cta"),
    close: dialog.querySelector(".dest-dialog__close"),
  };
  let lastTrigger = null;

  const openDestination = (key, trigger) => {
    const d = destinations[key];
    if (!d) return;
    lastTrigger = trigger;

    dialogEls.img.src = `https://images.unsplash.com/${d.image}?auto=format&fit=crop&w=900&q=80`;
    dialogEls.img.alt = d.alt;
    dialogEls.country.textContent = d.country;
    dialogEls.title.textContent = d.name;
    dialogEls.text.textContent = d.text;
    dialogEls.season.textContent = d.season;
    dialogEls.ideal.textContent = d.ideal;
    dialogEls.highlights.replaceChildren(
      ...d.highlights.map((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        return li;
      })
    );

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      body.style.overflow = "hidden";
    } else {
      // Very old browsers: fall back to the newsletter section
      document.getElementById("newsletter").scrollIntoView();
    }
  };

  document.querySelectorAll("[data-destination]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openDestination(el.dataset.destination, el);
    });
  });

  const closeDialog = () => dialog.close();

  dialog.addEventListener("close", () => {
    body.style.overflow = "";
    if (lastTrigger && !dialog.dataset.toNewsletter) lastTrigger.focus({ preventScroll: true });
    delete dialog.dataset.toNewsletter;
  });

  dialogEls.close.addEventListener("click", closeDialog);

  // Click on the backdrop closes the dialog
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeDialog();
  });

  // "Get Destination Guides" → close and move to the newsletter form
  dialogEls.cta.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.dataset.toNewsletter = "true";
    closeDialog();
    document.getElementById("newsletter").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    setTimeout(() => document.getElementById("email").focus({ preventScroll: true }), prefersReducedMotion ? 0 : 700);
  });

  /* 7. Newsletter form validation ---------------------------------------- */
  // Front-end validation only. No emails are sent — connect your mailing
  // provider (e.g. via a form action or fetch to your backend) in `subscribe()`.
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("email");
  const msg = document.getElementById("email-msg");
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const showMessage = (text, type) => {
    msg.textContent = text;
    msg.className = `newsletter__msg${type ? ` is-${type}` : ""}`;
    form.classList.toggle("has-error", type === "error");
    emailInput.setAttribute("aria-invalid", String(type === "error"));
  };

  const subscribe = (email) => {
    // Placeholder: no backend is connected, so nothing is sent.
    // Replace this with a real request to your email service.
    return Promise.resolve(email);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      showMessage("Please enter your email address.", "error");
      emailInput.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      showMessage("That doesn't look quite right — please check your email address.", "error");
      emailInput.focus();
      return;
    }

    subscribe(email).then(() => {
      showMessage(
        "Thank you! Your email looks good. (Demo form: subscriptions aren't connected to a mailing service yet, so nothing has been sent.)",
        "success"
      );
      form.reset();
    });
  });

  emailInput.addEventListener("input", () => {
    if (form.classList.contains("has-error")) showMessage("", "");
  });

  /* 8. Small helpers ------------------------------------------------------ */
  // Social placeholders: keep the page from jumping until real URLs are added
  document.querySelectorAll("[data-placeholder]").forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
