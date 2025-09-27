import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <div>welcome to hell</div>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <GuestLayout child={page} />;
