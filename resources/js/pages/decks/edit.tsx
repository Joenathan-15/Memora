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
    Table,
    ActionIcon,
    Tooltip,
    Autocomplete,
    Loader,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import React, { ReactNode, useState, useEffect } from 'react';
import { IconTrash, IconUserPlus, IconSearch } from '@tabler/icons-react';
import { debounce } from 'lodash';

type PageWithLayout = React.FC & {
    layout?: (page: ReactNode) => ReactNode;
};

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    tags?: string[] | null;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Deck {
    id: number;
    uuid: string; // Add UUID
    title: string;
    description?: string | null;
    is_public?: boolean;
    flashcards?: Flashcard[] | null;
    user_id: number;
    is_owner?: boolean;
    is_collaborator?: boolean;
    collaborators?: User[];
    owner?: User;
}

interface DeckForm {
    title: string;
    description: string;
    is_public: boolean;
}

interface FlashcardForm {
    deck_id: number;
    question: string;
    answer: string;
}

interface EditFlashcardForm {
    flashCard_id: number;
    question: string;
    answer: string;
}

interface CollaboratorForm {
    email: string;
}

const EditDeck: PageWithLayout = () => {
    const { deck, auth, is_owner, is_collaborator } = usePage().props as unknown as {
        deck: Deck;
        auth: { user: User };
        is_owner: boolean;
        is_collaborator: boolean;
    };

    const flashcards = deck?.flashcards ?? [];
    const collaborators = deck?.collaborators ?? [];
    const isOwner = is_owner ?? false;
    const isCollaborator = is_collaborator ?? false;

    const isMd = useMediaQuery('(min-width: 768px)');
    const [newCardModalOpened, { open: openNewCard, close: closeNewCard }] =
        useDisclosure(false);
    const [editCardModalOpened, { open: openEditCard, close: closeEditCard }] =
        useDisclosure(false);
    const [addCollaboratorModalOpened, { open: openAddCollaborator, close: closeAddCollaborator }] =
        useDisclosure(false);

    const formDeck = useForm<DeckForm>({
        title: deck?.title ?? '',
        description: deck?.description ?? '',
        is_public: !!deck?.is_public,
    });

    const formCard = useForm<FlashcardForm>({
        deck_id: deck.id,
        question: '',
        answer: '',
    });

    const formEditCard = useForm<EditFlashcardForm>({
        flashCard_id: 0,
        question: '',
        answer: '',
    });

    const formCollaborator = useForm<CollaboratorForm>({
        email: '',
    });

    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const INITIAL_SHOW = 10;
    const [visibleCount, setVisibleCount] = useState(
        Math.min(INITIAL_SHOW, flashcards.length),
    );

    const searchUsers = debounce(async (email: string) => {
        if (email.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fetch(`/api/user-search?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            setSearchResults(data.users || []);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, 300);

    useEffect(() => {
        return () => {
            searchUsers.cancel();
        };
    }, []);

    const handleDeleteFlashcard = (id: number) => {
        if (!confirm('Delete this flashcard?')) return;
        formCard.delete(`/flashcards/${id}`);
    };

    const handleDeckSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isOwner) return;
        formDeck.put(`/decks/${deck.uuid}`); // Use UUID
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
        closeNewCard();
    };

    const handleCardUpdate = (e?: React.FormEvent) => {
        e?.preventDefault();
        formEditCard.put(`/flashcards/${formEditCard.data.flashCard_id}`);
        formEditCard.reset();
        closeEditCard();
    };

    const handleAddCollaborator = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isOwner) return;

        formCollaborator.post(`/decks/${deck.uuid}/collaborators`, {
            onSuccess: () => {
                formCollaborator.reset();
                setSearchResults([]);
                closeAddCollaborator();
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            }
        });
    };


    const handleRemoveCollaborator = (userId: number) => {
        if (!isOwner || !confirm('Remove this collaborator?')) return;

        formCollaborator.delete(`/decks/${deck.uuid}/collaborators/${userId}`, {
            onSuccess: () => {
            }
        });
    };

    const canEditDeckDetails = isOwner;
    const canManageCollaborators = isOwner;
    const canManageFlashcards = isOwner || isCollaborator;

    return (
        <>
            {/* Edit Flashcard Modal */}
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

            {/* Add Flashcard Modal */}
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
                                onClick={closeNewCard}
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

            {/* Add Collaborator Modal */}
            <Modal
                opened={addCollaboratorModalOpened}
                onClose={closeAddCollaborator}
                title="Add Collaborator"
                centered
            >
                <form>
                    <Stack gap="sm">
                        <Autocomplete
                            label="User Email"
                            placeholder="Search user by email"
                            required
                            value={formCollaborator.data.email}
                            onChange={(value) => {
                                formCollaborator.setData('email', value);
                                // searchUsers(value);
                            }}
                            // data={searchResults.map(user => ({
                            //     value: user.email,
                            //     label: `${user.email}`
                            // }))}
                            error={
                                (formCollaborator.errors.email as string) ??
                                undefined
                            }
                            description="Start typing to search for users by email"
                            rightSection={searchLoading ? <Loader size="1rem" /> : <IconSearch size="1rem" />}
                        />
                        <Group justify="end">
                            <Button
                                loading={formCollaborator.processing}
                                variant="default"
                                onClick={closeAddCollaborator}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={formCollaborator.processing}
                                onClick={handleAddCollaborator}
                            >
                                Add Collaborator
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

            <Stack gap="md">
                {/* Deck Information Card - Only for Owners */}
                {canEditDeckDetails && (
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
                                <Badge color="blue">
                                    {isOwner ? 'Owner' : 'Collaborator'}
                                </Badge>
                            </Stack>
                        </Group>
                    </Card>
                )}

                {/* Collaborators Management - Only for Owners */}
                {canManageCollaborators && (
                    <Card withBorder>
                        <Stack gap="sm">
                            <Group justify="space-between">
                                <Text w={600}>Collaborators</Text>
                                <Button
                                    onClick={openAddCollaborator}
                                    size="sm"
                                    leftSection={<IconUserPlus size={16} />}
                                >
                                    Add Collaborator
                                </Button>
                            </Group>

                            {collaborators.length === 0 ? (
                                <Text c="dimmed">No collaborators yet.</Text>
                            ) : (
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Email</Table.Th>
                                            <Table.Th>Actions</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {collaborators.map((collaborator) => (
                                            <Table.Tr key={collaborator.id}>
                                                <Table.Td>{collaborator.name}</Table.Td>
                                                <Table.Td>{collaborator.email}</Table.Td>
                                                <Table.Td>
                                                    <Tooltip label="Remove collaborator">
                                                        <ActionIcon
                                                            color="red"
                                                            onClick={() => handleRemoveCollaborator(collaborator.id)}
                                                            loading={formCollaborator.processing}
                                                        >
                                                            <IconTrash size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            )}
                        </Stack>
                    </Card>
                )}

                {/* Deck Information Display for Collaborators */}
                {!isOwner && (
                    <Card withBorder>
                        <Group justify="space-between">
                            <Stack gap={4}>
                                <Text size="lg" fw={600}>{deck?.title}</Text>
                                <Text c="dimmed">{deck?.description}</Text>
                            </Stack>
                            <Stack gap="sm">
                                <Badge color={deck?.is_public ? 'green' : 'gray'}>
                                    {deck?.is_public ? 'Public' : 'Private'}
                                </Badge>
                                <Badge color="blue">Collaborator</Badge>
                            </Stack>
                        </Group>
                    </Card>
                )}

                {/* Flashcards Management - For both Owners and Collaborators */}
                {canManageFlashcards && (
                    <Card withBorder>
                        <Stack gap="sm">
                            <Group justify="space-between">
                                <Text w={600}>Flashcards</Text>
                                <Button onClick={openNewCard} size="sm">
                                    Add Flashcard
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
                                                                        handleDeleteFlashcard(
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
                                                                        handleDeleteFlashcard(
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
                )}
            </Stack>
        </>
    );
};

EditDeck.layout = (page: ReactNode) => <AuthLayout child={page} />;

export default EditDeck;
