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

  document.querySelectorAll("#siteNav .nav-link, #siteNav .btn-nav").forEach(function (link) {
    link.addEventListener("click", function () {
      var collapse = document.getElementById("siteNav");
      if (collapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

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
