/* =========================================================
   STORY BOOK WORLD - script.js  (one external JavaScript file)

   Features in this file:
   1. Dark / light mode            (every page, remembered)
   2. Book details popup           (Read More button on genre pages)
   3. Search + Favorites           (icons in the navbar)
   4. Like button + comments       (inside the popup)
   5. Story page: Show/Hide synopsis, Like button, Reading progress bar
   ========================================================= */

// ---------- 1. DARK / LIGHT MODE ----------
// The chosen theme is saved in the browser so it stays the same on every page.
const THEME_KEY = "sbw_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

(function () {
  let saved = "light";
  try { saved = localStorage.getItem(THEME_KEY) || "light"; } catch (e) {}
  document.documentElement.setAttribute("data-theme", saved);
})();

// ---------- READ MORE POPUPS ----------
// Works with pages that have several cards, each followed by its own popup.
// The 1st Read More button opens the 1st popup, the 2nd opens the 2nd, and so on.
const popups = document.querySelectorAll(".story-popup");
const readMoreBtns = document.querySelectorAll(".read-more-btn");

readMoreBtns.forEach((btn, i) => {
  btn.addEventListener("click", () => {
    if (popups[i]) {
      popups[i].style.display = "flex";
    }
  });
});

popups.forEach(popup => {
  const closeBtn = popup.querySelector(".popup-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }
  // Click on the dark background also closes the popup
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});

// ---------- STORIES PAGE: POSTER LINKS ----------
// Adds ?story=Title to each poster link so the genre page knows which story was clicked.
document.querySelectorAll(".poster").forEach(poster => {
  const title = poster.dataset.title;
  poster.href = poster.getAttribute("href") + "?story=" + encodeURIComponent(title);
});

// ---------- GENRE PAGES: SCROLL TO AND HIGHLIGHT THE CLICKED STORY ----------
window.addEventListener("load", () => {
  const wanted = new URLSearchParams(location.search).get("story");
  if (!wanted) return;

  const clean = s => s.replace(/\s+/g, " ").trim().toLowerCase();

  document.querySelectorAll(".story-card").forEach(card => {
    const heading = card.querySelector("h3");
    if (heading && clean(heading.textContent) === clean(wanted)) {
      card.classList.add("highlight");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

 
 
 
 
 // ================= SEARCH + FAVORITES =================
(function () {
  const STORIES = [
    { t: "Harry Potter", g: "Fantasy", p: "fantasy.html", i: "harry.jpg" },
    { t: "Percy Jackson and the Olympians", g: "Fantasy", p: "fantasy.html", i: "percy.jpg" },
    { t: "The Worst Witch", g: "Fantasy", p: "fantasy.html", i: "witch.jpg" },
    { t: "Journey to the Center of Earth", g: "Adventure", p: "adventure.html", i: "journey.jpg" },
    { t: "Jumanji: Welcome to the World", g: "Adventure", p: "adventure.html", i: "jumanji.jpg" },
    { t: "Sweet Tooth", g: "Adventure", p: "adventure.html", i: "sweet.jpg" },
    { t: "John Wick", g: "Action", p: "action.html", i: "jwick.jpg" },
    { t: "Expendables", g: "Action", p: "action.html", i: "expendable.jpg" },
    { t: "The Roundup: Punishment", g: "Action", p: "action.html", i: "roundup.jpg" },
    { t: "Obsession", g: "Horror", p: "horror.html", i: "obsession.jpg" },
    { t: "Saw", g: "Horror", p: "horror.html", i: "saw.jpg" },
    { t: "Wrong Turn", g: "Horror", p: "horror.html", i: "wrong.jpg" },
    { t: "Home Alone", g: "Comedy", p: "comedy.html", i: "homealone.jpg" },
    { t: "Haba-habadoo, Puti-putipoo", g: "Comedy", p: "comedy.html", i: "pinoy.jpg" },
    { t: "Mr.Bean", g: "Comedy", p: "comedy.html", i: "bean.jpg" },
    { t: "The Great Flood", g: "Sci-Fi", p: "scifi.html", i: "flood.jpg" },
    { t: "Project Hail Mary", g: "Sci-Fi", p: "scifi.html", i: "hail.jpg" },
    { t: "Starwars: The Rise of Skywalkers", g: "Sci-Fi", p: "scifi.html", i: "starwars.jpg" },
    { t: "Golden Scenery of Tomorrow", g: "Romance", p: "romance.html", i: "golden.jpg" },
    { t: "20th Century Girl", g: "Romance", p: "romance.html", i: "girl.jpg" },
    { t: "Fall Inlove At First Kiss", g: "Romance", p: "romance.html", i: "kiss.jpg" },
    { t: "Toy Story 5", g: "Cartoons", p: "cartoons.html", i: "toy.jpg" },
    { t: "Monster Inc.", g: "Cartoons", p: "cartoons.html", i: "monster.jpg" },
    { t: "Hotel Transylvania 3: Summer Vacation", g: "Cartoons", p: "cartoons.html", i: "hotel.jpg" },
    { t: "Black Clover 2nd Season", g: "Anime", p: "anime.html", i: "clover.jpg" },
    { t: "Boruto: Two Blue Vortex", g: "Anime", p: "anime.html", i: "boruto.jpg" },
    { t: "Spy X Family", g: "Anime", p: "anime.html", i: "spy.jpg" },
    { t: "Fall", g: "Thriller", p: "thriller.html", i: "fall.jpg" },
    { t: "127 Hours", g: "Thriller", p: "thriller.html", i: "127.jpg" },
    { t: "Curve", g: "Thriller", p: "thriller.html", i: "curve.jpg" }
  ];

  const KEY = "sbw_favorites";
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const findStory = title => STORIES.find(s => norm(s.t) === norm(title));

  const getFavs = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  };
  const saveFavs = f => {
    try { localStorage.setItem(KEY, JSON.stringify(f)); } catch (e) {}
  };

  const SEARCH_ICON = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="22" y2="22"></line></svg>';
  const BOOKMARK_ICON = '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"></path></svg>';
  const MOON_ICON = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg>';
  const SUN_ICON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><line x1="4.9" y1="4.9" x2="7" y2="7"></line><line x1="17" y1="17" x2="19.1" y2="19.1"></line><line x1="4.9" y1="19.1" x2="7" y2="17"></line><line x1="17" y1="7" x2="19.1" y2="4.9"></line></svg>';

  // ---------- Navbar icons ----------
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const icons = document.createElement("div");
  icons.className = "nav-icons";
  icons.innerHTML =
    '<button class="icon-btn" id="openSearch" aria-label="Search">' + SEARCH_ICON + '</button>' +
    '<button class="icon-btn" id="openFav" aria-label="Favorites">' + BOOKMARK_ICON + '</button>' +
    '<button class="icon-btn" id="themeToggle" aria-label="Switch dark or light mode"></button>';
  const links = navbar.querySelector(".nav-links");
  navbar.insertBefore(icons, links);

  // ---------- Dark / light mode button ----------
  const themeBtn = document.getElementById("themeToggle");
  function showThemeIcon() {
    // light mode shows a moon (click = go dark); dark mode shows a sun
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.innerHTML = dark ? SUN_ICON : MOON_ICON;
    themeBtn.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  themeBtn.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(dark ? "light" : "dark");
    showThemeIcon();
  });
  showThemeIcon();

  // ---------- Popups ----------
  const searchModal = document.createElement("div");
  searchModal.className = "sb-modal";
  searchModal.innerHTML =
    '<div class="sb-box">' +
      '<div class="sb-head"><h3>Search Stories</h3><button class="sb-close" aria-label="Close">&times;</button></div>' +
      '<input type="text" class="sb-input" placeholder="Type a title or genre..." autocomplete="off">' +
      '<div class="sb-list"></div>' +
    '</div>';

  const favModal = document.createElement("div");
  favModal.className = "sb-modal";
  favModal.innerHTML =
    '<div class="sb-box">' +
      '<div class="sb-head"><h3>My Favorites</h3><button class="sb-close" aria-label="Close">&times;</button></div>' +
      '<div class="sb-list"></div>' +
    '</div>';

  document.body.appendChild(searchModal);
  document.body.appendChild(favModal);

  const searchInput = searchModal.querySelector(".sb-input");
  const searchList = searchModal.querySelector(".sb-list");
  const favList = favModal.querySelector(".sb-list");

  function itemHTML(s, removable) {
    const href = s.p + "?story=" + encodeURIComponent(s.t);
    return '<div class="sb-item">' +
      '<img src="' + s.i + '" alt="">' +
      '<a href="' + href + '"><strong>' + esc(s.t) + '</strong><small>' + s.g + '</small></a>' +
      (removable ? '<button class="sb-remove" data-i="' + STORIES.indexOf(s) + '" aria-label="Remove">&times;</button>' : '') +
    '</div>';
  }

  function renderSearch() {
    const q = norm(searchInput.value);
    if (!q) {
      searchList.innerHTML = '<p class="sb-empty">Type to search all stories.</p>';
      return;
    }
    const found = STORIES.filter(s => norm(s.t).includes(q) || norm(s.g).includes(q));
    searchList.innerHTML = found.length
      ? found.map(s => itemHTML(s, false)).join("")
      : '<p class="sb-empty">No stories found.</p>';
  }

  function renderFavs() {
    const list = getFavs().map(findStory).filter(Boolean);
    favList.innerHTML = list.length
      ? list.map(s => itemHTML(s, true)).join("")
      : '<p class="sb-empty">No favorite stories yet.</p>';
  }

  function closeAll() {
    searchModal.classList.remove("open");
    favModal.classList.remove("open");
  }

  document.getElementById("openSearch").addEventListener("click", () => {
    closeAll();
    searchModal.classList.add("open");
    renderSearch();
    searchInput.focus();
  });

  document.getElementById("openFav").addEventListener("click", () => {
    closeAll();
    renderFavs();
    favModal.classList.add("open");
  });

  [searchModal, favModal].forEach(m => {
    m.addEventListener("click", e => {
      if (e.target === m || e.target.classList.contains("sb-close")) closeAll();
    });
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
  searchInput.addEventListener("input", renderSearch);

  // ---------- Favorite buttons on cards / posters ----------
  function refreshButtons() {
    const favs = getFavs();
    document.querySelectorAll(".fav-btn").forEach(b => {
      b.classList.toggle("active", favs.includes(b.dataset.title));
    });
  }

  function toggleFav(title) {
    let favs = getFavs();
    favs = favs.includes(title) ? favs.filter(t => t !== title) : favs.concat(title);
    saveFavs(favs);
    refreshButtons();
    if (favModal.classList.contains("open")) renderFavs();
  }

  function addFavButton(host, title) {
    const s = findStory(title);
    if (!s) return;
    const btn = document.createElement("button");
    btn.className = "fav-btn";
    btn.dataset.title = s.t;
    btn.setAttribute("aria-label", "Add to favorites");
    btn.innerHTML = BOOKMARK_ICON;
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      toggleFav(s.t);
    });
    host.appendChild(btn);
  }

  // Genre pages
  document.querySelectorAll(".story-card").forEach(card => {
    const h = card.querySelector("h3");
    if (h) addFavButton(card, h.textContent.trim());
  });

  // Story reading page (bookmark button on the cover)
  const readerCover = document.querySelector(".story-cover-wrap");
  const readerTitle = document.querySelector(".story-title");
  if (readerCover && readerTitle) addFavButton(readerCover, readerTitle.textContent.trim());

  // Stories page
  document.querySelectorAll(".poster-item").forEach(item => {
    const poster = item.querySelector(".poster");
    if (poster) addFavButton(item, poster.dataset.title);
  });

  // Favorites popup: remove button
  favList.addEventListener("click", e => {
    const rm = e.target.closest(".sb-remove");
    if (!rm) return;
    toggleFav(STORIES[rm.dataset.i].t);
  });

  refreshButtons();
})();


 // ---------- HEART LIKE + COMMENTS (no name needed) ----------
document.querySelectorAll(".story-popup").forEach(popup => {
  const title = popup.querySelector("h3").textContent.trim();
  const box = popup.querySelector(".popup-box");
  const closeBtn = box.querySelector(".popup-close");

  const likeKey = "like_" + title;
  const commentKey = "comments_" + title;

  // build the like button + comment section
  const extra = document.createElement("div");
  extra.className = "extra";
  extra.innerHTML =
    '<button class="like-btn">&#9825; <span class="like-count">0</span></button>' +
    '<div class="comment-list"></div>' +
    '<textarea class="comment-input" placeholder="Write a comment..."></textarea>' +
    '<button class="comment-send">Post Comment</button>';
  box.insertBefore(extra, closeBtn);

  const likeBtn = extra.querySelector(".like-btn");
  const likeCount = extra.querySelector(".like-count");
  const list = extra.querySelector(".comment-list");
  const input = extra.querySelector(".comment-input");
  const sendBtn = extra.querySelector(".comment-send");

  // ----- LIKES -----
  let likes = parseInt(localStorage.getItem(likeKey)) || 0;
  let liked = localStorage.getItem(likeKey + "_me") === "yes";

  function showLike() {
    likeCount.textContent = likes;
    likeBtn.classList.toggle("liked", liked);
    likeBtn.firstChild.textContent = liked ? "\u2665 " : "\u2661 ";
  }

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likes = liked ? likes + 1 : Math.max(0, likes - 1);
    localStorage.setItem(likeKey, likes);
    localStorage.setItem(likeKey + "_me", liked ? "yes" : "no");
    showLike();
  });
  showLike();

  // ----- COMMENTS -----
  function getComments() {
    try { return JSON.parse(localStorage.getItem(commentKey)) || []; }
    catch (e) { return []; }
  }

  function showComments() {
    list.innerHTML = "";
    const all = getComments();
    if (all.length === 0) {
      list.innerHTML = '<p class="no-comments">No comments yet.</p>';
      return;
    }
    all.forEach(text => {
      const p = document.createElement("p");
      p.className = "comment";
      p.textContent = text;   // textContent keeps it safe
      list.appendChild(p);
    });
  }

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    const all = getComments();
    all.push(text);
    localStorage.setItem(commentKey, JSON.stringify(all));
    input.value = "";
    showComments();
  });
  showComments();
});


