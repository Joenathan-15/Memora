import AuthLayout from '@/layouts/auth-layout';
import { useForm, usePage } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Switch,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import React, { ReactNode, useState } from 'react';

type PageWithLayout = React.FC & {
    layout?: (page: ReactNode) => ReactNode;
};

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    tags?: string[] | null;
}

interface Deck {
    id: number;
    title: string;
    description?: string | null;
    is_public?: boolean;
    flashcards?: Flashcard[] | null;
}

interface DeckForm {
    title: string;
    description: string;
    is_public: boolean;
}

const EditDeck: PageWithLayout = () => {
    const { deck } = usePage().props as unknown as { deck: Deck };
    const flashcards = deck?.flashcards ?? [];
    const isMd = useMediaQuery('(min-width: 768px)');
    const [newCardModalOpened, { open: openNewCard, close: closeNewCard }] =
        useDisclosure(false);
    const [editCardModalOpened, { open: openEditCard, close: closeEditCard }] =
        useDisclosure(false);

    // always-visible edit form
    const formDeck = useForm<DeckForm>({
        title: deck?.title ?? '',
        description: deck?.description ?? '',
        is_public: !!deck?.is_public,
    });

    const formCard = useForm<DeckForm>({
        deck_id: deck.id,
        question: '',
        answer: '',
    });

    const formEditCard = useForm<DeckForm>({
        flashCard_id: 0,
        question: '',
        answer: '',
    });

    const INITIAL_SHOW = 10;
    const [visibleCount, setVisibleCount] = useState(
        Math.min(INITIAL_SHOW, flashcards.length),
    );

    const handleDelete = (id: number) => {
        if (!confirm('Delete this flashcard?')) return;
        formCard.delete(`/flashcards/${id}`);
    };

    const handleDeckSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        formDeck.put(`/decks/${deck.id}`);
    };

    const handleDeckCancel = () => {
        formDeck.setData('title', deck.title ?? '');
        formDeck.setData('description', deck.description ?? '');
        formDeck.setData('is_public', !!deck.is_public);
        formDeck.clearErrors();
    };

    const handleCardSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        formCard.post(`/flashcards`);
        formCard.reset();
    };

    const handleCardUpdate = (e?: React.FormEvent) => {
        e?.preventDefault();
        formEditCard.put(`/flashcards/${formEditCard.data.flashCard_id}`);
        formEditCard.reset();
        closeEditCard();
    };

    return (
        <>
            <Modal
                opened={editCardModalOpened}
                onClose={closeEditCard}
                title="Edit Flashcard"
                centered
            >
                <form>
                    <Stack gap="sm">
                        <TextInput
                            label="Question"
                            placeholder="Flashcard question"
                            required
                            value={formEditCard.data.question}
                            onChange={(e) =>
                                formEditCard.setData(
                                    'question',
                                    e.currentTarget.value,
                                )
                            }
                            error={
                                (formEditCard.errors.question as string) ??
                                undefined
                            }
                        />
                        <Textarea
                            label="Answer"
                            placeholder="Flashcard answer"
                            required
                            minRows={3}
                            value={formEditCard.data.answer}
                            onChange={(e) =>
                                formEditCard.setData(
                                    'answer',
                                    e.currentTarget.value,
                                )
                            }
                            error={
                                (formEditCard.errors.answer as string) ??
                                undefined
                            }
                        />
                        <Group justify="end">
                            <Button
                                loading={formEditCard.processing}
                                variant="default"
                                onClick={closeEditCard}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={formEditCard.processing}
                                onClick={handleCardUpdate}
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
            {/* Modal End */}
            <Modal
                opened={newCardModalOpened}
                onClose={closeNewCard}
                title="New Flashcard"
                centered
            >
                <form>
                    <Stack gap="sm">
                        <TextInput
                            label="Question"
                            placeholder="Flashcard question"
                            required
                            value={formCard.data.question}
                            onChange={(e) =>
                                formCard.setData(
                                    'question',
                                    e.currentTarget.value,
                                )
                            }
                            error={
                                (formCard.errors.question as string) ??
                                undefined
                            }
                        />
                        <Textarea
                            label="Answer"
                            placeholder="Flashcard answer"
                            required
                            minRows={3}
                            value={formCard.data.answer}
                            onChange={(e) =>
                                formCard.setData(
                                    'answer',
                                    e.currentTarget.value,
                                )
                            }
                            error={
                                (formCard.errors.answer as string) ?? undefined
                            }
                        />
                        <Group justify="end">
                            <Button
                                loading={formCard.processing}
                                variant="default"
                                onClick={close}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={formCard.processing}
                                onClick={handleCardSubmit}
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
            <Stack gap="md">
                <Card withBorder>
                    <Group
                        justify="space-between"
                        align="flex-start"
                        style={{ gap: 16 }}
                    >
                        <Stack gap={6} style={{ flex: 1 }}>
                            <form onSubmit={handleDeckSubmit}>
                                <Stack gap="sm">
                                    <TextInput
                                        label="Title"
                                        placeholder="Deck title"
                                        required
                                        value={formDeck.data.title}
                                        onChange={(e) =>
                                            formDeck.setData(
                                                'title',
                                                e.currentTarget.value,
                                            )
                                        }
                                        error={
                                            (formDeck.errors.title as string) ??
                                            undefined
                                        }
                                    />

                                    <Textarea
                                        label="Description"
                                        placeholder="Short description of this deck"
                                        minRows={3}
                                        value={formDeck.data.description}
                                        onChange={(e) =>
                                            formDeck.setData(
                                                'description',
                                                e.currentTarget.value,
                                            )
                                        }
                                        error={
                                            (formDeck.errors
                                                .description as string) ??
                                            undefined
                                        }
                                    />

                                    <Group
                                        justify="space-between"
                                        align="center"
                                    >
                                        <Switch
                                            checked={!!formDeck.data.is_public}
                                            onChange={(event) =>
                                                formDeck.setData(
                                                    'is_public',
                                                    !!event.currentTarget
                                                        .checked,
                                                )
                                            }
                                            label={
                                                formDeck.data.is_public
                                                    ? 'Public'
                                                    : 'Private'
                                            }
                                        />

                                        <Group>
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={handleDeckCancel}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                type="submit"
                                                loading={formDeck.processing}
                                            >
                                                Save
                                            </Button>
                                        </Group>
                                    </Group>
                                </Stack>
                            </form>
                        </Stack>

                        <Stack gap="sm">
                            <Badge color={deck?.is_public ? 'green' : 'gray'}>
                                {deck?.is_public ? 'Public' : 'Private'}
                            </Badge>
                        </Stack>
                    </Group>
                </Card>

                <Card withBorder>
                    <Stack gap="sm">
                        <Group justify="space-between">
                            <Text w={600}>Flashcards</Text>
                            <Button onClick={openNewCard} size="sm">
                                Add
                            </Button>
                        </Group>

                        <ScrollArea>
                            <Stack gap="md">
                                {flashcards.length === 0 ? (
                                    <Text c="dimmed">No flashcards yet.</Text>
                                ) : (
                                    flashcards
                                        .slice(0, visibleCount)
                                        .map((f, i) => (
                                            <Card withBorder key={f.id}>
                                                {isMd ? (
                                                    <Group
                                                        justify="space-between"
                                                        align="center"
                                                        style={{ gap: 16 }}
                                                    >
                                                        <Stack
                                                            gap={6}
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 16,
                                                                }}
                                                            >
                                                                {f.question}
                                                            </Text>
                                                            <Text
                                                                c="dimmed"
                                                                style={{
                                                                    whiteSpace:
                                                                        'pre-wrap',
                                                                }}
                                                            >
                                                                {f.answer}
                                                            </Text>
                                                        </Stack>
                                                        <Stack gap="xs">
                                                            <Button
                                                                size="xs"
                                                                onClick={() => {
                                                                    formEditCard.setData(
                                                                        'flashCard_id',
                                                                        f.id,
                                                                    );
                                                                    formEditCard.setData(
                                                                        'question',
                                                                        f.question,
                                                                    );
                                                                    formEditCard.setData(
                                                                        'answer',
                                                                        f.answer,
                                                                    );
                                                                    openEditCard();
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                color="red"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        f.id,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Stack>
                                                    </Group>
                                                ) : (
                                                    <Stack
                                                        align="center"
                                                        style={{ gap: 16 }}
                                                    >
                                                        <Stack
                                                            gap={6}
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 16,
                                                                }}
                                                            >
                                                                {f.question}
                                                            </Text>
                                                            <Text
                                                                c="dimmed"
                                                                style={{
                                                                    whiteSpace:
                                                                        'pre-wrap',
                                                                }}
                                                            >
                                                                {f.answer}
                                                            </Text>
                                                        </Stack>
                                                        <Stack
                                                            w={'100%'}
                                                            gap="xs"
                                                        >
                                                            <Button
                                                                size="xs"
                                                                w={'100%'}
                                                                onClick={() => {
                                                                    formEditCard.setData(
                                                                        'flashCard_id',
                                                                        f.id,
                                                                    );
                                                                    formEditCard.setData(
                                                                        'question',
                                                                        f.question,
                                                                    );
                                                                    formEditCard.setData(
                                                                        'answer',
                                                                        f.answer,
                                                                    );
                                                                    openEditCard();
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="xs"
                                                                variant="outline"
                                                                color="red"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        f.id,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Stack>
                                                    </Stack>
                                                )}
                                            </Card>
                                        ))
                                )}
                            </Stack>
                        </ScrollArea>

                        {flashcards.length > visibleCount && (
                            <Group justify="center">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setVisibleCount(flashcards.length)
                                    }
                                >
                                    Show all ({flashcards.length})
                                </Button>
                            </Group>
                        )}
                    </Stack>
                </Card>
            </Stack>
        </>
    );
};

EditDeck.layout = (page: ReactNode) => <AuthLayout child={page} />;

export default EditDeck;
