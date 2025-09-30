import GuestLayout from '@/layouts/guest-layout';
import { Head } from '@inertiajs/react';
import CardExplore from '@/components/card-explore';
import {
    ActionIcon,
    Text,
    Card,
    Checkbox,
    Container,
    Grid,
    Group,
    ScrollArea,
    Select,
    SimpleGrid,
    Stack,
    TextInput,
} from '@mantine/core';
import {
    IconSearch,
} from '@tabler/icons-react';

export default function Welcome() {
    return (
        <>
            <Head title="Explore" />
            <Container fluid p="md" h={"94vh"} pt={15}>
                <Grid>
                    <Grid.Col span={{base: 12, md: 3}}>
                        <Stack gap="md">
                            <Card withBorder>
                                <Group grow={false} w="100%">
                                    <TextInput
                                        placeholder="Search a deck..."
                                        size="sm"
                                        style={{ flex: 1 }}
                                    />
                                    <ActionIcon
                                        size="input-sm"
                                        variant="default"
                                        aria-label="ActionIcon the same size as inputs"
                                    >
                                        <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
                                    </ActionIcon>
                                </Group>
                            </Card>
                            <Card withBorder>
                                <Text mb={8}>Order</Text>
                                <Select
                                    placeholder="Pick an order"
                                    defaultValue="Relevance"
                                    data={['Relevance', 'Most Download', 'Least Download', 'Newest']}
                                />
                            </Card>
                            <Card withBorder>
                                <Text mb={12}>Category</Text>
                                <ScrollArea h={'40vh'}>
                                    <Stack>
                                        <Checkbox label="Languages" />
                                        <Checkbox label="Mathematics" />
                                        <Checkbox label="Science" />
                                        <Checkbox label="History" />
                                        <Checkbox label="Geography" />
                                        <Checkbox label="Literature & Arts" />
                                        <Checkbox label="Technology & IT" />
                                        <Checkbox label="Engineering" />
                                        <Checkbox label="Business & Finance" />
                                        <Checkbox label="Law & Political Science" />
                                        <Checkbox label="Medicine & Nursing" />

                                    </Stack>
                                </ScrollArea>
                            </Card>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={{base: 12, md: 9}}>
                        <Container fluid px={0}>
                            <ScrollArea h={'91vh'}>
                                <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
                                    {[...Array(30)].map((deck, i) => {
                                        const badges: Array<'featured' | 'trending' | undefined> = [
                                            'featured',
                                            'trending',
                                            undefined,
                                            undefined,
                                            undefined,
                                        ];
                                        const badge = badges[Math.floor(Math.random() * badges.length)];

                                        return <CardExplore key={i} title={"deck.title"} badge={badge} />;
                                        })}
                                </SimpleGrid>
                            </ScrollArea>
                        </Container>
                    </Grid.Col>
                </Grid>
            </Container>


        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <GuestLayout child={page} />;
