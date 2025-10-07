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
    Container,
    ActionIcon,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconMoon, IconSun, IconHome, IconCompass, IconPlus, IconUser, IconLogout } from '@tabler/icons-react';
import classes from './guest.navbar.module.css';

export default function GuestLayout({ child }: LayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const { setColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme();
    const isMobile = useMediaQuery('(max-width: 800px)');
    const theme = useMantineTheme();
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);

    const toggleTheme = () => {
        setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <header
                className="sticky top-0 z-50 border-b"
                style={{
                    borderColor: 'var(--mantine-color-default-border)',
                    background: 'var(--mantine-color-body)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Container size="xl">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href={auth.user ? dashboard() : '/'} className="flex items-center gap-2 no-underline">
                            <Text
                                size="xl"
                                fw={900}
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'cyan' }}
                                className="tracking-tight"
                            >
                                Memora
                            </Text>
                        </Link>

                        {/* Desktop Navigation */}
                        <Group hidden={isMobile} gap="md">
                            {auth.user ? (
                                <>
                                    <Group gap="sm">
                                        <Link href={dashboard()}>
                                            <Button
                                                variant="subtle"
                                                leftSection={<IconHome size={16} />}
                                                size="sm"
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href={explore()}>
                                            <Button
                                                variant="subtle"
                                                leftSection={<IconCompass size={16} />}
                                                size="sm"
                                            >
                                                Explore
                                            </Button>
                                        </Link>
                                        <Link href="/create">
                                            <Button
                                                variant="subtle"
                                                leftSection={<IconPlus size={16} />}
                                                size="sm"
                                            >
                                                Create
                                            </Button>
                                        </Link>
                                    </Group>
                                    <Group gap="xs">
                                        <Link href="/profile">
                                            <Button
                                                variant="subtle"
                                                leftSection={<IconUser size={16} />}
                                                size="sm"
                                            >
                                                Profile
                                            </Button>
                                        </Link>
                                        <Link href={logout()}>
                                            <Button
                                                variant="outline"
                                                color="red"
                                                leftSection={<IconLogout size={16} />}
                                                size="sm"
                                            >
                                                Logout
                                            </Button>
                                        </Link>
                                    </Group>
                                </>
                            ) : (
                                <Group gap="sm">
                                    <Link href={explore()}>
                                        <Button variant="subtle" size="sm">
                                            Explore
                                        </Button>
                                    </Link>
                                    <Link href={login()}>
                                        <Button variant="default" size="sm">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href={register()}>
                                        <Button size="sm">
                                            Sign up
                                        </Button>
                                    </Link>
                                </Group>
                            )}

                            {/* Theme Toggle */}
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                onClick={toggleTheme}
                                aria-label="Toggle color scheme"
                            >
                                {computedColorScheme === 'dark' ? (
                                    <IconSun size={18} />
                                ) : (
                                    <IconMoon size={18} />
                                )}
                            </ActionIcon>
                        </Group>

                        {/* Mobile Menu Button */}
                        <Group visibleFrom="md" hidden>
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                onClick={toggleTheme}
                                aria-label="Toggle color scheme"
                            >
                                {computedColorScheme === 'dark' ? (
                                    <IconSun size={18} />
                                ) : (
                                    <IconMoon size={18} />
                                )}
                            </ActionIcon>
                        </Group>

                        <Burger
                            opened={drawerOpened}
                            onClick={toggleDrawer}
                            hiddenFrom="md"
                            size="sm"
                        />
                    </div>
                </Container>
            </header>

            {/* Mobile Drawer */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title={
                    <Text fw={700} size="lg">
                        Menu
                    </Text>
                }
                hiddenFrom="md"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Divider my="sm" />

                    <Stack gap="sm" p="md">
                        {auth.user ? (
                            <>
                                <Link href={dashboard()} className={classes.link} onClick={closeDrawer}>
                                    <Group gap="sm">
                                        <IconHome size={18} />
                                        <Text>Dashboard</Text>
                                    </Group>
                                </Link>
                                <Link href={explore()} className={classes.link} onClick={closeDrawer}>
                                    <Group gap="sm">
                                        <IconCompass size={18} />
                                        <Text>Explore</Text>
                                    </Group>
                                </Link>
                                <Link href="/create" className={classes.link} onClick={closeDrawer}>
                                    <Group gap="sm">
                                        <IconPlus size={18} />
                                        <Text>Create Deck</Text>
                                    </Group>
                                </Link>
                                <Link href="/profile" className={classes.link} onClick={closeDrawer}>
                                    <Group gap="sm">
                                        <IconUser size={18} />
                                        <Text>Profile</Text>
                                    </Group>
                                </Link>
                            </>
                        ) : (
                            <Link href={explore()} className={classes.link} onClick={closeDrawer}>
                                <Group gap="sm">
                                    <IconCompass size={18} />
                                    <Text>Explore</Text>
                                </Group>
                            </Link>
                        )}
                    </Stack>

                    <Divider my="md" />

                    <Stack p="md" gap="md">
                        {/* Theme Toggle in Drawer */}
                        <Button
                            fullWidth
                            variant="light"
                            onClick={toggleTheme}
                            leftSection={
                                computedColorScheme === 'dark' ? (
                                    <IconSun size={16} />
                                ) : (
                                    <IconMoon size={16} />
                                )
                            }
                        >
                            {computedColorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>

                        {/* Auth Buttons in Drawer */}
                        {auth.user ? (
                            <Stack gap="sm">
                                <Link href={logout()} as="a" onClick={closeDrawer}>
                                    <Button
                                        fullWidth
                                        variant="outline"
                                        color="red"
                                        leftSection={<IconLogout size={16} />}
                                    >
                                        Sign Out
                                    </Button>
                                </Link>
                            </Stack>
                        ) : (
                            <Stack gap="sm">
                                <Link href={login()} as="a" onClick={closeDrawer}>
                                    <Button fullWidth variant="default">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href={register()} as="a" onClick={closeDrawer}>
                                    <Button fullWidth>
                                        Sign up
                                    </Button>
                                </Link>
                            </Stack>
                        )}
                    </Stack>
                </ScrollArea>
            </Drawer>

            <main>{child}</main>
        </>
    );
}

GuestLayout.layout = (page: React.ReactNode) => <RootLayout child={page} />;
