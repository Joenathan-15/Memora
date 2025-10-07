import AuthLayout from '@/layouts/auth-layout';
import { router, usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    Center,
    Grid,
    Stack,
    Text,
    Timeline,
    Title,
} from '@mantine/core';
import { useMemo, useState } from 'react';

type Deck = { uuid: string; name?: string };
type Flashcard = {
    id: number | string;
    question: string;
    answer: string;
    next_review_date?: string;
    is_ai_generated: boolean;
};

interface Props {
    deck: Deck;
    dueCards: Flashcard[];
    futureCards: Flashcard[];
    stats: Record<string, any>;
}

export default function Show({
    deck,
    dueCards: initialDue,
    futureCards,
    stats,
}: Props) {
    const { props } = usePage();

    const [studyCards, setStudyCards] = useState<Flashcard[]>([...initialDue]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState<boolean>(false);

    const currentCard = useMemo(
        () => studyCards[currentIndex] ?? null,
        [studyCards, currentIndex],
    );

    const revealAnswer = () => setShowAnswer(true);

    const rateCard = (quality: number) => {
        if (!currentCard) return;

        try {
            // If you are using Wayfinder, uncomment the import at the top and use reviewRoute(deck.uuid, currentCard.id)
            // const action = reviewRoute(deck.uuid, currentCard.id);

            // Fallback: use the standard REST endpoint
            const action = `/decks/${deck.uuid}/flashcards/${currentCard.id}/review`;

            // Use Inertia to POST the review
            router.post(
                action,
                { quality },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        // remove current card locally
                        setStudyCards((prev) => {
                            const copy = [...prev];
                            copy.splice(currentIndex, 1);
                            // adjust index to avoid going out of bounds
                            const newIndex = Math.min(
                                currentIndex,
                                Math.max(0, copy.length - 1),
                            );
                            setCurrentIndex(newIndex);
                            return copy;
                        });
                        setShowAnswer(false);
                    },
                    onError: (err) => console.error('Review error', err),
                },
            );
        } catch (err) {
            console.error('rateCard error', err);
        }
    };

    console.log(currentCard)
    return (
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: 24 }}>
            {/* Stats Header */}
            <Grid gutter="md" mb="lg">
                <Grid.Col span={3}>
                    <Card shadow="sm" radius="md" p="md">
                        <Stack gap="xs">
                            <Title order={3}>{stats.due_today}</Title>
                            <Text c="dimmed" size="sm">
                                Due Today
                            </Text>
                        </Stack>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card shadow="sm" radius="md" p="md">
                        <Stack gap="xs">
                            <Title order={3}>{stats.new}</Title>
                            <Text c="dimmed" size="sm">
                                New Cards
                            </Text>
                        </Stack>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card shadow="sm" radius="md" p="md">
                        <Stack gap="xs">
                            <Title order={3}>{stats.learned}</Title>
                            <Text c="dimmed" size="sm">
                                Learning
                            </Text>
                        </Stack>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Card shadow="sm" radius="md" p="md">
                        <Stack gap="xs">
                            <Title order={3}>{stats.total_cards}</Title>
                            <Text c="dimmed" size="sm">
                                Total Cards
                            </Text>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Study Area */}
            {currentCard ? (
                <Card shadow="lg" radius="md" p="xl">
                    <div className="flex justify-between">
                        <Text size="sm" c="dimmed" mb="sm">
                            Card {currentIndex + 1} of {studyCards.length}
                        </Text>
                        <Text size="sm" c="dimmed" mb="sm">
                            {currentCard.is_ai_generated
                                ? 'This content was generated by an AI.'
                                : ''}
                        </Text>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <Text fw={600} size="sm">
                            Question:
                        </Text>
                        <Text size="lg" mt="xs">
                            {currentCard.question}
                        </Text>
                    </div>

                    {showAnswer && (
                        <div style={{ marginBottom: 24 }}>
                            <Text fw={600} size="sm">
                                Answer:
                            </Text>
                            <Text size="lg" mt="xs">
                                {currentCard.answer}
                            </Text>
                        </div>
                    )}

                    {!showAnswer ? (
                        <Center>
                            <Button onClick={revealAnswer} size="md">
                                Show Answer
                            </Button>
                        </Center>
                    ) : (
                        <Stack gap="sm">
                            <Text ta="center" c="dimmed">
                                How difficult was this card?
                            </Text>

                            <Grid>
                                <Grid.Col span={3}>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        color="red"
                                        onClick={() => rateCard(0)}
                                    >
                                        <Stack gap={0} align="center">
                                            <Text>Again</Text>
                                        </Stack>
                                    </Button>
                                    <Text c="dimmed" ta="center" size="xs">
                                        Complete blackout
                                    </Text>
                                </Grid.Col>

                                <Grid.Col span={3}>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        color="yellow"
                                        onClick={() => rateCard(3)}
                                    >
                                        <Stack gap={0} align="center">
                                            <Text>Hard</Text>
                                        </Stack>
                                    </Button>
                                    <Text c="dimmed" ta="center" size="xs">
                                        Correct but difficult
                                    </Text>
                                </Grid.Col>

                                <Grid.Col span={3}>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        color="blue"
                                        onClick={() => rateCard(4)}
                                    >
                                        <Stack gap={0} align="center">
                                            <Text>Good</Text>
                                        </Stack>
                                    </Button>
                                    <Text c="dimmed" size="xs" ta="center">
                                        Correct with hesitation
                                    </Text>
                                </Grid.Col>

                                <Grid.Col span={3}>
                                    <Button
                                        fullWidth
                                        variant="filled"
                                        color="green"
                                        onClick={() => rateCard(5)}
                                    >
                                        <Stack gap={0} align="center">
                                            <Text>Easy</Text>
                                        </Stack>
                                    </Button>
                                    <Text c="dimmed" size="xs" ta="center">
                                        Perfect response
                                    </Text>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    )}
                </Card>
            ) : (
                <Card
                    shadow="lg"
                    radius="md"
                    p="xl"
                    style={{ textAlign: 'center' }}
                >
                    <Title order={3}>🎉 All done for today!</Title>
                    <Text c="dimmed" mt="xs">
                        You've reviewed all due cards. Come back tomorrow for
                        more practice.
                    </Text>

                    {futureCards?.length > 0 && (
                        <div style={{ marginTop: 18 }}>
                            <Text fw={600} mb="xs">
                                Upcoming Reviews:
                            </Text>

                            <Timeline
                                active={-1}
                                bulletSize={16}
                                lineWidth={2}
                                align="left"
                            >
                                {futureCards.slice(0, 10).map((card) => (
                                    <Timeline.Item
                                        key={card.id}
                                        title={
                                            card.question.slice(0, 50) +
                                            (card.question.length > 50
                                                ? '…'
                                                : '')
                                        }
                                    >
                                        <Text size="xs" c="dimmed">
                                            Due: {card.next_review_date}
                                        </Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
