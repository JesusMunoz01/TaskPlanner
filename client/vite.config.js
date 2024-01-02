import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  loader: { '.js': 'jsx' },
  define: {
    __API__: `"${process.env.VITE_APP_BASE_URL}"` // wrapping in "" since it's a string
  },
})
