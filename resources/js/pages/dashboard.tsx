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
import {
    IconFileText,
    IconPresentation,
    IconUpload,
} from '@tabler/icons-react';

interface Deck {
    uuid: string;
    title: string;
    created_at: string;
    flashcards_count: number;
}

interface Props {
    decks: Deck[];
}

export default function Dashboard({ decks }: Props) {
    const isMobile = useMediaQuery('(max-width: 800px)');
    const { props } = usePage();
    const user = props.auth.user;

    return (
        <>
            <Head title="Dashboard" />

            <Container fluid>
                <Grid
                    align="flex-start"
                >
                    <Grid.Col span={9}>
                        <SimpleGrid cols={{ base: 1, lg: 3, xs: 2 }}>
                            {decks.map((deck, i) => (
                                <CardStats
                                    key={i}
                                    title={deck.title}
                                    href={deck.uuid}
                                    cards={deck.flashcards_count}
                                    created_at={deck.created_at}
                                />
                            ))}
                        </SimpleGrid>
                    </Grid.Col>

                    {/* Quick Upload Section */}
                    <Grid.Col span={3}>
                    <Stack
                        gap={'md'}
                        style={{
                            position: 'sticky',
                            top: 20,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Text size="xl" className='items-center'>💎 <span className='font-bold'>{user.user_info.gems}</span></Text>
                        <Card withBorder>
                            <Stack gap="md">
                                <Flex
                                    align="center"
                                    justify="space-between"
                                    gap="lg"
                                >
                                    <div>
                                        <Text fw={500}>Quick Upload</Text>
                                        <Text size="sm" c="dimmed">
                                            Send us your study material and get
                                            flashcards in seconds.
                                        </Text>
                                    </div>
                                    <ThemeIcon
                                        size="xl"
                                        variant="light"
                                        color="blue"
                                    >
                                        <IconUpload size={24} />
                                    </ThemeIcon>
                                </Flex>

                                <Group gap="sm">
                                    <Button
                                        leftSection={<IconFileText size={16} />}
                                        variant="default"
                                        size={isMobile ? 'sm' : 'md'}
                                    >
                                        <Link href={`/create`} as="a">
                                            Upload PDF
                                        </Link>
                                    </Button>
                                    <Button
                                        leftSection={
                                            <IconPresentation size={16} />
                                        }
                                        variant="default"
                                        size={isMobile ? 'sm' : 'md'}
                                    >
                                        Upload PowerPoint
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>

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
                    </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
