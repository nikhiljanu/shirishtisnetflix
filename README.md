# React + Vite

## Backend API and deployment

The Vite frontend is deployed to Vercel. Its standalone Express API is in the [`backend`](./backend) folder and is deployed to Render using the repository-root `render.yaml`.

To run the API locally, use a separate terminal:

```bash
cd backend
npm install
npm run dev
```

The currently available route is `GET /api/health`. Video routes (`GET /api/videos` and `GET /api/videos/:videoId`) are prepared for Cloudinary and intentionally return `503` until Cloudinary credentials and video public IDs are configured. See [`backend/README.md`](./backend/README.md) for setup details.

After the Render deployment, set `RENDER_BACKEND_URL` as a GitHub repository secret. The included Actions workflow calls its `/api/health` endpoint every ten minutes.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
