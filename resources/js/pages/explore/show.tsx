import AuthLayout from '@/layouts/auth-layout';
import { router, usePage } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Divider,
    Group,
    Paper,
    ScrollArea,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import React, { ReactNode, useState } from 'react';

type PageWithLayout = React.FC & {
    layout?: (page: ReactNode) => ReactNode;
};

interface User {
    name: string;
}

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    tags?: string[] | null;
}

interface Deck {
    id: number;
    uuid: string;
    title: string;
    description?: string | null;
    is_public?: boolean;
    flashcards?: Flashcard[] | null;
    owner: User;
}

const ExploreShow: PageWithLayout = () => {
    const { deck } = usePage().props as unknown as { deck: Deck };
    const flashcards = deck?.flashcards ?? [];
    const user = deck?.owner;
    const isMd = useMediaQuery('(min-width: 768px)');

    const INITIAL_SHOW = 10;
    const [visibleCount, setVisibleCount] = useState(
        Math.min(INITIAL_SHOW, flashcards.length),
    );

    const shareDeck = () => {
        navigator.clipboard.writeText(window.location.href);
        notifications.show({
            title: 'Link copied',
            message: `Deck link has been copied to clipboard`,
            color: 'green',
            autoClose: 3000,
        });
    };

    const importDeck = () => {
        router.post(`/decks/import/${deck.uuid}`);
    };
    return (
        <Stack gap="lg">
            {/* Header Section */}
            <Card withBorder shadow="sm" padding="lg">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Stack gap="xs" style={{ flex: 1 }}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap="xs">
                                <Title order={2} size="h1">
                                    {deck.title}
                                </Title>
                                {deck.description && (
                                    <Text c="dimmed" size="md">
                                        {deck.description}
                                    </Text>
                                )}
                            </Stack>
                            <Badge
                                size="lg"
                                color={deck?.is_public ? 'green' : 'gray'}
                                variant="filled"
                            >
                                {deck?.is_public ? 'Public' : 'Private'}
                            </Badge>
                        </Group>

                        <Group mt="sm">
                            <Button
                                onClick={importDeck}
                                size="md"
                                variant="filled"
                                color="blue"
                            >
                                Import Deck
                            </Button>
                            <Button
                                onClick={shareDeck}
                                size="md"
                                variant="outline"
                            >
                                Share Deck
                            </Button>
                        </Group>
                    </Stack>
                </Group>
            </Card>

            {/* Stats & Actions Card */}
            <Card withBorder shadow="sm" padding="lg">
                <Group justify="space-between">
                    <Stack gap="xs">
                        <Text fw={600} size="lg">
                            Deck Information
                        </Text>
                        <Group>
                            <Badge variant="light" color="blue">
                                {flashcards.length} cards
                            </Badge>
                            <Badge variant="light" color="grape">
                                Created by {user.name}
                            </Badge>
                        </Group>
                    </Stack>
                </Group>
            </Card>

            {/* Flashcards Section */}
            <Card withBorder shadow="sm" padding="lg">
                <Stack gap="md">
                    <Group justify="space-between">
                        <div>
                            <Text fw={700} size="xl">
                                Flashcards
                            </Text>
                            <Text c="dimmed" size="sm">
                                {flashcards.length} cards in this deck
                            </Text>
                        </div>
                    </Group>

                    <Divider />

                    <ScrollArea.Autosize mah={600}>
                        <Stack gap="md">
                            {flashcards.length === 0 ? (
                                <Paper withBorder p="xl" ta="center">
                                    <Text c="dimmed" size="lg">
                                        No flashcards in this deck yet.
                                    </Text>
                                </Paper>
                            ) : (
                                flashcards
                                    .slice(0, visibleCount)
                                    .map((flashcard, index) => (
                                        <Paper
                                            key={flashcard.id}
                                            withBorder
                                            p="lg"
                                            shadow="xs"
                                        >
                                            <Group
                                                justify="space-between"
                                                align="flex-start"
                                                wrap={isMd ? 'nowrap' : 'wrap'}
                                            >
                                                <Stack
                                                    gap="xs"
                                                    style={{ flex: 1 }}
                                                >
                                                    <Text fw={600} size="md">
                                                        {flashcard.question}
                                                    </Text>
                                                    <Text
                                                        c="dimmed"
                                                        style={{
                                                            whiteSpace:
                                                                'pre-wrap',
                                                            lineHeight: 1.6,
                                                        }}
                                                    >
                                                        {flashcard.answer}
                                                    </Text>
                                                </Stack>
                                                {flashcard.tags &&
                                                    flashcard.tags.length >
                                                        0 && (
                                                        <Group gap="xs">
                                                            {flashcard.tags
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        tagIndex,
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                tagIndex
                                                                            }
                                                                            size="sm"
                                                                            variant="light"
                                                                            color="gray"
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </Badge>
                                                                    ),
                                                                )}
                                                            {flashcard.tags
                                                                .length > 2 && (
                                                                <Badge
                                                                    size="sm"
                                                                    variant="dot"
                                                                    color="gray"
                                                                >
                                                                    +
                                                                    {flashcard
                                                                        .tags
                                                                        .length -
                                                                        2}
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                    )}
                                            </Group>
                                        </Paper>
                                    ))
                            )}
                        </Stack>
                    </ScrollArea.Autosize>

                    {flashcards.length > visibleCount && (
                        <Group justify="center" mt="md">
                            <Button
                                variant="light"
                                size="md"
                                onClick={() =>
                                    setVisibleCount(flashcards.length)
                                }
                            >
                                Show all {flashcards.length} flashcards
                            </Button>
                            <Button
                                variant="subtle"
                                size="md"
                                onClick={() => setVisibleCount(INITIAL_SHOW)}
                            >
                                Show less
                            </Button>
                        </Group>
                    )}
                </Stack>
            </Card>
        </Stack>
    );
};

ExploreShow.layout = (page: ReactNode) => <AuthLayout child={page} />;

export default ExploreShow;
