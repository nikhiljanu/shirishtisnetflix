import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Expose the public API base URL as import.meta.env.API_URL.
  // Do not add secrets here: every exposed value is bundled for browsers.
  envPrefix: ['VITE_', 'API_'],
})
