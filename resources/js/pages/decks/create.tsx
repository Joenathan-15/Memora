import AuthLayout from '@/layouts/auth-layout';
import { useForm, usePage } from '@inertiajs/react';
import {
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Group,
    Notification,
    Stack,
    Switch,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconPaperclip, IconUpload, IconX } from '@tabler/icons-react';
import React, { ReactNode, useState } from 'react';

type PageWithLayout = React.FC & {
    layout?: (page: ReactNode) => ReactNode;
};

interface DeckForm {
    title: string;
    description: string;
    is_public: boolean;
    source?: 'manual' | 'ai' | string | null;
    ai_file?: File | null;
}

const CreateDeck: PageWithLayout = () => {
    const { errors } = usePage().props;
    const form = useForm<DeckForm>({
        title: '',
        description: '',
        is_public: false,
        source: null,
        ai_file: null,
    });

    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

    const handleManualSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        form.post('/create', {
            onSuccess: () => {
                // backend redirect/response via Inertia
            },
        });
    };

    const handleAISubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();

        const fileToSend = droppedFiles[0] ?? form.data.ai_file ?? null;
        form.setData('ai_file', fileToSend);

        form.post('/create', {
            onSuccess: () => {
                // optional
            },
        });
    };
    const [showError, setShowError] = useState(true);

    return (
        <>
            {errors.error && showError && (
                <Notification
                    color="red"
                    mb="md"
                    withCloseButton
                    onClose={() => setShowError(false)}
                >
                    {errors.error}
                </Notification>
            )}
            <Card withBorder>
                <Text size="lg" fw={500} ta="center">
                    Create a deck
                </Text>

                <Divider label="...manually" labelPosition="center" my="lg" />

                <Box component="form" onSubmit={handleManualSubmit}>
                    <Stack gap="sm">
                        <TextInput
                            label="Title"
                            placeholder="Deck title"
                            required
                            value={form.data.title}
                            onChange={(e) =>
                                form.setData('title', e.currentTarget.value)
                            }
                            error={(form.errors.title as string) ?? undefined}
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
                                (form.errors.description as string) ?? undefined
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
                                    form.data.is_public ? 'Public' : 'Private'
                                }
                            />

                            <Button type="submit" loading={form.processing}>
                                Create manually
                            </Button>
                        </Group>
                    </Stack>
                </Box>

                <Divider label="or with AI" labelPosition="center" my="lg" />

                <Box component="form" onSubmit={handleAISubmit}>
                    <Stack gap="sm">
                        <Dropzone
                            loading={form.processing}
                            onDrop={(files: File[]) => {
                                setDroppedFiles(files);
                                form.setData('ai_file', files[0] ?? null);
                            }}
                            onReject={(files) =>
                                console.log('rejected files', files)
                            }
                            maxSize={10 * 1024 ** 2} // 10 MB
                            accept={[
                                MIME_TYPES.pdf,
                                MIME_TYPES.ppt,
                                MIME_TYPES.pptx,
                                'odp',
                            ]}
                        >
                            <Group
                                justify="center"
                                gap="xl"
                                mih={220}
                                style={{ pointerEvents: 'none' }}
                            >
                                <Dropzone.Accept>
                                    <IconUpload
                                        size={52}
                                        color="var(--mantine-color-blue-6)"
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>

                                <Dropzone.Reject>
                                    <IconX
                                        size={52}
                                        color="var(--mantine-color-red-6)"
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>

                                <Dropzone.Idle>
                                    <IconPaperclip
                                        size={52}
                                        color="var(--mantine-color-dimmed)"
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        Drag files here or click to select
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach a PDF or presentation
                                        (ppt/pptx/odp). Each file should not
                                        exceed 10 MB.
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>

                        <Group justify="space-between" align="center">
                            <Group gap="xs">
                                {droppedFiles.length > 0 ? (
                                    droppedFiles.map((f) => (
                                        <Badge key={f.name} variant="outline">
                                            {f.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <Text size="sm" color="dimmed">
                                        No file selected
                                    </Text>
                                )}
                            </Group>

                            <Button
                                type="submit"
                                loading={form.processing}
                                disabled={
                                    droppedFiles.length === 0 &&
                                    !form.data.ai_file
                                }
                            >
                                Generate with AI
                            </Button>
                        </Group>
                    </Stack>
                </Box>
            </Card>
        </>
    );
};

CreateDeck.layout = (page: ReactNode) => <AuthLayout child={page} />;

export default CreateDeck;
