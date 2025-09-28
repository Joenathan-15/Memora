import '../css/app.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider
                defaultColorScheme="dark"
                theme={{
                    defaultRadius: 'lg',
                }}
            >
                <App {...props} />
            </MantineProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
