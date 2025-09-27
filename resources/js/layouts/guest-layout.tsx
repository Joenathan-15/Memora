import { usePage } from "@inertiajs/react";
import type { SharedData, LayoutProps } from "@/types";
import {
    welcome,
    login,
    logout,
    register,
} from '@/wayfinder/routes';
import { Flex } from '@mantine/core';
import { useMantineColorScheme, Group } from '@mantine/core';
import Link from '@/components/link';
import RootLayout from '@/layouts/root-layout';
import { home as homeRoute } from '@/wayfinder/routes';

export default function GuestLayout({ child }: LayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const { setColorScheme, clearColorScheme } = useMantineColorScheme();

    return (
        <>
            <header className="flex justify-between border-b" style={{ borderColor: 'var(--mantine-color-default-border)' }}>
                <nav>
                    <Flex gap={12}>
                        <Link mr={10} href={welcome()}>
                            Memora
                        </Link>
                        {auth.user ? (
                            <>
                                <Link href={homeRoute()}>Dashboard</Link>
                                <Link href={logout()}>Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link href={login()}>Log in</Link>
                                <Link href={register()}>Register</Link>
                            </>
                        )}
                    </Flex>
                </nav>
                <Group>
                    <Link onClick={() => setColorScheme('light')}>Light</Link>
                    <Link onClick={() => setColorScheme('dark')}>Dark</Link>
                    <Link onClick={() => setColorScheme('auto')}>Auto</Link>
                    <Link onClick={clearColorScheme}>Clear</Link>
                </Group>
            </header>

            <main>{child}</main>
        </>
    );
}

GuestLayout.layout = (page: React.ReactNode) => <RootLayout child={page} />;


