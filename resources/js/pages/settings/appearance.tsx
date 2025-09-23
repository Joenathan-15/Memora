import { Head } from '@inertiajs/react';
import CenteredCardLayout from '@/layouts/centered-card-layout';
import AppearanceTabs from '@/components/appearance-tabs';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <AppearanceTabs />
        </>
    );
}

Appearance.layout = (page: React.ReactNode) => (
    <CenteredCardLayout child={page} title="Appearance settings" description="Update your account's appearance settings" />
);
