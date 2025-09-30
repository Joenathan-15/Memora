import AuthLayout from '@/layouts/auth-layout';
import { Head, usePage } from '@inertiajs/react';
import {
    Container,
    Text,
    Stack,
    Divider,
    SimpleGrid,
    Card,
    Flex,
    Grid,
    Group,
    Button,
} from '@mantine/core';
import type { SharedData } from '@/types';
import { IconFlame, IconPencil } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Link from '@/components/link';

interface Props {
    streak: number;
}

export default function Profile({streak}: Props) {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useMediaQuery('(max-width: 800px)');

    const createdAt = auth.user?.created_at
        ? new Date(auth.user.created_at).toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        })
        : null;

    return (
        <>
            <Head title="Profile" />

            <Grid
                align="flex-start"
            >
                <Grid.Col span={9}>
                    <Flex align="center">
                        <Stack gap="sm" flex={1}>
                            <div>
                                <Text size="xl" fw={900}>
                                    {auth.user?.name}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {auth.user?.email}
                                </Text>
                            </div>
                            <Text size="sm">Joined {createdAt}</Text>
                        </Stack>

                        <Link href="/profile/edit">
                            <IconPencil style={{color: 'var(--mantine-color-dimmed)'}} />
                        </Link>
                    </Flex>


                    <Divider my={20} />

                    <Text size="xl" fw={900} mb={8}>
                        Statistics
                    </Text>

                    <SimpleGrid cols={{base: 2, md: 4}}>
                        <Card withBorder>
                            <Flex>
                            <span style={{alignContent: 'center', paddingRight: 'var(--mantine-spacing-md)'}}>
                                <IconFlame color="orange" />
                            </span>
                                <Flex direction="column">
                                    <Text size="xl">{streak}</Text>
                                    <Text size="xs" c="dimmed">Day streak</Text>
                                </Flex>
                            </Flex>
                        </Card>
                    </SimpleGrid>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text
                        size="xl"
                        className="items-center"
                        mb={8}
                        fw={800}
                        style={{ display: isMobile ? "none" : "block" }}
                    >
                        💎 {auth.user.user_info.gems}
                    </Text>


                    <Card withBorder>
                        <Stack gap="md">
                            <Stack gap="md">
                                <Stack gap="0" w="100%" align="center">
                                    <Text fw={500}>
                                        Using an ad blocker?
                                    </Text>
                                    <Text
                                        fw={500}
                                        size="sm"
                                        c="dimmed"
                                        ta="center"
                                    >
                                        Stay sharp with Super and skip the
                                        ads
                                    </Text>
                                </Stack>
                            </Stack>

                            <Group gap="sm" align="center">
                                <Button
                                    variant="filled"
                                    size={isMobile ? 'sm' : 'md'}
                                    w="100%"
                                >
                                    Try Super for Free
                                </Button>
                                <Button
                                    variant="subtle"
                                    size={isMobile ? 'sm' : 'md'}
                                    w="100%"
                                >
                                    Disable ad blocker
                                </Button>
                            </Group>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>
        </>
    );
}

Profile.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
