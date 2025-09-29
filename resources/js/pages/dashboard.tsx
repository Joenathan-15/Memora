import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import {
    Text,
    Card,
    Button,
    Group,
    Stack,
    Container,
    SimpleGrid,
    ThemeIcon,
    Flex,
} from '@mantine/core';
import {
    IconUpload,
    IconFileText,
    IconPresentation,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import CardStats from '@/components/card-stats'

interface Deck {
    uuid: string;
    title: string;
    created_at: string;
}

interface Props {
    decks: Deck[];
}

export default function Dashboard({decks}: Props) {
    const isMobile = useMediaQuery('(max-width: 800px)');

    return (
        <>
            <Head title="Dashboard" />

            <Container fluid>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap="xl"
                    justify={{ sm: 'center' }}
                    align="flex-start"
                >
                    <SimpleGrid
                        cols={{ base: 1, lg: 3, xs: 2 }}
                    >
                        {decks.map((deck, i) => (
                            <CardStats key={i} title={deck.title} href={deck.uuid} />
                        ))}
                    </SimpleGrid>

                    {/* Quick Upload Section */}
                    <Stack
                        gap={"md"}
                        style={{
                            position: 'sticky',
                            top: 20,
                            alignSelf: 'flex-start',
                        }}
                    >
                        <Card withBorder>
                            <Stack gap="md">
                                <Flex align="center" justify="space-between" gap="lg">
                                    <div>
                                        <Text fw={500}>Quick Upload</Text>
                                        <Text size="sm" c="dimmed">
                                            Send us your study material and get flashcards in seconds.
                                        </Text>
                                    </div>
                                    <ThemeIcon size="xl" variant="light" color="blue">
                                        <IconUpload size={24} />
                                    </ThemeIcon>
                                </Flex>

                                <Group gap="sm">
                                    <Button
                                        leftSection={<IconFileText size={16} />}
                                        variant="default"
                                        size={isMobile ? 'sm' : 'md'}
                                    >
                                        Upload PDF
                                    </Button>
                                    <Button
                                        leftSection={<IconPresentation size={16} />}
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
                                        <Text fw={500}>Using an ad blocker?</Text>
                                        <Text fw={500} size="sm" c="dimmed" ta="center">Stay sharp with Super and skip the ads</Text>
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
                </Flex>
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;

