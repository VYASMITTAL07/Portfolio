/* Vyas Mittal — portfolio behaviour.
   Small and dependency-free: portrait, menu, scroll state, reveals, copy. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Hero portrait --------------------------------------------------- */

  /* The portrait is a cut-out PNG, so the monogram placeholder sitting behind
     it would show through the transparent parts. Drop it once the file loads.
     If the file is missing the <img> removes itself and the monogram stays. */

  var photo = document.querySelector(".photo-img");
  var photoFallback = document.querySelector(".photo-fallback");

  if (photo && photoFallback) {
    var dropFallback = function () { photoFallback.hidden = true; };
    if (photo.complete && photo.naturalWidth > 0) dropFallback();
    else photo.addEventListener("load", dropFallback);
  }

  /* ---- Hero typing ----------------------------------------------------- */

  /* Types the three hero lines in sequence. The text ships in the HTML and is
     only cleared once we are ready to type it, so nothing is lost if this never
     runs. Each line's natural height is locked first, otherwise the block grows
     as characters land and shoves the rest of the hero down. */

  var typeLines = document.querySelectorAll(".type-line");

  if (typeLines.length) {
    if (reduced) {
      Array.prototype.forEach.call(typeLines, function (el) {
        el.classList.add("is-live");
      });
    } else {
      var startTyping = function () {
        var queue = Array.prototype.map.call(typeLines, function (el) {
          var text = el.textContent.trim();
          el.style.minHeight = el.getBoundingClientRect().height + "px";
          el.textContent = "";
          el.classList.add("is-live");
          return { el: el, text: text };
        });

        var caret = document.createElement("span");
        caret.className = "type-caret";
        caret.setAttribute("aria-hidden", "true");

        var line = 0;
        var chars = 0;

        (function tick() {
          var current = queue[line];
          if (!current) {
            if (caret.parentNode) caret.parentNode.removeChild(caret);
            return;
          }
          if (chars === 0) current.el.appendChild(caret);

          if (chars < current.text.length) {
            caret.insertAdjacentText("beforebegin", current.text.charAt(chars));
            chars += 1;
            window.setTimeout(tick, 18 + Math.random() * 22);
          } else {
            line += 1;
            chars = 0;
            window.setTimeout(tick, 130);
          }
        })();
      };

      // Measure after the webfont lands, or the locked heights will be wrong.
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(startTyping);
      } else {
        window.addEventListener("load", startTyping);
      }
    }
  }

  /* ---- Live project previews ------------------------------------------- */

  /* Each cover is the real site in an iframe, laid out at a desktop width so the
     site renders its desktop layout, then scaled down to fit the card. Scrolling
     inside it is the browser's own job — put the cursor on a preview and the
     wheel scrolls that site. CSS cannot divide by a percentage, so the scale
     factor is set here and kept in sync with the card's width. */

  var FRAME_W = 1280;
  var views = document.querySelectorAll(".frame-view");

  function fitFrames() {
    Array.prototype.forEach.call(views, function (view) {
      var w = view.clientWidth;
      if (!w) return;
      view.style.setProperty("--frame-w", FRAME_W + "px");
      view.style.setProperty("--frame-scale", w / FRAME_W);
    });
  }

  if (views.length) {
    fitFrames();
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(fitFrames);
      Array.prototype.forEach.call(views, function (v) { ro.observe(v); });
    } else {
      window.addEventListener("resize", fitFrames);
    }
  }

  /* ---- Mobile menu ----------------------------------------------------- */

  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    if (!mobileNav || mobileNav.hidden) return;
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
    window.setTimeout(function () { mobileNav.hidden = true; }, 320);
  }

  function openMenu() {
    mobileNav.hidden = false;
    // Force a frame so the transition actually runs from the hidden state.
    void mobileNav.offsetWidth;
    mobileNav.classList.add("is-open");
    document.body.classList.add("nav-open");
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close menu");
  }

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      if (mobileNav.hidden) openMenu(); else closeMenu();
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 860) closeMenu();
    });
  }

  /* ---- Header state + scroll progress ---------------------------------- */

  var head = document.getElementById("siteHead");
  var bar = document.getElementById("progressBar");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (head) head.classList.toggle("is-stuck", y > 24);

    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + "%";
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* ---- Reveal on scroll ------------------------------------------------ */

  var items = document.querySelectorAll("[data-reveal]");

  if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---- Active nav link ------------------------------------------------- */

  var links = document.querySelectorAll("[data-navlink]");
  var sections = [];

  Array.prototype.forEach.call(links, function (link) {
    var el = document.querySelector(link.getAttribute("href"));
    if (el) sections.push({ link: link, el: el });
  });

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.filter(function (s) { return s.el === entry.target; })[0];
          if (!match) return;
          if (entry.isIntersecting) {
            Array.prototype.forEach.call(links, function (l) { l.classList.remove("is-active"); });
            match.link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* ---- Copy email ------------------------------------------------------ */

  var copyBtn = document.getElementById("copyBtn");

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var mail = copyBtn.getAttribute("data-mail");
      var done = function () {
        copyBtn.textContent = "Copied";
        copyBtn.classList.add("is-done");
        window.setTimeout(function () {
          copyBtn.textContent = "Copy";
          copyBtn.classList.remove("is-done");
        }, 1800);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(done, fallback);
      } else {
        fallback();
      }

      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = mail;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* ---- Footer year ----------------------------------------------------- */

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
