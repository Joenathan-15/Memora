import CardShop from '@/components/card-shop';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import {
    Badge,
    Button,
    Container,
    Flex,
    Grid,
    Group,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconCrown,
    IconSearch,
    IconShoppingCart,
    IconSparkles,
} from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    type?: string;
    is_featured?: boolean;
}

export default function Shop({ products }: { products: Props[] }) {
    const isMobile = useMediaQuery('(max-width: 800px)');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter and sort products
    const filteredProducts = products
        .filter(
            (product) =>
                product.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        )
        .filter(
            (product) =>
                selectedCategory === 'all' ||
                product.type === selectedCategory,
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const categories = [
        'all',
        ...new Set(products.map((p) => p.type).filter(Boolean)),
    ] as string[];
    const featuredProducts = products.filter((p) => p.is_featured);

    return (
        <>
            <Head title="Shop" />
            <Container size="xl" p="md">
                {/* Header Section */}
                <Stack gap="lg" mb="xl">
                    <Flex
                        justify="space-between"
                        align="flex-end"
                        wrap="wrap"
                        gap="md"
                    >
                        <Stack gap="xs">
                            <Group gap="sm">
                                <ThemeIcon
                                    size={50}
                                    variant="gradient"
                                    gradient={{ from: 'yellow', to: 'orange' }}
                                >
                                    <IconCrown size={26} />
                                </ThemeIcon>
                                <div>
                                    <Title order={1} size="h2">
                                        Currency Shop
                                    </Title>
                                    <Text c="dimmed" size="lg">
                                        Unlock powerful features to enhance your
                                        learning
                                    </Text>
                                </div>
                            </Group>
                        </Stack>

                        {/* Quick Stats */}
                        <Group gap="lg">
                            <Stack gap={2} align="center">
                                <Badge variant="light" color="blue" size="lg">
                                    {products.length} Products
                                </Badge>
                                <Text size="sm" c="dimmed">
                                    Available
                                </Text>
                            </Stack>
                        </Group>
                    </Flex>

                    {/* Search and Filters */}
                    <Paper withBorder p="md" radius="md">
                        <Flex gap="md" direction={isMobile ? 'column' : 'row'}>
                            <TextInput
                                placeholder="Search products..."
                                leftSection={<IconSearch size={16} />}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <Select
                                placeholder="Category"
                                data={categories.map((cat) => ({
                                    value: cat,
                                    label:
                                        cat.charAt(0).toUpperCase() +
                                        cat.slice(1),
                                }))}
                                value={selectedCategory}
                                onChange={(value) =>
                                    setSelectedCategory(value || 'all')
                                }
                                style={{ minWidth: 120 }}
                            />
                            <Select
                                placeholder="Sort by"
                                data={[
                                    { value: 'name', label: 'Name' },
                                    {
                                        value: 'price-low',
                                        label: 'Price: Low to High',
                                    },
                                    {
                                        value: 'price-high',
                                        label: 'Price: High to Low',
                                    },
                                ]}
                                value={sortBy}
                                onChange={(value) => setSortBy(value || 'name')}
                                style={{ minWidth: 160 }}
                            />
                        </Flex>
                    </Paper>
                </Stack>

                {/* Featured Products Banner */}
                {featuredProducts.length > 0 && (
                    <Paper
                        withBorder
                        p="lg"
                        mb="xl"
                        radius="lg"
                        style={{
                            background:
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                        }}
                    >
                        <Flex
                            gap="lg"
                            align="center"
                            direction={isMobile ? 'column' : 'row'}
                        >
                            <ThemeIcon size={60} variant="white" color="white">
                                <IconSparkles size={30} />
                            </ThemeIcon>
                            <Stack gap="xs" style={{ flex: 1 }}>
                                <Title order={2} c="white" size="h3">
                                    Featured Products
                                </Title>
                                <Text c="white" size="sm">
                                    Most popular choices among our learners
                                </Text>
                            </Stack>
                            <Badge
                                variant="filled"
                                color="white"
                                size="lg"
                                c="blue"
                            >
                                🔥 Trending
                            </Badge>
                        </Flex>
                    </Paper>
                )}

                {/* Products Grid */}
                <Grid>
                    <Grid.Col span={{ base: 12 }}>
                        <Stack gap="md">
                            {/* Results Header */}
                            <Flex justify="space-between" align="center">
                                <Text fw={500} c="dimmed">
                                    Showing {filteredProducts.length} of{' '}
                                    {products.length} products
                                </Text>
                                {searchQuery && (
                                    <Button
                                        variant="subtle"
                                        size="sm"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        Clear search
                                    </Button>
                                )}
                            </Flex>

                            {/* Products Grid */}
                            {filteredProducts.length === 0 ? (
                                <Paper
                                    withBorder
                                    p="xl"
                                    ta="center"
                                    radius="md"
                                >
                                    <Stack gap="md">
                                        <IconShoppingCart
                                            size={60}
                                            color="var(--mantine-color-gray-5)"
                                        />
                                        <Stack gap="xs">
                                            <Title order={3} size="h3">
                                                No products found
                                            </Title>
                                            <Text c="dimmed">
                                                {searchQuery
                                                    ? `No results for "${searchQuery}"`
                                                    : 'No products available at the moment'}
                                            </Text>
                                        </Stack>
                                        {searchQuery && (
                                            <Button
                                                variant="light"
                                                onClick={() =>
                                                    setSearchQuery('')
                                                }
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </Stack>
                                </Paper>
                            ) : (
                                <SimpleGrid
                                    cols={{ base: 1, sm: 2, lg: 3 }}
                                    spacing="lg"
                                >
                                    {filteredProducts.map((product) => (
                                        <CardShop
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            description={product.description}
                                            price={product.price}
                                            quantity={product.quantity}
                                            type={product.type}
                                            is_featured={product.is_featured}
                                        />
                                    ))}
                                </SimpleGrid>
                            )}
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}

Shop.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
