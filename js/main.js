/* ============================================================
   LITTLE LEMON — SHARED SCRIPT (loaded on every page)
   - mobile nav toggle
   - active nav link based on current page
   - footer year
   - LemonStore: shared booking data via sessionStorage
   ============================================================ */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    [].forEach.call(links.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
      });
    });
  }

  /* ---------- active nav link ---------- */
  var page = document.body.getAttribute("data-page");
  if (links && page) {
    [].forEach.call(links.querySelectorAll("a"), function (a) {
      if (a.getAttribute("data-nav") === page) a.classList.add("active");
    });
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ============================================================
   LemonStore — tiny global helper to share the booking
   between reserve.html → details.html → confirmation.html
   ============================================================ */
window.LemonStore = {
  KEY: "littleLemonBooking",
  get: function () {
    try {
      return JSON.parse(sessionStorage.getItem(this.KEY)) || {};
    } catch (e) {
      return {};
    }
  },
  set: function (data) {
    var current = this.get();
    var merged = Object.assign(current, data);
    sessionStorage.setItem(this.KEY, JSON.stringify(merged));
    return merged;
  },
  clear: function () {
    sessionStorage.removeItem(this.KEY);
  }
};
