import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const hmrHost =
    process.env.VITE_HMR_HOST ??
    'redesigned-tribble-947v5x4x652974x-5173.app.github.dev';
const isCodespaces = hmrHost.endsWith('.app.github.dev');

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
        origin: isCodespaces
            ? `https://${hmrHost}`
            : `http://${hmrHost}:5173`,
        hmr: {
            host: hmrHost,
            protocol: isCodespaces ? 'wss' : 'ws',
            clientPort: isCodespaces ? 443 : 5173,
        },
    },
});
