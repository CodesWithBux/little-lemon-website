/* ============================================================
   LITTLE LEMON — RESERVE PAGE (step 1)
   Builds date/time pickers + diners stepper, saves to
   LemonStore, then navigates to details.html
   ============================================================ */
(function () {
  "use strict";

  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || document).querySelectorAll(s)); };

  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* Every slot the restaurant could possibly offer, from breakfast
     to the last dinner seating. Each has a service period so the grid
     can group them under Breakfast / Lunch / Dinner headers. */
  var ALL_SLOTS = [
    { t: "08:00", period: "Breakfast" },
    { t: "08:30", period: "Breakfast" },
    { t: "09:00", period: "Breakfast" },
    { t: "09:30", period: "Breakfast" },
    { t: "10:00", period: "Breakfast" },
    { t: "10:30", period: "Breakfast" },
    { t: "12:00", period: "Lunch" },
    { t: "12:30", period: "Lunch" },
    { t: "13:00", period: "Lunch" },
    { t: "13:30", period: "Lunch" },
    { t: "14:00", period: "Lunch" },
    { t: "14:30", period: "Lunch" },
    { t: "17:30", period: "Dinner" },
    { t: "18:00", period: "Dinner" },
    { t: "18:30", period: "Dinner" },
    { t: "19:00", period: "Dinner" },
    { t: "19:30", period: "Dinner" },
    { t: "20:00", period: "Dinner" },
    { t: "20:30", period: "Dinner" },
    { t: "21:00", period: "Dinner" },
    { t: "21:30", period: "Dinner" }
  ];

  /* Convenience builders so the HOURS table stays readable */
  function slotsFrom(open, close) {
    /* returns every ALL_SLOTS time t with open <= t <= close */
    return ALL_SLOTS.filter(function (s) { return s.t >= open && s.t <= close; })
                    .map(function (s) { return s.t; });
  }

  /* Opening hours per weekday (0 = Sun ... 6 = Sat).
     `open` = the slots actually bookable that day; anything in
     ALL_SLOTS but NOT in `open` renders as disabled (closed).
     Little Lemon serves breakfast 08:00, lunch from 12:00 and
     dinner from 17:30. Kitchen close time varies by day. */
  var HOURS = {
    0: { label: "Sun \u00b7 09:00\u201321:00", open: slotsFrom("09:00", "20:30") },           // Sun: opens late (brunch), last seating 20:30
    1: { label: "Mon \u00b7 08:00\u201322:00", open: slotsFrom("08:00", "21:00") },           // Mon–Thu: 08:00 to last seating 21:00
    2: { label: "Tue \u00b7 08:00\u201322:00", open: slotsFrom("08:00", "21:00") },
    3: { label: "Wed \u00b7 08:00\u201322:00", open: slotsFrom("08:00", "21:00") },
    4: { label: "Thu \u00b7 08:00\u201322:00", open: slotsFrom("08:00", "21:00") },
    5: { label: "Fri \u00b7 08:00\u201323:00", open: slotsFrom("08:00", "21:30") },           // Fri–Sat: latest, 21:30 available
    6: { label: "Sat \u00b7 08:00\u201323:00", open: slotsFrom("08:00", "21:30") }
  };

  /* Slots genuinely fully booked on a given calendar day (index 0–13).
     Demo data — in a real system this would come from the server. */
  var BOOKED = {
    2: ["19:00", "12:30"],
    5: ["18:00", "20:00", "09:00"]
  };

  var state = { date: null, dateIndex: 2, time: null, diners: 4 };
  var dayObjs = {};

  /* ---------- build dates (next 14 days) ---------- */
  function buildDates() {
    var host = $("#dates");
    var today = new Date();
    var html = "";
    for (var i = 0; i < 14; i++) {
      var dt = new Date(today);
      dt.setDate(today.getDate() + i);
      var o = {
        dow: DOW[dt.getDay()],
        wd: dt.getDay(),
        dom: dt.getDate(),
        mo: MO[dt.getMonth()],
        full: DOW[dt.getDay()] + " " + dt.getDate() + " " + MO[dt.getMonth()]
      };
      dayObjs[i] = o;
      var sel = i === 2 ? "sel" : "";
      if (i === 2) state.date = o;
      html +=
        '<div class="day ' + sel + '" data-i="' + i + '">' +
          '<div class="dow">' + o.dow + "</div>" +
          '<div class="dom">' + o.dom + "</div>" +
          '<div class="mo">' + o.mo + "</div>" +
        "</div>";
    }
    host.innerHTML = html;
  }

  /* ---------- build times for a specific day index ---------- */
  function fmt(t) {
    var parts = t.split(":");
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var ap = h >= 12 ? "pm" : "am";
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + ":" + m + " " + ap;
  }

  function buildTimes(dayIndex) {
    var host = $("#times");
    var o = dayObjs[dayIndex];
    var hours = HOURS[o.wd];
    var openSet = hours.open;
    var bookedSet = BOOKED[dayIndex] || [];

    /* update the little label that tells the user the day's hours */
    var hint = $("#hoursHint");
    if (hint) hint.textContent = hours.label;

    /* reset current time selection — it may not exist on the new day */
    state.time = null;

    /* first available (open & not booked) slot becomes the default */
    var firstOpen = null;
    ALL_SLOTS.forEach(function (s) {
      if (firstOpen === null && openSet.indexOf(s.t) !== -1 && bookedSet.indexOf(s.t) === -1) {
        firstOpen = s.t;
      }
    });

    /* build the grid grouped by service period */
    var periods = ["Breakfast", "Lunch", "Dinner"];
    var html = "";
    periods.forEach(function (period) {
      var inPeriod = ALL_SLOTS.filter(function (s) { return s.period === period; });
      /* only render the period if at least one of its slots is open today */
      var anyOpen = inPeriod.some(function (s) { return openSet.indexOf(s.t) !== -1; });
      if (!anyOpen) return;

      html += '<div class="period-label">' + period + "</div>";
      html += '<div class="period-grid">';
      html += inPeriod.map(function (s) {
        var isOpen = openSet.indexOf(s.t) !== -1;
        var isBooked = bookedSet.indexOf(s.t) !== -1;
        var disabled = !isOpen || isBooked;
        var sel = "";
        if (!disabled && s.t === firstOpen) { sel = "sel"; state.time = fmt(s.t); }
        var title = !isOpen ? ' title="Closed at this time"'
                  : (isBooked ? ' title="Fully booked"' : "");
        return (
          '<div class="time ' + (disabled ? "disabled" : "") + " " + sel +
          '" data-t="' + s.t + '"' + title + ">" + fmt(s.t) + "</div>"
        );
      }).join("");
      html += "</div>";
    });

    host.innerHTML = html;
  }

  /* ---------- events ---------- */
  function init() {
    buildDates();
    buildTimes(state.dateIndex);

    $("#dates").addEventListener("click", function (e) {
      var d = e.target.closest(".day");
      if (!d) return;
      $$("#dates .day").forEach(function (x) { x.classList.remove("sel"); });
      d.classList.add("sel");
      state.dateIndex = parseInt(d.getAttribute("data-i"), 10);
      state.date = dayObjs[state.dateIndex];
      buildTimes(state.dateIndex);   // <-- rebuild the time grid for the new day
    });

    $("#times").addEventListener("click", function (e) {
      var t = e.target.closest(".time");
      if (!t || t.classList.contains("disabled")) return;
      $$("#times .time").forEach(function (x) { x.classList.remove("sel"); });
      t.classList.add("sel");
      state.time = fmt(t.getAttribute("data-t"));
    });

    var dv = $("#dinerVal");
    function clamp() {
      $("#dinerDec").disabled = state.diners <= 1;
      $("#dinerInc").disabled = state.diners >= 10;
    }
    $("#dinerInc").addEventListener("click", function () {
      if (state.diners < 10) { state.diners++; dv.textContent = state.diners; clamp(); }
    });
    $("#dinerDec").addEventListener("click", function () {
      if (state.diners > 1) { state.diners--; dv.textContent = state.diners; clamp(); }
    });
    clamp();

    $("#toDetails").addEventListener("click", function () {
      if (!state.time) { alert("Please choose a time."); return; }
      window.LemonStore.set({
        dateFull: state.date.full,
        dateIndex: state.dateIndex,
        time: state.time,
        diners: state.diners
      });
      window.location.href = "details.html";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
