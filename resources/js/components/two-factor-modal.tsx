import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from '@inertiajs/react';
import { Loader, Card, Stack, Button, Text, Modal, Group, Code, ScrollArea, Center, Box, Divider, PinInput } from '@mantine/core';
import { Eye, EyeOff, LockKeyhole, RefreshCw, Check, Copy, Loader2, ScanLine } from 'lucide-react';

import { regenerateRecoveryCodes } from '@/wayfinder/routes/two-factor';
import { confirm } from '@/wayfinder/routes/two-factor';
import { useClipboard } from '@mantine/hooks';
import { OTP_MAX_LENGTH } from '@/helpers/use-two-factor-auth';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

// -----------------------------
// TwoFactorRecoveryCodes
// -----------------------------
export function TwoFactorRecoveryCodes({ recoveryCodesList, fetchRecoveryCodes, errors }: {
    recoveryCodesList: string[];
    fetchRecoveryCodes: () => Promise<void>;
    errors: string[];
}) {
    const [codesAreVisible, setCodesAreVisible] = useState<boolean>(false);
    const codesSectionRef = useRef<HTMLDivElement | null>(null);
    const canRegenerateCodes = recoveryCodesList.length > 0 && codesAreVisible;

    const toggleCodesVisibility = useCallback(async () => {
        if (!codesAreVisible && !recoveryCodesList.length) {
            await fetchRecoveryCodes();
        }

        setCodesAreVisible((v) => !v);

        if (!codesAreVisible) {
            setTimeout(() => {
                codesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }
    }, [codesAreVisible, recoveryCodesList.length, fetchRecoveryCodes]);

    useEffect(() => {
        if (!recoveryCodesList.length) {
            fetchRecoveryCodes();
        }
    }, [recoveryCodesList.length, fetchRecoveryCodes]);

    const RecoveryCodeIconComponent = codesAreVisible ? EyeOff : Eye;

    return (
        <Card shadow="sm">
            <Stack gap="sm">
                <Group justify="space-between">
                    <Group gap="xs">
                        <LockKeyhole aria-hidden />
                        <Text w={700}>2FA Recovery Codes</Text>
                    </Group>
                </Group>

                <Text size="sm" c="dimmed">
                    Recovery codes let you regain access if you lose your 2FA device. Store them in a secure password manager.
                </Text>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        onClick={toggleCodesVisibility}
                        aria-expanded={codesAreVisible}
                        aria-controls="recovery-codes-section"
                    >
                        <RecoveryCodeIconComponent aria-hidden className="mr-8" />
                        {codesAreVisible ? 'Hide' : 'View'} Recovery Codes
                    </Button>

                    {canRegenerateCodes && (
                        <Form
                            {...regenerateRecoveryCodes.form()}
                            options={{ preserveScroll: true }}
                            onSuccess={fetchRecoveryCodes}
                        >
                            {({ processing }) => (
                                <Button type="submit" disabled={processing} variant="outline">
                                    {processing ? <Loader size="xs" /> : <RefreshCw className="mr-8" />}
                                    Regenerate Codes
                                </Button>
                            )}
                        </Form>
                    )}
                </div>

                <div
                    id="recovery-codes-section"
                    className={`relative overflow-hidden transition-all duration-300 ${codesAreVisible ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}
                    aria-hidden={!codesAreVisible}
                >
                    <div className="mt-3 space-y-3">
                        {errors?.length ? (
                            <Box>
                                <Text color="red" size="sm">{errors.join('\n')}</Text>
                            </Box>
                        ) : (
                            <>
                                <div ref={codesSectionRef} role="list" aria-label="Recovery codes">
                                    <ScrollArea type="auto" style={{ maxHeight: 240 }}>
                                        <div className="grid gap-1 rounded-lg bg-gray-50 p-4 font-mono text-sm">
                                            {recoveryCodesList.length ? (
                                                recoveryCodesList.map((code, index) => (
                                                    <div key={index} role="listitem" className="select-text py-1">
                                                        <Code>{code}</Code>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="space-y-2" aria-label="Loading recovery codes">
                                                    {Array.from({ length: 8 }, (_, index) => (
                                                        <div key={index} className="h-4 animate-pulse rounded bg-gray-200/60" aria-hidden />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>

                                <Text size="xs" color="dimmed" className="select-none">
                  <span id="regenerate-warning">
                    Each recovery code can be used once to access your account and will be removed after use. If you need more, click <strong>Regenerate Codes</strong> above.
                  </span>
                                </Text>
                            </>
                        )}
                    </div>
                </div>
            </Stack>
        </Card>
    );
}

// -----------------------------
// TwoFactorSetupModal + helpers
// -----------------------------
function GridScanIcon() {
    return (
        <Center>
            <div className="mb-3 rounded-full border p-0.5 shadow-sm">
                <div className="relative overflow-hidden rounded-full p-2.5">
                    <div className="absolute inset-0 grid grid-cols-5 opacity-20">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={`col-${i + 1}`} className="border-r last:border-r-0" />
                        ))}
                    </div>
                    <div className="absolute inset-0 grid grid-rows-5 opacity-20">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={`row-${i + 1}`} className="border-b last:border-b-0" />
                        ))}
                    </div>
                    <ScanLine className="relative z-20" />
                </div>
            </div>
        </Center>
    );
}

function TwoFactorSetupStep({
                                qrCodeSvg,
                                manualSetupKey,
                                buttonText,
                                onNextStep,
                                errors,
                            }: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const clipboard = useClipboard({ timeout: 2000 });
    const codesAreEqual = clipboard.copied && manualSetupKey;

    return (
        <>
            {errors?.length ? (
                <Box>
                    <Text color="red">{errors.join('\n')}</Text>
                </Box>
            ) : (
                <Stack align="center" gap="md">
                    <div className="mx-auto flex max-w-md overflow-hidden">
                        <div className="mx-auto aspect-square w-64 rounded-lg border">
                            <div className="z-10 flex h-full w-full items-center justify-center p-5">
                                {qrCodeSvg ? (
                                    <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                                ) : (
                                    <Loader2 className="flex animate-spin" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ width: '100%' }}>
                        <Button fullWidth onClick={onNextStep}>
                            {buttonText}
                        </Button>
                    </div>

                    <Divider labelPosition="center" label="or, enter the code manually"/>

                    <div style={{ width: '100%' }}>
                        <div className="flex w-full items-stretch overflow-hidden rounded-xl border">
                            {!manualSetupKey ? (
                                <div className="flex h-full w-full items-center justify-center p-3">
                                    <Loader2 className="animate-spin" />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <input type="text" readOnly value={manualSetupKey} className="h-full w-full p-3 outline-none" />
                                    <button
                                        onClick={() => manualSetupKey && clipboard.copy(manualSetupKey)}
                                        className="border-l px-3 hover:bg-gray-50"
                                        aria-label="copy-setup-key"
                                    >
                                        {clipboard.copied ? <Check className="w-4" /> : <Copy className="w-4" />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Stack>
            )}
        </>
    );
}

function TwoFactorVerificationStep({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
    const [code, setCode] = useState<string>('');
    const pinInputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => {
            pinInputContainerRef.current?.querySelector('input')?.focus();
        }, 0);
    }, []);

    return (
        <Form {...confirm.form()} onSuccess={() => onClose()} resetOnError resetOnSuccess>
            {({ processing, errors }: { processing: boolean; errors?: { confirmTwoFactorAuthentication?: { code?: string } } }) => (
                <div ref={pinInputContainerRef} style={{ width: '100%' }}>
                    <div className="flex w-full flex-col items-center py-2">
                        <PinInput
                            length={OTP_MAX_LENGTH}
                            onChange={(value) => setCode(value)}
                            value={code}
                            placeholder="-"
                            inputMode="numeric"
                            autoFocus
                        />

                        {errors?.confirmTwoFactorAuthentication?.code && (
                            <Text color="red" size="sm">{errors.confirmTwoFactorAuthentication.code}</Text>
                        )}
                    </div>

                    <div className="flex w-full gap-3">
                        <Button variant="outline" style={{ flex: 1 }} onClick={onBack} disabled={processing}>
                            Back
                        </Button>
                        <Button type="submit" style={{ flex: 1 }} disabled={processing || code.length < OTP_MAX_LENGTH}>
                            {processing ? <Loader size="xs" /> : 'Confirm'}
                        </Button>
                    </div>
                </div>
            )}
        </Form>
    );
}

export function TwoFactorSetupModal({
                                                isOpen,
                                                onClose,
                                                requiresConfirmation,
                                                twoFactorEnabled,
                                                qrCodeSvg,
                                                manualSetupKey,
                                                clearSetupData,
                                                fetchSetupData,
                                                errors,
                                            }: {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
    errors: string[];
}) {
    const [showVerificationStep, setShowVerificationStep] = useState<boolean>(false);

    const modalConfig = useMemo(() => {
        if (twoFactorEnabled) {
            return {
                title: 'Two-Factor Authentication Enabled',
                description: 'Two-factor authentication is now enabled. Scan the QR code or enter the setup key in your authenticator app.',
                buttonText: 'Close',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'Verify Authentication Code',
                description: 'Enter the 6-digit code from your authenticator app',
                buttonText: 'Continue',
            };
        }

        return {
            title: 'Enable Two-Factor Authentication',
            description: 'To finish enabling two-factor authentication, scan the QR code or enter the setup key in your authenticator app',
            buttonText: 'Continue',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const handleModalNextStep = useCallback(() => {
        if (requiresConfirmation) {
            setShowVerificationStep(true);
            return;
        }

        clearSetupData();
        onClose();
    }, [requiresConfirmation, clearSetupData, onClose]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);
        if (twoFactorEnabled) clearSetupData();
    }, [twoFactorEnabled, clearSetupData]);

    useEffect(() => {
        if (!isOpen) {
            resetModalState();
            return;
        }

        if (!qrCodeSvg) fetchSetupData();
    }, [isOpen, qrCodeSvg, fetchSetupData, resetModalState]);

    return (
        <Modal opened={isOpen} onClose={() => onClose()} size="md" centered>
            <Stack align="center" gap="sm">
                <GridScanIcon />
                <Text ta="center">
                    {modalConfig.title}
                </Text>
                <Text size="sm" ta="center" color="dimmed">
                    {modalConfig.description}
                </Text>

                {showVerificationStep ? (
                    <TwoFactorVerificationStep onClose={onClose} onBack={() => setShowVerificationStep(false)} />
                ) : (
                    <TwoFactorSetupStep qrCodeSvg={qrCodeSvg} manualSetupKey={manualSetupKey} buttonText={modalConfig.buttonText} onNextStep={handleModalNextStep} errors={errors} />
                )}
            </Stack>
        </Modal>
    );
}
