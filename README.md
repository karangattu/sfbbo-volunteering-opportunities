# sfbbo-volunteering-opportunities

A minimal static site for browsing recurring SFBBO volunteer programs by month and experience level.

## What it does

- Keeps the public view focused on the essentials: the program list, filters, and a single detail panel.
- Works as a plain static site, so it is easy to publish on GitHub Pages.
- Registers a service worker so the core app shell is available offline after the first successful visit.

## Files

- `index.html`: main app entry point.
- `styles.css`: minimal layout and visual styling.
- `app.js`: client-side filtering, rendering, and service worker registration.
- `service-worker.js`: offline cache for the app shell.
- `site.webmanifest`: metadata for installable/offline-friendly browsers.
- `favicon.svg`: site icon.
- `data/programs.js`: volunteer program seed data.

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

- The first successful visit caches the core files.
- Later visits can continue to load the app even without a network connection.
- Offline support applies to the app shell and bundled dataset, not to external services or future dynamic content.
