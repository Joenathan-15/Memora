import { usePage } from '@inertiajs/react';
import { Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function TopBar() {
    const { props } = usePage();
    const isMobile = useMediaQuery('(max-width: 800px)');
    const user = props.auth.user;
    return (
        <>
            {isMobile ? (
                <header
                    className="sticky top-0 z-50"
                    style={{ backgroundColor: 'var(--mantine-color-body)' }}
                >
                    <div className="flex justify-between p-4">
                        <Text
                            size="xl"
                            c="blue"
                            className="tracking-widest"
                            mx={12}
                            fw={800}
                        >
                            Memora
                        </Text>
                        {/* TODO: Add Dynamic User Gems */}
                        <Text size="xl">💎 {user.user_info.gems}</Text>
                    </div>
                </header>
            ) : null}
        </>
    );
}
