# LLL Tools

A small suite of mobile-friendly, client-side file tools. Pick a file, view it on your
phone — nothing is uploaded to a server.

**Live:** https://lll-tools.pages.dev/

## Tools

| Path    | Tool            | Opens              |
|---------|-----------------|--------------------|
| `/html` | HTML Viewer     | `.html`, `.htm`    |
| `/md`   | Markdown Viewer | `.md`, `.markdown` |
| `/pdf`  | *(planned)*     | `.pdf`             |
| `/csv`  | *(planned)*     | `.csv`             |

## Structure

```
lll-tools/
├── index.html          landing page (links to each tool)
├── shared/             shared across all tools — edit once, applies everywhere
│   ├── brand.css       palette, logo, common UI styles
│   ├── i18n.js         language list + common translations + switcher engine
│   ├── logo.svg
│   ├── favicon.svg
│   └── vendor/         local copies of third-party libs (offline-capable)
│       ├── marked.min.js
│       └── purify.min.js
├── html/index.html     HTML Viewer
└── md/index.html       Markdown Viewer
```

## Adding a new tool

1. Create a folder (e.g. `csv/`) with an `index.html`.
2. Link `../shared/brand.css` and `../shared/i18n.js`.
3. Provide only the tool-specific strings to `LLL_I18N.init(...)`; common strings
   (Back, New tab, Choose file, language names) come from `shared/i18n.js`.
4. Add a card to the landing page.

## Languages

Japanese (default), English, Simplified Chinese, Traditional Chinese, Korean, Malay.
The chosen language is shared across all tools and remembered across visits.

## Notes

- The Markdown viewer sanitizes rendered output (DOMPurify) so untrusted `.md` files
  can't run scripts.
- All third-party libraries are vendored locally under `shared/vendor/` — no CDN calls.
