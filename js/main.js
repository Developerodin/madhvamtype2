(function () {
  var header = document.getElementById("siteHeader");
  var video = document.querySelector(".hero-video");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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

  function toggleMessage() {
    var ready = nameInput.value.trim().length > 1 && phoneInput.value.replace(/\D/g, "").length >= 10;
    messageWrap.hidden = !ready;
  }

  nameInput.addEventListener("input", toggleMessage);
  phoneInput.addEventListener("input", function () {
    phoneInput.setCustomValidity("");
    toggleMessage();
  });

  var form = document.getElementById("enquiryForm");
  var success = document.getElementById("enquirySuccess");

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
    success.hidden = false;
  });

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
      { category: "aerial", title: "A Planned Community Amidst Nature", lines: ["A Planned", "Community", "Amidst Nature"], caption: "", feature: true, png: "assets/Residential Aerial View.png", webp: "assets/residential-aerial-view.webp", all: 0 },
      { category: "clubhouse", title: "Clubhouse", caption: "Relax. Reconnect. Belong.", png: "assets/Golden-Hour Luxury Garden Pavilion.png", webp: "assets/golden-hour-luxury-garden-pavilion.webp", all: 0 },
      { category: "amenities", title: "Kids Play Area", caption: "A Safer, Happier Tomorrow", png: "assets/Playground Oasis.png", webp: "assets/playground-oasis.webp", all: 0 },
      { category: "roads", title: "Internal Roads", caption: "Wide. Well Planned. Serene.", png: "assets/ Street.png", webp: "assets/street.webp", all: 0 },
      { category: "landscapes", title: "Landscape", caption: "Green Spaces for a Healthier Life.", png: "assets/ Courtyard.png", webp: "assets/courtyard.webp", all: 0 },
      { category: "amenities", title: "Badminton Court", caption: "A court set among the trees.", png: "assets/Badminton Courtyard.png", webp: "assets/badminton-courtyard.webp", all: 1 },
      { category: "clubhouse", title: "Banquet Hall", caption: "Gather. Celebrate. Belong.", png: "assets/Elegant Banquet Hall Interior.png", webp: "assets/elegant-banquet-hall-interior.webp", all: 1 },
      { category: "landscapes", title: "Hillside", caption: "Trees along the open ground.", png: "assets/Dark Green Hillside Tree Panorama.png", webp: "assets/dark-green-hillside-tree-panorama.webp", contain: true, all: 1 },
      { category: "landscapes", title: "Emerald Greens", caption: "A line of hills and trees.", png: "assets/Emerald Green Panoramic Landscape Outline.png", webp: "assets/emerald-green-panoramic-landscape-outline.webp", contain: true, all: 1 }
    ];
    var galleryLeaf = '<svg class="gallery-leaf" viewBox="0 0 72 118" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.15"><path d="M36 108c0-28-14-42-18-68"/><path d="M18 40c10-2 18 10 18 24"/><path d="M36 86c16-8 28-22 24-40"/><path d="M60 46c-10 2-18 14-20 26"/><path d="M34 98c-12-4-22-16-20-30"/><path d="M14 68c8 2 14 10 16 18"/><path d="M36 70c8-18 8-32 2-44"/><path d="M38 26c6 8 8 18 6 28"/></g></svg>';
    var galleryFilter = "all";
    var galleryPage = 0;

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

    function galleryPages(filter) {
      if (filter === "all") {
        var seen = [];
        gallerySlides.forEach(function (slide) {
          if (typeof slide.all !== "number") return;
          if (seen.indexOf(slide.all) === -1) seen.push(slide.all);
        });
        return Math.max(seen.length, 1);
      }
      var count = gallerySlides.filter(function (slide) { return slide.category === filter; }).length;
      return Math.max(count, 1);
    }

    function galleryView() {
      if (galleryFilter === "all") {
        var total = galleryPages("all");
        var page = ((galleryPage % total) + total) % total;
        var mosaic = gallerySlides.filter(function (slide) { return slide.all === page; });
        mosaic.sort(function (a, b) { return (b.feature ? 1 : 0) - (a.feature ? 1 : 0); });
        var layout = mosaic.some(function (slide) { return slide.feature; }) && mosaic.length >= 5 ? "mosaic" : "grid";
        return { layout: layout, items: mosaic };
      }
      var items = gallerySlides.filter(function (slide) { return slide.category === galleryFilter; });
      var count = items.length || 1;
      var start = ((galleryPage % count) + count) % count;
      var visible = [];
      var take = Math.min(4, items.length);
      for (var i = 0; i < take; i++) visible.push(items[(start + i) % count]);
      return { layout: "grid", items: visible };
    }

    function galleryCard(slide, feature) {
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
      return '<article class="gallery-card' + (feature ? " gallery-feature" : "") + '">' +
        '<div class="gallery-media">' + media + "</div>" +
        (feature ? galleryLeaf : "") +
        '<div class="gallery-caption">' + caption + "</div></article>";
    }

    function renderGallery() {
      var view = galleryView();
      galleryStage.dataset.layout = view.layout;
      galleryStage.innerHTML = '<div class="gallery-' + view.layout + '">' +
        view.items.map(function (slide) {
          return galleryCard(slide, view.layout === "mosaic" && !!slide.feature);
        }).join("") +
        "</div>";
    }

    document.querySelectorAll(".gallery-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        galleryFilter = pill.getAttribute("data-filter") || "all";
        galleryPage = 0;
        document.querySelectorAll(".gallery-pill").forEach(function (item) {
          var on = item === pill;
          item.classList.toggle("is-active", on);
          item.setAttribute("aria-pressed", on ? "true" : "false");
        });
        renderGallery();
      });
    });

    document.querySelectorAll("[data-gallery-dir]").forEach(function (button) {
      button.addEventListener("click", function () {
        galleryPage += Number(button.getAttribute("data-gallery-dir")) || 0;
        renderGallery();
      });
    });

    renderGallery();
  }

  var disclaimer = document.getElementById("footerDisclaimer");
  var disclaimerToggle = document.getElementById("disclaimerToggle");
  if (disclaimer && disclaimerToggle) {
    disclaimerToggle.addEventListener("click", function () {
      var collapsed = disclaimer.getAttribute("data-collapsed") === "true";
      disclaimer.setAttribute("data-collapsed", collapsed ? "false" : "true");
      disclaimerToggle.setAttribute("aria-expanded", collapsed ? "true" : "false");
      disclaimerToggle.textContent = collapsed ? "Read less" : "Read more";
    });
  }
})();
