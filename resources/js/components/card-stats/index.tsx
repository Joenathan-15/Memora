import { Badge, Card, Group, Text } from '@mantine/core';
import classes from './index.module.css';

const stats = [
    { title: 'Cards', value: '50' },
    { title: 'New', value: '10' },
    { title: 'Confident', value: '12' },
];

export default function FlashcardDeckCard() {
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
            className="transition-all duration-300 hover:cursor-pointer group-hover:opacity-50 hover:!opacity-100 hover:scale-105"
        >
            <Group mt="-8" justify="space-between">
                <span>🧠</span>
                <Badge color="green">Ready</Badge>
            </Group>

            <Group justify="space-between" mt="sm">
                <Text className={classes.title}>Spanish Vocabulary</Text>
                <Group gap={5}>
                    <Text fz="xs" c="dimmed">
                        75% confident
                    </Text>
                </Group>
            </Group>
            <Text mt="sm" mb="md" c="dimmed" fz="xs">
                Last studied: Today • Created: 2 months ago
            </Text>
            <Card.Section className={classes.footer}>{items}</Card.Section>
        </Card>
    );
}
