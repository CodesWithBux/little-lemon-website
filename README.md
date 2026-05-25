# Little Lemon — Restaurant Reservation Website

A complete multi-page website for **Little Lemon**, a family-owned Mediterranean
restaurant in Arcadia, Pretoria. Built with plain HTML, CSS and JavaScript — no
frameworks, no build step.

## How to run

Just open **`index.html`** in any web browser. That's it.

> Tip: for the cleanest experience (so the booking data carries between pages),
> run a tiny local server instead of opening the file directly:
>
> ```bash
> # from inside the little-lemon folder
> python3 -m http.server 8000
> # then visit http://localhost:8000
> ```

## Folder structure

```
little-lemon/
├── index.html          Home page (hero, highlights, menu preview, CTA)
├── menu.html           Full menu grouped by Starters / Mains / Desserts
├── reserve.html        Reservation step 1 — date, time, number of diners
├── details.html        Reservation step 2 — customer details + validation
├── confirmation.html   Reservation step 3 — booking confirmed
├── about.html          About the restaurant
├── css/
│   └── styles.css      One shared stylesheet for the whole site
├── js/
│   ├── main.js         Shared: mobile nav, active link, footer year, LemonStore
│   ├── menu.js         Menu data + renders the preview and full menu
│   ├── reserve.js      Step 1 logic (date/time/diners pickers)
│   ├── details.js      Step 2 logic (recap, occasion, form validation)
│   └── confirmation.js Step 3 logic (calendar download, share, restart)
└── README.md
```

## How the pages link together

Every page shares the same header navigation and footer. The reservation flow
moves across three pages:

```
reserve.html  ──►  details.html  ──►  confirmation.html
   (step 1)          (step 2)            (step 3)
```

The booking data (date, time, diners, name, etc.) is passed between pages using
the browser's `sessionStorage`, wrapped in a small helper called `LemonStore`
(defined in `js/main.js`). If you land on `details.html` or `confirmation.html`
without a booking in progress, you're automatically sent back to `reserve.html`.

## Features

- **Responsive** — works on phones, tablets and desktops; the nav collapses to a
  hamburger menu on small screens.
- **Full-day menu** — six categories (Breakfast, Lunch, Starters, Mains, Desserts,
  Drinks) with real food photography, served from `images/`.
- **Interactive booking** — date scroller, time grid grouped into Breakfast /
  Lunch / Dinner periods, diners stepper (1–10), and occasion picker. Selected
  items change colour.
- **Day-specific opening hours** — available time slots change depending on the
  weekday you pick (see the `HOURS` table in `js/reserve.js`); closed and
  fully-booked slots are shown disabled.
- **Form validation** — name, email and phone are checked before you can confirm.
- **Real confirmation** — generates a booking reference, lets you download a
  calendar (`.ics`) file, and share the booking via your device's share sheet.

## Brand / style guide

| Token        | Value      | Use                         |
|--------------|------------|-----------------------------|
| Green        | `#495E57`  | Primary / headings          |
| Yellow       | `#F4CE14`  | Accent / buttons            |
| Orange       | `#EE9972`  | Secondary accents           |
| Peach        | `#FBDABB`  | Soft section backgrounds    |
| Off-white    | `#EDEFEE`  | Page background             |
| Display font | Markazi Text | Headings, prices          |
| Body font    | Karla      | Everything else             |

To re-skin the whole site, edit the `:root` variables at the top of
`css/styles.css`.

---
© 1995–2026 Little Lemon Pretoria. Built for the Meta UX capstone.
