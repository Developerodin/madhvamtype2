(function () {
  var header = document.getElementById("siteHeader");
  var video = document.querySelector(".hero-video");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var navToggle = document.querySelector(".navbar-toggler");
  var siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    siteNav.addEventListener("show.bs.collapse", function () {
      navToggle.setAttribute("aria-label", "Close menu");
    });
    siteNav.addEventListener("hide.bs.collapse", function () {
      navToggle.setAttribute("aria-label", "Open menu");
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
      { category: "aerial", title: "A Planned Community Amidst Nature", lines: ["A Planned", "Community", "Amidst Nature"], caption: "", feature: true, png: "assets/Residential Aerial View.png", webp: "assets/residential-aerial-view.webp" },
      { category: "amenities", also: "clubhouse", title: "Park Gazebo", caption: "Relax. Reconnect. Belong.", png: "assets/Golden-Hour Luxury Garden Pavilion.png", webp: "assets/golden-hour-luxury-garden-pavilion.webp" },
      { category: "amenities", title: "Kids Play Area", caption: "A Safer, Happier Tomorrow", png: "assets/Playground Oasis.png", webp: "assets/playground-oasis.webp" },
      { category: "roads", title: "Internal Roads", caption: "Wide. Well Planned. Serene.", png: "assets/ Street.png", webp: "assets/street.webp" },
      { category: "amenities", also: "landscapes", title: "Flower Garden", caption: "Green spaces for a healthier life.", png: "assets/ Courtyard.png", webp: "assets/courtyard.webp" },
      { category: "amenities", title: "Badminton Court", caption: "A court set among the trees.", png: "assets/Badminton Courtyard.png", webp: "assets/badminton-courtyard.webp" },
      { category: "amenities", also: "clubhouse", title: "Multi Purpose Hall", caption: "A hall for a hundred, with a pantry.", png: "assets/Elegant Banquet Hall Interior.png", webp: "assets/elegant-banquet-hall-interior.webp" },
      { category: "amenities", also: "landscapes", title: "Lush Green Lawn with Jogging Track", caption: "A lawn to run, walk, and gather.", png: "assets/ Garden Jogging Park.png", webp: "assets/garden-jogging-park.webp" },
      { category: "amenities", title: "Gymnasium", caption: "Training with a view of the gardens.", png: "assets/ Gym with Garden Views.png", webp: "assets/gym-with-garden-views.webp" },
      { category: "amenities", title: "Yoga and Zumba Room", caption: "A quiet room for yoga and dance.", png: "assets/Yoga and Dance Studio.png", webp: "assets/yoga-and-dance-studio.webp" },
      { category: "amenities", also: "landscapes", title: "Sculpture Platform", caption: "A plaza to pause in the garden.", png: "assets/Garden Sculpture Plaza.png", webp: "assets/garden-sculpture-plaza.webp" },
      { category: "amenities", title: "Cricket Net Practice", caption: "Nets for an evening session.", png: "assets/Cricket Practice Courtyard.png", webp: "assets/cricket-practice-courtyard.webp" },
      { category: "amenities", title: "Yoga Lawn", caption: "An open lawn for morning practice." },
      { category: "amenities", title: "Pet Park", caption: "A corner of the garden for pets." },
      { category: "amenities", title: "Indoor Games Room", caption: "Board games and indoor play.", png: "assets/indoorGames Room .png" },
      { category: "amenities", title: "Toddler Play Area", caption: "A softer space for the smallest." },
      { category: "landscapes", title: "Hillside", caption: "Trees along the open ground.", png: "assets/Dark Green Hillside Tree Panorama.png", webp: "assets/dark-green-hillside-tree-panorama.webp", contain: true },
      { category: "landscapes", title: "Emerald Greens", caption: "A line of hills and trees.", png: "assets/Emerald Green Panoramic Landscape Outline.png", webp: "assets/emerald-green-panoramic-landscape-outline.webp", contain: true }
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

    var galleryDesktop = window.matchMedia("(min-width: 1100px)");

    function galleryHasMedia(slide) {
      return !!(slide.png || slide.webp);
    }

    function galleryMatches(slide, filter) {
      return slide.category === filter || slide.also === filter;
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
      return '<article class="gallery-card' + (feature ? " gallery-feature" : "") + '"' + (hidden ? ' aria-hidden="true"' : "") + ">" +
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
        galleryWindow(galleryPool(galleryFilter), galleryPage, 4).map(function (slide) {
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
      galleryPage = 0;
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

  if (arrival && arrivalVideo && !reduceMotion) {
    function playArrival() {
      var pending = arrivalVideo.play();
      if (pending && pending.catch) pending.catch(function () {});
    }

    if ("IntersectionObserver" in window) {
      var arrivalWatch = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (arrivalVideo.paused) playArrival();
        } else {
          arrivalVideo.pause();
        }
      }, { threshold: 0.45 });
      arrivalWatch.observe(arrival);
    } else {
      playArrival();
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
    var developerParagraphs = Array.prototype.map.call(
      developerBody.querySelectorAll("p"),
      function (paragraph) { return paragraph.textContent; }
    );
    var developerOpen = false;
    var developerQuery = window.matchMedia("(max-width: 767px)");
    var developerLimit = 100;

    function developerWords(text) {
      var trimmed = text.trim();
      return trimmed ? trimmed.split(/\s+/) : [];
    }

    function renderDeveloperCopy() {
      var total = developerParagraphs.reduce(function (sum, text) {
        return sum + developerWords(text).length;
      }, 0);
      var showToggle = developerQuery.matches && total > developerLimit;
      var expanded = showToggle && developerOpen;

      developerMore.hidden = !showToggle;
      developerMore.classList.toggle("is-open", expanded);
      developerMore.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (developerLabel) developerLabel.textContent = expanded ? "Read less" : "Read more";

      developerBody.textContent = "";
      if (!showToggle || developerOpen) {
        developerParagraphs.forEach(function (text) {
          var paragraph = document.createElement("p");
          paragraph.textContent = text;
          developerBody.appendChild(paragraph);
        });
        return;
      }

      var remaining = developerLimit;
      developerParagraphs.forEach(function (text) {
        if (remaining <= 0) return;
        var words = developerWords(text);
        var paragraph = document.createElement("p");
        if (words.length <= remaining) {
          paragraph.textContent = text;
          remaining -= words.length;
        } else {
          paragraph.textContent = words.slice(0, remaining).join(" ") + "…";
          remaining = 0;
        }
        developerBody.appendChild(paragraph);
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
