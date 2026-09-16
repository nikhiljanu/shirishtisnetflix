# Shrishti's Netflix API

Standalone Express API for serving Cloudinary-hosted videos to the Vercel frontend.

## Start locally

1. Copy `.env.example` to `.env` and set `FRONTEND_URL`.
2. Run `npm install` inside this `backend` folder.
3. Run `npm run dev`.

The service runs at `http://localhost:5000` by default.

## Routes

- `GET /api/health` returns service health information. Use this endpoint for Render and an uptime monitor.
- `GET /api/videos?limit=25&cursor=...` lists Cloudinary upload videos.
- `GET /api/videos/:videoId` returns an individual Cloudinary video.

The video routes return `503` until `CLOUDINARY_URL` is configured. Do not expose Cloudinary credentials to Vercel or browser code.

## Render

The repository-root `render.yaml` deploys this directory as the Render web service. On Render, set `FRONTEND_URL` to the Vercel production URL and add `CLOUDINARY_URL` as a secret environment variable.
