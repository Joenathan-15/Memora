import { usePage } from "@inertiajs/react";
import type { SharedData } from "@/types";
import { Box } from '@mantine/core';
import { useMantineColorScheme, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import RootLayout from '@/layouts/root-layout';
import { LayoutProps } from '@/types';
import Navbar from '@/components/navbar';
import classes from '@/components/navbar/index.module.css';
import BottomNavbar from '@/components/bottom-navbar';

function AuthLayout({ child }: LayoutProps) {
    const isMobile = false;
    document.body.dataset.loaded = "true";

    return (
        <>
            <Navbar />
            <BottomNavbar />

            <Box
                component="main"
                className={classes.mainContent}
                style={{
                    minHeight: '100vh',
                    padding: isMobile ? 'var(--mantine-spacing-md)' : 'var(--mantine-spacing-xl)',
                    paddingTop: isMobile ? '80px' : 'var(--mantine-spacing-xl)',
                }}
            >
                {child}
            </Box>
        </>
    );
}

AuthLayout.layout = (page: React.ReactNode) => <RootLayout child={page} />;

export default AuthLayout;
