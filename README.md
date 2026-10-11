# Yash Pathak · Portfolio

The static portfolio site for [Yash Pathak](https://github.com/YashPathak007), built to make three systems easy to understand before opening their repositories.

## Sections

- BreachWatch — evidence-first security operations
- CipherLink — private file exchange with controlled links
- FrameTrace — honest media evidence lab
- Engineering method — visible state, secure boundaries, and repeatable validation

## Run locally

Open `index.html` directly for a quick preview, or serve the folder with any static server:

```powershell
python -m http.server 4173
```

Then open http://localhost:4173.

## Deployment

GitHub Pages deploys this repository through `.github/workflows/pages.yml` on every push to `main`.

The portfolio is a static presentation layer. The three featured applications retain their own Dockerized backends and databases; GitHub Pages does not run those services.
