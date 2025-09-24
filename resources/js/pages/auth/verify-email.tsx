import EmailVerificationNotificationController from '@/wayfinder/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/wayfinder/routes';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import CenteredCardLayout from '@/layouts/centered-card-layout';
import { Button, Stack } from '@mantine/core';
import Link from '@/components/link';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <Form
                {...EmailVerificationNotificationController.store.form()}
                className="space-y-6 text-center"
            >
                {({ processing }) => (
                    <Stack gap="md">
                        <Button type="submit" disabled={processing} variant="secondary">
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Resend verification email
                        </Button>

                        <Link
                            href={logout()}
                            className="mx-auto block"
                            size="sm"
                        >
                            Log out
                        </Link>
                    </Stack>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = (page: React.ReactNode) => (
    <CenteredCardLayout
        child={page}
        type="auth"
        title="Verify email"
        description="Please verify your email address by clicking on the link we just emailed to you."
    />
);
