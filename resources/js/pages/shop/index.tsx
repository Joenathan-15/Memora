import CardShop from '@/components/card-shop';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import { Container, Grid, SimpleGrid, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface Props {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export default function Shop({ products }: { products: Props[] }) {
    const isMobile = useMediaQuery('(max-width: 800px)');

    return (
        <>
            <Head title="Shop" />
            <Container fluid p="md" pt={15}>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 9 }}>
                        <Container fluid px={0}>
                            <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <CardShop
                                            key={product.id}
                                            id={product.id}
                                            name={product.name}
                                            description={product.description}
                                            price={product.price}
                                            quantity={product.quantity}
                                        />
                                    ))
                                ) : (
                                    <Text>No products found.</Text>
                                )}
                            </SimpleGrid>
                        </Container>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    );
}

Shop.layout = (page: React.ReactNode) => <AuthLayout child={page} />;
