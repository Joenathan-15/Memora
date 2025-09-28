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
    title: string;
    created_at: string;
}

interface Props {
    decks: Deck[];
}

function Dashboard({decks}: Props) {
    const isMobile = useMediaQuery('(max-width: 800px)');

    return (
        <>
            <Head title="Dashboard" />

            <Container fluid>
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    gap="xl"
                    justify={{ sm: 'center' }}
                >
                    <SimpleGrid
                        cols={{ base: 2, lg: 3 }}
                        // className="group"
                    >
                        {decks.map((deck, i) => (
                            <>
                                <CardStats key={i} title={deck.title} />
                            </>
                        ))}
                    </SimpleGrid>

                    {/* Quick Upload Section */}
                    <div>
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
                                        variant="filled"
                                        size={isMobile ? 'sm' : 'md'}
                                    >
                                        Upload PDF
                                    </Button>
                                    <Button
                                        leftSection={<IconPresentation size={16} />}
                                        variant="outline"
                                        size={isMobile ? 'sm' : 'md'}
                                    >
                                        Upload PowerPoint
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>
                    </div>
                </Flex>
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;

export default Dashboard;
