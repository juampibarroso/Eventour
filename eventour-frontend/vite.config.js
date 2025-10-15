import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dejá la base ABSOLUTA para que los assets cuelguen de /assets en cualquier ruta
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
