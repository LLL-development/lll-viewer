# LLL Viewer

An all-in-one, mobile-friendly, client-side file viewer. Pick a file, view it on your
phone — nothing is uploaded to a server.

Part of the **LLL Series OSS** — building open-source tools from scratch using AI.

**Live:** https://lll-viewer.pages.dev/

## Tools

| Path    | Tool            | Opens              |
|---------|-----------------|--------------------|
| `/html` | HTML Viewer     | `.html`, `.htm`    |
| `/md`   | Markdown Viewer | `.md`, `.markdown` |
| `/pdf`  | PDF Viewer      | `.pdf`             |
| `/csv`  | CSV Viewer      | `.csv`, `.tsv`     |

## Structure

```
lll-viewer/
├── index.html          landing page (links to each tool)
├── shared/             shared across all tools — edit once, applies everywhere
│   ├── brand.css       palette, logo, common UI styles
│   ├── i18n.js         language list + common translations + switcher engine
│   ├── nav.js          global navbar (jump between tools)
│   ├── logo.svg
│   ├── favicon.svg
│   └── vendor/         local copies of third-party libs (offline-capable)
│       ├── marked.min.js
│       ├── purify.min.js
│       ├── papaparse.min.js
│       └── pdfjs/      (pdf.min.js + worker)
├── html/index.html     HTML Viewer
├── md/index.html       Markdown Viewer
├── pdf/index.html      PDF Viewer
└── csv/index.html      CSV Viewer
```

## Adding a new tool

1. Create a folder (e.g. `xml/`) with an `index.html`.
2. Link `../shared/brand.css`, `../shared/nav.js`, and `../shared/i18n.js`.
3. Build the navbar and pass its language slot to i18n:
   `var langHost = LLL_NAV.build(host, { base: "../", active: "xml" });`
4. Provide only the tool-specific strings to `LLL_I18N.init(...)`; common strings
   (Back, New tab, Choose file, language names) come from `shared/i18n.js`.
5. Add the tool to the navbar list in `shared/nav.js` and a card on the landing page.

## Languages

Japanese (default), English, Simplified Chinese, Traditional Chinese, Korean, Malay.
The chosen language is shared across all tools and remembered across visits.

## Notes

- The Markdown viewer sanitizes rendered output (DOMPurify) so untrusted `.md` files
  can't run scripts.
- All third-party libraries are vendored locally under `shared/vendor/` — no CDN calls.