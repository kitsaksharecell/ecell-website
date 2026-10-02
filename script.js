const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const albumModal = document.querySelector("#album-modal");
const albumTitle = document.querySelector("#album-title");
const albumPhotos = document.querySelector("#album-photos");
const modalClose = document.querySelector(".modal-close");

// Article and Share Modal Elements
const articleModal = document.querySelector("#article-modal");
const articleModalClose = document.querySelector(".article-modal-close");
const shareModal = document.querySelector("#share-modal");
const shareModalClose = document.querySelector(".share-modal-close");
const shareLinkInput = document.querySelector("#share-link-input");
const shareCopyBtn = document.querySelector("#share-copy-button");
const toastEl = document.querySelector("#toast-notification");

let toastTimer = null;
function showToast(message, duration = 3000) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("active");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("active");
  }, duration);
}

const albums = {
  illuminate: {
    title: "Illuminate 2025",
    photos: [
      ["assets/illuminate/1.jpg", "Illuminate event banner"],
      ["assets/illuminate/2.jpg", "IIT Bombay faculty addressing students"],
      ["assets/illuminate/3.jpg", "Guest felicitation"],
      ["assets/illuminate/4.jpg", "Startup learning session"],
      ["assets/illuminate/5.jpg", "Student participation"],
      ["assets/illuminate/6.jpg", "Engaged student audience"],
      ["assets/illuminate/7.jpg", "Student innovation presentation"],
      ["assets/illuminate/8.jpg", "First prize winners"],
      ["assets/illuminate/9.jpg", "Second prize winners"],
      ["assets/illuminate/10.jpg", "Third prize winners"],
      ["assets/illuminate/11.jpg", "Honoring the guest"],
      ["assets/illuminate/12.jpg", "Organizing team with guests"],
      ["assets/illuminate/13.jpg", "Illuminate team moment"],
    ],
  },
  awareness: {
    title: "Awareness for 3rd Years",
    photos: [
      ["assets/awareness-third-years/1.jpeg", "Entrepreneurship awareness session"],
      ["assets/awareness-third-years/2.jpeg", "E-Cell activities explained"],
      ["assets/awareness-third-years/3.jpeg", "Interactive classroom discussion"],
      ["assets/awareness-third-years/4.jpeg", "Student coordinator interaction"],
      ["assets/awareness-third-years/5.jpeg", "Innovation mindset briefing"],
      ["assets/awareness-third-years/6.jpeg", "Classroom outreach"],
    ],
  },
};

// Mobile Nav Toggle
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Contact Form
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const originalText = button.textContent;

    button.textContent = "Message Sent ✨";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
}

// Gallery Albums
document.querySelectorAll(".album-card").forEach((card) => {
  card.addEventListener("click", () => {
    const album = albums[card.dataset.album];
    if (!album) return;

    albumTitle.textContent = album.title;
    albumPhotos.innerHTML = album.photos
      .map(
        ([src, alt]) => `
          <figure>
            <img src="${src}" alt="${alt}" />
            <figcaption>${alt}</figcaption>
          </figure>
        `
      )
      .join("");

    albumModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose.focus();
  });
});

const closeAlbum = () => {
  albumModal.setAttribute("aria-hidden", "true");
  if (!articleModal || articleModal.getAttribute("aria-hidden") === "true") {
    document.body.classList.remove("modal-open");
  }
};

if (modalClose) {
  modalClose.addEventListener("click", closeAlbum);
}

if (albumModal) {
  albumModal.addEventListener("click", (event) => {
    if (event.target === albumModal) {
      closeAlbum();
    }
  });
}

/* =======================================================
   ARTICLE GALLERY & MODAL SYSTEM
======================================================= */

/* Article metadata for dynamic modal updates */
const articleMeta = {
  airbnb: { title: "Airbnb", breadcrumb: "Airbnb Case Study", poster: "assets/airbnb-behind-the-brand.jpg" },
  nike:   { title: "Nike",   breadcrumb: "Nike Case Study",   poster: "assets/nike-behind-the-brand.jpg" },
};

let currentArticleId = null;

