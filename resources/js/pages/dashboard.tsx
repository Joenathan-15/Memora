import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import {
    Text,
    Title,
    Grid,
    Card,
    Button,
    Group,
    Stack,
    Progress,
    Container,
    SimpleGrid,
    ThemeIcon,
    Flex,
} from '@mantine/core';
import {
    IconUpload,
    IconCards,
    IconTrendingUp,
    IconBrain,
    IconFileText,
    IconPresentation,
    IconArrowRight,
    IconPlus,
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

function Dashboard() {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const stats = [
        {
            title: 'Total Flashcards',
            value: '284',
            icon: IconCards,
            color: 'blue'
        },
        {
            title: 'Files Uploaded',
            value: '15',
            icon: IconFileText,
            color: 'green'
        },
        {
            title: 'Study Progress',
            value: '67%',
            icon: IconTrendingUp,
            color: 'orange'
        },
        {
            title: 'AI Conversions',
            value: '12',
            icon: IconBrain,
            color: 'purple'
        }
    ];

    const recentActivity = [
        {
            title: 'Mathematics - Chapter 5',
            description: 'Generated 15 flashcards from PDF',
            time: '2 hours ago',
            type: 'pdf'
        },
        {
            title: 'Chemistry Presentation',
            description: 'Generated 23 flashcards from PowerPoint',
            time: '1 day ago',
            type: 'ppt'
        },
        {
            title: 'History Notes',
            description: 'Generated 8 flashcards from PDF',
            time: '3 days ago',
            type: 'pdf'
        }
    ];

    const quickActions = [
        {
            name: 'Start Study Session',
            icon: IconBrain,
            color: 'green',
        },
        {
            name: 'Review Difficult Cards',
            icon: IconFileText,
            color: 'yellow'
        },
        {
            name: 'Create Manual Card',
            icon: IconPlus,
            color: 'blue',
        }
    ]

    return (
        <>
            <Head title="Dashboard" />

            <Container fluid>
                <Stack gap="xl">
                    {/* Welcome Section */}
                    <div>
                        <Title order={1} size={isMobile ? 'h2' : 'h1'}>
                            Welcome back! 👋
                        </Title>
                        <Text c="dimmed" size={isMobile ? 'sm' : 'md'} mt="xs">
                            Upload your PDFs or PowerPoints, and let AI turn them into smart, interactive flashcards instantly.
                        </Text>
                    </div>

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

                    {/* Quick Actions */}
                    <Card withBorder>
                        <Text fw={500} pb={20}>Quick Actions</Text>

                        <SimpleGrid
                            cols={isMobile ? 2 : 3}
                            spacing={isMobile ? 'md' : 'lg'}
                        >
                            {quickActions.map((action) => (
                                <Card key={action.name} withBorder w={300} className="hover:bg-gray-200">
                                    <Group justify="space-between">
                                        <div>
                                            <Text fw={700} size={isMobile ? 'lg' : 'xl'}>
                                                {action.name}
                                            </Text>
                                            <Flex>
                                                <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>
                                                    Go to page
                                                </Text>
                                                <IconArrowRight size={17} color="gray" />
                                            </Flex>
                                        </div>
                                        <ThemeIcon color={action.color} variant="light" size="lg">
                                            <action.icon size={20} />
                                        </ThemeIcon>
                                    </Group>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Card>

                    {/* Stats Grid */}
                    <SimpleGrid
                        cols={isMobile ? 2 : 4}
                        spacing={isMobile ? 'md' : 'lg'}
                    >
                        {stats.map((stat) => (
                            <Card key={stat.title} withBorder>
                                <Group justify="space-between">
                                    <div>
                                        <Text size="xs" c="dimmed" fw={700} style={{ textTransform: 'uppercase' }}>
                                            {stat.title}
                                        </Text>
                                        <Text fw={700} size={isMobile ? 'lg' : 'xl'}>
                                            {stat.value}
                                        </Text>
                                    </div>
                                    <ThemeIcon color={stat.color} variant="light" size="lg">
                                        <stat.icon size={20} />
                                    </ThemeIcon>
                                </Group>
                            </Card>
                        ))}
                    </SimpleGrid>

                    {/* Content Grid */}
                    <Grid>
                        <Grid.Col span={isMobile ? 12 : 8}>
                            <Card withBorder>
                                <Stack gap="md">
                                    <Group justify="space-between">
                                        <Text fw={500}>Recent Activity</Text>
                                        <Button variant="subtle" size="xs">
                                            View All
                                        </Button>
                                    </Group>

                                    <Stack gap="sm">
                                        {recentActivity.map((activity, index) => (
                                            <Group key={index} wrap="nowrap" gap="md">
                                                <ThemeIcon
                                                    color={activity.type === 'pdf' ? 'red' : 'orange'}
                                                    variant="light"
                                                >
                                                    {activity.type === 'pdf' ?
                                                        <IconFileText size={16} /> :
                                                        <IconPresentation size={16} />
                                                    }
                                                </ThemeIcon>

                                                <div style={{ flex: 1 }}>
                                                    <Text fw={500} size="sm">
                                                        {activity.title}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {activity.description}
                                                    </Text>
                                                </div>

                                                <Text size="xs" c="dimmed">
                                                    {activity.time}
                                                </Text>
                                            </Group>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={isMobile ? 12 : 4}>
                            <Stack gap="md">
                                {/* Study Progress */}
                                <Card withBorder>
                                    <Stack gap="md">
                                        <Text fw={500}>Study Progress</Text>

                                        <div>
                                            <Group justify="space-between" mb="xs">
                                                <Text size="sm">Mathematics</Text>
                                                <Text size="sm" c="dimmed">85%</Text>
                                            </Group>
                                            <Progress value={85} color="blue" />
                                        </div>

                                        <div>
                                            <Group justify="space-between" mb="xs">
                                                <Text size="sm">Chemistry</Text>
                                                <Text size="sm" c="dimmed">67%</Text>
                                            </Group>
                                            <Progress value={67} color="green" />
                                        </div>

                                        <div>
                                            <Group justify="space-between" mb="xs">
                                                <Text size="sm">History</Text>
                                                <Text size="sm" c="dimmed">45%</Text>
                                            </Group>
                                            <Progress value={45} color="orange" />
                                        </div>
                                    </Stack>
                                </Card>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AuthLayout child={page} />;

export default Dashboard;
