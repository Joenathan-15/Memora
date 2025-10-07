import Link from '@/components/link';
import { ActionIcon, Badge, Card, Flex, Group, Text } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import classes from './index.module.css';

// --- Utility to format relative time ---
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return 'Last week';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

    return `${Math.floor(diffDays / 365)} years ago`;
}

const stats = [
    { title: 'Cards', value: 0 },
    { title: 'New', value: '-' },
    { title: 'Confident', value: '-' },
];

interface Props {
    title: string;
    href?: string;
    cards: number;
    created_at: string;
    status: string;
}

export default function CardStats({ title, href, cards, created_at, status }: Props) {
    stats[0].value = cards;
    const formattedDate = formatRelativeTime(created_at);

    const items = stats.map((stat) => (
        <div key={stat.title}>
            <Text size="xs" c="dimmed">
                {stat.title}
            </Text>
            <Text fw={500} size="sm">
                {stat.value}
            </Text>
        </div>
    ));

    const content = (
        <>
            <Group mt="-8" justify="space-between">
                <span>🧠</span>
                <Flex align="center" gap="sm">
                    <Badge color={status === 'ready' ? 'red' : status === 'done' ? 'green' : 'gray'}>
                        {status}
                    </Badge>
                    <Link href={`decks/${href}/edit`}>
                        <ActionIcon variant="default" aria-label="Edit">
                            <IconAdjustments
                                style={{ width: '70%', height: '70%' }}
                                stroke={1.5}
                            />
                        </ActionIcon>
                    </Link>
                </Flex>
            </Group>

            <Text mt="sm" className={classes.title} lineClamp={2}>
                {title}
            </Text>

            <Text mb="md" c="dimmed" fz="xs" mt="auto">
                Created: {formattedDate} • Last studied: Yesterday
            </Text>

            <Card.Section className={classes.footer}>{items}</Card.Section>
        </>
    );

    if (href) {
        return (
            <Card
                withBorder
                padding="lg"
                component={Link}
                href={`decks/${href}`}
                className={`${classes.card} transition hover:cursor-pointer`}
                style={{
                    textDecoration: 'none',
                    border: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
                }}
            >
                {content}
            </Card>
        );
    }

    return (
        <Card withBorder padding="lg" className={`${classes.card} transition`}>
            {content}
        </Card>
    );
}