function openArticle(articleId, scrollToComments = false) {
  if (!articleModal) return;
  currentArticleId = articleId;

  articleModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  // Update URL hash for sharing
  try {
    history.replaceState(null, "", "#article-" + articleId);
  } catch (err) {}

  // Update modal header: breadcrumb, title-area social buttons
  const meta = articleMeta[articleId] || { title: articleId, breadcrumb: articleId + " Case Study" };
  const breadcrumb = document.getElementById("modal-article-breadcrumb");
  if (breadcrumb) breadcrumb.textContent = meta.breadcrumb;

  // Update modal nav social buttons to point to current article
  articleModal.querySelectorAll(".article-modal-nav [data-article-id]").forEach((el) => {
    el.dataset.articleId = articleId;
  });
  articleModal.querySelectorAll(".article-modal-nav [data-count-for]").forEach((el) => {
    el.dataset.countFor = articleId;
  });
  articleModal.querySelectorAll(".article-modal-nav [data-comment-count-for]").forEach((el) => {
    el.dataset.commentCountFor = articleId;
  });

  // Show only the correct article content, hide others
  document.querySelectorAll(".article-full-content").forEach((el) => {
    el.style.display = "none";
  });
  const targetArticle = document.getElementById("article-content-" + articleId);
  if (targetArticle) targetArticle.style.display = "";

  // Update interaction zone (like, share, comment buttons) to current article
  const interactionZone = document.getElementById("article-interaction-zone");
  if (interactionZone) {
    interactionZone.querySelectorAll("[data-article-id]").forEach((el) => {
      el.dataset.articleId = articleId;
    });
    interactionZone.querySelectorAll("[data-count-for]").forEach((el) => {
      el.dataset.countFor = articleId;
    });
    interactionZone.querySelectorAll("[data-comment-count-for]").forEach((el) => {
      el.dataset.commentCountFor = articleId;
    });
    // Update comment form
    const commentForm = document.getElementById("comment-form");
    if (commentForm) commentForm.dataset.articleId = articleId;
  }

  // Scroll to comments if requested, else reset scroll to top
  const dialog = articleModal.querySelector(".article-dialog");
  if (dialog) {
    if (scrollToComments) {
      setTimeout(() => {
        const commentsSec = document.querySelector("#article-comments-section");
        if (commentsSec) {
          commentsSec.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    } else {
      dialog.scrollTop = 0;
    }
  }

  // Re-sync Likes & Comments UI
  updateLikesUI(articleId);
  updateCommentsUI(articleId);
}

function closeArticle() {
  if (!articleModal) return;
  articleModal.setAttribute("aria-hidden", "true");

  if (!albumModal || albumModal.getAttribute("aria-hidden") === "true") {
    document.body.classList.remove("modal-open");
  }

  // Reset URL hash if pointing to an article
  if (window.location.hash.startsWith("#article-")) {
    try {
      history.replaceState(null, "", "#articles");
    } catch (err) {}
  }
}

if (articleModalClose) {
  articleModalClose.addEventListener("click", closeArticle);
}

if (articleModal) {
  articleModal.addEventListener("click", (event) => {
    if (event.target === articleModal) {
      closeArticle();
    }
  });
}

// Card Click Handlers
document.querySelectorAll(".article-folder-card").forEach((card) => {
  const articleId = card.dataset.article;
  if (!articleId) return;

  card.addEventListener("click", (e) => {
    // Ignore clicks on specific action buttons
    if (e.target.closest(".article-social-btn") || e.target.closest(".notify-pill-btn")) {
      return;
    }
    openArticle(articleId);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.target.closest(".article-social-btn") || e.target.closest(".notify-pill-btn")) {
        return;
      }
      e.preventDefault();
      openArticle(articleId);
    }
  });
});

// "Read Story" button
document.querySelectorAll("[data-open-article]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = btn.getAttribute("data-open-article");
    openArticle(id);
  });
});

