# Raúl Montoliu — personal website

Static website ready for GitHub Pages. It has no runtime dependencies or build step.

## Publications

All publications are stored in `data/publications.js`. Add a new object to the `window.publications` array, using an existing record as a template. Required fields are `title`, `authors`, `doi`, `year`, `publisher`, `quarter`, `type`, and `slug`.

The page automatically sorts publications from newest to oldest and underlines Raúl Montoliu’s name in the author list.

## Local preview and deployment

Open `index.html` through a local static server. The GitHub Actions workflow in `.github/workflows/deploy.yml` deploys the `main` branch to GitHub Pages; set **Settings → Pages → Source** to **GitHub Actions** in the GitHub repository.
