import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './user-button.module.css';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function UserButton() {
    const { auth } = usePage<SharedData>().props;

    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                    radius="xl"
                />

                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {auth.user?.name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {auth.user?.email}
                    </Text>
                </div>

                <IconChevronRight size={14} stroke={1.5} />
            </Group>
        </UnstyledButton>
    );
}
