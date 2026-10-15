import '../css/app.css';
import './i18n';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { applyLocale } from './i18n';

router.on('navigate', (event) => {
    applyLocale(event.detail.page.props.locale);
});

const appName = import.meta.env.VITE_APP_NAME || 'Omnishop';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        applyLocale(props.initialPage.props.locale);

        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
