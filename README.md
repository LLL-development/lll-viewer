# LLL HTML Viewer

A single-page web app for opening `.html` files directly in a phone browser — no need to download the file and hunt for an app that can render it.

**Live:** https://lll-development.github.io/lll-html-viewer/

## How to use

1. Open the link on your phone (or desktop).
2. Tap **Choose file** and pick a `.html` or `.htm` file.
3. It renders right away.

Use **New tab** in the viewer if a page doesn't display correctly inside the frame.

## How it works

- The selected file is turned into a temporary blob URL and loaded into an `<iframe>`.
- Everything runs client-side. **Nothing is uploaded to a server** — the file never leaves the device.
- No libraries, no build step, no external fonts. Works offline once the page has loaded.

## Files

- `index.html` — the entire app (markup, styles, and script in one file).

## Notes

- The viewer runs opened files with their scripts and styles intact, so they render faithfully. It's intended for trusted, inhouse files.