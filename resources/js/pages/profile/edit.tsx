import CenteredCardLayout from '@/layouts/centered-card-layout';
import ProfileController from '@/wayfinder/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/wayfinder/routes/verification';
import { type SharedData } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Button, Loader, Stack, Text, TextInput } from '@mantine/core';
import { useRef } from 'react';

export default function Profile({
                                    mustVerifyEmail,
                                    status,
                                }: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    const nameInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Profile settings" />

            <Form
                {...ProfileController.update.form()}
                options={{
                    preserveScroll: true,
                }}
                // focus first invalid field on error
                onError={(errors) => {
                    if (errors.name) {
                        nameInput.current?.focus();
                    } else if (errors.email) {
                        emailInput.current?.focus();
                    }
                }}
                className="space-y-6"
            >
                {({ processing, recentlySuccessful, errors }) => (
                    <Stack>
                        <TextInput
                            ref={nameInput}
                            id="name"
                            name="name"
                            label="Name"
                            withAsterisk
                            placeholder="Full name"
                            defaultValue={auth.user?.name ?? ''}
                            error={
                                errors.name && (
                                    <Text size="xs" c="red">
                                        {errors.name}
                                    </Text>
                                )
                            }
                        />

                        <TextInput
                            ref={emailInput}
                            id="email"
                            name="email"
                            label="Email"
                            withAsterisk
                            placeholder="mail@example.com"
                            defaultValue={auth.user?.email ?? ''}
                            error={
                                errors.email && (
                                    <Text size="xs" c="red">
                                        {errors.email}
                                    </Text>
                                )
                            }
                        />

                        {mustVerifyEmail &&
                            auth.user?.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been
                                            sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="flex flex-col gap-2">
                            <Button
                                type="submit"
                                fullWidth
                                disabled={processing}
                                className="w-full"
                                data-test="update-profile-button"
                                leftSection={processing ? <Loader size="xs" /> : null}
                            >
                                Save
                            </Button>

                            {recentlySuccessful && (
                                <Text size="sm" className="text-neutral-600">
                                    Saved
                                </Text>
                            )}
                        </div>
                    </Stack>
                )}
            </Form>

            {/*<DeleteUser />*/}
        </>
    );
}

Profile.layout = (page: React.ReactNode) => (
    <CenteredCardLayout
        child={page}
        type="auth"
        title="Profile settings"
        description="Update your name and email address"
    />
);
