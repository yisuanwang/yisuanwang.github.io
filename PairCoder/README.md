# PairCoder — Project Page

Static project page for **PairCoder: Pair Programming Agents for Code-Driven Multimodal and Structured-Artifact Generation**.

Pure HTML/CSS/JS, no build step. Ready for GitHub Pages.

## Files
```
webpage/
├── index.html        # the page
├── style.css         # styling
├── script.js         # gallery tabs + copy-bibtex + scrollspy
├── .nojekyll         # serve files as-is (skip Jekyll)
└── assets/img/        # figures (teaser, framework, galleries, cross-model, plots)
```

## Preview locally
```bash
cd webpage
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on GitHub Pages
Pick one:

**A. Serve from `/docs`** — rename `webpage/` to `docs/`, push, then in the repo:
Settings → Pages → Source: `main` branch, folder `/docs`.

**B. Serve from a `gh-pages` branch** — copy the contents of `webpage/` to the root of a
`gh-pages` branch and enable Pages on that branch.

**C. Serve this folder as the site root** — if the repo only hosts the site, copy the
contents of `webpage/` to the repo root and set Pages Source to `main` → `/ (root)`.

All asset paths are relative, so the site works from any subpath.

## Updating figures
Replace the PNGs in `assets/img/` (same filenames). They were rendered from the paper's
PDF/PNG figures. To re-render a vector figure to PNG:
```python
import fitz  # PyMuPDF
d = fitz.open("figure.pdf")
d[0].get_pixmap(matrix=fitz.Matrix(2.2, 2.2), alpha=False).save("figure.png")
```

## TODO before publishing
- Fill in the `Paper` and `arXiv` button links in `index.html` (currently `#`).
- Optionally add real author homepage links (currently `#`).
