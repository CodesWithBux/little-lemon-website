/* ============================================================
   LITTLE LEMON — CONFIRMATION PAGE (step 3)
   Reads booking from LemonStore, fills the card, wires
   "add to calendar" (.ics) and "share" buttons.
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s) { return document.querySelector(s); };

  function init() {
    var b = window.LemonStore.get();

    /* no booking? go back to start */
    if (!b.time || !b.first) {
      window.location.href = "reserve.html";
      return;
    }

    var whoText = "Table for " + b.diners + " guest" + (b.diners > 1 ? "s" : "");

    $("#confirmGreeting").textContent = "You're booked, " + b.first + "!";
    $("#confirmEmail").textContent = b.email;
    $("#confirmWhen").innerHTML = b.dateFull + " · " + b.time + "<br>" + whoText;
    $("#refNo").textContent = b.ref;

    var note = "Please arrive 5 minutes early. We hold your table for 15 minutes past the reservation time.";
    if (b.note) note = "Your note: \u201C" + b.note + "\u201D. " + note;
    $("#confirmNote").textContent = note;

    /* ---------- add to calendar (.ics) ---------- */
    $("#calBtn").addEventListener("click", function () {
      var m = b.time.match(/(\d+):(\d+)\s*(am|pm)/i);
      var h = parseInt(m[1], 10);
      var min = parseInt(m[2], 10);
      var ap = m[3].toLowerCase();
      if (ap === "pm" && h !== 12) h += 12;
      if (ap === "am" && h === 12) h = 0;

      var start = new Date();
      start.setDate(start.getDate() + (b.dateIndex || 0));
      start.setHours(h, min, 0, 0);
      var end = new Date(start.getTime() + 90 * 60000);

      function z(d) {
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      }

      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Little Lemon//EN",
        "BEGIN:VEVENT",
        "SUMMARY:Little Lemon reservation (" + b.diners + " guests)",
        "LOCATION:14 Stanza Bopape St\\, Arcadia\\, Pretoria 0083",
        "DTSTART:" + z(start), "DTEND:" + z(end),
        "DESCRIPTION:Reservation " + b.ref + " for " + b.diners + " guests.",
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");

      var blob = new Blob([ics], { type: "text/calendar" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "little-lemon-reservation.ics";
      a.click();
      URL.revokeObjectURL(a.href);
    });

    /* ---------- share ---------- */
    $("#shareBtn").addEventListener("click", function () {
      var text =
        "I booked us a table at Little Lemon!\n" +
        b.dateFull + " · " + b.time + " · " + whoText + "\n" +
        "14 Stanza Bopape St, Arcadia, Pretoria.";
      if (navigator.share) {
        navigator.share({ title: "Little Lemon booking", text: text }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          alert("Booking details copied to clipboard!");
        });
      } else {
        alert(text);
      }
    });

    /* ---------- restart ---------- */
    $("#restart").addEventListener("click", function () {
      window.LemonStore.clear();
      window.location.href = "reserve.html";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
