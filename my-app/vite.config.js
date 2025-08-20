
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/E-Commerce-Website-Generator-/', // must match the repo name exactly
  plugins: [react()] // remove this line if not using React
})