// ================= STORY PAGE FEATURES =================
// Runs only on the story reading pages (read-....html)
(function () {
  const story = document.querySelector(".story");
  if (!story) return;

  const title = story.querySelector(".story-title").textContent.trim();

  // ----- SHOW / HIDE SYNOPSIS -----
  const synopsisBtn = document.getElementById("synopsisBtn");
  const synopsisBox = document.getElementById("synopsis");

  if (synopsisBtn && synopsisBox) {
    synopsisBtn.addEventListener("click", () => {
      const wasHidden = synopsisBox.hasAttribute("hidden");
      if (wasHidden) {
        synopsisBox.removeAttribute("hidden");       // show it
        synopsisBtn.textContent = "Hide Synopsis";
      } else {
        synopsisBox.setAttribute("hidden", "");      // hide it
        synopsisBtn.textContent = "Show Synopsis";
      }
      synopsisBtn.setAttribute("aria-expanded", wasHidden ? "true" : "false");
    });
  }

  // ----- LIKE BUTTON (same saved likes as the popup on the genre page) -----
  const likeBtn = document.getElementById("storyLike");
  const likeCount = likeBtn.querySelector(".like-count");
  const likeKey = "like_" + title;

  let likes = 0;
  let liked = false;
  try {
    likes = parseInt(localStorage.getItem(likeKey)) || 0;
    liked = localStorage.getItem(likeKey + "_me") === "yes";
  } catch (e) {}

  function showLike() {
    likeCount.textContent = likes;
    likeBtn.classList.toggle("liked", liked);
    likeBtn.firstChild.textContent = liked ? "♥ " : "♡ ";
  }

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likes = liked ? likes + 1 : Math.max(0, likes - 1);
    try {
      localStorage.setItem(likeKey, likes);
      localStorage.setItem(likeKey + "_me", liked ? "yes" : "no");
    } catch (e) {}
    showLike();
  });
  showLike();

  // ----- READING PROGRESS BAR -----
  // Measures how far down the page the reader has scrolled (0% to 100%).
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const percent = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;
    progressBar.style.width = percent + "%";
    progressText.textContent = percent + "% read";
  }

  window.addEventListener("scroll", updateProgress);
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();

