import CardStats from '@/components/card-stats';
import { DailyRewardNotification } from '@/components/daily-reward-notification';
import AuthLayout from '@/layouts/auth-layout';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Button,
    Container,
    Flex,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Paper,
    Group,
    Card,
    ThemeIcon,
    Badge,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconFileText, IconUpload, IconCrown } from '@tabler/icons-react';
import { useEffect } from 'react';

interface Deck {
    uuid: string;
    title: string;
    created_at: string;
    flashcards_count: number;
    status: string;
}

interface Props {
    decks: Deck[];
}

/* --- page-level types --- */
interface UserInfo {
    gems: number;
    is_super: boolean;
    subscription_plan: string;
    [k: string]: any;
}
interface User {
    user_info: UserInfo;
    [k: string]: any;
}
interface AuthProp {
    user: User;
}

interface RewardInfo {
    can_claim: boolean;
    final_gems: number;
    base_gems: number;
    has_subscription: boolean;
    total_gems: number;
}

interface FlashProps {
    success?: string;
    error?: string;
    [k: string]: any;
}

interface PageProps extends InertiaPageProps {
    auth: AuthProp;
    flash?: FlashProps;
    rewardInfo?: RewardInfo;
}

/* --- component --- */
export default function Dashboard({ decks }: Props) {
    const isMobile = useMediaQuery('(max-width: 800px)');
    const { props } = usePage<PageProps>();
    const user = props.auth.user;
    useEffect(() => {
        const flash = props.flash;
        if (flash?.success) {
            notifications.show({
                title: 'Reward Claimed! 🎉',
                message: flash.success,
                color: 'green',
                autoClose: 3000,
            });
        }

        if (flash?.error) {
            notifications.show({
                title: 'Error',
                message: flash.error,
                color: 'red',
                autoClose: 3000,
            });
        }
    }, [props.flash]);

    const totalCards = decks.reduce((sum, deck) => sum + deck.flashcards_count, 0);

    return (
        <>
            <Head title="Dashboard" />
            {props.rewardInfo && (
                <DailyRewardNotification rewardInfo={props.rewardInfo} />
            )}

            <Container size="xl" p="md">
                <Flex justify="space-between" align="center" mb="xl">
                    <Stack gap="xs">
                        <Title order={1} size="h2">
                            Your Decks
                        </Title>
                        <Text c="dimmed" size="lg">
                            {decks.length} decks • {totalCards} total cards
                        </Text>
                    </Stack>

                    {!isMobile && (
                        <Badge
                            variant="light"
                            color="yellow"
                            size="xl"
                            leftSection="💎"
                            styles={{
                                root: {
                                    paddingLeft: '12px',
                                    paddingRight: '16px',
                                    height: '40px'
                                }
                            }}
                        >
                            <Text fw={700} size="lg">
                                {user.user_info.gems}
                            </Text>
                        </Badge>
                    )}
                </Flex>

                <Group justify="space-between" mb="xl">
                    <Link href="/create" as="a">
                        <Button
                            leftSection={<IconUpload size={16} />}
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                            size={isMobile ? 'sm' : 'md'}
                        >
                            Create New Deck
                        </Button>
                    </Link>

                    {isMobile && (
                        <Badge
                            variant="light"
                            color="yellow"
                            size="lg"
                            leftSection="💎"
                        >
                            <Text fw={700} size="sm">
                                {user.user_info.gems}
                            </Text>
                        </Badge>
                    )}
                </Group>

                {isMobile ? (
                    <Stack gap="xl">
                        {user.user_info.subscription_plan == "free" && (
                            <Card withBorder p="lg" radius="md">
                                <Stack gap="md">
                                    <Flex align="center" gap="sm">
                                        <ThemeIcon size={40} variant="filled" color="yellow">
                                            <IconCrown size={20} />
                                        </ThemeIcon>
                                        <Stack gap={2}>
                                            <Text fw={600} size="lg">
                                                Go Super
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Unlock premium features
                                            </Text>
                                        </Stack>
                                    </Flex>

                                    <Stack gap="xs">
                                        <Text size="sm">• Ad-free experience</Text>
                                        <Text size="sm">• Unlimited decks</Text>
                                    </Stack>

                                    <Link href="/shop" as="a">
                                        <Button
                                            fullWidth
                                            variant="filled"
                                            color="yellow"
                                            leftSection={<IconCrown size={16} />}
                                        >
                                            Try Super Free
                                        </Button>
                                    </Link>
                                </Stack>
                            </Card>
                        )}

                        {/* Decks Grid */}
                        {decks.length === 0 ? (
                            <Paper withBorder p="xl" ta="center" radius="md">
                                <Stack gap="lg">
                                    <IconFileText size={60} color="var(--mantine-color-gray-5)" />
                                    <Stack gap="xs">
                                        <Title order={3} size="h3">
                                            No decks yet
                                        </Title>
                                        <Text c="dimmed" size="lg">
                                            Create your first deck to start learning
                                        </Text>
                                    </Stack>
                                    <Link href="/create" as="a">
                                        <Button
                                            leftSection={<IconUpload size={16} />}
                                            variant="gradient"
                                            gradient={{ from: 'blue', to: 'cyan' }}
                                            size="lg"
                                        >
                                            Create Your First Deck
                                        </Button>
                                    </Link>
                                </Stack>
                            </Paper>
                        ) : (
                            <SimpleGrid cols={1} spacing="lg">
                                {decks.map((deck) => (
                                    <CardStats
                                        key={deck.uuid}
                                        title={deck.title}
                                        href={deck.uuid}
                                        cards={deck.flashcards_count}
                                        created_at={deck.created_at}
                                        status={deck.status}
                                    />
                                ))}
                            </SimpleGrid>
                        )}
                    </Stack>
                ) : (
                    <Flex gap="xl" align="flex-start">
                        {/* Decks Grid */}
                        <div style={{ flex: 1 }}>
                            {decks.length === 0 ? (
                                <Paper withBorder p="xl" ta="center" radius="md">
                                    <Stack gap="lg">
                                        <IconFileText size={60} color="var(--mantine-color-gray-5)" />
                                        <Stack gap="xs">
                                            <Title order={3} size="h3">
                                                No decks yet
                                            </Title>
                                            <Text c="dimmed" size="lg">
                                                Create your first deck to start learning
                                            </Text>
                                        </Stack>
                                        <Link href="/create" as="a">
                                            <Button
                                                leftSection={<IconUpload size={16} />}
                                                variant="gradient"
                                                gradient={{ from: 'blue', to: 'cyan' }}
                                                size="lg"
                                            >
                                                Create Your First Deck
                                            </Button>
                                        </Link>
                                    </Stack>
                                </Paper>
                            ) : (
                                <SimpleGrid
                                    cols={2}
                                    spacing="lg"
                                    styles={{
                                        root: {
                                            '& > *': {
                                                minHeight: '200px',
                                            }
                                        }
                                    }}
                                >
                                    {decks.map((deck) => (
                                        <CardStats
                                            key={deck.uuid}
                                            title={deck.title}
                                            href={deck.uuid}
                                            cards={deck.flashcards_count}
                                            created_at={deck.created_at}
                                            status={deck.status}
                                        />
                                    ))}
                                </SimpleGrid>
                            )}
                        </div>
                        {user.user_info.subscription_plan == "free" && (
                            <Card
                                withBorder
                                p="lg"
                                radius="md"
                                style={{
                                    width: 320,
                                    position: 'sticky',
                                    top: 20
                                }}
                            >
                                <Stack gap="md">
                                    <Flex align="center" gap="sm">
                                        <ThemeIcon size={40} variant="filled" color="yellow">
                                            <IconCrown size={20} />
                                        </ThemeIcon>
                                        <Stack gap={2}>
                                            <Text fw={600} size="lg">
                                                Go Super
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                Unlock premium features
                                            </Text>
                                        </Stack>
                                    </Flex>

                                    <Stack gap="xs">
                                        <Text size="sm">• Ad-free experience</Text>
                                        <Text size="sm">• Unlimited decks</Text>
                                    </Stack>

                                    <Link href="/shop" as="a">
                                        <Button
                                            fullWidth
                                            variant="filled"
                                            color="yellow"
                                            leftSection={<IconCrown size={16} />}
                                            style={{ marginTop: 'auto' }}
                                        >
                                            Try Super Free
                                        </Button>
                                    </Link>
                                </Stack>
                            </Card>
                        )}
                    </Flex>
                )}
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
