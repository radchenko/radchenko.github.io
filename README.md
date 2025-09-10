# radchenko.github.io

Minimal personal landing page hosted on GitHub Pages.

## Deploy

- GitHub Pages: Settings → Pages → Source: Deploy from a branch → Branch: `main` → Folder: `/ (root)`.
- Ensure “Enforce HTTPS” is enabled.
- `.nojekyll` is present to serve files as-is.

## Structure

- `index.html` — clean semantic HTML (About, Projects, Links).
- `assets/css/normalize.css` — normalize v8.
- `assets/css/styles.css` — minimal design system (CSS variables, light/dark via prefers-color-scheme, responsive container and typography).
- `assets/js/main.js` — tiny enhancement (current year in footer).

## Notes

- No build step; static files only.