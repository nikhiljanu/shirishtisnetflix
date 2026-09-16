# Shrishti's Netflix API

Standalone Express API for serving Cloudinary-hosted videos to the Vercel frontend.

## Start locally

1. Copy `.env.example` to `.env` and set `FRONTEND_URL`.
2. Run `npm install` inside this `backend` folder.
3. Run `npm run dev`.

The service runs at `http://localhost:5000` by default.

## Routes

- `GET /api/health` returns service health information. Use this endpoint for Render and an uptime monitor.
- `GET /api/videos` is reserved for the Cloudinary video list.
- `GET /api/videos/:videoId` is reserved for an individual Cloudinary video.

The video routes intentionally return `503` until Cloudinary credentials and the chosen video metadata/public-ID format are supplied. Do not expose `CLOUDINARY_API_SECRET` to Vercel or to browser code.

## Render

The repository-root `render.yaml` deploys this directory as the Render web service. On Render, set `FRONTEND_URL` to the Vercel production URL and add the three `CLOUDINARY_*` values later through Render environment variables.
