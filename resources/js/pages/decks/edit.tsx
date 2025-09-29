import React, { ReactNode, useState } from 'react';
import AuthLayout from '@/layouts/auth-layout';
import {
    Card,
    Text,
    Group,
    Badge,
    Stack,
    Table,
    ScrollArea,
    Button,
    TextInput,
    Textarea,
    Switch,
} from '@mantine/core';
import { usePage, useForm, Link } from '@inertiajs/react';

type PageWithLayout = React.FC & {
    layout?: (page: ReactNode) => ReactNode;
};

interface Flashcard {
    id: number;
    front: string;
    back: string;
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

    // always-visible edit form
    const form = useForm<DeckForm>({
        title: deck?.title ?? '',
        description: deck?.description ?? '',
        is_public: !!deck?.is_public,
    });

    const INITIAL_SHOW = 10;
    const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL_SHOW, flashcards.length));

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
                <Group justify="space-between" align="flex-start" style={{ gap: 16 }}>
                    <Stack gap={6} style={{ flex: 1 }}>
                        <form onSubmit={handleSubmit}>
                            <Stack gap="sm">
                                <TextInput
                                    label="Title"
                                    placeholder="Deck title"
                                    required
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.currentTarget.value)}
                                    error={(form.errors.title as string) ?? undefined}
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="Short description of this deck"
                                    minRows={3}
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.currentTarget.value)}
                                    error={(form.errors.description as string) ?? undefined}
                                />

                                <Group justify="space-between" align="center">
                                    <Switch
                                        checked={!!form.data.is_public}
                                        onChange={(event) => form.setData('is_public', !!event.currentTarget.checked)}
                                        label={form.data.is_public ? 'Public' : 'Private'}
                                    />

                                    <Group>
                                        <Button type="button" variant="default" onClick={handleCancel}>
                                            Reset
                                        </Button>
                                        <Button type="submit" loading={form.processing}>
                                            Save
                                        </Button>
                                    </Group>
                                </Group>
                            </Stack>
                        </form>
                    </Stack>

                    <Stack gap="sm">
                        <Badge color={deck?.is_public ? 'green' : 'gray'}>{deck?.is_public ? 'Public' : 'Private'}</Badge>
                    </Stack>
                </Group>
            </Card>

            <Card withBorder>
                <Stack gap="sm">
                    <Group justify="space-between">
                        <Text w={600}>Flashcards</Text>
                        <Link href={`/decks/${deck?.id}/flashcards/create`} as="a">
                            <Button size="sm">Add</Button>
                        </Link>
                    </Group>

                    <ScrollArea>
                        <Table striped highlightOnHover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Front</th>
                                <th>Back</th>
                                <th />
                            </tr>
                            </thead>
                            <tbody>
                            {flashcards.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <Text color="dimmed">No flashcards yet.</Text>
                                    </td>
                                </tr>
                            ) : (
                                flashcards.slice(0, visibleCount).map((f, i) => (
                                    <tr key={f.id}>
                                        <td>{i + 1}</td>
                                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.front}</td>
                                        <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.back}</td>
                                        <td>
                                            {(f.tags ?? []).join(', ')}
                                        </td>
                                        <td>
                                            <Group gap="xs">
                                                <Link href={`/flashcards/${f.id}/edit`} as="a">
                                                    <Button size="xs">Edit</Button>
                                                </Link>
                                                <Button size="xs" variant="outline" onClick={() => handleDelete(f.id)}>
                                                    Delete
                                                </Button>
                                            </Group>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </ScrollArea>

                    {flashcards.length > visibleCount && (
                        <Group justify="center">
                            <Button variant="outline" onClick={() => setVisibleCount(flashcards.length)}>
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
