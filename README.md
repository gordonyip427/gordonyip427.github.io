# Personal Academic Website — Dr Gordon (Kai Hou) Yip

Official academic and research group website for **Dr Gordon (Kai Hou) Yip** (Lecturer in Physics (AI), King's College London), hosted on GitHub Pages at **[https://gordonyip427.github.io](https://gordonyip427.github.io)**.

---

## 1. Quick Start: Running & Previewing Locally

You do **not** need to install Ruby gems or manage a local Jekyll environment on macOS to preview this website. A zero-dependency local builder and live-reload preview server ([`serve.py`](serve.py)) is included using built-in macOS Python and Ruby.

### Option A: Zero-Setup Local Preview (Recommended)
Open a terminal in this directory and run:

```bash
python3 serve.py
```

Then open **[http://localhost:4000](http://localhost:4000)** in your browser.
- To validate your YAML files and build the static site into `_site/` without starting a server:
  ```bash
  python3 serve.py --build-only
  ```
- While `serve.py` is running, refreshing your browser automatically rebuilds any edits to `_config.yml`, `_data/*.yml`, `pages/*`, `index.html`, or `assets/*`.

### Option B: Standard Jekyll (Optional)
Because the repository uses standard Jekyll templates and front matter (built automatically by GitHub Pages on push), you can also run Jekyll directly if you have a Ruby environment installed:

```bash
bundle install
bundle exec jekyll serve
```

---

## 2. Repository Structure

Structured academic records live in `_data/*.yml`, while page layouts and prose live in `index.html`, `_layouts/*.html`, and `pages/*`:

```text
.
├── _config.yml                 # Site-wide settings (name, KCL role, email, office, external profile URLs)
├── index.html                  # Full-screen homepage (folio bio card, PhD CTA, social links, 3D Ice Giant hero)
├── serve.py                    # Zero-dependency local build & preview server (renders Liquid & YAML into _site/)
├── _data/
│   ├── opportunities.yml       # PhD studentships (general enquiries, K-CSC timeline) & KCL project/visiting routes
│   ├── research.yml            # Core research pillars (with responsive illustrations) & mission/software initiatives
│   ├── publications.yml        # Refereed & unrefereed papers grouped by year
│   ├── cv.yml                  # Appointments, education, teaching modules, leadership, service, and supervision
│   └── news.yml                # Public engagement, media, and community milestones (rendered on /cv/)
├── pages/
│   ├── research.md             # /research/ — Research themes & consortia/software/benchmarks
│   ├── opportunities.md        # /opportunities/ — How to apply, supervisory style, PhD studentships & other routes
│   ├── publications.md         # /publications/ — External bibliographic indexes (NASA ADS, arXiv) & full paper list
│   ├── CV.md                   # /cv/ — Appointments, education, teaching, leadership, public engagement & supervision
│   └── 404.html                # Custom 404 page
├── _layouts/
│   ├── default.html            # Master HTML shell, theme persistence (light/dark), mobile drawer & scroll reveal
│   └── page.html               # Interior ledger-style page wrapper (/research/, /publications/, /opportunities/, /cv/)
└── assets/
    ├── css/
    │   ├── style.css           # Primary stylesheet (Folio homepage & Ledger interior pages, light/dark themes)
    │   └── rubble-ring.css     # Deep-space scrim and token overrides for the homepage 3D planet backdrop
    ├── js/
    │   └── rubble-ring/
    │       ├── rubble-ring.js  # WebGL 3D Ice Giant, differential zonal bands & Keplerian rubble ring engine
    │       └── vendor/
    │           └── three.min.js # Bundled Three.js r147 runtime
    └── img/
        ├── profile.jpg         # Profile portrait
        ├── favicon.svg         # Site favicon
        └── painted-paper/      # Responsive WebP artwork for the research pillars on /research/
```

---

## 3. 3D Ice Giant & Keplerian Rubble Ring Hero (`rubble-ring.js`)

The homepage (`index.html`) features a real-time 3D WebGL background ([`assets/js/rubble-ring/rubble-ring.js`](assets/js/rubble-ring/rubble-ring.js)) styled by [`assets/css/rubble-ring.css`](assets/css/rubble-ring.css):

- **Stationary Ice Giant with Flowing Zonal Bands:** The planetary sphere remains anchored on the right side of the viewport and tilted toward the left-hand bio card (`system.rotation.set(0.24, -0.18, 0.44)`), while a custom 4-tap 3D Simplex noise GLSL shader drives counter-streaming zonal wind bands and high-altitude methane-ice cirrus streaks across latitudes.
- **Keplerian 3D Rubble Belt & Shepherd Moon Wakes:** Renders 3,200 instanced 3D dented icosahedral boulders (1,800 on narrow/mobile screens) orbiting at Keplerian velocities ($\omega \propto r^{-3/2}$), paired with a translucent multi-ringlet dust sheet (`fwidth` anti-aliased), mutual analytic planet/ring shadows, and an embedded ring-gap shepherd moon carving spiral density wakes.
- **High-Efficiency 60 FPS Design:** Uses passive `pointer-events: none` with a gentle, heavily damped cursor parallax ($\pm 1.5^\circ$ sway), avoiding `OrbitControls` drag hijacking or per-frame projection matrix rebuilds.

### Customizing the 3D Scene via `data-*` Attributes
You can adjust the framing or rock count directly on the `<div data-rubble-ring>` element in [`index.html`](index.html):

```html
<div
  class="rubble-ring rubble-ring--background rubble-ring--scrim"
  data-rubble-ring
  data-cam-dist="6.0"
  data-offset-x="0.27"
  data-rocks="3200"
  data-parallax="true"
  aria-hidden="true">
</div>
```

| Attribute | Default | Description |
| :--- | :--- | :--- |
| `data-cam-dist` | `6.0` | Camera distance from the planet center (`6.0` = `1.75×` hero close-up; `7.6` = medium-close; `4.7` = macro flyby). |
| `data-offset-x` | `0.27` | Horizontal frustum shift placing the planet on the right side of desktop viewports (`>= 900px`). |
| `data-rocks` | `3200` | Number of instanced 3D boulders in the ring belt (automatically defaults to `1800` below `900px` width). |
| `data-parallax` | `true` | Enables subtle ambient cursor parallax while keeping the planet anchored. |

---

## 4. Common Content Updates Cheat Sheet

### A. Updating Profile Links or Contact Info
Edit [`_config.yml`](_config.yml) under `author:`. Changes to `role`, `institution`, `office`, `email`, `google_scholar`, `github`, `linkedin`, `kcl_profile`, or `ads_library` automatically propagate across the homepage and interior pages.

### B. Updating PhD Opportunities & Funding Deadlines
1. **Homepage PhD line:** Edit `<p class="hero-phd-line">` in [`index.html`](index.html) (e.g., to update `October 2027 entry`).
2. **Application guidance & supervisory style:** Edit Section `01` in [`pages/opportunities.md`](pages/opportunities.md).
3. **Studentship routes & K-CSC timelines:** Edit `phd_positions:` and `other_opportunities:` in [`_data/opportunities.yml`](_data/opportunities.yml).

### C. Adding a New Publication
Open [`_data/publications.yml`](_data/publications.yml) and add an entry under the relevant `year:` block (or create a new `- year: 2027` block at the top):

```yaml
- year: 2026
  items:
    - authors: "<strong>Yip, K. H.</strong>, Coauthor, A., & Coauthor, B."
      year: "2026"
      title: "Title of Your Paper"
      venue: "Monthly Notices of the Royal Astronomical Society (MNRAS), 538(3), 1690–1719"
      url: "https://doi.org/10.1093/..."
      url_label: "DOI"
```

### D. Updating Research Themes or Mission Initiatives
Open [`_data/research.yml`](_data/research.yml):
- `pillars:` controls the illustrated research theme rows in Section `01` of `/research/`.
- `initiatives:` controls the consortia, software packages, and benchmarks in Section `02` of `/research/`.

### E. Updating Your CV, Supervision, or Public Engagement
- **Appointments, education, teaching, leadership, service & supervision:** Edit [`_data/cv.yml`](_data/cv.yml).
- **Public engagement & community milestones:** Edit [`_data/news.yml`](_data/news.yml) (rendered under Section `03 · Leadership & public engagement` on `/cv/`).
- **Portrait photo:** Replace `assets/img/profile.jpg`.

---

## 5. Building & Publishing (`https://gordonyip427.github.io`)

1. Verify that all YAML files parse cleanly and build into `_site/`:
   ```bash
   python3 serve.py --build-only
   ```
2. Stage, commit, and push to `master`:
   ```bash
   git status -sb
   git add -A
   git commit -m "Update website content"
   git push origin master
   ```
   GitHub Pages automatically builds from `master` and publishes to **[https://gordonyip427.github.io](https://gordonyip427.github.io)**.
