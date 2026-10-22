(function () {
  var header = document.getElementById("siteHeader");
  var video = document.querySelector(".hero-video");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navToggle = document.querySelector(".navbar-toggler");
  var siteNav = document.getElementById("siteNav");
  var brandLogos = document.querySelectorAll("[data-brand][data-logo-light][data-logo-dark]");
  var navMenuOpen = false;

  function headerNeedsDarkLogo() {
    if (!header) return false;
    if (header.classList.contains("is-solid") || header.classList.contains("is-scrolled")) return true;
    return navMenuOpen;
  }

  function syncBrandLogo() {
    var useDark = headerNeedsDarkLogo();
    brandLogos.forEach(function (img) {
      var next = useDark ? img.getAttribute("data-logo-dark") : img.getAttribute("data-logo-light");
      if (!next || img.getAttribute("src") === next) return;
      img.src = next;
    });
  }

  brandLogos.forEach(function (img) {
    var dark = img.getAttribute("data-logo-dark");
    var light = img.getAttribute("data-logo-light");
    if (dark) {
      var preloadDark = new Image();
      preloadDark.src = dark;
    }
    if (light) {
      var preloadLight = new Image();
      preloadLight.src = light;
    }
  });

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    syncBrandLogo();
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var waFloat = document.querySelector(".wa-float");
  var hero = document.querySelector(".hero");
  if (waFloat && hero) {
    function syncWaFloat(heroInView) {
      waFloat.classList.toggle("is-hero-hidden", heroInView);
    }

    if ("IntersectionObserver" in window) {
      var waHeroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          syncWaFloat(entry.isIntersecting);
        });
      }, { threshold: 0 });
      waHeroObserver.observe(hero);
      syncWaFloat(true);
    } else {
      function syncWaFloatFallback() {
        syncWaFloat(window.scrollY < hero.offsetHeight);
      }
      syncWaFloatFallback();
      window.addEventListener("scroll", syncWaFloatFallback, { passive: true });
      window.addEventListener("resize", syncWaFloatFallback);
    }
  }

  if (navToggle && siteNav) {
    siteNav.addEventListener("show.bs.collapse", function () {
      navMenuOpen = true;
      navToggle.setAttribute("aria-label", "Close menu");
      syncBrandLogo();
    });
    siteNav.addEventListener("hide.bs.collapse", function () {
      navMenuOpen = false;
      navToggle.setAttribute("aria-label", "Open menu");
      syncBrandLogo();
    });
  }

  if (reduceMotion && video) {
    video.removeAttribute("autoplay");
    video.pause();
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    var reveals = document.querySelectorAll(".reveal");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  document.querySelectorAll("[data-brand]").forEach(function (img) {
    function ready() {
      if (!img.naturalWidth) return;
      img.alt = img.getAttribute("data-alt") || "";
      var slot = img.closest(".brand-slot");
      if (!slot) return;
      slot.classList.add("is-ready");
      var fallback = slot.querySelector(".brand-fallback");
      if (fallback) fallback.setAttribute("aria-hidden", "true");
    }
    if (img.complete && img.naturalWidth > 0) ready();
    else img.addEventListener("load", ready);
  });

  var nameInput = document.getElementById("fullName");
  var phoneInput = document.getElementById("phone");
  var messageWrap = document.getElementById("messageWrap");
  var form = document.getElementById("enquiryForm");
  var success = document.getElementById("enquirySuccess");

  if (form && nameInput && phoneInput && messageWrap) {
    function toggleMessage() {
      var ready = nameInput.value.trim().length > 1 && phoneInput.value.replace(/\D/g, "").length >= 10;
      messageWrap.hidden = !ready;
    }

    nameInput.addEventListener("input", toggleMessage);
    phoneInput.addEventListener("input", function () {
      phoneInput.setCustomValidity("");
      toggleMessage();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var digits = phoneInput.value.replace(/\D/g, "");
      if (digits.length < 10) phoneInput.setCustomValidity("Enter a phone number with at least 10 digits.");
      else phoneInput.setCustomValidity("");
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  var siteNav = document.getElementById("siteNav");

  if (siteNav && video) {
    siteNav.addEventListener("show.bs.collapse", function () {
      if (!reduceMotion) video.pause();
    });
    siteNav.addEventListener("hidden.bs.collapse", function () {
      if (!reduceMotion && !video.ended) video.play();
    });
  }

  document.querySelectorAll("#siteNav .nav-link, #siteNav .btn-nav").forEach(function (link) {
    link.addEventListener("click", function () {
      if (siteNav.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(siteNav).hide();
      }
    });
  });

  var galleryStage = document.getElementById("galleryStage");
  if (galleryStage) {
    var gallerySlides = [
      { category: "aerial", title: "A Planned Community Amidst Nature", lines: ["A Planned", "Community", "Amidst Nature"], caption: "", feature: true, png: "assets/Residential Aerial View.png", webp: "assets/residential-aerial-view.webp" },
      { category: "amenities", also: "landscapes", title: "Park Gazebo", caption: "Relax. Reconnect. Belong.", png: "assets/Golden-Hour Luxury Garden Pavilion.png", webp: "assets/golden-hour-luxury-garden-pavilion.webp" },
      { category: "amenities", title: "Kids Play Area", caption: "A Safer, Happier Tomorrow", png: "assets/Playground Oasis.png", webp: "assets/playground-oasis.webp" },
      { category: "roads", title: "Internal Roads", caption: "Wide. Well Planned. Serene.", png: "assets/ Street.png", webp: "assets/street.webp" },
      { category: "roads", also: "landscapes", title: "Entrance Plaza", caption: "A grand welcome home.", placeholder: true },
      { category: "amenities", also: "landscapes", title: "Flower Garden", caption: "Green spaces for a healthier life.", png: "assets/ Courtyard.png", webp: "assets/courtyard.webp" },
      { category: "amenities", title: "Badminton Court", caption: "A court set among the trees.", png: "assets/Badminton Courtyard.png", webp: "assets/badminton-courtyard.webp" },
      { category: "amenities", also: ["landscapes", "clubhouse"], title: "Club Madhavam", caption: "The heart of the community.", png: "assets/clubhouseelevation.png" },
      { category: "amenities", also: "clubhouse", title: "Multi Purpose Hall", caption: "A hall for a hundred, with a pantry.", png: "assets/Elegant Banquet Hall Interior.png", webp: "assets/elegant-banquet-hall-interior.webp" },
      { category: "amenities", also: "landscapes", title: "Lush Green Lawn with Jogging Track", caption: "A lawn to run, walk, and gather.", png: "assets/ Garden Jogging Park.png", webp: "assets/garden-jogging-park.webp" },
      { category: "amenities", also: "clubhouse", title: "Gymnasium", caption: "Training with a view of the gardens.", png: "assets/ Gym with Garden Views.png", webp: "assets/gym-with-garden-views.webp" },
      { category: "amenities", also: "clubhouse", title: "Yoga and Zumba Room", caption: "A quiet room for yoga and dance.", png: "assets/Yoga and Dance Studio.png", webp: "assets/yoga-and-dance-studio.webp" },
      { category: "amenities", also: "landscapes", title: "Sculpture Platform", caption: "A plaza to pause in the garden.", png: "assets/Garden Sculpture Plaza.png", webp: "assets/garden-sculpture-plaza.webp" },
      { category: "amenities", title: "Cricket Net Practice", caption: "Nets for an evening session.", png: "assets/Cricket Practice Courtyard.png", webp: "assets/cricket-practice-courtyard.webp" },
      { category: "amenities", title: "Yoga Lawn", caption: "An open lawn for morning practice." },
      { category: "amenities", title: "Pet Park", caption: "A corner of the garden for pets." },
      { category: "amenities", also: "clubhouse", title: "Indoor Games Room", caption: "Board games and indoor play.", png: "assets/indoorGames Room .png" },
      { category: "amenities", also: "clubhouse", title: "Toddler Play Area", caption: "A softer space for the smallest.", png: "assets/Toddler Play Area.png", webp: "assets/toddler-play-area.webp" }
    ];
    var galleryLeaf = '<svg class="gallery-leaf" viewBox="0 0 72 118" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.15"><path d="M36 108c0-28-14-42-18-68"/><path d="M18 40c10-2 18 10 18 24"/><path d="M36 86c16-8 28-22 24-40"/><path d="M60 46c-10 2-18 14-20 26"/><path d="M34 98c-12-4-22-16-20-30"/><path d="M14 68c8 2 14 10 16 18"/><path d="M36 70c8-18 8-32 2-44"/><path d="M38 26c6 8 8 18 6 28"/></g></svg>';
    var galleryFilter = "all";

    function galleryEscape(value) {
      return String(value).replace(/[&<>"']/g, function (ch) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
      });
    }

    function galleryUrl(path) {
      return String(path).split("/").map(function (part) {
        return encodeURIComponent(part);
      }).join("/");
    }

    var galleryDesktop = window.matchMedia("(min-width: 1100px)");

    function galleryHasMedia(slide) {
      return !!(slide.png || slide.webp || slide.placeholder);
    }

    function galleryMatches(slide, filter) {
      if (slide.category === filter) return true;
      if (Array.isArray(slide.also)) return slide.also.indexOf(filter) !== -1;
      return slide.also === filter;
    }

    function galleryFeature() {
      for (var i = 0; i < gallerySlides.length; i++) {
        if (gallerySlides[i].feature) return gallerySlides[i];
      }
      return null;
    }

    function galleryPool(filter) {
      return gallerySlides.filter(function (slide) {
        if (filter === "all") return !slide.feature && galleryHasMedia(slide);
        return galleryMatches(slide, filter);
      });
    }

    function galleryWindow(items, start, take) {
      var count = items.length || 1;
      var index = ((start % count) + count) % count;
      var visible = [];
      var limit = Math.min(take, items.length);
      for (var i = 0; i < limit; i++) visible.push(items[(index + i) % count]);
      return visible;
    }

    function galleryCard(slide, feature, hidden) {
      var media = "";
      if (slide.png || slide.webp) {
        var alt = galleryEscape(slide.title);
        var img = '<img src="' + galleryEscape(galleryUrl(slide.png || slide.webp)) + '" alt="' + alt + '"' + (slide.contain ? ' class="is-contain"' : "") + ">";
        media = slide.webp && slide.png
          ? '<picture><source srcset="' + galleryEscape(galleryUrl(slide.webp)) + '" type="image/webp">' + img + "</picture>"
          : img;
      }
      var title = feature && slide.lines
        ? slide.lines.map(galleryEscape).join("<br>")
        : galleryEscape(slide.title);
      var caption = feature
        ? '<p class="gallery-feature-title">' + title + "</p>"
        : '<p class="gallery-card-title">' + galleryEscape(slide.title) + "</p>" +
          (slide.caption ? '<p class="gallery-card-caption">' + galleryEscape(slide.caption) + "</p>" : "");
      return '<article class="gallery-card' + (feature ? " gallery-feature" : "") + (slide.placeholder ? " is-placeholder" : "") + '"' + (hidden ? ' aria-hidden="true"' : "") + ">" +
        '<div class="gallery-media">' + media + "</div>" +
        (feature ? galleryLeaf : "") +
        '<div class="gallery-caption">' + caption + "</div></article>";
    }

    function galleryLooping() {
      return galleryFilter === "all" && galleryDesktop.matches && !reduceMotion && document.visibilityState !== "hidden";
    }

    function galleryTrack(cards) {
      return cards.map(function (slide) {
        return galleryCard(slide, false, false);
      }).join("") + cards.map(function (slide) {
        return galleryCard(slide, false, true);
      }).join("");
    }

    function renderGallery() {
      var looping = galleryLooping();
      galleryStage.classList.toggle("is-looping", looping);
      if (galleryFilter === "all") {
        var feature = galleryFeature();
        var cards = galleryPool("all");
        if (looping && cards.length) {
          galleryStage.dataset.layout = "marquee";
          galleryStage.innerHTML = '<div class="gallery-mosaic is-marquee">' +
            (feature ? galleryCard(feature, true, false) : "") +
            '<div class="gallery-marquee"><div class="gallery-marquee-track">' +
            galleryTrack(cards) +
            "</div></div></div>";
          return;
        }
        galleryStage.dataset.layout = "mosaic";
        var visible = galleryWindow(cards, 0, 4);
        var items = feature ? [feature].concat(visible) : visible;
        galleryStage.innerHTML = '<div class="gallery-mosaic">' +
          items.map(function (slide) {
            return galleryCard(slide, !!slide.feature, false);
          }).join("") +
          "</div>";
        return;
      }
      galleryStage.dataset.layout = "grid";
      galleryStage.innerHTML = '<div class="gallery-grid">' +
        galleryPool(galleryFilter).filter(galleryHasMedia).map(function (slide) {
          return galleryCard(slide, false, false);
        }).join("") +
        "</div>";
    }

    function galleryPills() {
      return Array.prototype.slice.call(document.querySelectorAll(".gallery-pill"));
    }

    function revealGalleryPill(item) {
      var scroller = item.parentElement;
      if (!scroller) return;
      var viewLeft = scroller.scrollLeft;
      var viewRight = viewLeft + scroller.clientWidth;
      var itemLeft = item.offsetLeft;
      var itemRight = itemLeft + item.offsetWidth;
      if (itemLeft >= viewLeft && itemRight <= viewRight) return;
      var left = itemLeft - (scroller.clientWidth - item.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }

    function setGalleryFilter(filter) {
      galleryFilter = filter || "all";
      galleryPills().forEach(function (item) {
        var on = (item.getAttribute("data-filter") || "all") === galleryFilter;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
        if (on) revealGalleryPill(item);
      });
      renderGallery();
    }

    galleryPills().forEach(function (pill) {
      pill.addEventListener("click", function () {
        setGalleryFilter(pill.getAttribute("data-filter") || "all");
      });
    });

    document.querySelectorAll("[data-gallery-dir]").forEach(function (button) {
      button.addEventListener("click", function () {
        var pills = galleryPills();
        if (!pills.length) return;
        var index = 0;
        pills.forEach(function (item, i) {
          if ((item.getAttribute("data-filter") || "all") === galleryFilter) index = i;
        });
        var dir = Number(button.getAttribute("data-gallery-dir")) || 0;
        var next = (index + dir + pills.length) % pills.length;
        setGalleryFilter(pills[next].getAttribute("data-filter") || "all");
      });
    });

    if (galleryDesktop.addEventListener) {
      galleryDesktop.addEventListener("change", renderGallery);
    }
    document.addEventListener("visibilitychange", renderGallery);

    renderGallery();
  }

  var arrival = document.getElementById("arrival");
  var arrivalVideo = arrival && arrival.querySelector(".arrival-video");
  var arrivalOverlay = arrival && arrival.querySelector(".arrival-overlay");
  var arrivalTimeline = null;

  function playArrivalVideo() {
    if (!arrivalVideo || reduceMotion) return;
    var pending = arrivalVideo.play();
    if (pending && pending.catch) pending.catch(function () {});
  }

  function pauseArrivalVideo() {
    if (!arrivalVideo) return;
    arrivalVideo.pause();
  }

  function isArrivalMobile() {
    return window.matchMedia("(max-width: 767.98px)").matches;
  }

  function buildArrivalDesktopTimeline(words, rule, items) {
    var tl = gsap.timeline({
      paused: true,
      repeat: -1,
      defaults: { ease: "power3.out" }
    });

    gsap.set(words, { opacity: 0, y: 28, filter: "blur(8px)", clearProps: "position,left,right,top" });
    if (rule) gsap.set(rule, { opacity: 0, scaleX: 0 });
    gsap.set(items, { opacity: 0, y: 42, filter: "blur(10px)", clearProps: "position,left,right,top" });

    tl.to(words, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.85,
      stagger: 0.08,
      ease: "power3.out"
    }, 0.15);

    if (rule) {
      tl.to(rule, {
        opacity: 1,
        scaleX: 1,
        duration: 0.7,
        ease: "power2.out"
      }, "-=0.35");
    }

    tl.to(items, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 1.05,
      ease: "power3.out"
    }, "-=0.15");

    tl.to({}, { duration: 2.8 });

    tl.to(items, {
      opacity: 0,
      y: -18,
      filter: "blur(6px)",
      duration: 0.55,
      stagger: { each: 0.07, from: "end" },
      ease: "power2.in"
    });

    if (rule) {
      tl.to(rule, {
        opacity: 0,
        scaleX: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.35");
    }

    tl.to(words, {
      opacity: 0,
      y: -14,
      filter: "blur(6px)",
      duration: 0.5,
      stagger: { each: 0.04, from: "end" },
      ease: "power2.in"
    }, "-=0.3");

    tl.to({}, { duration: 0.55 });

    return tl;
  }

  function buildArrivalMobileTimeline(words, rule, items) {
    var tl = gsap.timeline({
      paused: true,
      repeat: -1,
      defaults: { ease: "power3.out" }
    });
    var pairGapEm = 3.2;
    var pairSize = 2;
    var i;
    var pairIndex = 0;
    var lastPair = [];

    gsap.set(words, { opacity: 0, y: 22, filter: "blur(8px)" });
    if (rule) gsap.set(rule, { opacity: 0, scaleX: 0 });
    gsap.set(items, {
      opacity: 0,
      y: "1.6em",
      filter: "blur(10px)",
      position: "absolute",
      left: 0,
      right: 0,
      top: 0
    });

    tl.to(words, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 0.07,
      ease: "power3.out"
    }, 0.12);

    if (rule) {
      tl.to(rule, {
        opacity: 1,
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");
    }

    for (i = 0; i < items.length; i += pairSize) {
      var pair = [];
      var prevPair = [];
      var p;
      for (p = 0; p < pairSize && i + p < items.length; p++) {
        pair.push(items[i + p]);
      }
      lastPair = pair;

      if (pairIndex > 0) {
        for (p = 0; p < pairSize && i - pairSize + p < i; p++) {
          prevPair.push(items[i - pairSize + p]);
        }
        tl.to(prevPair, {
          opacity: 0,
          y: "-1.4em",
          filter: "blur(7px)",
          duration: 0.9,
          stagger: 0.06,
          ease: "power2.inOut"
        }, ">+0.2");
      }

      for (p = 0; p < pair.length; p++) {
        var slotY = (p * pairGapEm) + "em";
        var fromY = (p * pairGapEm + 1.5) + "em";
        var enterAt = pairIndex === 0 && p === 0
          ? "-=0.05"
          : p === 0
            ? "<+=0.18"
            : "<+=0.1";

        tl.fromTo(pair[p], {
          opacity: 0,
          y: fromY,
          filter: "blur(10px)"
        }, {
          opacity: 1,
          y: slotY,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out"
        }, enterAt);
      }

      tl.to({}, { duration: 1.45 });
      pairIndex += 1;
    }

    tl.to({}, { duration: 0.55 });

    tl.to(lastPair, {
      opacity: 0,
      y: "-=1.1em",
      filter: "blur(6px)",
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.in"
    });

    if (rule) {
      tl.to(rule, {
        opacity: 0,
        scaleX: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.3");
    }

    tl.to(words, {
      opacity: 0,
      y: -12,
      filter: "blur(6px)",
      duration: 0.5,
      stagger: { each: 0.04, from: "end" },
      ease: "power2.in"
    }, "-=0.3");

    tl.to({}, { duration: 0.5 });

    return tl;
  }

  function buildArrivalTimeline() {
    if (!arrival || !window.gsap || reduceMotion) return null;

    var words = arrival.querySelectorAll(".arrival-word");
    var rule = arrival.querySelector(".title-arrows");
    var items = arrival.querySelectorAll(".arrival-benefits li");
    if (!words.length || !items.length) return null;

    if (isArrivalMobile()) {
      return buildArrivalMobileTimeline(words, rule, items);
    }
    return buildArrivalDesktopTimeline(words, rule, items);
  }

  function destroyArrivalTimeline() {
    if (!arrivalTimeline) return;
    arrivalTimeline.kill();
    arrivalTimeline = null;
  }

  function initArrivalTimeline(shouldPlay) {
    destroyArrivalTimeline();
    if (!arrival || reduceMotion || window.__gsapFailed || !window.gsap || !arrivalOverlay) {
      return;
    }
    try {
      arrivalTimeline = buildArrivalTimeline();
    } catch (err) {
      arrivalTimeline = null;
    }
    if (!arrivalTimeline) {
      arrival.classList.add("arrival--no-overlay");
      return;
    }
    arrival.classList.remove("arrival--no-overlay");
    if (shouldPlay) arrivalTimeline.play(0);
  }

  if (arrival) {
    var arrivalInView = false;

    if (reduceMotion) {
      arrival.classList.add("arrival--static");
    } else if (window.__gsapFailed || !window.gsap || !arrivalOverlay) {
      arrival.classList.add("arrival--no-overlay");
    } else {
      initArrivalTimeline(false);
    }

    function onArrivalEnter() {
      arrivalInView = true;
      playArrivalVideo();
      if (arrivalTimeline) {
        if (arrivalTimeline.paused()) arrivalTimeline.play();
      }
    }

    function onArrivalLeave() {
      arrivalInView = false;
      pauseArrivalVideo();
      if (arrivalTimeline) arrivalTimeline.pause();
    }

    if ("IntersectionObserver" in window) {
      var arrivalWatch = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) onArrivalEnter();
        else onArrivalLeave();
      }, { threshold: 0.45 });
      arrivalWatch.observe(arrival);
    } else if (!reduceMotion) {
      onArrivalEnter();
    }

    if (!reduceMotion && window.gsap && arrivalOverlay) {
      var arrivalMobileQuery = window.matchMedia("(max-width: 767.98px)");
      var onArrivalBreakpoint = function () {
        initArrivalTimeline(arrivalInView);
      };
      if (arrivalMobileQuery.addEventListener) {
        arrivalMobileQuery.addEventListener("change", onArrivalBreakpoint);
      } else if (arrivalMobileQuery.addListener) {
        arrivalMobileQuery.addListener(onArrivalBreakpoint);
      }
    }
  }

  var locationMapOpen = document.getElementById("locationMapOpen");
  var locationMapDialog = document.getElementById("locationMapDialog");
  var locationMapStage = document.getElementById("locationMapStage");
  var locationMapImg = document.getElementById("locationMapImg");

  if (locationMapOpen && locationMapDialog && locationMapStage && locationMapImg && locationMapDialog.showModal) {
    var mapScale = 1;
    var panX = 0;
    var panY = 0;
    var mapPointers = new Map();
    var mapDrag = null;
    var mapPinch = null;
    var mapMin = 1;
    var mapMax = 5;

    function applyMapTransform() {
      locationMapImg.style.setProperty("--map-scale", String(mapScale));
      locationMapImg.style.setProperty("--pan-x", panX + "px");
      locationMapImg.style.setProperty("--pan-y", panY + "px");
    }

    function clampMapPan() {
      var stageRect = locationMapStage.getBoundingClientRect();
      var baseW = locationMapImg.offsetWidth;
      var baseH = locationMapImg.offsetHeight;
      var maxX = Math.max(0, (baseW * mapScale - stageRect.width) / 2);
      var maxY = Math.max(0, (baseH * mapScale - stageRect.height) / 2);
      panX = Math.max(-maxX, Math.min(maxX, panX));
      panY = Math.max(-maxY, Math.min(maxY, panY));
    }

    function setMapScale(next, originX, originY) {
      var prev = mapScale;
      mapScale = Math.max(mapMin, Math.min(mapMax, next));
      if (originX != null && originY != null && prev > 0) {
        var ratio = mapScale / prev;
        panX = originX - (originX - panX) * ratio;
        panY = originY - (originY - panY) * ratio;
      }
      if (mapScale === mapMin) {
        panX = 0;
        panY = 0;
      } else {
        clampMapPan();
      }
      applyMapTransform();
    }

    function resetMapView() {
      mapScale = 1;
      panX = 0;
      panY = 0;
      applyMapTransform();
    }

    function stageOrigin(clientX, clientY) {
      var rect = locationMapStage.getBoundingClientRect();
      return {
        x: clientX - rect.left - rect.width / 2,
        y: clientY - rect.top - rect.height / 2
      };
    }

    locationMapOpen.addEventListener("click", function () {
      resetMapView();
      locationMapOpen.setAttribute("aria-expanded", "true");
      locationMapDialog.showModal();
    });

    locationMapDialog.addEventListener("close", function () {
      locationMapOpen.setAttribute("aria-expanded", "false");
      resetMapView();
      locationMapOpen.focus();
    });

    locationMapDialog.addEventListener("click", function (event) {
      if (event.target.closest("[data-map-close]")) {
        locationMapDialog.close();
        return;
      }
      var rect = locationMapDialog.getBoundingClientRect();
      var inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) locationMapDialog.close();
    });

    locationMapDialog.querySelectorAll("[data-map-zoom]").forEach(function (button) {
      button.addEventListener("click", function () {
        var action = button.getAttribute("data-map-zoom");
        if (action === "reset") {
          resetMapView();
          return;
        }
        setMapScale(mapScale * (action === "in" ? 1.25 : 0.8));
      });
    });

    locationMapDialog.addEventListener("keydown", function (event) {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setMapScale(mapScale * 1.25);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setMapScale(mapScale / 1.25);
      } else if (event.key === "0") {
        event.preventDefault();
        resetMapView();
      }
    });

    locationMapStage.addEventListener("wheel", function (event) {
      event.preventDefault();
      var origin = stageOrigin(event.clientX, event.clientY);
      var factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
      setMapScale(mapScale * factor, origin.x, origin.y);
    }, { passive: false });

    locationMapStage.addEventListener("dblclick", function (event) {
      event.preventDefault();
      resetMapView();
    });

    function pinchDistance() {
      var points = Array.from(mapPointers.values());
      if (points.length < 2) return 0;
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }

    locationMapStage.addEventListener("pointerdown", function (event) {
      mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      locationMapStage.setPointerCapture(event.pointerId);
      if (mapPointers.size === 1) {
        mapPinch = null;
        mapDrag = { x: event.clientX, y: event.clientY, ox: panX, oy: panY };
        locationMapStage.classList.add("is-panning");
      } else if (mapPointers.size === 2) {
        mapDrag = null;
        var mid = stageOrigin(
          (Array.from(mapPointers.values())[0].x + Array.from(mapPointers.values())[1].x) / 2,
          (Array.from(mapPointers.values())[0].y + Array.from(mapPointers.values())[1].y) / 2
        );
        mapPinch = { dist: pinchDistance(), scale: mapScale, x: mid.x, y: mid.y };
      }
    });

    locationMapStage.addEventListener("pointermove", function (event) {
      if (!mapPointers.has(event.pointerId)) return;
      mapPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (mapPointers.size >= 2 && mapPinch && mapPinch.dist > 0) {
        var dist = pinchDistance();
        setMapScale(mapPinch.scale * (dist / mapPinch.dist), mapPinch.x, mapPinch.y);
        return;
      }
      if (!mapDrag || mapScale <= 1) return;
      panX = mapDrag.ox + (event.clientX - mapDrag.x);
      panY = mapDrag.oy + (event.clientY - mapDrag.y);
      clampMapPan();
      applyMapTransform();
    });

    function endMapPointer(event) {
      mapPointers.delete(event.pointerId);
      if (mapPointers.size < 2) mapPinch = null;
      if (mapPointers.size === 0) {
        mapDrag = null;
        locationMapStage.classList.remove("is-panning");
      } else if (mapPointers.size === 1) {
        var remaining = Array.from(mapPointers.values())[0];
        mapDrag = { x: remaining.x, y: remaining.y, ox: panX, oy: panY };
      }
    }

    locationMapStage.addEventListener("pointerup", endMapPointer);
    locationMapStage.addEventListener("pointercancel", endMapPointer);

    locationMapImg.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
  }

  var developerBody = document.getElementById("developerBody");
  var developerMore = document.getElementById("developerMore");
  if (developerBody && developerMore) {
    var developerLabel = developerMore.querySelector(".developer-more-label");
    var developerNodes = Array.prototype.map.call(
      developerBody.querySelectorAll("p"),
      function (paragraph) { return paragraph.cloneNode(true); }
    );
    var developerOpen = false;
    var developerQuery = window.matchMedia("(max-width: 767px)");
    var developerLimit = 100;

    function developerWords(text) {
      var trimmed = (text || "").trim();
      return trimmed ? trimmed.split(/\s+/) : [];
    }

    function truncateRichNode(source, remaining) {
      var clone = source.cloneNode(false);
      var nodes = Array.prototype.slice.call(source.childNodes);
      var i;

      for (i = 0; i < nodes.length; i += 1) {
        if (remaining.count <= 0) break;
        var child = nodes[i];

        if (child.nodeType === 3) {
          var words = developerWords(child.nodeValue);
          if (!words.length) {
            clone.appendChild(document.createTextNode(child.nodeValue));
            continue;
          }
          if (words.length <= remaining.count) {
            clone.appendChild(document.createTextNode(child.nodeValue));
            remaining.count -= words.length;
          } else {
            clone.appendChild(
              document.createTextNode(words.slice(0, remaining.count).join(" ") + "…")
            );
            remaining.count = 0;
          }
          continue;
        }

        if (child.nodeType === 1) {
          var nested = truncateRichNode(child, remaining);
          if (nested.textContent) clone.appendChild(nested);
        }
      }

      return clone;
    }

    function renderDeveloperCopy() {
      var total = developerNodes.reduce(function (sum, node) {
        return sum + developerWords(node.textContent).length;
      }, 0);
      var showToggle = developerQuery.matches && total > developerLimit;
      var expanded = showToggle && developerOpen;

      developerMore.hidden = !showToggle;
      developerMore.classList.toggle("is-open", expanded);
      developerMore.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (developerLabel) developerLabel.textContent = expanded ? "Read less" : "Read more";

      developerBody.textContent = "";
      if (!showToggle || developerOpen) {
        developerNodes.forEach(function (node) {
          developerBody.appendChild(node.cloneNode(true));
        });
        return;
      }

      var remaining = { count: developerLimit };
      developerNodes.forEach(function (node) {
        if (remaining.count <= 0) return;
        var words = developerWords(node.textContent);
        if (words.length <= remaining.count) {
          developerBody.appendChild(node.cloneNode(true));
          remaining.count -= words.length;
          return;
        }
        developerBody.appendChild(truncateRichNode(node, remaining));
      });
    }

    developerMore.addEventListener("click", function () {
      developerOpen = !developerOpen;
      renderDeveloperCopy();
    });

    renderDeveloperCopy();
    if (typeof developerQuery.addEventListener === "function") {
      developerQuery.addEventListener("change", renderDeveloperCopy);
    } else if (typeof developerQuery.addListener === "function") {
      developerQuery.addListener(renderDeveloperCopy);
    }
  }

  var faqMore = document.getElementById("faqMore");
  var faqMoreBtn = document.getElementById("faqMoreBtn");
  if (faqMore && faqMoreBtn) {
    var faqMoreLabel = faqMoreBtn.querySelector(".faq-more-label");

    faqMoreBtn.addEventListener("click", function () {
      var expanded = faqMoreBtn.getAttribute("aria-expanded") === "true";
      var next = !expanded;
      faqMore.hidden = !next;
      faqMoreBtn.setAttribute("aria-expanded", next ? "true" : "false");
      faqMoreBtn.classList.toggle("is-open", next);
      if (faqMoreLabel) faqMoreLabel.textContent = next ? "Show less" : "Show more";
    });
  }

  function setupTabStrip(tabs, panels) {
    if (!tabs.length || !panels.length) return;

    function activateTab(tab) {
      if (!tab) return;
      var panelId = tab.getAttribute("aria-controls");
      tabs.forEach(function (item) {
        var on = item === tab;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-selected", on ? "true" : "false");
        item.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (panel) {
        var on = panel.id === panelId;
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });
      tab.addEventListener("keydown", function (event) {
        var index = tabs.indexOf(tab);
        var next = -1;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next < 0) return;
        event.preventDefault();
        tabs[next].focus();
        activateTab(tabs[next]);
      });
    });
  }

  (function initDocuments() {
    setupTabStrip(
      Array.prototype.slice.call(document.querySelectorAll(".documents-tab")),
      Array.prototype.slice.call(document.querySelectorAll(".documents-panel"))
    );
  })();


  /* Plots and pricing — interactive map + band table */
  (function () {
    var data = window.MADHAVAM_PLOTS;
    var section = document.getElementById("plots");
    if (!data || !section) return;

    var svg = document.getElementById("plotsMapSvg");
    var dialog = document.getElementById("plotDialog");
    var chipsEl = document.getElementById("plotsBandChips");
    var bandRows = section.querySelectorAll(".plots-band-row");
    var NS = "http://www.w3.org/2000/svg";
    var WA_BASE = "https://wa.me/918069982711";
    var activeBand = null;
    var plotByNumber = {};

    (data.plots || []).forEach(function (plot) {
      plotByNumber[plot.number] = plot;
    });
    if (data.commercial) {
      data.commercial.isCommercial = true;
      data.commercial.number = data.commercial.number || "commercial";
      plotByNumber.commercial = data.commercial;
    }

    function formatInr(value, digits) {
      if (value == null || isNaN(value)) return null;
      var maxDigits = digits == null ? 0 : digits;
      try {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: (data.pricing && data.pricing.currency) || "INR",
          maximumFractionDigits: maxDigits,
          minimumFractionDigits: maxDigits > 0 && value % 1 !== 0 ? Math.min(2, maxDigits) : 0
        }).format(value);
      } catch (err) {
        return "₹" + Number(value).toLocaleString("en-IN", {
          maximumFractionDigits: maxDigits
        });
      }
    }

    function padPlot(n) {
      if (typeof n === "string") return n;
      return n < 10 ? "0" + n : String(n);
    }

    function plotLabel(plot) {
      if (!plot) return "—";
      if (plot.displayNumber) return String(plot.displayNumber);
      if (plot.isCommercial) return "Commercial";
      return padPlot(plot.number);
    }

    function formatArea(value, digits) {
      if (value == null || isNaN(value)) return "—";
      return Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: digits == null ? 2 : digits,
        minimumFractionDigits: 0
      });
    }

    function statusClass(status, plot) {
      var s = (status || "Available").toLowerCase();
      var classes = [];
      if (s === "sold") classes.push("is-sold");
      else if (s === "booked") classes.push("is-booked");
      else classes.push("is-available");
      if (plot && plot.mortgage) classes.push("is-mortgage");
      return classes.join(" ");
    }

    function tentativeForPlot(plot) {
      var rate = plot && plot.ratePerSqYd != null
        ? plot.ratePerSqYd
        : (data.pricing && data.pricing.ratePerSqYd);
      var amount = plot && plot.amountMonth != null
        ? plot.amountMonth
        : (rate != null && plot && plot.sizeSqYd != null ? rate * plot.sizeSqYd : null);
      if (rate == null || rate === "") {
        return {
          rateLabel: (data.pricing && data.pricing.priceLabel) || "On request",
          amountLabel: (data.pricing && data.pricing.priceLabel) || "On request",
          rate: null,
          amountMonth: null
        };
      }
      return {
        rateLabel: formatInr(rate, 2),
        amountLabel: amount != null ? formatInr(amount, 2) : "—",
        rate: rate,
        amountMonth: amount
      };
    }

    function tentativeForSize(sizeSqYd) {
      return tentativeForPlot({ sizeSqYd: sizeSqYd, ratePerSqYd: data.pricing && data.pricing.ratePerSqYd });
    }

    function hydratePrices() {
      section.querySelectorAll(".plots-rate").forEach(function (cell) {
        var size = Number(cell.getAttribute("data-size"));
        cell.textContent = tentativeForSize(size).rateLabel;
      });
      section.querySelectorAll(".plots-amount-month").forEach(function (cell) {
        var size = Number(cell.getAttribute("data-size"));
        var priced = tentativeForSize(size);
        cell.textContent = priced.amountLabel;
      });
    }

    function hydrateBandTable() {
      (data.bands || []).forEach(function (band) {
        var row = section.querySelector('.plots-band-row[data-band="' + band.bandKey + '"]');
        if (!row) return;
        var sizeCell = row.querySelector("[data-band-size]");
        if (sizeCell && band.sizeSqYdLabel) {
          sizeCell.textContent = band.sizeSqYdLabel;
        }
        var countCell = row.querySelector("[data-band-count]");
        if (countCell && band.count != null) {
          countCell.textContent = String(band.count);
        }
      });
      var totalEl = section.querySelector(".plots-total strong");
      if (totalEl) totalEl.textContent = String((data.plots || []).length);
    }

    function el(name, attrs, text) {
      var node = document.createElementNS(NS, name);
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          node.setAttribute(key, attrs[key]);
        });
      }
      if (text != null) node.textContent = text;
      return node;
    }

    function bandFill(bandKey) {
      if (data.bandColors && data.bandColors[bandKey]) return data.bandColors[bandKey];
      var band = (data.bands || []).find(function (b) { return b.bandKey === bandKey; });
      return (band && band.color) || "#d8d0c4";
    }

    function renderMap() {
      if (!svg) return;
      var vb = data.viewBox || { width: 394, height: 849 };
      svg.setAttribute("viewBox", "0 0 " + vb.width + " " + vb.height);
      svg.replaceChildren();

      var bg = el("g", { class: "plot-backdrop", "aria-hidden": "true" });
      bg.appendChild(el("rect", {
        class: "plot-ground",
        x: 0,
        y: 0,
        width: vb.width,
        height: vb.height,
        rx: 10
      }));

      var voidRect = data.amenitiesVoid;
      if (voidRect) {
        bg.appendChild(el("rect", {
          class: "plot-amenities-void",
          x: voidRect.x,
          y: voidRect.y,
          width: voidRect.w,
          height: voidRect.h,
          rx: 4
        }));
      }

      (data.roads || []).forEach(function (road) {
        bg.appendChild(el("rect", {
          class: "plot-road",
          x: road.x,
          y: road.y,
          width: road.w,
          height: road.h,
          rx: 3
        }));
      });
      svg.appendChild(bg);

      var commercial = data.commercial;
      if (commercial && commercial.rect) {
        var cr = commercial.rect;
        var clickable = commercial.clickable !== false;
        var cgAttrs = {
          class: "plot plot-commercial " + statusClass(commercial.status || "Available", commercial) +
            (clickable ? " is-clickable" : ""),
          "data-plot": "commercial",
          "data-band": "commercial",
          "aria-label": [
            "Commercial plot",
            commercial.sizeSqYd ? commercial.sizeSqYd + " sq yd" : "",
            commercial.status || "Available"
          ].filter(Boolean).join(", ")
        };
        if (clickable) {
          cgAttrs.role = "button";
          cgAttrs.tabindex = "0";
        } else {
          cgAttrs["aria-hidden"] = "true";
        }
        var cg = el("g", cgAttrs);
        cg.appendChild(el("rect", {
          x: cr.x,
          y: cr.y,
          width: cr.w,
          height: cr.h,
          rx: 3
        }));
        var cSize = Math.max(8, Math.min(12, cr.w * 0.12));
        var cLabel = el("text", {
          x: cr.x + cr.w / 2,
          y: cr.y + cr.h / 2 - cSize * 0.55,
          "text-anchor": "middle",
          "dominant-baseline": "central",
          "font-size": String(cSize)
        });
        cLabel.appendChild(el("tspan", {
          x: cr.x + cr.w / 2,
          dy: "0"
        }, "COMMERCIAL"));
        cLabel.appendChild(el("tspan", {
          x: cr.x + cr.w / 2,
          dy: String(cSize * 1.25)
        }, "PLOT"));
        cg.appendChild(cLabel);
        svg.appendChild(cg);
      }

      var layer = el("g", { class: "plot-tiles" });
      (data.plots || []).forEach(function (plot) {
        var r = plot.rect || {};
        var status = plot.status || "Available";
        var labelText = plotLabel(plot);
        var cx = r.x + r.w / 2;
        var cy = r.y + r.h / 2;
        var badgeR = Math.max(5.5, Math.min(9, Math.min(r.w, r.h) * 0.32));
        var fontSize = Math.max(5.5, Math.min(10, badgeR * (labelText.length > 2 ? 0.85 : 1.05)));
        var g = el("g", {
          class: "plot " + statusClass(status, plot),
          role: "button",
          tabindex: "0",
          "data-plot": String(plot.number),
          "data-band": plot.bandKey || "",
          "aria-label": [
            "Plot " + labelText,
            plot.sizeSqYd + " sq yd",
            plot.dimensions ? plot.dimensions : "",
            plot.facing ? plot.facing + " facing" : "",
            plot.mortgage ? "Mortgage" : "",
            (plot.tags || []).join(", "),
            status
          ].filter(Boolean).join(", ")
        });
        var tile = el("rect", {
          x: r.x,
          y: r.y,
          width: r.w,
          height: r.h,
          rx: 1.5
        });
        tile.setAttribute("fill", bandFill(plot.bandKey));
        g.appendChild(tile);
        if (plot.mortgage) {
          g.appendChild(el("rect", {
            class: "plot-mortgage-mark",
            x: r.x + 1.2,
            y: r.y + 1.2,
            width: Math.max(3, r.w * 0.18),
            height: Math.max(3, r.h * 0.18),
            rx: 0.6
          }));
        }
        g.appendChild(el("circle", {
          class: "plot-badge",
          cx: cx,
          cy: cy,
          r: badgeR
        }));
        var label = el("text", {
          x: cx,
          y: cy,
          "text-anchor": "middle",
          "dominant-baseline": "central"
        }, labelText);
        label.setAttribute("font-size", String(fontSize));
        g.appendChild(label);
        layer.appendChild(g);
      });
      svg.appendChild(layer);
    }

    function waUrlForPlot(plot) {
      var name = plot.isCommercial ? "the commercial plot" : ("Plot " + plotLabel(plot));
      var sizeBit = plot.sizeSqYd != null ? " (" + plot.sizeSqYd + " sq yd)" : "";
      var msg = "Hi, I'd like details on " + name + sizeBit +
        " at Madhavam, Raj Nagar Extension.";
      return WA_BASE + "?text=" + encodeURIComponent(msg);
    }

    function openPlotDialog(plot) {
      if (!dialog || !plot) return;
      var title = document.getElementById("plotDialogTitle");
      var meta = document.getElementById("plotDialogMeta");
      var tags = document.getElementById("plotDialogTags");
      var price = document.getElementById("plotDialogPrice");
      var statusEl = document.getElementById("plotDialogStatus");
      var wa = document.getElementById("plotDialogWa");
      var priced = tentativeForPlot(plot);
      var label = plotLabel(plot);

      if (title) {
        title.textContent = plot.isCommercial ? "Commercial Plot" : ("Plot " + label);
      }
      if (meta) {
        var rows = [];
        if (!plot.isCommercial) {
          rows.push("<dt>Plot No</dt><dd>" + label + "</dd>");
        }
        if (plot.dimensions) {
          rows.push("<dt>Size (L × B)</dt><dd>" + plot.dimensions + " <span>(m)</span></dd>");
        }
        rows.push("<dt>Area (sq m)</dt><dd>" + formatArea(plot.sizeSqM) + "</dd>");
        rows.push("<dt>Area (sq yd)</dt><dd>" + formatArea(plot.sizeSqYd) + "</dd>");
        if (plot.sizeSqFt != null) {
          rows.push("<dt>Area (sq ft)</dt><dd>" + formatArea(plot.sizeSqFt, 0) + "</dd>");
        }
        if (!plot.isCommercial) {
          rows.push("<dt>Facing</dt><dd>" + (plot.facing || "Confirm at enquiry") + "</dd>");
        }
        if (plot.bandKey && plot.bandKey !== "commercial") {
          rows.push("<dt>Size band</dt><dd>" + plot.bandKey.replace("-", " – ") + "</dd>");
        }
        if (plot.mortgage) {
          rows.push("<dt>List note</dt><dd>Plots being sent for mortgage</dd>");
        }
        meta.innerHTML = rows.join("");
      }
      if (tags) {
        var tagList = (plot.tags || []).slice();
        if (plot.isCommercial) tagList = ["commercial"].concat(tagList);
        if (plot.displayNumber) tagList = ["list id " + plot.displayNumber].concat(tagList);
        tags.innerHTML = tagList.map(function (tag) {
          return '<span class="plot-tag">' + String(tag).replace(/-/g, " ") + "</span>";
        }).join("");
      }
      if (price) {
        price.innerHTML =
          "<span>Tentative rate (per sq yd)</span><strong>" + priced.rateLabel + "</strong>" +
          "<span style=\"display:block;margin-top:0.55rem\">Amount / month (as per list)</span><strong>" +
          priced.amountLabel + "</strong>";
      }
      if (statusEl) {
        var statusText = plot.status || "Available";
        if (plot.mortgage) statusText += " · Mortgage";
        statusEl.textContent = "Status: " + statusText;
        statusEl.setAttribute("data-status", plot.status || "Available");
      }
      if (wa) {
        wa.href = waUrlForPlot(plot);
        wa.textContent = plot.isCommercial
          ? "Enquire about commercial plot"
          : "Enquire about this plot";
      }

      section.querySelectorAll(".plot.is-active").forEach(function (node) {
        node.classList.remove("is-active");
      });
      var selector = plot.isCommercial
        ? '.plot[data-plot="commercial"]'
        : '.plot[data-plot="' + plot.number + '"]';
      var tile = svg && svg.querySelector(selector);
      if (tile) tile.classList.add("is-active");

      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    function closePlotDialog() {
      if (!dialog) return;
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      section.querySelectorAll(".plot.is-active").forEach(function (node) {
        node.classList.remove("is-active");
      });
    }

    function setBandHighlight(bandKey) {
      activeBand = bandKey;
      if (!svg) return;
      svg.querySelectorAll(".plot").forEach(function (node) {
        var match = !bandKey || node.getAttribute("data-band") === bandKey;
        node.classList.toggle("is-band-dim", Boolean(bandKey) && !match);
        node.classList.toggle("is-band-hot", Boolean(bandKey) && match);
      });
      bandRows.forEach(function (row) {
        var on = row.getAttribute("data-band") === bandKey;
        row.classList.toggle("is-active", on);
        row.setAttribute("aria-expanded", on ? "true" : "false");
      });
    }

    function showBandChips(bandKey) {
      if (!chipsEl) return;
      if (!bandKey) {
        chipsEl.hidden = true;
        chipsEl.replaceChildren();
        return;
      }
      var plots = (data.plots || []).filter(function (p) { return p.bandKey === bandKey; });
      if (bandKey === "commercial" && data.commercial) {
        plots = [data.commercial];
      }
      chipsEl.replaceChildren();
      plots.forEach(function (plot) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "plots-chip " + statusClass(plot.status, plot);
        btn.textContent = plot.isCommercial ? "Commercial" : plotLabel(plot);
        btn.setAttribute(
          "aria-label",
          plot.isCommercial ? "Open commercial plot" : ("Open plot " + plotLabel(plot))
        );
        btn.addEventListener("click", function () {
          openPlotDialog(plot);
        });
        chipsEl.appendChild(btn);
      });
      chipsEl.hidden = false;
    }

    function toggleBand(bandKey) {
      if (activeBand === bandKey) {
        setBandHighlight(null);
        showBandChips(null);
        return;
      }
      setBandHighlight(bandKey);
      showBandChips(bandKey);
      if (bandKey === "commercial" && data.commercial) {
        openPlotDialog(data.commercial);
      }
    }

    function plotFromTile(tile) {
      if (!tile) return null;
      var key = tile.getAttribute("data-plot");
      if (key === "commercial") return plotByNumber.commercial;
      return plotByNumber[Number(key)];
    }

    hydratePrices();
    hydrateBandTable();
    renderMap();

    if (svg) {
      svg.addEventListener("click", function (event) {
        var tile = event.target.closest(".plot");
        if (!tile || !svg.contains(tile)) return;
        if (tile.classList.contains("plot-commercial") &&
            !tile.classList.contains("is-clickable")) return;
        var plot = plotFromTile(tile);
        if (plot) {
          /* Clear band dim so map colours stay full when opening a plot */
          setBandHighlight(null);
          showBandChips(null);
          openPlotDialog(plot);
        }
      });
      svg.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        var tile = event.target.closest(".plot");
        if (!tile || !svg.contains(tile)) return;
        if (tile.classList.contains("plot-commercial") &&
            !tile.classList.contains("is-clickable")) return;
        event.preventDefault();
        var plot = plotFromTile(tile);
        if (plot) {
          setBandHighlight(null);
          showBandChips(null);
          openPlotDialog(plot);
        }
      });
    }

    bandRows.forEach(function (row) {
      function activate() {
        toggleBand(row.getAttribute("data-band"));
      }
      row.addEventListener("click", activate);
      row.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });

    if (dialog) {
      dialog.querySelectorAll("[data-plot-close]").forEach(function (btn) {
        btn.addEventListener("click", closePlotDialog);
      });
      dialog.addEventListener("click", function (event) {
        if (event.target === dialog) closePlotDialog();
      });
      dialog.addEventListener("cancel", function (event) {
        event.preventDefault();
        closePlotDialog();
      });
    }
  })();

})();
