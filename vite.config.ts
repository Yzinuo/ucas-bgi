import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    // GitHub Pages serves project sites from /<repository>/.
    base: env.BASE_PATH || '/',
    plugins: [react()],
  }
})