// "Comments" button on card / header
document.addEventListener("click", (e) => {
  const commentBtn = e.target.closest(".comment-btn");
  if (commentBtn) {
    e.stopPropagation();
    const id = commentBtn.dataset.articleId || "airbnb";
    if (articleModal && articleModal.getAttribute("aria-hidden") === "false") {
      const commentsSec = document.querySelector("#article-comments-section");
      if (commentsSec) {
        commentsSec.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      openArticle(id, true);
    }
  }
});

/* =======================================================
   LIKE SYSTEM (Reactive & Persisted)
======================================================= */
const initialLikes = {
  airbnb: 28,
  nike: 35,
};

function getLikes(articleId) {
  try {
    const savedLikes = localStorage.getItem("ecell_likes_" + articleId);
    const isLiked = localStorage.getItem("ecell_liked_" + articleId) === "true";
    const count = savedLikes !== null ? parseInt(savedLikes, 10) : (initialLikes[articleId] || 20);
    return { count, isLiked };
  } catch (err) {
    return { count: initialLikes[articleId] || 20, isLiked: false };
  }
}

function updateLikesUI(articleId) {
  const { count, isLiked } = getLikes(articleId);

  // Update all counters for this article
  document.querySelectorAll(`[data-count-for="${articleId}"]`).forEach((el) => {
    el.textContent = count;
  });

  // Update all like buttons for this article
  document.querySelectorAll(`.like-btn[data-article-id="${articleId}"]`).forEach((btn) => {
    if (isLiked) {
      btn.classList.add("liked");
      const icon = btn.querySelector(".heart-icon, .heart-pulse-icon");
      if (icon) icon.textContent = "❤️";
      btn.setAttribute("aria-label", "Unlike article");
    } else {
      btn.classList.remove("liked");
      const icon = btn.querySelector(".heart-icon, .heart-pulse-icon");
      if (icon) icon.textContent = "🤍";
      btn.setAttribute("aria-label", "Like article");
    }
  });
}

function toggleLike(articleId) {
  let { count, isLiked } = getLikes(articleId);
  if (isLiked) {
    count = Math.max(0, count - 1);
    isLiked = false;
    localStorage.setItem("ecell_likes_" + articleId, count);
    localStorage.setItem("ecell_liked_" + articleId, "false");
    showToast("Like removed");
  } else {
    count += 1;
    isLiked = true;
    localStorage.setItem("ecell_likes_" + articleId, count);
    localStorage.setItem("ecell_liked_" + articleId, "true");
    showToast("Added to your liked stories! ❤️");
  }
  updateLikesUI(articleId);
}

// Global click handler for like buttons
document.addEventListener("click", (e) => {
  const likeBtn = e.target.closest(".like-btn");
  if (likeBtn) {
    e.stopPropagation();
    const id = likeBtn.dataset.articleId || "airbnb";
    toggleLike(id);
  }
});

/* =======================================================
   SHARE SYSTEM (Web Share + Fallback Modal + Channels)
======================================================= */
function getShareData(articleId) {
  const cleanUrl = window.location.href.split("#")[0];
  const url = cleanUrl + "#article-" + articleId;
  const meta = articleMeta[articleId] || { title: articleId };
  const title = "Behind the Brand: " + meta.title + " - KITS Akshar E-Cell";
  const text = "Check out this inspiring case study on " + meta.title + " curated by KITS Akshar E-Cell: Same Logo. A Different Story!";
  return { url, title, text };
}

function openShareModal(articleId) {
  const { url } = getShareData(articleId);
  if (shareLinkInput) {
    shareLinkInput.value = url;
  }
  if (shareModal) {
    shareModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }
}

function closeShareModal() {
  if (shareModal) {
    shareModal.setAttribute("aria-hidden", "true");
    if (
      (!articleModal || articleModal.getAttribute("aria-hidden") === "true") &&
      (!albumModal || albumModal.getAttribute("aria-hidden") === "true")
    ) {
      document.body.classList.remove("modal-open");
    }
  }
}

if (shareModalClose) {
  shareModalClose.addEventListener("click", closeShareModal);
}
if (shareModal) {
  shareModal.addEventListener("click", (e) => {
    if (e.target === shareModal) closeShareModal();
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Article link copied to clipboard! 📋");
      })
      .catch(() => {
        fallbackCopy(text);
      });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand("copy");
    showToast("Article link copied to clipboard! 📋");
  } catch (err) {
    showToast("Press Ctrl+C to copy link");
  }
  document.body.removeChild(tempInput);
}

if (shareCopyBtn && shareLinkInput) {
  shareCopyBtn.addEventListener("click", () => {
    copyToClipboard(shareLinkInput.value);
    closeShareModal();
  });
}

