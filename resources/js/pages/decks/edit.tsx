import AuthLayout from '@/layouts/auth-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Badge,
    Button,
    Card,
    Group,
    ScrollArea,
    Stack,
    Switch,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
      const isMd = useMediaQuery("(min-width: 768px)"); // md breakpoint

    // always-visible edit form
    const form = useForm<DeckForm>({
        title: deck?.title ?? '',
        description: deck?.description ?? '',
        is_public: !!deck?.is_public,
    });

    const INITIAL_SHOW = 10;
    const [visibleCount, setVisibleCount] = useState(
        Math.min(INITIAL_SHOW, flashcards.length),
    );

    const handleDelete = (id: number) => {
        if (!confirm('Delete this flashcard?')) return;
        // use Inertia global to perform delete — server should redirect back with updated props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).Inertia.delete(`/flashcards/${id}`);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        form.put(`/decks/${deck.id}`);
    };

    const handleCancel = () => {
        form.setData('title', deck.title ?? '');
        form.setData('description', deck.description ?? '');
        form.setData('is_public', !!deck.is_public);
        form.clearErrors();
    };

    return (
        <Stack gap="md">
            <Card withBorder>
                <Group
                    justify="space-between"
                    align="flex-start"
                    style={{ gap: 16 }}
                >
                    <Stack gap={6} style={{ flex: 1 }}>
                        <form onSubmit={handleSubmit}>
                            <Stack gap="sm">
                                <TextInput
                                    label="Title"
                                    placeholder="Deck title"
                                    required
                                    value={form.data.title}
                                    onChange={(e) =>
                                        form.setData(
                                            'title',
                                            e.currentTarget.value,
                                        )
                                    }
                                    error={
                                        (form.errors.title as string) ??
                                        undefined
                                    }
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Short description of this deck"
                                    minRows={3}
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.currentTarget.value,
                                        )
                                    }
                                    error={
                                        (form.errors.description as string) ??
                                        undefined
                                    }
                                />

                                <Group justify="space-between" align="center">
                                    <Switch
                                        checked={!!form.data.is_public}
                                        onChange={(event) =>
                                            form.setData(
                                                'is_public',
                                                !!event.currentTarget.checked,
                                            )
                                        }
                                        label={
                                            form.data.is_public
                                                ? 'Public'
                                                : 'Private'
                                        }
                                    />

                                    <Group>
                                        <Button
                                            type="button"
                                            variant="default"
                                            onClick={handleCancel}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            loading={form.processing}
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
                        <Link
                            href={`/decks/${deck?.id}/flashcards/create`}
                            as="a"
                        >
                            <Button size="sm">Add</Button>
                        </Link>
                    </Group>

                    <ScrollArea>
                        <Stack gap="md">
                            {flashcards.length === 0 ?
                            (
                                <Text c="dimmed">No flashcards yet.</Text>
                            ) : (
                                flashcards.slice(0, visibleCount).map((f, i) => (
                                        <Card withBorder key={f.id}>
                                            {isMd ? (
                                                <Group justify="space-between" align="center" style={{ gap: 16 }}>
                                                    <Stack gap={6} style={{ flex: 1 }}>
                                                        <Text style={{fontSize: 16}}>
                                                            {f.question}
                                                        </Text>
                                                        <Text c="dimmed" style={{whiteSpace:'pre-wrap'}}>
                                                            {f.answer}
                                                        </Text>
                                                    </Stack>
                                                    <Stack gap="xs">
                                                        <Button size="xs">
                                                            <Link href={`/flashcards/${f.id}/edit`} as="a">
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button size="xs" variant="outline" color="red" onClick={() =>handleDelete(f.id)}>
                                                            Delete
                                                        </Button>
                                                    </Stack>
                                                </Group>
                                            ) : (
                                                <Stack align="center" style={{ gap: 16 }}>
                                                    <Stack gap={6} style={{ flex: 1 }}>
                                                        <Text style={{fontSize: 16}}>
                                                            {f.question}
                                                        </Text>
                                                        <Text c="dimmed" style={{whiteSpace:'pre-wrap'}}>
                                                            {f.answer}
                                                        </Text>
                                                    </Stack>
                                                    <Stack w={'100%'} gap="xs">
                                                        <Button size="xs" w={'100%'}>
                                                            <Link href={`/flashcards/${f.id}/edit`} as="a">
                                                                    Edit
                                                            </Link>
                                                        </Button>
                                                        <Button size="xs" variant="outline" color="red" onClick={() =>handleDelete(f.id)}>
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
    );
};

EditDeck.layout = (page: ReactNode) => <AuthLayout child={page} />;

export default EditDeck;
