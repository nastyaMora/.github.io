# Moranote — Tattoo Artist Portfolio

A static, responsive portfolio website with no build step or runtime dependencies.

## Publish on GitHub Pages

1. Extract this archive into the root of your repository so `index.html` is at the repository root.
2. On GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, choose `main` and `/ (root)`, then save.

## Project files

- `index.html` — English page content, SEO and social-preview metadata.
- `css/styles.css` — responsive dark-theme layout, carousel and image-viewer styling.
- `js/gallery.js` and `js/gallery-data.js` — carousel controls, zoom viewer and photo data.
- `images/` — optimized WebP portfolio images.
- `favicon.ico` — the supplied site favicon.
- `manus-routes.json` — the single-page route manifest.

## Carousel and zoom controls

Use the arrow zones at the left and right edges of an image to move backward or forward. The carousels wrap around at either end; keyboard users can focus a carousel and press the left or right arrow key. Click a photo to open the enlarged viewer. Use **+** and **−** to change magnification, **Fit** to reset, and **Close** or **Esc** to leave the viewer. At higher zoom, scroll to inspect the image. Images retain their original aspect ratios and load lazily.

All portfolio photos are WebP and under 500 KB. After the site has a public GitHub Pages URL, replace the relative `og:image` and `twitter:image` values in `index.html` with the full public image URL for best social-link previews.
