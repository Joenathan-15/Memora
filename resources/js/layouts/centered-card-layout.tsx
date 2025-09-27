import GuestLayout from '@/layouts/guest-layout';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import { Center, Card, Stack, Text } from '@mantine/core';

type Props = {
    child: React.ReactNode;
    title: string;
    description: string;
    type: 'guest' | 'auth';
};

export default function CenteredCardLayout({
    child,
    title,
    description,
    type,
}: Props) {
    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm">
                <Head title={title} />

                <Stack gap="xs" mb={20}>
                    <Text size="lg" fw={500}>
                        {title}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {description}
                    </Text>
                </Stack>

                {child}
            </Card>
        </Center>
    );
}

CenteredCardLayout.layout = (page: React.ReactNode) => {
    // @ts-expect-error inertia page props typing workaround
    const { type } = page.props;

    if (type === 'guest') {
        return <GuestLayout child={page} />;
    }

    return <AuthLayout child={page} />;
};
