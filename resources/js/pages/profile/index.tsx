import Link from '@/components/link';
import AuthLayout from '@/layouts/auth-layout';
import type { SharedData } from '@/types';
import ProfileController from '@/wayfinder/actions/App/Http/Controllers/Settings/ProfileController';
import { Form, Head, usePage } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Grid,
    Loader,
    Modal,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconCards,
    IconCrown,
    IconFlame,
    IconPencil,
    IconShield,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';

interface Props {
    loginStreak: number;
    decks: number;
    cardsMastered: number;
}

export default function Profile({ loginStreak, decks, cardsMastered }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isMobile = useMediaQuery('(max-width: 800px)');
    const [editModalOpened, setEditModalOpened] = useState(false);

    const nameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);

    const createdAt = auth.user?.created_at
        ? new Date(auth.user.created_at).toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
          })
        : null;

    const stats = [
        {
            label: 'Login Streak',
            value: loginStreak,
            icon: IconFlame,
            color: 'orange',
            description: 'Keep learning every day!',
        },
        {
            label: 'Total Decks',
            value: decks,
            icon: IconCards,
            color: 'blue',
            description: 'Decks created',
        },
        {
            label: 'Cards Mastered',
            value: cardsMastered,
            icon: IconShield,
            color: 'green',
            description: 'Flashcards completed',
        },
    ];

    return (
        <>
            <Head title="Profile" />
            <Container size="lg" p="md">
                <Grid gutter="xl">
                    {/* Main Content */}
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        {/* Profile Header */}
                        <Card withBorder shadow="sm" radius="md" p="lg">
                            <Flex
                                justify="space-between"
                                align="flex-start"
                                gap="md"
                                wrap="wrap"
                            >
                                <Stack gap="xs" flex={1}>
                                    <Flex align="center" gap="sm" wrap="wrap">
                                        <Title order={2} size="h2">
                                            {auth.user?.name}
                                        </Title>
                                        <Badge
                                            variant="light"
                                            color="blue"
                                            leftSection="💎"
                                            size="lg"
                                        >
                                            {auth.user.user_info.gems} Gems
                                        </Badge>
                                    </Flex>
                                    <Text size="sm" c="dimmed">
                                        {auth.user?.email}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Joined {createdAt}
                                    </Text>
                                </Stack>
                                <Button
                                    variant="light"
                                    size="sm"
                                    leftSection={<IconPencil size={16} />}
                                    onClick={() => setEditModalOpened(true)}
                                >
                                    Edit Profile
                                </Button>
                            </Flex>
                        </Card>

                        <Divider my="xl" />

                        {/* Statistics Section */}
                        <Stack gap="md">
                            <Title order={3} size="h3">
                                Your Statistics
                            </Title>

                            <SimpleGrid
                                cols={{ base: 1, sm: 2, lg: 3 }}
                                spacing="md"
                            >
                                {stats.map((stat, index) => (
                                    <Card
                                        key={index}
                                        withBorder
                                        padding="lg"
                                        radius="md"
                                        shadow="xs"
                                    >
                                        <Flex gap="md" align="center">
                                            <Paper
                                                p="sm"
                                                radius="md"
                                                bg={`${stat.color}.0`}
                                            >
                                                <stat.icon
                                                    size={24}
                                                    color={`var(--mantine-color-${stat.color}-6)`}
                                                />
                                            </Paper>
                                            <Stack gap={2}>
                                                <Text size="xl" fw={700}>
                                                    {stat.value}
                                                </Text>
                                                <Text size="sm" fw={500}>
                                                    {stat.label}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {stat.description}
                                                </Text>
                                            </Stack>
                                        </Flex>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Grid.Col>

                    {/* Sidebar */}
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <Stack gap="md">
                            {/* Super Upgrade Card */}
                            <Card
                                withBorder
                                shadow="sm"
                                padding="lg"
                                radius="md"
                            >
                                <Stack gap="lg">
                                    <Flex gap="sm" align="flex-start">
                                        <IconCrown
                                            size={32}
                                            color="var(--mantine-color-yellow-6)"
                                        />
                                        <Stack gap={4}>
                                            <Text fw={600} size="lg">
                                                Go Super
                                            </Text>
                                            <Text size="sm" c="dimmed" lh={1.4}>
                                                Unlock an ad-free experience and
                                                premium features to accelerate
                                                your learning.
                                            </Text>
                                        </Stack>
                                    </Flex>

                                    <Stack gap="sm">
                                        <Link underline='never' href="/shop">
                                            <Button
                                                variant="gradient"
                                                gradient={{
                                                    from: 'yellow',
                                                    to: 'orange',
                                                }}
                                                size="md"
                                                fullWidth
                                                leftSection={
                                                    <IconCrown size={18} />
                                                }
                                            >
                                                Become Super
                                            </Button>
                                        </Link>
                                    </Stack>
                                </Stack>
                            </Card>

                            {/* Quick Actions */}
                            <Card withBorder padding="lg" radius="md">
                                <Stack gap="md">
                                    <Text fw={600} size="lg">
                                        Quick Actions
                                    </Text>
                                    <Stack gap="sm">
                                        <Link underline="never" href="/create">
                                            <Button
                                                variant="light"
                                                fullWidth
                                                leftSection={
                                                    <IconCards size={16} />
                                                }
                                            >
                                                Create New Deck
                                            </Button>
                                        </Link>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>

            {/* Edit Profile Modal */}
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Profile"
                size="md"
                centered
            >
                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                        onSuccess: () => setEditModalOpened(false),
                    }}
                    onError={(errors) => {
                        if (errors.name) {
                            nameInput.current?.focus();
                        } else if (errors.email) {
                            emailInput.current?.focus();
                        }
                    }}
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <Stack gap="md">
                            <TextInput
                                ref={nameInput}
                                id="name"
                                name="name"
                                label="Name"
                                withAsterisk
                                placeholder="Full name"
                                defaultValue={auth.user?.name ?? ''}
                                error={errors.name}
                            />

                            <TextInput
                                ref={emailInput}
                                id="email"
                                name="email"
                                label="Email"
                                withAsterisk
                                placeholder="mail@example.com"
                                defaultValue={auth.user?.email ?? ''}
                                error={errors.email}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                disabled={processing}
                                leftSection={
                                    processing ? <Loader size="xs" /> : null
                                }
                            >
                                Save Changes
                            </Button>

                            {recentlySuccessful && (
                                <Text size="sm" c="green">
                                    Profile updated successfully!
                                </Text>
                            )}
                        </Stack>
                    )}
                </Form>
            </Modal>
        </>
    );
}

Profile.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
