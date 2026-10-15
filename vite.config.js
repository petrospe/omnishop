import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

const codespaceName = process.env.CODESPACE_NAME;
const codespaceDomain =
    process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? 'app.github.dev';
const isCodespaces = process.env.CODESPACES === 'true' && Boolean(codespaceName);
const hmrHost =
    process.env.VITE_HMR_HOST ??
    (isCodespaces ? `${codespaceName}-5173.${codespaceDomain}` : '127.0.0.1');
const localhostOrigins =
    /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/;

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
        // public/hot must point at the browser-reachable Vite URL. That URL is
        // not the Laravel origin, so CORS has to allow the app host separately.
        origin: isCodespaces ? `https://${hmrHost}` : `http://${hmrHost}:5173`,
        cors: {
            origin: [
                localhostOrigins,
                /^https:\/\/.*\.app\.github\.dev(?::\d+)?$/,
            ],
        },
        hmr: isCodespaces
            ? {
                  host: hmrHost,
                  protocol: 'wss',
                  clientPort: 443,
              }
            : {
                  host: hmrHost,
              },
    },
});
