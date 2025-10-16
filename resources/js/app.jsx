import '../css/app.css';
import './bootstrap';
// import './chat.js';
import "./../../public/fichiers/base.css";
import '@coreui/coreui/dist/css/coreui.min.css'

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#2a7348',
        // Ajoutez la propriété 'size' pour augmenter la hauteur de la barre de progression
        size: 50, // La valeur est en pixels (px), augmentez selon vos besoins

        showSpinner: false,
    },
});
