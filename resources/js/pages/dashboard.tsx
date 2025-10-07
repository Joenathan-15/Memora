import CardStats from '@/components/card-stats';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    Container,
    Flex,
    Grid,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconFileText, IconUpload } from '@tabler/icons-react';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { DailyRewardNotification } from '@/components/daily-reward-notification';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

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
    const { props } = usePage<PageProps>(); // <-- typed usePage
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

    return (
        <>
            <Head title="Dashboard" />
            {props.rewardInfo && <DailyRewardNotification rewardInfo={props.rewardInfo} />}

            <Container fluid>
                <Grid align="flex-start">
                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <SimpleGrid cols={{ base: 1, lg: 3, xs: 2 }}>
                            {decks.map((deck) => (
                                <CardStats
                                    key={deck.uuid} // use stable unique key
                                    title={deck.title}
                                    href={deck.uuid}
                                    cards={deck.flashcards_count}
                                    created_at={deck.created_at}
                                    status={deck.status}
                                />
                            ))}
                        </SimpleGrid>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 3 }}>
                        <Stack
                            gap={'md'}
                            style={{
                                position: 'sticky',
                                top: 20,
                                alignSelf: 'flex-start',
                            }}
                        >
                            <Text
                                size="xl"
                                className="items-center"
                                style={{ display: isMobile ? 'none' : 'block' }}
                            >
                                💎 <span className="font-bold">{user.user_info.gems}</span>
                            </Text>

                            <Card withBorder>
                                <Stack gap="md">
                                    <Flex align="center" justify="space-between" gap="lg">
                                        <div>
                                            <Text fw={500}>Quick Upload</Text>
                                            <Text size="sm" c="dimmed">
                                                Send us your study material and get
                                                flashcards in seconds.
                                            </Text>
                                        </div>
                                        <ThemeIcon size="xl" variant="light" color="blue">
                                            <IconUpload size={24} />
                                        </ThemeIcon>
                                    </Flex>

                                    <Group gap="sm">
                                        <Link href="/create" as="a">
                                            <Button leftSection={<IconFileText size={16} />} variant="default" size={isMobile ? 'sm' : 'md'}>
                                                Upload PDF
                                            </Button>
                                        </Link>
                                    </Group>
                                </Stack>
                            </Card>

                            <Card withBorder>
                                <Stack gap="md">
                                    <Stack gap="md">
                                        <Stack gap="0" w="100%" align="center">
                                            <Text fw={500}>Using an ad blocker?</Text>
                                            <Text fw={500} size="sm" c="dimmed" ta="center">
                                                Stay sharp with Super and skip the ads
                                            </Text>
                                        </Stack>
                                    </Stack>

                                    <Group gap="sm" align="center">
                                        <Button variant="filled" size={isMobile ? 'sm' : 'md'} w="100%">
                                            Try Super for Free
                                        </Button>
                                        <Button variant="subtle" size={isMobile ? 'sm' : 'md'} w="100%">
                                            Disable ad blocker
                                        </Button>
                                    </Group>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
