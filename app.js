const state = {
  rankId: localStorage.getItem("brawldraft-rank") || "diamond",
  modeId: null,
  mapName: null,
  pickOrder: "us"
};

const screens = Array.from(document.querySelectorAll(".screen"));
const rankGrid = document.getElementById("rank-grid");
const currentRankCard = document.getElementById("current-rank-card");
const modeList = document.getElementById("mode-list");
const mapList = document.getElementById("map-list");
const orderSummary = document.getElementById("order-summary");
const goRecsBtn = document.getElementById("go-recs");
const recSummary = document.getElementById("rec-summary");
const banCards = document.getElementById("ban-cards");
const pickCards = document.getElementById("pick-cards");
const altCards = document.getElementById("alt-cards");

const startBtn = document.getElementById("start-btn");
const backButtons = Array.from(document.querySelectorAll(".back-btn"));
const toggles = Array.from(document.querySelectorAll(".toggle"));

const emojiDataUrl = (emoji) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='128' height='128' rx='20' ry='20' fill='%23151d2e'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='72'>${emoji}</text></svg>`;

const MODE_ICON_PATHS = {
  bounty: ["icons/bounty_icon.png"],
  brawlball: ["icons/brawl_ball_icon.png"],
  gemgrab: ["icons/gem_grab_icon.png"],
  heist: ["icons/heist_icon.png"],
  hotzone: ["icons/hot_zone_icon.png"],
  knockout: ["icons/knock_out_icon.png"]
};

const RANK_ICON_PATHS = {
  bronze: ["icons/Bronze.png"],
  silver: ["icons/Silver.png"],
  gold: ["icons/Gold.png"],
  diamond: ["icons/Diamond.png"],
  mythic: ["icons/Mythic.png"],
  legendary: ["icons/Legendary.png"],
  masters: ["icons/Master.png"],
  pro: ["icons/Pro.png"]
};

const MAP_ALIASES = {
  creme_de_la_creme: ["layer_cake"],
  super_stadium: ["center_stage"],
  backyard_bowl: ["sneaky_fields", "out_in_the_open"],
  deathcap_trap: ["gem_fort"],
  scorched_stone: ["rustic_arcade_map", "pit_stop"],
  goldarm_gulf: ["belle_s_rock"],
  toxic_swamp: ["flaring_phoenix"],
  dark_dunes: ["new_horizons"],
  stone_fort: ["undermine"]
};

const ROLE_TAG_HINTS = {
  sniper: ["open", "sniper"],
  контроль: ["lanes", "choke"],
  зонинг: ["choke", "lanes"],
  "анти-танк": ["brawl", "walls"],
  танк: ["brawl", "walls"],
  скорость: ["mobility", "lanes"],
  ассасин: ["bushes", "mobility"],
  флекс: ["lanes", "mobility"]
};

const MODE_TAGS = {
  bounty: ["open", "sniper"],
  brawlball: ["brawl", "mobility"],
  gemgrab: ["choke", "control"],
  heist: ["burst", "walls"],
  hotzone: ["choke", "control"],
  knockout: ["pickoff", "open"]
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const sentenceCase = (value) => {
  if (!value) return value;
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const titleCase = (value) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const buildNameVariants = (name) => {
  const cleaned = name.replace(/’/g, "'").trim();
  const base = slugify(cleaned);
  const noApos = cleaned.replace(/'/g, "");
  const spaced = cleaned.replace(/_/g, " ");
  const withApos = spaced.includes(" s ") ? spaced.replace(" s ", "'s ") : spaced;
  const sent = sentenceCase(spaced);
  const titled = titleCase(spaced);
  const underscore = spaced.replace(/ /g, "_");
  const hyphen = spaced.replace(/ /g, "-");
  const squeeze = underscore.replace(/_/g, "");
  const list = [
    cleaned,
    cleaned.toLowerCase(),
    noApos,
    noApos.toLowerCase(),
    spaced,
    spaced.toLowerCase(),
    withApos,
    withApos.toLowerCase(),
    sent,
    sent?.toLowerCase(),
    titled,
    titled?.toLowerCase(),
    underscore,
    underscore.toLowerCase(),
    hyphen,
    hyphen.toLowerCase(),
    base,
    base.replace(/_/g, "-"),
    squeeze
  ];
  return [...new Set(list.filter(Boolean))];
};

const mapImageCandidates = (name) => {
  const baseList = buildNameVariants(name);
  const alias = MAP_ALIASES[slugify(name)] || [];
  const aliasVariants = alias.flatMap((a) => buildNameVariants(a));
  return [...new Set([...baseList, ...aliasVariants])].map((n) => `images/maps/${n}.png`);
};

const brawlerImageCandidates = (name) => {
  const base = slugify(name);
  const squeezed = base.replace(/_/g, "");
  return [
    `images/brawlers/${base}.png`,
    `images/brawlers/${base}_portrait.png`,
    `images/brawlers/${base}-portrait.png`,
    `images/brawlers/${squeezed}_portrait.png`,
    `images/brawlers/${name}.png`,
    `images/brawlers/${name}_portrait.png`,
    `images/brawlers/${name}-portrait.png`
  ];
};

function tierWeight(name) {
  const tier = RANK_TO_TIER[state.rankId] || "low";
  const list = GLOBAL_META?.[tier] || [];
  const idx = list.findIndex((n) => n.toLowerCase() === name.toLowerCase());
  if (idx === -1) return 0;
  return Math.max(0, list.length - idx);
}

function setImageWithFallback(img, candidates, fallbackEmoji) {
  const list = [...new Set(candidates.filter(Boolean))];
  const tryNext = () => {
    const next = list.shift();
    if (!next) {
      img.onerror = null;
      img.src = emojiDataUrl(fallbackEmoji);
      return;
    }
    img.onerror = tryNext;
    img.src = next;
  };
  tryNext();
}

function inferTagsFromRole(role = "") {
  const lower = role.toLowerCase();
  return Object.entries(ROLE_TAG_HINTS)
    .filter(([key]) => lower.includes(key))
    .flatMap(([, tags]) => tags);
}

function getMapTags(mapName, modeId) {
  const key = (mapName || "").toLowerCase();
  const mapTags = MAP_TRAITS?.[key] || [];
  const modeTags = MODE_TAGS[modeId] || [];
  return new Set([...mapTags, ...modeTags]);
}

function scorePicks(picks = [], tags, pickOrder) {
  return [...picks]
    .map((p) => {
      const inferred = inferTagsFromRole(p.role || "");
      const tagMatches = [...tags].filter((t) => inferred.includes(t) || (p.tags || []).includes(t)).length;
      const buff = p.buffed || BUFFED.has(p.name) ? 1 : 0;
      const vuln = (p.counteredBy || []).length;
      const counters = (p.counters || []).length;
      const orderPenalty = pickOrder === "enemy" ? vuln * 0.4 : 0;
      const metaWeight = tierWeight(p.name);
      const score = 10 + tagMatches * 2 + buff * 3 + counters * 0.6 + metaWeight * 0.9 - vuln * 0.8 - orderPenalty;
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreBans(meta, tier, tags) {
  const baseBanNames = meta?.bans?.[tier] || [];
  const basePicks = meta?.picks?.[tier] || [];
  const combined = [
    ...baseBanNames.map((n) => ({ name: n, role: "ban", counters: [], counteredBy: [] })),
    ...basePicks
  ];
  const scored = combined.map((p) => {
    const inferred = inferTagsFromRole(p.role || "");
    const tagMatches = [...tags].filter((t) => inferred.includes(t) || (p.tags || []).includes(t)).length;
    const buff = p.buffed || BUFFED.has(p.name) ? 1 : 0;
    const vuln = (p.counteredBy || []).length;
    const metaWeight = tierWeight(p.name);
    const score = 10 + tagMatches * 2 + buff * 2 + metaWeight * 0.7 - vuln * 0.5;
    return { name: p.name, score };
  });
  const seen = new Set();
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    })
    .slice(0, 3)
    .map((p) => p.name);
}

function goTo(screenName) {
  screens.forEach((s) => s.classList.remove("active"));
  const target = screens.find((s) => s.dataset.screen === screenName);
  if (target) target.classList.add("active");
  if (screenName === "map" && state.modeId) {
    renderMaps(state.modeId);
  }
  if (screenName === "order") {
    renderOrderSummary();
  }
  if (screenName === "recs") {
    renderRecommendations();
  }
}

function renderCurrentRank() {
  const rank = RANKS.find((r) => r.id === state.rankId) || RANKS[0];
  currentRankCard.innerHTML = "";
  const icon = document.createElement("img");
  icon.className = "rank-icon";
  setImageWithFallback(icon, RANK_ICON_PATHS[rank.id] || [], rank.emoji);
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = "Текущий ранг:";
  const nameEl = document.createElement("div");
  nameEl.className = "rank-name";
  nameEl.style.color = rank.color;
  nameEl.textContent = rank.name;
  currentRankCard.append(label, icon, nameEl);
}

function renderRanks() {
  rankGrid.innerHTML = "";
  RANKS.forEach((rank) => {
    const card = document.createElement("div");
    card.className = "card rank-card hover-tilt";
    card.style.borderColor = rank.color + "66";
    if (rank.id === state.rankId) card.classList.add("selected");
    card.innerHTML = `
      <div class="rank-emoji"><img class="rank-icon" alt="${rank.name}"></div>
      <div class="rank-name">${rank.name}</div>
      <div class="tick">✓</div>
    `;
    const icon = card.querySelector(".rank-icon");
    setImageWithFallback(icon, RANK_ICON_PATHS[rank.id] || [], rank.emoji);
    card.addEventListener("click", () => {
      state.rankId = rank.id;
      localStorage.setItem("brawldraft-rank", rank.id);
      renderRanks();
      renderCurrentRank();
      goTo("mode");
    });
    rankGrid.appendChild(card);
  });
}

function renderModes() {
  modeList.innerHTML = "";
  MODES.forEach((mode) => {
    const card = document.createElement("div");
    card.className = "card mode-card hover-tilt";
    card.innerHTML = `
      <div class="mode-icon-wrap"><img class="mode-icon" alt="${mode.name}"></div>
      <div>
        <div class="rank-name">${mode.name}</div>
        <div class="subtle">${mode.maps} карты</div>
      </div>
      <div class="arrow">→</div>
    `;
    const mIcon = card.querySelector(".mode-icon");
    setImageWithFallback(mIcon, MODE_ICON_PATHS[mode.id] || [], mode.icon);
    card.addEventListener("click", () => {
      state.modeId = mode.id;
      card.classList.add("active");
      setTimeout(() => goTo("map"), 120);
    });
    modeList.appendChild(card);
  });
}

function renderMaps(modeId) {
  const maps = MAPS[modeId] || [];
  mapList.innerHTML = "";
  maps.forEach((m) => {
    const card = document.createElement("div");
    card.className = "card map-card hover-tilt";

    const img = document.createElement("img");
    img.alt = m.name;
    setImageWithFallback(img, mapImageCandidates(m.name), "🗺️");

    const info = document.createElement("div");
    info.className = "map-info";
    info.innerHTML = `
      <div class="subtle">Карта</div>
      <div class="map-title">${m.name}</div>
    `;

    const arrow = document.createElement("div");
    arrow.className = "arrow";
    arrow.textContent = "→";

    card.append(img, info, arrow);
    card.addEventListener("click", () => {
      state.mapName = m.name;
      card.classList.add("active");
      setTimeout(() => goTo("order"), 120);
    });

    mapList.appendChild(card);
  });
}

function renderOrderSummary() {
  const rank = RANKS.find((r) => r.id === state.rankId);
  const mode = MODES.find((m) => m.id === state.modeId);
  orderSummary.innerHTML = `
    <div class="summary-grid">
      <span>Режим: <strong>${mode ? mode.icon + " " + mode.name : "—"}</strong></span>
      <span>Карта: <strong>${state.mapName || "—"}</strong></span>
      <span>Ранг: <strong>${rank ? rank.name : "—"}</strong></span>
    </div>
  `;
  toggles.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.order === state.pickOrder);
  });
}

function reorderPicksForOrder(picks, pickOrder) {
  if (pickOrder !== "enemy") return picks;
  return [...picks].sort((a, b) => {
    const buffA = a.buffed || BUFFED.has(a.name) ? 1 : 0;
    const buffB = b.buffed || BUFFED.has(b.name) ? 1 : 0;
    const vulnA = a.counteredBy?.length || 0;
    const vulnB = b.counteredBy?.length || 0;
    const scoreA = (a.score || 0) + buffA * 2 - vulnA;
    const scoreB = (b.score || 0) + buffB * 2 - vulnB;
    return scoreB - scoreA;
  });
}

function renderRecommendations() {
  if (!state.modeId || !state.mapName) return;
  const tier = RANK_TO_TIER[state.rankId] || "low";
  const meta = META[state.modeId];
  const mode = MODES.find((m) => m.id === state.modeId);
  const rank = RANKS.find((r) => r.id === state.rankId);
  const mapTags = getMapTags(state.mapName, state.modeId);

  recSummary.innerHTML = "";
  const summaryImg = document.createElement("img");
  summaryImg.alt = state.mapName;
  setImageWithFallback(summaryImg, mapImageCandidates(state.mapName), "🗺️");

  const summaryTop = document.createElement("div");
  summaryTop.className = "summary-top";

  const modeBadge = document.createElement("div");
  modeBadge.className = "mode-icon-badge";
  const modeImg = document.createElement("img");
  modeImg.alt = mode?.name || "";
  setImageWithFallback(modeImg, MODE_ICON_PATHS[state.modeId] || [], mode?.icon || "⭐");
  modeBadge.appendChild(modeImg);

  const textBlock = document.createElement("div");
  textBlock.className = "summary-top-text";
  const modeName = document.createElement("div");
  modeName.className = "rank-name";
  modeName.textContent = mode?.name || "";
  const rankNote = document.createElement("div");
  rankNote.className = "subtle";
  rankNote.textContent = `Ранг: ${rank ? rank.name : "—"}`;
  textBlock.append(modeName, rankNote);

  summaryTop.append(modeBadge, textBlock);
  recSummary.append(summaryTop, summaryImg);
  const grid = document.createElement("div");
  grid.className = "summary-grid";
  grid.innerHTML = `
    <span>Карта: <strong>${state.mapName}</strong></span>
    <span>Порядок: <strong>${state.pickOrder === "us" ? "Мы выбираем первыми" : "Противник выбирает первым"}</strong></span>
  `;
  recSummary.appendChild(grid);
  const tagLine = document.createElement("div");
  tagLine.className = "meta-note";
  tagLine.textContent = `AI-драфт учитывает карту: ${[...mapTags].join(", ") || "—"}.`;
  recSummary.appendChild(tagLine);
  if (state.pickOrder === "enemy") {
    const note = document.createElement("div");
    note.className = "meta-note";
    note.textContent = "Порядок пиков сдвинут, потому что противник открывает драфт первым.";
    recSummary.appendChild(note);
  }

  const bans = scoreBans(meta, tier, mapTags);
  banCards.innerHTML = "";
  bans.forEach((name, idx) => {
    const card = document.createElement("div");
    card.className = "ban-card";
    card.innerHTML = `
      <div class="ban-number">${idx + 1}</div>
      <div class="brawler-row">
        <img alt="${name}">
        <div>
          <div class="brawler-name">${name}</div>
          <div class="subtle">Рекомендуемый бан</div>
        </div>
      </div>
    `;
    const img = card.querySelector("img");
    setImageWithFallback(img, brawlerImageCandidates(name), "🚫");
    banCards.appendChild(card);
  });

  const scoredPicks = scorePicks(meta?.picks?.[tier] || [], mapTags, state.pickOrder);
  const picks = reorderPicksForOrder(scoredPicks, state.pickOrder);
  pickCards.innerHTML = "";
  picks.slice(0, 6).forEach((pick, idx) => {
    const card = document.createElement("div");
    card.className = "pick-card";
    card.innerHTML = `
      <div class="pick-number">${idx + 1}</div>
      <div class="brawler-row">
        <img alt="${pick.name}">
        <div>
          <div class="brawler-name">${pick.name}</div>
          <div class="role-tags">
            <span class="tag role">${pick.role}</span>
            ${pick.buffed || BUFFED.has(pick.name) ? '<span class="tag buffed">⚡ Баффи</span>' : ""}
          </div>
        </div>
      </div>
      <div class="counters">
        <div class="counter-block green">
          ✓ Контрит
          <div class="mini-avatars">${renderMiniAvatars(pick.counters)}</div>
        </div>
        <div class="counter-block red">
          ✗ Слаб против
          <div class="mini-avatars">${renderMiniAvatars(pick.counteredBy)}</div>
        </div>
      </div>
    `;
    const img = card.querySelector("img");
    setImageWithFallback(img, brawlerImageCandidates(pick.name), "⚡");
    card.querySelectorAll(".mini-avatars img").forEach((mini) => {
      setImageWithFallback(mini, brawlerImageCandidates(mini.dataset.name), "🎯");
    });
    pickCards.appendChild(card);
  });

  const alts = meta?.alsoTry?.[tier] || [];
  altCards.innerHTML = "";
  alts.forEach((name) => {
    const card = document.createElement("div");
    card.className = "alt-card";
    card.innerHTML = `
      <img alt="${name}">
      <div>
        <div class="brawler-name">${name}</div>
        <div class="role-tags">
          ${BUFFED.has(name) ? '<span class="tag buffed">⚡ Баффи</span>' : '<span class="tag role">Флекс</span>'}
        </div>
      </div>
    `;
    const img = card.querySelector("img");
    setImageWithFallback(img, brawlerImageCandidates(name), "💡");
    altCards.appendChild(card);
  });
}

function renderMiniAvatars(list = []) {
  return list
    .slice(0, 3)
    .map((name) => `<img data-name="${name}" alt="${name}">`)
    .join("");
}

function wireEvents() {
  startBtn.addEventListener("click", () => goTo("rank"));

  backButtons.forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.dataset.target));
  });

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.pickOrder = btn.dataset.order;
      renderOrderSummary();
    });
  });

  goRecsBtn.addEventListener("click", () => goTo("recs"));
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

function initParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w = 0;
  let h = 0;

  const resize = () => {
    w = (canvas.width = window.innerWidth);
    h = (canvas.height = window.innerHeight);
    particles = new Array(45).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      pulse: 0.5 + Math.random() * 0.5
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
      const pulse = 0.5 + Math.sin(Date.now() / 800) * 0.2 * p.pulse;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,229,255,0.25)";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(0,229,255,0.35)";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  draw();
}

function init() {
  renderCurrentRank();
  renderRanks();
  renderModes();
  wireEvents();
  renderRecommendations();
  registerServiceWorker();
  initParticles();
}

document.addEventListener("DOMContentLoaded", init);
