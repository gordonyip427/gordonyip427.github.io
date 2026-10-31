# Personal Academic Website — Dr Gordon (Kai Hou) Yip

Official personal and research group website for **Dr Gordon (Kai Hou) Yip** (Lecturer in Physics (AI), King's College London), hosted on GitHub Pages at **[www.gordonkhy.com](https://www.gordonkhy.com)**.

---

## 1. Quick Start: Running & Previewing Locally

You do **not** need to install Ruby gems or wrestle with Jekyll version conflicts on macOS to preview this website locally. A zero-dependency local builder and preview server ([`serve.py`](serve.py)) is included using built-in macOS Python and Ruby.

### Option A: Zero-Setup Local Preview (Recommended on macOS)
Open a terminal in this directory and run:

```bash
python3 serve.py
```

Then open **[http://localhost:4000](http://localhost:4000)** in your browser.
- To validate your YAML files and test-build the site into `_site/` without starting a server, run:
  ```bash
  python3 serve.py --build-only
  ```
- While `serve.py` is running, refreshing your browser automatically rebuilds any edits to `_data/*.yml`, `pages/*`, `index.html`, or `assets/css/style.css`.

### Option B: Standard Jekyll (Optional)
Because the repository is standard Jekyll (and built automatically by GitHub Pages on push), you can also use Jekyll directly if you have a Ruby environment installed:

```bash
bundle install
bundle exec jekyll serve
```

---

## 2. Repository Structure (Where Everything Lives)

Structured data lives in `_data/*.yml`, while introductory prose, application steps, and section layouts are written in `index.html` and `pages/*.md`:

```text
.
├── _config.yml                 # Site-wide settings (name, KCL role, email, office, external profile links)
├── CNAME                       # Custom domain configuration (www.gordonkhy.com)
├── index.html                  # Homepage template (hero introduction, PhD invitation copy, and loops for _data/)
├── serve.py                    # Zero-dependency local build & preview server (supports Liquid for/if/elsif/else)
├── _data/
│   ├── opportunities.yml       # PhD funding routes (general enquiries, K-CSC timeline) & postdoc/MSc/visiting info
│   ├── news.yml                # Recent news & event announcements shown on the homepage
│   ├── research.yml            # Research themes (pillars) and flagship initiatives (Ariel Mission, Ariel Data Challenge)
│   ├── publications.yml        # Publications grouped by year (uses homepage_selected: true for homepage highlights)
│   ├── cv.yml                  # Structured CV entries (appointments, education, teaching, service, leadership, awards, supervision)
│   └── outreach.yml            # Media, UK Parliament (STEM for Britain), hackathons & public engagement
├── pages/
│   ├── research.md             # /research/ page (research theme details, ESA Ariel mission graphic, consortia)
│   ├── opportunities.md        # /opportunities/ page (3-step application guide, PhD project areas, and funding routes)
│   ├── publications.md         # /publications/ page (full bibliography grouped by year)
│   ├── cv.md                   # /cv/ page (biography paragraph and loops over _data/cv.yml sections)
│   ├── outreach.md             # /outreach/ page
│   └── 404.html                # Custom 404 page
├── _layouts/
│   ├── default.html            # Master header, navigation bar, and footer
│   └── page.html               # Standard interior page header wrapper
└── assets/
    ├── css/style.css           # Site stylesheet (light/dark themes, responsive layout, print styles)
    └── img/
        ├── profile.jpg         # Profile portrait
        └── ink-wash-c/         # Ink-wash-c hero backdrops (light/dark) and research theme illustrations
```

> **Note on data files vs. page templates:**
> - **PhD recruitment:** The homepage PhD invitation (`index.html`), the 3-step application guide, and the PhD project areas (`pages/opportunities.md`) are written directly in those templates. The funding route cards (`phd_positions`) and postdoctoral/visiting opportunities (`other_opportunities`) are read from `_data/opportunities.yml`.
> - **Research themes & illustrations:** `_data/research.yml` defines each research pillar (`short_summary` is rendered on the homepage; `summary` and `key_papers` are rendered on `/research/`). Both `index.html` and `pages/research.md` match `pillar.id` (`diff-tau`, `chexanet`, `black-box`) to select the corresponding painted-paper illustration, so if you rename a `pillar.id`, update the `if / elsif` condition in both templates as well.
> - **CV sections:** Adding a new entry to an existing list in `_data/cv.yml` (`appointments`, `education`, `teaching`, `service`, `leadership`, `awards`, `supervision`, `skills`) updates `/cv/` automatically. If you add a brand-new top-level key to `_data/cv.yml`, also add a matching section loop in `pages/cv.md`.

---

## 3. Common Updates Cheat Sheet

### A. Updating PhD Opportunities & Funding Deadlines
1. **Homepage PhD invitation:** Edit Section `01 / PHD OPPORTUNITIES` in [`index.html`](index.html) to update the target entry cohort (e.g., `October 2027 entry`) or introductory copy.
2. **Application steps & project areas:** Edit Sections `01` and `02` in [`pages/opportunities.md`](pages/opportunities.md).
3. **Funding route details & K-CSC deadlines:** Edit `phd_positions:` in [`_data/opportunities.yml`](_data/opportunities.yml). Each entry's `status` field (e.g., `"Open for enquiries"`) is displayed next to its title on `/opportunities/`, and `details_checked` records when scheme deadlines were last verified.

### B. Adding a New Publication & Selecting Homepage Papers
Open [`_data/publications.yml`](_data/publications.yml) and add an entry under the relevant `year:` (or add a new `- year: 2027` block at the top):

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

- **To feature a paper in "Selected publications" on the homepage:**
  Set `homepage_selected: true` (setting `selected: true` alone will **not** place a paper on the homepage) and include `short_venue` and `contribution`:
  ```yaml
      short_venue: "Yip et al., MNRAS (2026)"
      homepage_selected: true
      contribution: "One-sentence summary of what the paper contributes."
  ```
  Keep the homepage selection small (typically 3 papers, one per research theme); `/publications/` displays the full record.

### C. Adding a News Highlight on the Homepage
Open [`_data/news.yml`](_data/news.yml) and add a new item at the top of the file:

```yaml
- date: "3 Nov 2026"
  badge: "Community event"
  title: "Headline of the announcement"
  summary: "1–2 sentence summary of the event, paper, or milestone."
  link: "https://..." # optional; omit if there is no external link
```

### D. Updating Your CV or Profile Photo
- **Web CV:** Edit [`_data/cv.yml`](_data/cv.yml) (and the opening biography paragraph in [`pages/cv.md`](pages/cv.md)).
- **Profile Photo:** Replace `assets/img/profile.jpg`.

---

## 4. Verifying & Publishing Changes (`www.gordonkhy.com`)

1. Build and verify locally:
   ```bash
   python3 serve.py --build-only
   ```
2. Check your current branch and push to the branch configured for GitHub Pages in this repository:
   ```bash
   git status -sb
   git add -A
   git commit -m "Update website content"
   git push origin HEAD
   ```
   GitHub Pages builds from the repository's configured default/Pages branch and deploys to **[https://www.gordonkhy.com](https://www.gordonkhy.com)**.
