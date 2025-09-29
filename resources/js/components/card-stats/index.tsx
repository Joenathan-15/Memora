import { Badge, Card, Group, Text } from '@mantine/core';
import classes from './index.module.css';
import Link from '@/components/link';

const stats = [
    { title: 'Cards', value: '50' },
    { title: 'New', value: '10' },
    { title: 'Confident', value: '12' },
];

interface Props {
    title: string;
    href?: string;
}

export default function FlashcardDeckCard({ title, href }: Props) {
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
                <Badge color="green">Ready</Badge>
            </Group>

            <Text
                mt="sm"
                className={classes.title}
                lineClamp={2}
                style={{ minHeight: 0 }}
            >
                {title}
            </Text>

            <Text mb="md" c="dimmed" fz="xs" mt="auto">
                Last studied: Today • Created: 2 months ago • 75% confident
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
                className={`${classes.card} hover:cursor-pointer transition`}
                style={{ textDecoration: 'none', border: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))" }}
            >
                {content}
            </Card>
        );
    }

    return (
        <Card
            withBorder
            padding="lg"
            className={`${classes.card} transition`}
        >
            {content}
        </Card>
    );
}
