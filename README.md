# Md. Mehadi Hassan — AI Engineer Portfolio

A premium, fully static single-page portfolio for an AI Engineer. Dark, calm, high-end AI-lab aesthetic (Linear / Vercel / Stripe vibes) with an animated neural-network background, LLM-style text streaming, an interactive AI terminal, and a command palette.

Built with **plain HTML, CSS and vanilla JavaScript** — no build step, no dependencies (only Google Fonts). Deploys directly to GitHub Pages.

## Features

- Neural-network canvas background with mouse parallax
- Boot screen with terminal-style streaming (once per session)
- Sticky glass navbar with active-section highlighting + mobile overlay menu
- Hero with rotating typing roles, LLM-style streaming intro, gradient-glow photo with 3D tilt and floating tech badges
- Animated counters computed from `js/data.js` (never hardcoded)
- Bento skill grid + infinite scrolling marquee
- Project cards with animated pipeline strips, mouse spotlight, 3D tilt
- Pre-scripted interactive AI terminal (`help`, `whoami`, `skills`, `projects`, `education`, `certs`, `contact`, `resume`, `github`, `linkedin`, `clear`, and an easter egg `sudo hire mehadi`)
- Education timeline with self-drawing line
- Contact cards with click-to-copy email, auto-year footer
- Command palette (Ctrl/Cmd + K) with keyboard navigation and focus trap
- Fully responsive (360px → 4K), respects `prefers-reduced-motion`, semantic HTML + ARIA + AA contrast

## Project structure

```
.
├── index.html          # All sections; data-driven parts render from js/data.js
├── 404.html            # Styled 404 page
├── .nojekyll           # Tells GitHub Pages not to run Jekyll
├── README.md
├── css/style.css       # Design system + layout + responsive rules
├── js/
│   ├── data.js         # ⭐ ALL content and ALL links live here
│   ├── icons.js        # Inline SVG icon helpers
│   ├── stream.js       # LLM-style text streaming effect
│   ├── background.js   # Canvas neural-network background
│   ├── terminal.js     # Interactive AI terminal
│   └── main.js         # Navbar, reveal, counters, tilt, spotlight, palette
└── assets/
    ├── profile.png              # Your photo
    ├── Md__Mehadi_Hassan.pdf    # Resume
    ├── favicon.svg              # "MH" gradient monogram
    └── og-image.png             # Social share image (1200x630) — create this
```

## Run locally

You don't need a server to edit, but a local server avoids CORS quirks and mirrors GitHub Pages. Any of these work from the project root:

```bash
# Python
python -m http.server 8000

# Node (any http server)
npx serve .

# Windows PowerShell (no install) — open index.html directly is also fine
```

Then open http://localhost:8000.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo, e.g. `Mehadii-Hassan/Mehadi-Portfolio`.
2. In the repo go to **Settings → Pages**.
3. Under **Branch**, pick `Deploy from a branch` → `main` → `/ (root)`.
4. Click **Save**. Your site is live at `https://Mehadii-Hassan.github.io/Mehadi-Portfolio/`.

The `.nojekyll` file keeps GitHub Pages from processing files, and the custom `404.html` is picked up automatically.

## Links (all defined in `js/data.js`)

Everything is already filled in:
- GitHub: `https://github.com/Mehadii-Hassan`
- LinkedIn: `https://www.linkedin.com/in/md-mehadi-hassan-ai/`
- MehadiAI repo: `https://github.com/Mehadii-Hassan/MehadiAI`
- Multi-Agent Research System repo: `https://github.com/Mehadii-Hassan/Multi-Agent-Research-System`
- Medical Chatbot repo: `https://github.com/Mehadii-Hassan/Medical-Chatbot`
- Personal Voice Assistant repo: `https://github.com/Mehadii-Hassan/Personal-Voice-Assistant-System`
- Certificate 1 (Ostad): `https://drive.google.com/file/d/1qqLrZIWMPHhtXXSLVXGEQtx1Iu071SNF/view`
- Certificate 2 (InceptionBD): `https://drive.google.com/file/d/1E7YehptqspMi5M-Bubi05JmgNJP4gCSt/view`

On page load, the console warns only about URLs that still contain `YOUR_` — none remain. Nothing breaks even if one crops up; that link just stays a placeholder until you fill it.

### Optional to-do (nothing required)
- Create **`assets/og-image.png`** (1200×630) for richer social sharing — the meta tags already reference it.
- Live demo buttons: set `demo1`…`demo4` to a URL to show a "Live Demo" button on that project. Leave them `""` to hide (the default).
- Phone/WhatsApp: set `showPhone: true` in `js/data.js` to display your phone publicly (contact card + terminal `contact`).

## Editing content

Everything text lives in `js/data.js`: name, roles, intro/about paragraphs, skills, projects, education, certifications, and links. Edit that one file; the rest of the site updates automatically.

To edit the design system (colors, fonts, radius), change the CSS variables at the top of `css/style.css`.