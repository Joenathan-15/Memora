import { router } from '@inertiajs/react';
import { Button, Card, Group, Stack, Text } from '@mantine/core';
interface Props {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export default function CardShop({
    id,
    name,
    description,
    price,
    quantity,
}: Props) {
    // Format number to Indonesian Rupiah
    const formatRupiah = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    return (
        <Card
            shadow="xs"
            padding="md"
            radius="lg"
            withBorder
            style={{
                transition: 'all 0.2s ease',
            }}
            className="transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md"
        >
            <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                    <Text fw={600} size="lg">
                        {name}
                    </Text>
                    <Text fw={700} size="lg" c="blue">
                        {formatRupiah(price)}
                    </Text>
                </Group>

                <Text size="sm" c="dimmed" lh={1.5} lineClamp={2}>
                    {description}
                </Text>

                <Button
                    color="blue"
                    fullWidth
                    radius="md"
                    variant="filled"
                    mt="sm"
                    onClick={() => {
                        router.post('/shop', { product_id: id });
                    }}
                >
                    Purchase Now
                </Button>
            </Stack>
        </Card>
    );
}
