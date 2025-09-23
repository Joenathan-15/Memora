import { OTP_MAX_LENGTH } from '@/helpers/use-two-factor-auth';
import { store } from '@/wayfinder/routes/two-factor/login';
import { Form, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    PinInput,
    TextInput,
    Button,
    Text,
    Stack,
    Center,
    Group,
    Card,
} from '@mantine/core';
import GuestLayout from '@/layouts/guest-layout';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Recovery Code',
                description:
                    'Please confirm access to your account by entering one of your emergency recovery codes.',
                toggleText: 'login using an authentication code',
            };
        }

        return {
            title: 'Authentication Code',
            description:
                'Enter the authentication code provided by your authenticator application.',
            toggleText: 'login using a recovery code',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm">
                <Head title="Two-Factor Authentication" />

                <Stack gap="xs" mb={20}>
                    <Text size="lg" fw={500}>{authConfigContent.title}</Text>

                    <Text size="sm" c="dimmed">{authConfigContent.description}</Text>
                </Stack>

                <Form
                    {...store.form()}
                    resetOnError
                    resetOnSuccess={!showRecoveryInput}
                >
                    {({ errors, processing, clearErrors }: any) => (
                        <Stack gap="lg">
                            {showRecoveryInput ? (
                                <Stack gap="xs">
                                    <TextInput
                                        name="recovery_code"
                                        placeholder="Enter recovery code"
                                        autoFocus={showRecoveryInput}
                                        required
                                    />

                                    {errors?.recovery_code && (
                                        <Text size="sm" color="red">
                                            {errors.recovery_code}
                                        </Text>
                                    )}
                                </Stack>
                            ) : (
                                <Center>
                                    <Stack align="center" gap="sm">
                                        <PinInput
                                            length={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={(val) => setCode(val)}
                                            disabled={processing}
                                            inputMode="numeric"
                                        />

                                        <input type="hidden" name="code" value={code} />

                                        {errors?.code && (
                                            <Text size="sm" c="red">
                                                {errors.code}
                                            </Text>
                                        )}
                                    </Stack>
                                </Center>
                            )}

                            <Button type="submit" fullWidth loading={processing}>
                                Continue
                            </Button>

                            <Group justify="center" gap="xs">
                                <Text size="sm" c="dimmed">
                                    or you can
                                </Text>

                                <Button
                                    variant="outline"
                                    size="xs"
                                    onClick={() => toggleRecoveryMode(clearErrors)}
                                >
                                    {authConfigContent.toggleText}
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Form>
            </Card>

        </Center>
    );
}

TwoFactorChallenge.layout = (page: React.ReactNode) => (
    <GuestLayout child={page} />
);