document.addEventListener("DOMContentLoaded", () => {
  // Select all story cards (on genre pages) or popups where comments should be available
  const storyCards = document.querySelectorAll(".story-card");

  storyCards.forEach((card, index) => {
    const titleElement = card.querySelector("h3");
    const storyTitle = titleElement ? titleElement.textContent.trim() : `story-${index}`;
    // Create a unique storage key for each story
    const storageKey = `comments_${storyTitle.replace(/\s+/g, "_").toLowerCase()}`;

    // Create comment section container
    const commentSection = document.createElement("div");
    commentSection.classList.add("story-comments-section");

    commentSection.innerHTML = `
      <h4>Comments</h4>
      <form class="comment-form">
        <textarea class="comment-input" placeholder="Add a comment..." required></textarea>
        <button type="submit" class="comment-submit-btn">Post Comment</button>
      </form>
      <div class="comments-list"></div>
    `;

    // Append the comment section inside the story card body
    const cardBody = card.querySelector(".card-body");
    if (cardBody) {
      cardBody.appendChild(commentSection);
    }

    const form = commentSection.querySelector(".comment-form");
    const textarea = commentSection.querySelector(".comment-input");
    const commentsList = commentSection.querySelector(".comments-list");

    // Load saved comments from localStorage
    function loadComments() {
      commentsList.innerHTML = "";
      const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
      savedComments.forEach(text => {
        const commentItem = document.createElement("div");
        commentItem.classList.add("comment-item");
        commentItem.textContent = text;
        commentsList.appendChild(commentItem);
      });
    }

    loadComments();

    // Handle form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const commentText = textarea.value.trim();
      if (!commentText) return;

      const savedComments = JSON.parse(localStorage.getItem(storageKey)) || [];
      savedComments.push(commentText);
      localStorage.setItem(storageKey, JSON.stringify(savedComments));

      textarea.value = "";
      loadComments();
    });
  });
});
