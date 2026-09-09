# Vyas Mittal — Portfolio

Personal portfolio site. Hand-written HTML, CSS and JavaScript — no framework, no build
step, no dependencies. Open `index.html` and it runs.

## Structure

```
index.html                    all the content lives here
favicon.svg
dev-server.py                 local preview server that disables caching
assets/css/styles.css         design tokens + every rule, in section order
assets/js/main.js             portrait, menu, scroll state, reveals, copy-to-clipboard
assets/img/                   put your hero portrait here (see its README.txt)
assets/files/                 the downloadable resume PDF
```

## The hero portrait

`assets/img/profile.webp` is the photo with its background removed, cropped tight and exported
at 880 × 1243 / 102 KB. If neither `profile.webp` nor `profile.png` loads, the hero falls back
to a "VM" monogram, so the page never breaks. `assets/img/README.txt` has the notes for
swapping in a new photo later.

## Run it locally

```bash
python dev-server.py
```

Then open <http://localhost:4173>. Use this rather than `python -m http.server` — it sends
`Cache-Control: no-store`, so your CSS edits actually show up on reload.

## Editing

- **Text, projects, links** — `index.html`. Each project is one `<article class="project">`.
  Adding `class="project-flip"` puts the artwork on the right instead of the left.
- **Colours, type, spacing** — the `:root` block at the top of `styles.css`. The site is
  dark-only, so there is one palette and no theme switching. The orange is one variable:
  `--accent`.
- **Resume** — replace `assets/files/Vyas-Mittal-Resume.pdf`, keeping the filename. The contact
  section shows a rendered preview of page one, so re-render it after any change:

  ```bash
  pip install pypdfium2 pillow
  python -c "import pypdfium2 as p; from PIL import Image; i=p.PdfDocument('assets/files/Vyas-Mittal-Resume.pdf')[0].render(scale=2.2).to_pil().convert('RGB'); i=i.resize((640, round(i.height*640/i.width)), Image.LANCZOS); i.save('assets/img/resume-preview.webp', quality=82, method=6)"
  ```

  It is an image rather than an embedded PDF because iOS Safari will not render a PDF inside an
  iframe.
- **Project covers** — each one is the real site running in an `<iframe>`, not a screenshot,
  so the card is never out of date. The iframe is laid out at 1280 px wide and scaled down by
  `--frame-scale`, which `main.js` recalculates whenever the card resizes. A full-bleed `<a>`
  sits over it so a click opens the site; the iframe itself has `pointer-events: none`.
  All four sites currently send no `X-Frame-Options` or CSP `frame-ancestors` header — if one
  ever starts blocking framing, its card will go blank and will need a screenshot instead.

## Deploying

It is a static site, so anything works — Vercel, Netlify, Cloudflare Pages, GitHub Pages, or
plain shared hosting. Upload the whole folder; there is nothing to build.

For Vercel: `vercel --prod` from this directory, or point a Vercel project at the repo and
leave the build command empty with the output directory set to `.`.

**When you redeploy after changing CSS or JS**, bump the `?v=2` on the two asset links at the
top and bottom of `index.html` (to `?v=3`, and so on). That is what forces returning visitors'
browsers to pick up the new files instead of the cached ones.

## Notes

- Dark-only by design — no light theme, no toggle. `color-scheme: dark` on `:root` keeps
  scrollbars and form controls dark to match.
- Motion is gated behind `prefers-reduced-motion`.
- There is a print stylesheet, so Ctrl+P gives a readable one-pager.
