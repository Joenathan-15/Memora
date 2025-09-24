import NewPasswordController from '@/wayfinder/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Form, Head } from '@inertiajs/react';
import Link from '@/components/link';
import { login } from '@/wayfinder/routes';
import {
    Button,
    Card,
    Center,
    Loader,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm">
                <Head title="Reset password" />

                <Stack gap="xs" mb={20}>
                    <Text size="lg" fw={500}>Reset password</Text>

                    <Text size="sm" c="dimmed">Please enter your new password below</Text>
                </Stack>

                <div className="space-y-6">
                    <Form
                        {...NewPasswordController.store.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                    >
                        {({ processing, errors }) => (
                            <Stack>
                                <TextInput
                                    id="email"
                                    name="email"
                                    label="Email"
                                    withAsterisk
                                    placeholder="mail@example.com"
                                    error={errors.email && <Text size="xs" c="red">{errors.email}</Text>}
                                />

                                <PasswordInput
                                    id="password"
                                    name="password"
                                    label="Password"
                                    withAsterisk
                                    placeholder="Your password"
                                    error={errors.password && <Text size="xs" c="red">{errors.password}</Text>}
                                />

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    label="Confirm Password"
                                    withAsterisk
                                    placeholder="Confirm your password"
                                    error={errors.password_confirmation && <Text size="xs" c="red">{errors.password_confirmation}</Text>}
                                />

                                <Button
                                    type="submit"
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
