import { Badge, Card, Group, Text } from '@mantine/core';
import classes from './index.module.css';

const stats = [
    { title: 'Created', value: '2 months ago' },
    { title: 'Downloads', value: '193' },
    { title: 'Confident', value: '12' },
];

interface Props {
    title: string;
    badge: string | undefined;
}

export default function CardExplore({ title, badge }: Props) {
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
