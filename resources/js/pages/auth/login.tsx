import GithubButton from '@/components/github-button';
import GoogleButton from '@/components/google-button';
import Link from '@/components/link';
import AuthenticatedSessionController from '@/wayfinder/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { register } from '@/wayfinder/routes';
import { useForm } from '@inertiajs/react';
import {
    Button,
    Card,
    CardProps,
    Center,
    Checkbox,
    Divider,
    Flex,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';

interface Props extends CardProps {
    canResetPassword: boolean;
    status: string;
}

export default function AuthenticationForm({
    canResetPassword,
    status,
    ...cardProps
}: Props) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.submit(AuthenticatedSessionController.store(), {
            preserveScroll: true,
        });
    };

    const handleGithubLogin = () => {
        window.location.href = '/oauth/github/redirect';
    };

    const handleGoogleLogin = () => {
        window.location.href = '/oauth/google/redirect';
    };

    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm" {...cardProps}>
                <Text size="lg" fw={500}>
                    Welcome to Memora, login with
                </Text>

                <Group grow mt="md">
                    <GoogleButton onClick={handleGoogleLogin}>
                        Google
                    </GoogleButton>
                    <GithubButton onClick={handleGithubLogin}>
                        Github
                    </GithubButton>
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
                            placeholder="mail@example.com"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.currentTarget.value)
                            }
                            error={form.errors.email}
                        />

                        <PasswordInput
                            withAsterisk
                            label="Password"
                            placeholder="Your password"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.currentTarget.value)
                            }
                            error={form.errors.password}
                        />

                        <Checkbox
                            label="Remember me"
                            checked={form.data.remember}
                            onChange={(e) =>
                                form.setData(
                                    'remember',
                                    e.currentTarget.checked,
                                )
                            }
                        />
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Flex direction="column">
                            {/* TODO: IDK WHAT WRONG???? */}
                            {/* {canResetPassword && (
                                <Link size="xs" c="dimmed" href={request()}>
                                    Forgot password?
                                </Link>
                            )} */}
                            <Link
                                href={register()}
                                type="button"
                                c="dimmed"
                                size="xs"
                            >
                                Don't have an account? Register
                            </Link>
                        </Flex>

                        <Button type="submit" loading={form.processing}>
                            Login
                        </Button>
                    </Group>
                </form>
            </Card>
        </Center>
    );
}
