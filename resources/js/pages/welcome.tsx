import HeroText from '@/components/hero-text';
import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <HeroText />
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <GuestLayout child={page} />;
