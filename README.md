# Umesh Verma — Persona-Style Portfolio

A **Persona 5 menu-inspired portfolio**: animated red diagonal stripes, ransom-note
lettering, keyboard-driven navigation, screen-wipe transitions, a custom cursor,
skill bars, a live GitHub feed, and a contact form that lands straight in my inbox.

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

- `assets/menus/<screen>.jpg` — per-screen background art (home, projects,
  skills, about, contact). Missing files fall back to the CSS stripes.
- `assets/projects/<RepoName>.png` — thumbnails for the "All repositories" cards.
- `assets/hero.png` — reserved for future hero art.

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
