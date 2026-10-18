/* =====================================================================
   VIEW — everything that draws to the screen. No app logic lives here;
   the Controller tells the View what to show.
   ===================================================================== */

const View = {

  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,

  els: {
    screens:    {},   // filled in init()
    menuItems:  [],
    wipe:       document.getElementById("wipe"),
    featGrid:   document.getElementById("feat-grid"),
    repoGrid:   document.getElementById("repo-grid"),
    repoStatus: document.getElementById("repo-status"),
    skillsBody: document.getElementById("skills-body"),
    cursor:     document.getElementById("cursor"),
    clock:      document.getElementById("clock"),
  },

  init() {
    document.querySelectorAll(".screen").forEach(s => {
      this.els.screens[s.id.replace("screen-", "")] = s;
    });
    this.els.menuItems = [...document.querySelectorAll(".menu-item")];
    document.querySelectorAll("[data-ransom]").forEach(el => this.ransomize(el));
    // stamp each art slot with its screen id (art-video-<s> / art-<s>)
    document.querySelectorAll(".menu-art").forEach(a => {
      a.dataset.screen = a.id.replace("art-video-", "").replace("art-", "");
    });
    this.wireArtVideos();
    this.buildAnimeBg();
    this.startClock();
    this.startParallax();
    this.startCursor();
    this.syncArtVisibility(Model.state.screen);
    this.startMusicPlayer();
    document.body.classList.add("loaded");
  },

  // Deterministic pseudo-random hash (so letters look the same every visit)
  hash(str) {
    let h = 9;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 387420489);
    return (h ^ h >>> 9) >>> 0;
  },

  /* ---------- Ransom-note lettering ---------- */
  ransomize(el) {
    const text = el.dataset.ransom || el.textContent;
    el.textContent = "";
    [...text].forEach((c, i) => {
      const span = document.createElement("span");
      span.className = "ch display";
      span.textContent = c;
      const h = this.hash(text + i);
      const rot = (h % 17) - 8;                   // -8..8 degrees
      const scale = 0.86 + ((h >> 3) % 30) / 100; // 0.86..1.15
      const dy = ((h >> 5) % 9) - 4;              // -4..4 px
      const t = `rotate(${rot}deg) scale(${scale}) translateY(${dy}px)`;
      span.style.setProperty("--t", t);
      span.style.transform = t;
      const variant = (h >> 7) % 10;

      // keep a couple of letters boxed on the big name for brand consistency
      if ((text === "UMESH" && c === "M") || (text === "VERMA" && c === "A")) {
        span.classList.add("box");
      } else if (variant === 0) {
        span.classList.add("box");
      } else if (variant === 1) {
        span.classList.add("boxw");
      } else if (variant === 2) {
        span.classList.add("red");
      }

      el.appendChild(span);
    });
  },

  /* ---------- Per-screen background videos ----------
     Missing file → source error → video removes itself (falls back to the
     image slot / CSS stripes). Loaded → tag body, then force playback:
     autoplay alone can stall when data arrives after the load started. */
  wireArtVideos() {
    document.querySelectorAll("video.menu-art").forEach(v => {
      const screen = v.id.replace("art-video-", "");
      const kill = () => v.remove();
      if (v.querySelector("source")) {
        v.querySelector("source").addEventListener("error", kill);
      }
      v.addEventListener("error", kill);
      v.addEventListener("loadeddata", () => {
        document.body.classList.add("has-video-" + screen);
        v.muted = true;
        const tryPlay = () => {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        };
        tryPlay();
        // belt and braces: if autoplay was refused or stalled, the visitor's
        // first interaction (or returning to the tab) starts it
        const kick = () => {
          if (v.paused) tryPlay();
          window.removeEventListener("pointerdown", kick);
          window.removeEventListener("keydown", kick);
          window.removeEventListener("wheel", kick);
        };
        window.addEventListener("pointerdown", kick);
        window.addEventListener("keydown", kick);
        window.addEventListener("wheel", kick, { passive: true });
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden && v.paused) tryPlay();
        });
      });
    });
  },

  /* ---------- Anime background layer (bursts, twinkles, ticker) ---------- */
  // Jagged manga starburst polygon points (deterministic per seed)
  burstPoints(spikes, R, r, seed) {
    const pts = [];
    for (let i = 0; i < spikes * 2; i++) {
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      const rad = (i % 2 ? r : R) * (0.82 + (this.hash(seed + i) % 34) / 100);
      pts.push((50 + Math.cos(a) * rad).toFixed(2) + "," + (50 + Math.sin(a) * rad).toFixed(2));
    }
    return pts.join(" ");
  },

  buildAnimeBg() {
    const host = document.getElementById("anime-bg");
    if (!host) return;

    // starbursts: [svg element, spikes, outer R, inner r, seed]
    const bursts = [
      ["b1", 14, 62, 34, "umesh-b1"],   // big black burst over the stripes
      ["b2", 11, 48, 27, "umesh-b2"],   // outlined burst over the slash
      ["b3", 8, 30, 18, "umesh-b3"],    // small red burst
    ];
    bursts.forEach(([cls, spikes, R, r, seed]) => {
      const svg = host.querySelector("." + cls);
      if (!svg) return;
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", this.burstPoints(spikes, R, r, seed));
      poly.setAttribute("vector-effect", "non-scaling-stroke");
      svg.appendChild(poly);
    });

    // twinkling 4-point sparkles at deterministic positions
    const wrap = host.querySelector("#twinkles");
    for (let i = 0; i < 12; i++) {
      const t = document.createElement("span");
      t.className = "twinkle";
      const h = this.hash("twinkle" + i);
      t.style.left = (4 + (h % 92)) + "%";
      t.style.top = (6 + ((h >> 4) % 86)) + "%";
      const size = 10 + ((h >> 8) % 16);
      t.style.width = size + "px";
      t.style.height = size + "px";
      t.style.animationDelay = ((h >> 12) % 40) / 10 + "s";
      t.style.animationDuration = (1.6 + ((h >> 16) % 22) / 10) + "s";
      wrap.appendChild(t);
    }

    // Persona ticker strip
    const strip = host.querySelector("#ticker-strip");
    if (strip) strip.textContent = "TAKE YOUR TIME ★ UMESH VERMA ★ AI & FULL-STACK ★ ".repeat(8);
  },

  /* ---------- Screens & menu ---------- */
  showScreen(name) {
    const s = this.els.screens;
    Object.values(s).forEach(sc => sc.classList.remove("active"));
    s[name].classList.add("active");
    s[name].scrollTop = 0;
    document.body.dataset.screen = name;
    this.syncArtVisibility(name);
  },

  // Reveal the active screen's background art via inline opacity — some
  // webviews stall stylesheet-driven opacity transitions on these layers,
  // so JS owns the value; the CSS rules remain as a no-JS fallback.
  // Videos load lazily (preload="none"): a screen's clip downloads on first
  // visit, the active one plays, and off-screen decoders pause.
  syncArtVisibility(screen) {
    document.querySelectorAll(".menu-art").forEach(a => {
      const active = a.dataset.screen === screen;
      a.style.opacity = active ? "1" : "0";
      if (a.tagName !== "VIDEO") return;
      if (active) {
        if (a.readyState === 0 && !a.__loading) {
          a.__loading = true;
          a.load();               // triggers loadeddata → play (wireArtVideos)
        } else if (a.readyState >= 2 && a.paused) {
          const p = a.play();
          if (p && p.catch) p.catch(() => {});
        }
      } else if (!a.paused) {
        a.pause();                // stop off-screen video decoders
      }
    });
    // while the active screen's video covers them, the stripes/stars are
    // display:none and their animations stop — skip their parallax too
    this.bgStripesActive = !document.body.classList.contains("has-video-" + screen);
  },

  setMenuSelection(index) {
    this.els.menuItems.forEach((m, j) => m.classList.toggle("sel", j === index));
  },

  // Diagonal wipe; calls swap() mid-way while the screen is covered
  wipe(swap, done) {
    if (this.reducedMotion) { swap(); done(); return; }
    const w = this.els.wipe;
    w.classList.remove("go"); void w.offsetWidth;  // restart animation
    w.classList.add("go");
    setTimeout(swap, 340);
    setTimeout(done, 720);
  },

  /* ---------- Sound: short Persona-style menu blip, synthesized ---------- */
  audioOn: false,
  audioCtx: null,

  playSelect() {
    if (!this.audioOn) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!this.audioCtx) this.audioCtx = new AC();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(740, t);
      osc.frequency.exponentialRampToValueAtTime(1480, t + 0.07);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      osc.connect(gain).connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch { /* audio unavailable — stay silent */ }
  },

  /* ---------- Project cards ---------- */
  cardThumb(src) {
    return `<div class="thumb"><img src="${src}" alt="" loading="lazy"
      onerror="this.closest('.thumb').remove()"></div>`;
  },

  // Split the title so the first word renders red
  splitTitle(title) {
    const first = title.split(" ")[0];
    return `<em>${first}</em>${title.slice(first.length)}`;
  },

  renderFeatured(list) {
    if (this.els.featGrid.childElementCount) return;
    list.forEach((f, i) => {
      const a = document.createElement("a");
      a.className = "card feat";
      a.href = f.url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(f.title) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.innerHTML = `
        <span class="lang" style="--lc:${f.color}">${f.tag}</span>
        <h3>${f.live ? '<span class="live-dot"></span>' : ""}${this.splitTitle(f.title)}</h3>
        <p>${f.desc}</p>
        <div class="meta"><span>${f.live ? "LIVE NOW" : "HIGHLIGHT"}</span><span class="go">${f.cta}</span></div>`;
      this.els.featGrid.appendChild(a);
    });
  },

  renderRepos(repos, statusText, model) {
    this.els.repoStatus.textContent = statusText;
    this.els.repoGrid.innerHTML = "";
    repos.forEach((r, i) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(r.name) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.style.setProperty("--lc", model.langColors[r.language] || "#e60012");
      const pretty = r.name.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const img = model.projectImages[r.name] || `assets/projects/${r.name}.png`;
      a.innerHTML = `
        ${this.cardThumb(img)}
        <span class="lang">${r.language || "Repo"}</span>
        <h3>${this.splitTitle(pretty)}</h3>
        <p>${r.description || "No description yet, but the code speaks for itself."}</p>
        <div class="meta">
          <span>★ ${r.stargazers_count || 0}</span>
          <span class="go">View on GitHub →</span>
        </div>`;
      this.els.repoGrid.appendChild(a);
    });
  },

  /* ---------- Skills ---------- */
  renderSkills(groups) {
    groups.forEach(g => {
      const div = document.createElement("div");
      div.className = "skill-group";
      div.innerHTML = `<h3>${g.group}</h3>`;
      g.items.forEach(([name, value]) => {
        const row = document.createElement("div");
        row.className = "skill-row";
        row.innerHTML = `
          <span class="name">${name}</span>
          <div class="skill-bar"><div class="fill" data-v="${value}"></div></div>
          <span class="lv">${value}</span>`;
        div.appendChild(row);
      });
      this.els.skillsBody.appendChild(div);
    });
  },

  renderAchievements(list) {
    const host = document.getElementById("achievement-stamps");
    if (!host || host.childElementCount) return;
    list.forEach((name, i) => {
      const s = document.createElement("span");
      s.className = "stamp";
      s.style.setProperty("--tilt", ((this.hash(name) % 7) - 3) + "deg");
      s.textContent = "🏆 " + name;
      host.appendChild(s);
    });
  },

  animateSkillBars() {
    const fills = this.els.skillsBody.querySelectorAll(".fill");
    fills.forEach(f => { f.style.width = "0"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fills.forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.v + "%"; }, i * 60));
    }));
  },

  /* ---------- Floating music player (liquid glass) ---------- */
  startMusicPlayer() {
    const wrap = document.getElementById("music-float");
    const btn  = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-music");
    const vol  = document.getElementById("music-volume");
    if (!wrap || !btn || !audio) return;

    const bar  = document.getElementById("music-progress");
    const fill = document.getElementById("music-progress-fill");
    const knob = document.getElementById("music-progress-knob");
    const timeEl = document.getElementById("music-time");
    const fmt = s => {
      if (!isFinite(s)) return "0:00";
      const m = Math.floor(s / 60), sec = Math.floor(s % 60);
      return m + ":" + String(sec).padStart(2, "0");
    };
    // Safari can report Infinity while streaming and throttles timeupdate,
    // so fall back to seekable ranges and drive the bar with rAF
    const dur = () => {
      if (isFinite(audio.duration) && audio.duration > 0) return audio.duration;
      if (audio.seekable && audio.seekable.length) return audio.seekable.end(audio.seekable.length - 1);
      return NaN;
    };
    const sync = () => {
      const d = dur();
      const pct = isFinite(d) && d > 0 ? (audio.currentTime / d) * 100 : 0;
      if (fill) fill.style.width = pct + "%";
      if (knob) knob.style.left = pct + "%";
      if (bar) bar.setAttribute("aria-valuenow", Math.round(pct));
      if (timeEl) timeEl.textContent = fmt(audio.currentTime) + " / " + fmt(d);
    };
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("seeked", sync);

    const setPlaying = on => wrap.classList.toggle("playing", on);
    const play = () => {
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    };

    btn.addEventListener("click", () => {
      if (audio.paused) play(); else audio.pause();
    });
    audio.addEventListener("play", () => { setPlaying(true); raf(); });
    audio.addEventListener("pause", () => setPlaying(false));

    if (vol) {
      audio.volume = parseInt(vol.value, 10) / 100;
      vol.addEventListener("input", () => {
        audio.volume = parseInt(vol.value, 10) / 100;
        vol.parentElement.querySelector(".mf-vol-ic").textContent =
          audio.volume === 0 ? "🔇" : audio.volume < .5 ? "🔈" : "🔊";
      });
    }

    if (bar) {
      let seeking = false;
      const seekTo = clientX => {
        const r = bar.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
        const d = dur();
        if (isFinite(d)) audio.currentTime = ratio * d;
      };
      bar.addEventListener("pointerdown", e => {
        seeking = true;
        wrap.classList.add("seeking");
        try { bar.setPointerCapture(e.pointerId); } catch {}
        seekTo(e.clientX);
      });
      bar.addEventListener("pointermove", e => { if (seeking) seekTo(e.clientX); });
      const stop = () => { seeking = false; wrap.classList.remove("seeking"); };
      bar.addEventListener("pointerup", stop);
      bar.addEventListener("pointercancel", stop);
    }

    // rAF loop only while playing (keeps the bar silky in every browser)
    const raf = () => {
      if (audio.paused) return;
      sync();
      requestAnimationFrame(raf);
    };

    // slide the player in shortly after load
    setTimeout(() => wrap.classList.add("in"), 700);
  },

  /* ---------- Ambient: clock, parallax, custom cursor ---------- */
  startClock() {
    const tick = () => {
      this.els.clock.textContent =
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " · IND";
    };
    tick();
    setInterval(tick, 1000);
  },

  startParallax() {
    if (this.reducedMotion) return;
    const stripes = document.getElementById("bg-stripes");
    const halftone = document.getElementById("bg-halftone");
    const art = document.getElementById("home-photo");
    const arts = [...document.querySelectorAll(".menu-art")];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener("mousemove", e => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      // skip the (invisible) stripe/halftone layers while a video covers them
      if (this.bgStripesActive !== false) {
        stripes.style.transform = `translate(${cx * 22}px, ${cy * 14}px)`;
        halftone.style.transform = `translate(${cx * -34}px, ${cy * -22}px)`;
      }
      // only the visible art layer needs the drift
      arts.forEach(a => {
        if (a.isConnected && a.style.opacity === "1")
          a.style.transform = `translate(${cx * 14}px, ${cy * 9}px) scale(1.05)`;
      });
      if (art && art.isConnected)
        art.style.transform = `translate(${cx * -12}px, ${cy * -8}px) rotate(4deg)`;
      requestAnimationFrame(loop);
    };
    loop();
  },

  // CSS-drawn Persona-style cursor (no sprite assets needed).
  // Position is applied synchronously on every mousemove — no rAF indirection —
  // so it tracks the real pointer 1:1 even when the main thread is busy.
  startCursor() {
    if (!matchMedia("(pointer:fine)").matches || this.reducedMotion) return;
    const cur = this.els.cursor;
    document.body.classList.add("cursor-on");
    let visible = false;

    addEventListener("mousemove", e => {
      if (!visible) { cur.style.display = "block"; visible = true; }
      cur.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const t = e.target;
      const overLink = t.closest &&
        t.closest("a,button,.card,.menu-item,.back-hint,.contact-chip,#big-name");
      cur.classList.toggle("link", !!overLink);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
      cur.style.display = "none"; visible = false;
    });
  },
};
