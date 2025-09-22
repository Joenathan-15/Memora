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
import GoogleButton from '@/components/google-button';
import GithubButton from '@/components/github-button';
import Link from '@/components/link';
import { request } from '@/wayfinder/routes/password';
import { login } from '@/wayfinder/routes';
import { useForm } from '@inertiajs/react';
import RegisteredUserController from '@/wayfinder/actions/App/Http/Controllers/Auth/RegisteredUserController';

interface Props extends PaperProps {
    canResetPassword: boolean;
    status: string;
}

export default function AuthenticationForm({ canResetPassword, status, ...paperProps }: Props) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        remember: false,
        terms: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.submit(RegisteredUserController.store(), {
            preserveScroll: true,
        });
    };

    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Paper radius="md" p="lg" w={400} withBorder shadow="sm" {...paperProps}>
                <Text size="lg" fw={500}>
                    Welcome to Memora, login with
                </Text>

                <Group grow mb="md" mt="md">
                    <GoogleButton radius="xl">Google</GoogleButton>
                    <GithubButton radius="xl">Github</GithubButton>
                </Group>

                <Divider label="Or continue with email" labelPosition="center" my="lg" />

                <form onSubmit={handleSubmit}>
                    <Stack>
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.currentTarget.value)}
                            error={form.errors.name}
                            radius="md"
                        />

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

                        <PasswordInput
                            withAsterisk
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={form.data.password_confirmation}
                            onChange={(e) =>
                                form.setData('password_confirmation', e.currentTarget.value)
                            }
                            error={form.errors.password_confirmation}
                            radius="md"
                        />

                        <Checkbox
                            label="Remember me"
                            checked={form.data.remember}
                            onChange={(e) => form.setData('remember', e.currentTarget.checked)}
                        />

                        <Checkbox
                            label="I accept terms and conditions"
                            checked={form.data.terms}
                            onChange={(e) => form.setData('terms', e.currentTarget.checked)}
                        />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Flex direction="column">
                            {canResetPassword && (
                                <Link size="xs" c="dimmed" href={request()}>
                                    Forgot password?
                                </Link>
                            )}
                            <Link href={login()} type="button" c="dimmed" size="xs">
                                Already have an account? Login
                            </Link>
                        </Flex>

                        <Button type="submit" radius="xl" loading={form.processing}>
                            Register
                        </Button>
                    </Group>
                </form>
            </Paper>
        </Center>
    );
}
