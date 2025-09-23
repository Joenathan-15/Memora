import { store } from '@/wayfinder/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import {
    PasswordInput,
    Button,
    Stack,
    Loader,
    Text,
    Card,
    Center,
} from '@mantine/core';

export default function ConfirmPassword() {
    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm">

                <Head title="Confirm password" />

                <Stack gap="xs" mb={20}>
                    <Text size="lg" fw={500}>Confirm your password</Text>

                    <Text size="sm" c="dimmed">This is a secure area of the application. Please confirm your password before continuing.</Text>
                </Stack>

                <Form {...store.form()} resetOnSuccess={['password']}>
                    {({ processing, errors }) => (
                        <Stack gap="md">
                            <PasswordInput
                                id="password"
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                autoFocus
                                error={errors.password && <Text size="xs" c="red">{errors.password}</Text>}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                disabled={processing}
                                data-test="confirm-password-button"
                                leftSection={processing ? <Loader size="xs" /> : null}
                            >
                                Confirm password
                            </Button>
                        </Stack>
                    )}
                </Form>

            </Card>
        </Center>
    );
}

ConfirmPassword.layout = (page: React.ReactNode) => (
    <GuestLayout child={page} />
);
