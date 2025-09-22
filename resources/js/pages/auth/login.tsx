import {
    Button,
    Checkbox,
    Divider,
    Group,
    Paper,
    PaperProps,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Center,
    Flex,
} from '@mantine/core';
import { useForm } from '@inertiajs/react';
import GoogleButton from '@/components/google-button';
import GithubButton from '@/components/github-button';
import Link from '@/components/link';
import { request } from '@/wayfinder/routes/password';
import { register } from '@/wayfinder/routes';
import AuthenticatedSessionController from '@/wayfinder/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';

interface Props extends PaperProps {
    canResetPassword: boolean;
    status: string;
}

export default function AuthenticationForm({
                                               canResetPassword,
                                               status,
                                               ...paperProps
                                           }: Props) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // The Wayfinder way - pass the route definition directly to Inertia's submit
        form.submit(AuthenticatedSessionController.store(), {
            preserveScroll: true,
        });
    };

    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Paper
                radius="md"
                p="lg"
                w={400}
                withBorder
                shadow="sm"
                {...paperProps}
            >
                <Text size="lg" fw={500}>
                    Welcome to Memora, login with
                </Text>

                <Group grow mb="md" mt="md">
                    <GoogleButton radius="xl">Google</GoogleButton>
                    <GithubButton radius="xl">Github</GithubButton>
                </Group>

                <Divider
                    label="Or continue with email"
                    labelPosition="center"
                    my="lg"
                />

                {status && (
                    <Text c="green" size="sm" mb="md">
                        {status}
                    </Text>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="hello@mantine.dev"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.currentTarget.value)}
                            error={form.errors.email}
                            radius="md"
                        />

                        <PasswordInput
                            withAsterisk
                            label="Password"
                            placeholder="Your password"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.currentTarget.value)}
                            error={form.errors.password}
                            radius="md"
                        />

                        <Checkbox
                            label="Remember me"
                            checked={form.data.remember}
                            onChange={(e) => form.setData('remember', e.currentTarget.checked)}
                        />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Flex direction="column">
                            {canResetPassword && (
                                <Link size="xs" c="dimmed" href={request()}>
                                    Forgot password?
                                </Link>
                            )}
                            <Link
                                href={register()}
                                type="button"
                                c="dimmed"
                                size="xs"
                            >
                                Don't have an account? Register
                            </Link>
                        </Flex>

                        <Button
                            type="submit"
                            radius="xl"
                            loading={form.processing}
                        >
                            Login
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Center>
    );
}
