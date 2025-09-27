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
} from '@mantine/core';
import {
    IconUpload,
    IconFileText,
    IconPresentation,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import CardStats from '@/components/card-stats'

function Dashboard() {
    const isMobile = useMediaQuery('(max-width: 800px)');
    const isTiny = useMediaQuery('(max-width: 450px)');

    return (
        <>
            <Head title="Dashboard" />

            <Container fluid>
                <Stack gap="xl">

                    {/* Quick Upload Section */}
                    <Card withBorder>
                        <Stack gap="md">
                            <Group justify="space-between">
                                <div>
                                    <Text fw={500}>Quick Upload</Text>
                                    <Text size="sm" c="dimmed">
                                        Send us your study material and get ready-to-review flashcards in seconds.
                                    </Text>
                                </div>
                                <ThemeIcon size="xl" variant="light" color="blue">
                                    <IconUpload size={24} />
                                </ThemeIcon>
                            </Group>

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

                    <SimpleGrid
                        cols={{ base: 1, sm: 2, md: 3 }}
                    >
                        {[...Array(10)].map((x, i) =>
                            <CardStats />
                        )}
                    </SimpleGrid>
                </Stack>
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;

export default Dashboard;
