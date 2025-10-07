import { usePage } from '@inertiajs/react';
import { Text, Flex, Group, ActionIcon, Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBell, IconCrown } from '@tabler/icons-react';
import Link from '@/components/link';

export function TopBar() {
    const { props } = usePage();
    const isMobile = useMediaQuery('(max-width: 800px)');
    const user = props.auth.user;

    return (
        <>
            {isMobile ? (
                <header
                    className="sticky top-0 z-50 border-b"
                    style={{
                        backgroundColor: 'var(--mantine-color-body)',
                        borderColor: 'var(--mantine-color-default-border)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <div className="flex items-center justify-between p-4">
                        {/* Logo Section */}
                        <Link href="/home" underline="never">
                            <Flex align="center" gap="xs">
                                <Text
                                    size="xl"
                                    fw={900}
                                    variant="gradient"
                                    gradient={{ from: 'blue', to: 'cyan' }}
                                    className="tracking-tight"
                                >
                                    Memora
                                </Text>
                            </Flex>
                        </Link>

                        {/* Right Section - Gems & Notifications */}
                        <Group gap="sm">
                            {/* Gems Display */}
                            <Badge
                                variant="light"
                                color="yellow"
                                size="lg"
                                leftSection="💎"
                                styles={{
                                    root: {
                                        paddingLeft: '8px',
                                        paddingRight: '12px',
                                    }
                                }}
                            >
                                <Text fw={700} size="sm">
                                    {user.user_info.gems}
                                </Text>
                            </Badge>

                        </Group>
                    </div>

                    {/* Super User Promo Banner */}
                    {user.user_info.subscription_plan == "free" && (
                        <div
                            className="px-4 py-2 text-center"
                            style={{
                                backgroundColor: 'var(--mantine-color-yellow-light)',
                                borderBottom: '1px solid var(--mantine-color-yellow-outline)',
                            }}
                        >
                            <Link href="/shop" underline="never">
                                <Group gap="xs" justify="center">
                                    <IconCrown size={16} color="var(--mantine-color-yellow-7)" />
                                    <Text size="sm" c="yellow.7" fw={600}>
                                        Go Super - Unlock Premium Features!
                                    </Text>
                                    <IconCrown size={16} color="var(--mantine-color-yellow-7)" />
                                </Group>
                            </Link>
                        </div>
                    )}
                </header>
            ) : null}
        </>
    );
}
