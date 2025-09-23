import {
    Button,
    Checkbox,
    Divider,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Center,
    Flex,
    Card,
    CardProps,
} from '@mantine/core';
import GoogleButton from '@/components/google-button';
import GithubButton from '@/components/github-button';
import Link from '@/components/link';
import { request } from '@/wayfinder/routes/password';
import { login } from '@/wayfinder/routes';
import { useForm } from '@inertiajs/react';
import RegisteredUserController from '@/wayfinder/actions/App/Http/Controllers/Auth/RegisteredUserController';

interface Props extends CardProps {
    canResetPassword: boolean;
    status: string;
}

export default function AuthenticationForm({ canResetPassword, status, ...cardProps }: Props) {
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
            <Card p="lg" w={400} withBorder shadow="sm" {...cardProps}>
                <Text size="lg" fw={500}>
                    Welcome to Memora, login with
                </Text>

                <Group grow mb="md" mt="md">
                    <GoogleButton>Google</GoogleButton>
                    <GithubButton>Github</GithubButton>
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
                        />

                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="mail@example.com"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.currentTarget.value)}
                            error={form.errors.email}
                        />

                        <PasswordInput
                            withAsterisk
                            label="Password"
                            placeholder="Your password"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.currentTarget.value)}
                            error={form.errors.password}
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

                        <Button type="submit" loading={form.processing}>
                            Register
                        </Button>
                    </Group>
                </form>
            </Card>
        </Center>
    );
}
