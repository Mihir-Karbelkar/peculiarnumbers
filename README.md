# Peculiar Numbers

A static Astro mathematics laboratory for exploring unusual integer patterns.

## Development

```sh
npm install
npm run dev
```

## Cloudflare Pages

This project is configured for Cloudflare Pages as a static Astro site.

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `22.16.0` (pinned in `.node-version` and `.nvmrc`)

The Cloudflare Pages output directory is recorded in `wrangler.toml` via `pages_build_output_dir = "dist"`. The same file also declares the static asset directory for Wrangler/Workers deployments.
