import CenteredCardLayout from '@/layouts/centered-card-layout';
import PasswordController from '@/wayfinder/actions/App/Http/Controllers/Settings/PasswordController';
import { Form } from '@inertiajs/react';
import { Button, Loader, PasswordInput, Stack, Text } from '@mantine/core';
import { useRef } from 'react';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Form
                {...PasswordController.update.form()}
                options={{
                    preserveScroll: true,
                }}
                resetOnError={[
                    'password',
                    'password_confirmation',
                    'current_password',
                ]}
                resetOnSuccess
                onError={(errors) => {
                    if (errors.password) {
                        passwordInput.current?.focus();
                    }

                    if (errors.current_password) {
                        currentPasswordInput.current?.focus();
                    }
                }}
                className="space-y-6"
            >
                {({ errors, processing, recentlySuccessful }) => (
                    <Stack>
                        <PasswordInput
                            ref={currentPasswordInput}
                            id="current_password"
                            name="current_password"
                            label="Current Password"
                            withAsterisk
                            placeholder="Current password"
                            error={
                                errors.current_password && (
                                    <Text size="xs" c="red">
                                        {errors.current_password}
                                    </Text>
                                )
                            }
                        />

                        <PasswordInput
                            ref={passwordInput}
                            id="password"
                            name="password"
                            label="Password"
                            withAsterisk
                            placeholder="Your password"
                            error={
                                errors.password && (
                                    <Text size="xs" c="red">
                                        {errors.password}
                                    </Text>
                                )
                            }
                        />

                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            label="Confirm Password"
                            withAsterisk
                            placeholder="Confirm your password"
                            error={
                                errors.password_confirmation && (
                                    <Text size="xs" c="red">
                                        {errors.password_confirmation}
                                    </Text>
                                )
                            }
                        />

                        <Button
                            type="submit"
                            fullWidth
                            disabled={processing}
                            className="w-full"
                            data-test="update-password-button"
                            leftSection={
                                processing ? <Loader size="xs" /> : null
                            }
                        >
                            Save password
                        </Button>
                    </Stack>
                )}
            </Form>
        </>
    );
}

Password.layout = (page: React.ReactNode) => (
    <CenteredCardLayout
        child={page}
        type="auth"
        title="Update password"
        description="Ensure your account is using a long, random password to stay secure"
    />
);
