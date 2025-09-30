import {
    Button,
    Checkbox,
    Divider,
    Group,
    CardProps,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Center,
    Flex,
    Card,
} from '@mantine/core';
import { useForm } from '@inertiajs/react';
import GoogleButton from '@/components/google-button';
import GithubButton from '@/components/github-button';
import Link from '@/components/link';
import { request } from '@/wayfinder/routes/password';
import { register } from '@/wayfinder/routes';
import AuthenticatedSessionController from '@/wayfinder/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';

interface Props extends CardProps {
    canResetPassword: boolean;
    status: string;
}

export default function AuthenticationForm({ canResetPassword, status, ...cardProps }: Props) {
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

    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card
                p="lg"
                w={400}
                withBorder
                shadow="sm"
                {...cardProps}
            >
                <Text size="lg" fw={500}>
                    Welcome to Memora, login with
                </Text>

                <Group grow mt="md">
                    <GoogleButton>Google</GoogleButton>
                    <GithubButton>Github</GithubButton>
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

                        <Checkbox
                            label="Remember me"
                            checked={form.data.remember}
                            onChange={(e) => form.setData('remember', e.currentTarget.checked)}
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

                        <Button
                            type="submit"
                            loading={form.processing}
                        >
                            Login
                        </Button>
                    </Group>
                </form>
            </Card>
        </Center>
    );
}
