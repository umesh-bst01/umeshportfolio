# Umesh Verma — Persona-Style Portfolio

A **Persona 5 menu-inspired portfolio**: animated red diagonal stripes, ransom-note
lettering, keyboard-driven navigation, screen-wipe transitions, a custom cursor,
skill bars, a live GitHub feed, and a contact form that lands straight in my inbox.

The anime-style background (jagged manga starbursts, rotating speed-lines,
twinkling sparkles, and the "TAKE YOUR TIME" ticker) is **drawn entirely in
code** — SVG polygons + CSS animations, no video assets, so it stays under 50 KB
and respects `prefers-reduced-motion`.

Design inspired by [Numal400/Persona_style_portfolio](https://github.com/Numal400/Persona_style_portfolio),
rebuilt from scratch with my own content, code and assets.

## Structure (Model–View–Controller)

```
├── index.html            View skeleton — markup only, no logic or styles
├── css/
│   └── style.css         All styling (theme colors in :root at the top)
├── js/
│   ├── model.js          DATA — featured projects, skills, achievements, GitHub fetch
│   ├── js/view.js        DOM — rendering, ransom lettering, wipe, cursor, synth SFX
│   └── js/controller.js  EVENTS — keyboard/mouse input, navigation, contact form
└── assets/
    └── me.jpg            profile photo (home polaroid + about paper)
```

## Editing content

Everything lives in **js/model.js**: featured projects, skill bars, achievement
stamps, thumbnail overrides, GitHub username, contact email.
Bio and contact links are plain HTML in **index.html**.
Colors are CSS variables at the top of **css/style.css**.

## Optional art slots

### Background videos (like the original reference)

The reference repo shipped with Persona-style **background videos** but excluded
them from GitHub because they were 500MB+. You don't need huge files — a short,
compressed loop looks identical in fullscreen. The site supports a video on
**every screen**:

1. Drop your clip at `assets/menus/<screen>.mp4` — one of:
   `home.mp4`, `projects.mp4`, `skills.mp4`, `about.mp4`, `contact.mp4`
2. Commit and push. Done — no code changes needed.

Priority per screen: **video → image (`<screen>.jpg`) → animated CSS stripes.**
Missing files hide themselves; nothing breaks.

**Video specs (important for GitHub Pages):**

| Spec | Target | Why |
|---|---|---|
| Length | 10–20s seamless loop | loops invisibly |
| Resolution | 1280×720 | crisp enough fullscreen |
| Codec | H.264 MP4 (`-movflags +faststart`) | plays everywhere, starts fast |
| Audio | **remove it** (`-an`) | muted videos autoplay in every browser |
| Size | **≤15MB** | GitHub blocks files >100MB, warns >50MB; big files stay in git history forever |

**Compress any video to spec** (ffmpeg, free):

```
ffmpeg -i input.mp4 -vf "scale=1280:-2" -an -c:v libx264 -crf 26 -preset slow -movflags +faststart assets/menus/home.mp4
```

(`-crf 26` trades a little quality for a lot of size; raise to 23 for better
quality, lower to 30 for smaller files. Trim to a loop first, e.g.
`-ss 3 -t 12` for 12 seconds starting at 0:03.)

**Where to get footage:** search YouTube for "Persona 5 menu background" /
"All-Out Attack" clips, download a short segment, then run it through the
command above. Heads up: Persona 5 footage is Atlus/SEGA IP — fine for a
personal fan portfolio (the reference author does the same), just don't
monetize the site.

### Static images

- `assets/menus/<screen>.jpg` — per-screen background art (used when no video
  exists for that screen)
- `assets/projects/<RepoName>.png` — thumbnails for the "All repositories" cards
- `assets/hero.png` — reserved for future hero art

## Contact form

Relayed via [formsubmit.co](https://formsubmit.co) to `umeshverma.mv@gmail.com`.
**The first-ever submission emails a one-time activation link** — click it once
and every future message arrives normally. If the relay is unreachable, the form
falls back to opening the visitor's own mail app.

## Run locally

```
python3 -m http.server
```

then open http://localhost:8000 — opening `index.html` directly (file://) blocks
the GitHub API fetch in most browsers.

## Deploy

Push to GitHub, enable **Settings → Pages → Deploy from a branch → main → / (root)**. Done.

## Controls

↑ / ↓ select · Enter confirm · Esc back · click the name to go home
(on touch devices everything is tap-driven)
