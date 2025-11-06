# Generic App Template

This template runs a Next.js app on port 4444 and can export to GitHub Pages. Root scripts also provide simple generators for Node and Python starters.

## Requirements
- Node 22 or newer
- Python 3 or newer
- npm

## Quick start
```bash
npm install
npm run setup
cd src/projects/hello_next
npm install
npm run dev    # opens on http://localhost:4444
```

## Production preview
```bash
npm run build
npm run start  # serves on http://localhost:4444
```

## Export for GitHub Pages
```bash
npm run build:ghpages
# the static site is written to _site at the repo root
```

If this is a project page under username.github.io/repo
the default base path is set to /hello_next automatically by the build script. Change it with NEXT_PUBLIC_BASE_PATH if needed.

## Scripts of interest
- root: `npm run setup` creates the base work tree
- project: `npm run dev` runs the Next app on port 4444
- project: `npm run build:ghpages` writes a static site to `../../_site`

## License
MIT. See LICENSE.
