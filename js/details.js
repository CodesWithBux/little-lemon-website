/* ============================================================
   LITTLE LEMON — DETAILS PAGE (step 2)
   Shows recap, collects + validates customer details,
   saves to LemonStore, navigates to confirmation.html
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  function init() {
    var b = window.LemonStore.get();

    /* if someone lands here directly without a booking, send them back */
    if (!b.time || !b.dateFull) {
      window.location.href = "reserve.html";
      return;
    }

    /* fill recap */
    $("#recapWhen").textContent = b.dateFull + " · " + b.time;
    $("#recapWho").textContent = "Table for " + b.diners + " guest" + (b.diners > 1 ? "s" : "");

    /* occasion picker (default Dinner) */
    var occasion = b.occasion || "Dinner";
    $$("#occ .o").forEach(function (o) {
      o.classList.toggle("sel", o.getAttribute("data-occ") === occasion);
    });
    $("#occ").addEventListener("click", function (e) {
      var o = e.target.closest(".o");
      if (!o) return;
      $$("#occ .o").forEach(function (x) { x.classList.remove("sel"); });
      o.classList.add("sel");
      occasion = o.getAttribute("data-occ");
    });

    /* edit -> back to reserve */
    $("#editBooking").addEventListener("click", function () {
      window.location.href = "reserve.html";
    });

    /* validation */
    function validate() {
      var ok = true;
      function set(id, cond) {
        $(id).classList.toggle("invalid", !cond);
        if (!cond) ok = false;
      }
      var first = $("#firstName").value.trim();
      var last = $("#lastName").value.trim();
      var email = $("#email").value.trim();
      var phone = $("#phone").value.trim();
      set("#f-first", first.length > 0);
      set("#f-last", last.length > 0);
      set("#f-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      set("#f-phone", phone.replace(/\D/g, "").length >= 7);
      return ok;
    }

    $("#confirmBtn").addEventListener("click", function () {
      if (!validate()) {
        var bad = $(".field.invalid");
        if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      window.LemonStore.set({
        first: $("#firstName").value.trim(),
        last: $("#lastName").value.trim(),
        email: $("#email").value.trim(),
        phone: $("#phone").value.trim(),
        note: $("#note").value.trim(),
        occasion: occasion,
        ref: "#LL-" + Math.floor(10000 + Math.random() * 89999)
      });
      window.location.href = "confirmation.html";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
