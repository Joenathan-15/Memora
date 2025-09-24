import CenteredCardLayout from '@/layouts/centered-card-layout';
import { useTwoFactorAuth } from '@/helpers/use-two-factor-auth';
import { disable, enable } from '@/wayfinder/routes/two-factor';
import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { Button, Loader, Stack, Text, Badge } from '@mantine/core';
import { useState } from 'react';
import {
    TwoFactorRecoveryCodes,
    TwoFactorSetupModal,
} from '@/components/two-factor-modal';

interface TwoFactorProps {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

export default function TwoFactor({ requiresConfirmation = false, twoFactorEnabled = false }: TwoFactorProps) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <>
            <Head title="Two-Factor Authentication" />

            <Stack className="space-y-6">
                <Stack gap="xs" mb={8}>
                    <Text size="xl" fw={700}>
                        Two-Factor Authentication
                    </Text>
                    <Text size="sm" c="dimmed">
                        Manage your two-factor authentication settings
                    </Text>
                </Stack>

                {twoFactorEnabled ? (
                    <Stack gap="sm">
                        <Badge variant="light">Enabled</Badge>

                        <Text size="sm" color="dimmed">
                            With two-factor authentication enabled, you will be prompted for a
                            secure, random pin during login, which you can retrieve from the
                            TOTP-supported application on your phone.
                        </Text>

                        {/* recovery codes component (keeps your original API) */}
                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <div className="inline-block">
                            <Form {...disable.form()}>
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        leftSection={processing ? <Loader size="xs" /> : null}
                                    >
                                        <ShieldBan size={16} style={{ marginRight: 6 }} />
                                        Disable 2FA
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </Stack>
                ) : (
                    <Stack gap="sm">
                        <Badge color="red" variant="filled">
                            Disabled
                        </Badge>

                        <Text size="sm" color="dimmed">
                            When you enable two-factor authentication, you will be prompted
                            for a secure pin during login. This pin can be retrieved from a
                            TOTP-supported application on your phone.
                        </Text>

                        <div>
                            {hasSetupData ? (
                                <Button onClick={() => setShowSetupModal(true)}>
                                    <ShieldCheck size={16} style={{ marginRight: 6 }} />
                                    Continue Setup
                                </Button>
                            ) : (
                                <Form
                                    {...enable.form()}
                                    onSuccess={() => setShowSetupModal(true)}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            leftSection={processing ? <Loader size="xs" /> : null}
                                        >
                                            <ShieldCheck size={16} style={{ marginRight: 6 }} />
                                            Enable 2FA
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </div>
                    </Stack>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </Stack>
        </>
    );
}

TwoFactor.layout = (page: React.ReactNode) => (
    <CenteredCardLayout
        child={page}
        type="auth"
        title="Two-Factor Authentication"
        description="Manage your two-factor authentication settings"
    />
);
