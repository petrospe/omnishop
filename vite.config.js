import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'redesigned-tribble-947v5x4x652974x-5173.app.github.dev', // Βάλ' το ακριβές URL του Vite σου χωρίς το https://
        },
    },
});
