import { Badge, Card, Group, Text } from '@mantine/core';
import classes from './index.module.css';

const stats = [
    { title: 'Created', value: '-' },
    { title: 'Downloads', value: '-' },
    { title: 'Confident', value: '-' },
];

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

interface Props {
    title: string;
    created_at: string;
    badge: string | undefined;
}

export default function CardExplore({ title, created_at, badge }: Props) {
    const formattedDate = formatRelativeTime(created_at);
    stats[0].value = formattedDate;
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

    return (
        <Card
            withBorder
            padding="lg"
            className={`${classes.card} group-hover:opacity-50 hover:cursor-pointer hover:!opacity-100`}
        >
            <Group mt="-8" justify="space-between">
                <span>🧠</span>
                {badge && (
                    <Badge color={badge === 'trending' ? 'orange' : 'yellow'}>
                        {badge}
                    </Badge>
                )}
            </Group>

            <Text mt="sm" className={classes.title}>
                {title}
            </Text>
            <Card.Section className={classes.footer}>{items}</Card.Section>
        </Card>
    );
}
