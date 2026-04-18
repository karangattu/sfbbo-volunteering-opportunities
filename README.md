# sfbbo-volunteering-opportunities

A simple static site that shows the SFBBO logo and a clean catalog of volunteering opportunities from the images in `assets/`.

## What it does

- Shows the SFBBO logo up top.
- Displays each volunteering opportunity as a simple card with its logo and a short summary.
- Stays static and offline-friendly for GitHub Pages.

## Files

- `index.html`: main app entry point.
- `styles.css`: minimal layout and visual styling.
- `app.js`: renders the opportunity cards.
- `service-worker.js`: offline cache for the app shell and logo assets.
- `site.webmanifest`: metadata for installable/offline-friendly browsers.
- `favicon.svg`: site icon.
- `assets/`: opportunity logos used in the catalog.

## Run locally

Serve the site over HTTP so the service worker can register:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

To use it:

1. Push to `main`.
2. In the repository settings, enable GitHub Pages and select **GitHub Actions** as the source.
3. The workflow publishes the static files without any build step.

## Offline behavior

- The first successful visit caches the app shell and logo assets.
- Later visits can continue to load the app even without a network connection.
