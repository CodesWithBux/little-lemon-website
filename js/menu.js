/* ============================================================
   LITTLE LEMON — MENU DATA + RENDERING
   Used on index.html (preview) and menu.html (full menu)

   Each dish has an `img` filename in the images/ folder.
   If the image is missing, the card falls back to a coloured
   gradient + plate illustration automatically (onerror).
   To add real photos: drop files into images/ using exactly
   the filenames listed in `img` below.
   ============================================================ */
(function () {
  "use strict";

  var MENU = {
    Breakfast: [
      { n: "Avocado Toast",    d: "Smashed avocado on sourdough, poached eggs, chilli & microgreens.", p: "R 95",  img: "avocado-toast.jpg",     g: "linear-gradient(135deg,#8fae5d,#5c7f3a)" },
      { n: "Shakshuka",        d: "Eggs baked in spiced tomato & pepper sauce, feta, grilled bread.",   p: "R 110", img: "shakshuka.jpg",         g: "linear-gradient(135deg,#d9533b,#a8321f)" }
    ],
    Lunch: [
      { n: "Chicken Gyro",     d: "Grilled chicken in warm pita, tzatziki, salad & a side of fries.",   p: "R 130", img: "chicken-gyro.jpg",      g: "linear-gradient(135deg,#e0b06a,#b07d36)" },
      { n: "Falafel Bowl",     d: "Crispy falafel, couscous, hummus, olives & Mediterranean salad.",    p: "R 120", img: "falafel-bowl.jpg",      g: "linear-gradient(135deg,#a98b4f,#6f5a2f)" }
    ],
    Starters: [
      { n: "Greek Salad",      d: "Crisp lettuce, peppers, olives, feta & a lemon-oregano dressing.", p: "R 95",  img: "greek-salad.jpg",       g: "linear-gradient(135deg,#7cae6f,#3f7a3c)" },
      { n: "Bruschetta",       d: "Grilled sourdough, vine tomato, garlic & fresh basil.",            p: "R 70",  img: "bruschetta.jpg",        g: "linear-gradient(135deg,#e0a04a,#b27336)" },
      { n: "Calamari",         d: "Lightly fried, served with lemon aioli & rocket.",                 p: "R 110", img: "calamari.jpg",          g: "linear-gradient(135deg,#d9b38c,#a87a4f)" }
    ],
    Mains: [
      { n: "Lemon Herb Pasta", d: "Hand-rolled pasta, roasted tomato, basil & citrus.",              p: "R 165", img: "lemon-herb-pasta.jpg",  g: "linear-gradient(135deg,#f6ad55,#cd9442)" },
      { n: "Grilled Sea Bream",d: "Whole line-fish, charred lemon, herbed potatoes.",                 p: "R 210", img: "grilled-sea-bream.jpg", g: "linear-gradient(135deg,#6fa8c7,#3a6f8f)" },
      { n: "Lamb Souvlaki",    d: "Skewered Karoo lamb, tzatziki & warm flatbread.",                  p: "R 185", img: "lamb-souvlaki.jpg",     g: "linear-gradient(135deg,#c0613f,#8f3f23)" }
    ],
    Desserts: [
      { n: "Lemon Cake",       d: "Our signature dessert — light, zesty & not too sweet.",           p: "R 65",  img: "lemon-cake.jpg",        g: "linear-gradient(135deg,#F4CE14,#e0bc09)" },
      { n: "Baklava",          d: "Layered filo, walnuts, honey & a hint of cinnamon.",              p: "R 75",  img: "baklava.jpg",           g: "linear-gradient(135deg,#d6a85f,#9c7032)" },
      { n: "Affogato",         d: "Vanilla gelato 'drowned' in a shot of hot espresso.",             p: "R 55",  img: "affogato.jpg",          g: "linear-gradient(135deg,#7a5c46,#4a382b)" }
    ],
    Drinks: [
      { n: "Cappuccino",        d: "Double-shot espresso, steamed milk & a feathered rosetta.",        p: "R 40",  img: "cappuccino.jpg",        g: "linear-gradient(135deg,#c9a27a,#8a6240)" },
      { n: "Fresh Orange Juice",d: "Squeezed-to-order Gauteng oranges, nothing added.",                p: "R 45",  img: "orange-juice.jpg",      g: "linear-gradient(135deg,#f6a821,#e07d12)" },
      { n: "Lemon Mint Cooler", d: "Sparkling lemonade over ice with fresh mint.",                     p: "R 42",  img: "lemon-mint-cooler.jpg", g: "linear-gradient(135deg,#cfe08a,#9cc24a)" },
      { n: "Strawberry Smoothie",d: "Blended strawberry & banana with yoghurt.",                       p: "R 55",  img: "strawberry-smoothie.jpg", g: "linear-gradient(135deg,#e98ba0,#c64f6b)" }
    ]
  };

  /* plate illustration used as a fallback when a photo is missing */
  var DISH_ICON =
    '<svg viewBox="0 0 120 120" width="74" aria-hidden="true">' +
    '<circle cx="60" cy="60" r="48" fill="#fff" opacity=".95"/>' +
    '<circle cx="60" cy="60" r="40" fill="#fff8ec"/>' +
    '<circle cx="48" cy="54" r="7" fill="#d04b3a"/>' +
    '<circle cx="74" cy="52" r="8" fill="#d04b3a"/>' +
    '<ellipse cx="60" cy="70" rx="12" ry="4" fill="#3f7a3c"/>' +
    '<path d="M40 60 Q60 44 80 60" stroke="#e6b855" stroke-width="4" fill="none"/></svg>';

  function cardHTML(m) {
    /* The <img> sits on top of the gradient+icon fallback. If the
       file can't be loaded, onerror hides the broken image and the
       fallback underneath shows through. */
    var fallback = '<div class="dish-fallback">' + DISH_ICON + '</div>';
    var photo =
      '<img class="dish-photo" src="images/' + m.img + '" alt="' + m.n + '" ' +
      'loading="lazy" onerror="this.style.display=\'none\'">';
    return (
      '<article class="dish-card">' +
        '<div class="dish-img" style="background:' + m.g + '">' + fallback + photo + "</div>" +
        '<div class="dish-body">' +
          '<div class="row"><h3>' + m.n + "</h3><span class=\"cost\">" + m.p + "</span></div>" +
          "<p>" + m.d + "</p>" +
        "</div>" +
      "</article>"
    );
  }

  /* preview grid on the home page — a spread across the day */
  var preview = document.getElementById("menuPreview");
  if (preview) {
    var flat = [
      MENU.Breakfast[0],   // Avocado Toast
      MENU.Lunch[0],       // Chicken Gyro
      MENU.Mains[0],       // Lemon Herb Pasta
      MENU.Mains[1],       // Grilled Sea Bream
      MENU.Desserts[0],    // Lemon Cake
      MENU.Drinks[0]       // Cappuccino
    ];
    preview.innerHTML = flat.map(cardHTML).join("");
  }

  /* full menu page — grouped by category */
  var full = document.getElementById("menuFull");
  if (full) {
    var html = "";
    Object.keys(MENU).forEach(function (cat) {
      html +=
        '<h2 class="menu-cat">' + cat + "</h2>" +
        '<div class="menu-grid" style="margin-bottom:48px">' +
          MENU[cat].map(cardHTML).join("") +
        "</div>";
    });
    full.innerHTML = html;
  }
})();
