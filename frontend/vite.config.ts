import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['bwxor.com', 'www.bwxor.com']
    },
    base: "/",
    optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg'],
    },
    build: {
        rollupOptions: {
            external: [],
        },
    },
    define: {
        global: 'window',
    },
})
