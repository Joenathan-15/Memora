import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import {
    Button,
    Card,
    Center,
    Loader,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import Link from '@/components/link';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm">
                <Head title="Forgot password" />

                <Stack gap="xs" mb={20}>
                    <Text size="lg" fw={500}>Forgot password</Text>

                    <Text size="sm" c="dimmed">Enter your email to receive a password reset link</Text>
                </Stack>

                {status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <div className="space-y-6">
                    <Form {...PasswordResetLinkController.store.form()}>
                        {({ processing, errors }) => (
                            <Stack gap="md">
                                <TextInput
                                    id="email"
                                    name="email"
                                    label="Email"
                                    withAsterisk
                                    placeholder="mail@example.com"
                                    error={errors.email && <Text size="xs" c="red">{errors.email}</Text>}
                                />

                                <Button
                                    fullWidth
                                    disabled={processing}
                                    className="w-full"
                                    data-test="email-password-reset-link-button"
                                    leftSection={processing ? <Loader size="xs" /> : null}
                                >
                                    Email password reset link
                                </Button>
                            </Stack>
                        )}
                    </Form>

                    <div className="space-x-1 text-center text-sm text-muted-foreground">
                        <span>Or, return to</span>
                        <Link href={login()} size="sm">log in</Link>
                    </div>
                </div>
            </Card>
        </Center>
    );
}

ForgotPassword.layout = (page: React.ReactNode) => (
    <GuestLayout child={page} />
);
