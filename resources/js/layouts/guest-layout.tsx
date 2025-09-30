import RootLayout from '@/layouts/root-layout';
import type { LayoutProps, SharedData } from '@/types';
import {
    dashboard,
    explore,
    login,
    logout,
    register,
} from '@/wayfinder/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    Burger,
    Button,
    Divider,
    Drawer,
    Flex,
    Group,
    ScrollArea,
    Stack,
    Text,
    useComputedColorScheme,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';
import classes from './guest.navbar.module.css';

export default function GuestLayout({ child }: LayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const { setColorScheme, clearColorScheme } = useMantineColorScheme();
    const computeColorScheme = useComputedColorScheme();
    const isMobile = useMediaQuery('(max-width: 800px)');
    const theme = useMantineTheme();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);

    return (
        <>
            <header
                className="sticky top-0 z-50 flex justify-between border-b p-5"
                style={{
                    borderColor: 'var(--mantine-color-default-border)',
                    background: 'var(--mantine-color-default)',
                }}
            >
                <nav>
                    <Flex gap={12}>
                        <Text
                            size="xl"
                            c="blue"
                            className="tracking-widest"
                            mx={12}
                            fw={800}
                        >
                            Memora
                        </Text>
                        <Group hidden={isMobile}>
                            {auth.user ? (
                                <>
                                    <Link href={dashboard()}>
                                        <Button>Dashboard</Button>
                                    </Link>
                                    <Link href={logout()}>
                                        <Button>Logout</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button>Log in</Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button>Register</Button>
                                    </Link>
                                </>
                            )}
                        </Group>
                    </Flex>
                </nav>
                <Group hidden={isMobile}>
                    <Button
                        onClick={() =>
                            setColorScheme(
                                computeColorScheme === 'dark'
                                    ? 'light'
                                    : 'dark',
                            )
                        }
                    >
                        {computeColorScheme === 'dark' ? (
                            <IconSun />
                        ) : (
                            <IconMoon />
                        )}
                    </Button>
                </Group>
                <Burger
                    opened={drawerOpened}
                    onClick={toggleDrawer}
                    hiddenFrom="md"
                />
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Menu"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />

                    {auth.user ? (
                        <>
                            <Link href={dashboard()} className={classes.link}>
                                Home
                            </Link>
                            <Link href={explore()} className={classes.link}>
                                Explore
                            </Link>
                            <Link href="/create" className={classes.link}>
                                Create Deck
                            </Link>
                            <Link href="/store" className={classes.link}>
                                Store
                            </Link>
                            <Link href="/profile" className={classes.link}>
                                Profile
                            </Link>
                        </>
                    ) : (
                        <Link href="/explore" className={classes.link}>
                            Explore
                        </Link>
                    )}

                    <Divider my={'md'} />
                    <Stack justify="center" pb="xl" px="sm">
                        {auth.user ? (
                            <Group justify="center" grow pb="md" px="md">
                                <Button variant="default">
                                    <Link href={dashboard()} as={'a'}>
                                        Dashboard
                                    </Link>
                                </Button>
                                <Button variant="filled">
                                    <Link href={logout()} as={'a'}>
                                        Logout
                                    </Link>
                                </Button>
                            </Group>
                        ) : (
                            <Group justify="center" grow pb="sm" px="md">
                                <Button variant="default">
                                    <Link href={login()} as={'a'}>
                                        Log in
                                    </Link>
                                </Button>
                                <Button>
                                    <Link href={register()} as={'a'}>
                                        Sign up
                                    </Link>
                                </Button>
                            </Group>
                        )}
                        <Button
                            px={'xl'}
                            fullWidth
                            onClick={() =>
                                setColorScheme(
                                    computeColorScheme === 'dark'
                                        ? 'light'
                                        : 'dark',
                                )
                            }
                        >
                            {computeColorScheme === 'dark' ? (
                                <IconSun />
                            ) : (
                                <IconMoon />
                            )}
                        </Button>
                    </Stack>
                </ScrollArea>
            </Drawer>

            <main>{child}</main>
        </>
    );
}

GuestLayout.layout = (page: React.ReactNode) => <RootLayout child={page} />;
