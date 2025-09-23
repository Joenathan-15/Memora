import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';
import { Center, Card, Stack, Text } from '@mantine/core';

export default function CenteredCardLayout({ child, title, description }: { child: React.ReactNode, title: string, description: string }) {
    return (
        <Center style={{ width: '100%', height: '100vh' }}>
            <Card p="lg" w={400} withBorder shadow="sm">
                <Head title={title} />

                <Stack gap="xs" mb={20}>
                    <Text size="lg" fw={500}>{title}</Text>

                    <Text size="sm" c="dimmed">{description}</Text>
                </Stack>

                {child}
            </Card>
        </Center>
    )
}

CenteredCardLayout.layout = (page: React.ReactNode) => (
    <GuestLayout child={page} />
);