async function triggerShare(articleId) {
  const { url, title, text } = getShareData(articleId);
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      showToast("Shared successfully! 🚀");
    } catch (err) {
      if (err.name !== "AbortError") {
        openShareModal(articleId);
      }
    }
  } else {
    openShareModal(articleId);
  }
}

function handleDirectShare(channel, articleId) {
  const { url, title, text } = getShareData(articleId);
  if (channel === "whatsapp") {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + "\n\n" + text + "\n" + url)}`,
      "_blank"
    );
  } else if (channel === "linkedin") {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  } else if (channel === "twitter") {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + " - " + text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  } else if (channel === "copy") {
    copyToClipboard(url);
  }
}

document.addEventListener("click", (e) => {
  const shareBtn = e.target.closest(".share-btn");
  if (shareBtn) {
    e.stopPropagation();
    const id = shareBtn.dataset.articleId || "airbnb";
    triggerShare(id);
    return;
  }

  const channelBtn = e.target.closest("[data-share-channel]");
  if (channelBtn) {
    e.stopPropagation();
    const channel = channelBtn.dataset.shareChannel;
    const id = channelBtn.dataset.articleId || "airbnb";
    handleDirectShare(channel, id);
    if (shareModal && shareModal.getAttribute("aria-hidden") === "false") {
      closeShareModal();
    }
  }
});

/* =======================================================
   COMMENTS SYSTEM (Real-time & Persisted)
======================================================= */
const seedComments = {
  airbnb: [
    {
      id: "seed_1",
      author: "Karthik Varma (CSE, 3rd Year)",
      text: "The insight about viewing unused spaces differently is so relevant for our upcoming campus hackathon! Starting small with air mattresses is true bootstrapping.",
      date: "2 days ago",
      avatar: "KV",
    },
    {
      id: "seed_2",
      author: "Ananya Sharma (ECE, 4th Year)",
      text: "Loved the breakdown of core takeaways. It's inspiring how they kept going even during tough financial times before finding product-market fit.",
      date: "3 days ago",
      avatar: "AS",
    },
    {
      id: "seed_3",
      author: "Priya Reddy (E-Cell Core Team)",
      text: "Great case study! Every student innovator should read this before pitching. Looking forward to the next Behind the Brand article!",
      date: "1 week ago",
      avatar: "PR",
    },
  ],
  nike: [
    {
      id: "nike_seed_1",
      author: "Rahul Mehta (MBA, 2nd Year)",
      text: "The waffle iron story blew my mind! It's proof that innovation can come from the most unexpected experiments. Bowerman was a true maker.",
      date: "1 day ago",
      avatar: "RM",
    },
    {
      id: "nike_seed_2",
      author: "Sravani K (CSE, 3rd Year)",
      text: "\"Hustle before you scale\" is the best advice from this article. Phil Knight selling shoes from a car trunk — that's real entrepreneurship, not just theory!",
      date: "2 days ago",
      avatar: "SK",
    },
    {
      id: "nike_seed_3",
      author: "Vishnu Vardhan (E-Cell Core Team)",
      text: "Just Do It isn't just a tagline — it's the whole philosophy of starting without waiting for perfect conditions. Great read for our campus founders!",
      date: "4 days ago",
      avatar: "VV",
    },
  ],
};

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getArticleComments(articleId) {
  try {
    const userCommentsRaw = localStorage.getItem("ecell_comments_" + articleId);
    const userComments = userCommentsRaw ? JSON.parse(userCommentsRaw) : [];
    const defaults = seedComments[articleId] || [];
    return [...userComments, ...defaults];
  } catch (err) {
    return seedComments[articleId] || [];
  }
}

function updateCommentsUI(articleId) {
  const comments = getArticleComments(articleId);
  const stream = document.querySelector("#comments-stream");

  // Update all comment count badges
  document.querySelectorAll(`[data-comment-count-for="${articleId}"]`).forEach((badge) => {
    badge.textContent = comments.length;
  });

  if (!stream) return;

  if (comments.length === 0) {
    stream.innerHTML = `<p class="comments-empty" style="color: var(--muted); text-align: center; padding: 2rem;">No comments yet. Be the first to share your thoughts!</p>`;
    return;
  }

  stream.innerHTML = comments
    .map(
      (c) => `
    <div class="comment-item" id="${escapeHTML(c.id)}">
      <div class="comment-avatar" aria-hidden="true">${escapeHTML(c.avatar)}</div>
      <div class="comment-body">
        <div class="comment-header-row">
          <span class="comment-author-name">${escapeHTML(c.author)}</span>
          <span class="comment-timestamp">${escapeHTML(c.date)}</span>
        </div>
        <p class="comment-text-content">${escapeHTML(c.text)}</p>
      </div>
    </div>
  `
    )
    .join("");
}

const commentForm = document.querySelector("#comment-form");
if (commentForm) {
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const articleId = commentForm.dataset.articleId || "airbnb";
    const nameInput = document.querySelector("#comment-author-name");
    const textInput = document.querySelector("#comment-body-text");
    const statusMsg = document.querySelector("#comment-status");

    const author = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!author || !text) return;

    const newComment = {
      id: "usr_" + Date.now(),
      author: author,
      text: text,
      date: "Just now",
      avatar: getInitials(author),
    };

    try {
      const userCommentsRaw = localStorage.getItem("ecell_comments_" + articleId);
      const userComments = userCommentsRaw ? JSON.parse(userCommentsRaw) : [];
      userComments.unshift(newComment);
      localStorage.setItem("ecell_comments_" + articleId, JSON.stringify(userComments));
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }

    textInput.value = "";
    updateCommentsUI(articleId);

    if (statusMsg) {
      statusMsg.textContent = "Comment posted! Thank you ✨";
      setTimeout(() => {
        statusMsg.textContent = "";
      }, 3500);
    }
    showToast("Your comment has been posted! ✨");
  });
}

// Notify Me Button on upcoming articles
document.querySelectorAll("[data-notify]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    showToast("You'll be notified when Zerodha: Bootstrapping is published! 🚀");
  });
});

// ESC Key closes any open modal
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (shareModal && shareModal.getAttribute("aria-hidden") === "false") {
      closeShareModal();
      return;
    }
    if (albumModal && albumModal.getAttribute("aria-hidden") === "false") {
      closeAlbum();
      return;
    }
    if (articleModal && articleModal.getAttribute("aria-hidden") === "false") {
      closeArticle();
      return;
    }
  }
});

// Full Poster zoom inside Article Modal — works for all articles
document.querySelectorAll(".article-poster-wrap").forEach((posterWrap) => {
  posterWrap.style.cursor = "zoom-in";
  posterWrap.setAttribute("title", "Click to view full poster");
  posterWrap.addEventListener("click", () => {
    const articleId = currentArticleId || "airbnb";
    const meta = articleMeta[articleId] || { title: articleId, poster: "" };
    if (albumTitle) albumTitle.textContent = "Behind the Brand: " + meta.title;
    if (albumPhotos) {
      albumPhotos.innerHTML = `
        <figure style="height: auto; max-height: 80vh; grid-column: 1 / -1; display: flex; justify-content: center; background: transparent;">
          <img src="${meta.poster}" alt="Behind the Brand: ${meta.title}" style="width: auto; max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
        </figure>
      `;
    }
    if (albumModal) {
      albumModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (modalClose) modalClose.focus();
    }
  });
});

// Deep Linking / Route Handling via Hash (#article-airbnb, #article-nike, etc.)
function handleHashRoute() {
  const hash = window.location.hash;
  if (hash.startsWith("#article-") && hash.length > 9) {
    const id = hash.replace("#article-", "");
    openArticle(id);
  }
}

function initArticleApp() {
  // Initialize likes UI for all articles on cards
  Object.keys(initialLikes).forEach((id) => {
    updateLikesUI(id);
  });
  // Initialize card comment counts
  Object.keys(seedComments).forEach((id) => {
    const comments = getArticleComments(id);
    document.querySelectorAll(`[data-comment-count-for="${id}"]`).forEach((badge) => {
      badge.textContent = comments.length;
    });
  });
  handleHashRoute();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initArticleApp);
} else {
  initArticleApp();
}

window.addEventListener("hashchange", handleHashRoute);

