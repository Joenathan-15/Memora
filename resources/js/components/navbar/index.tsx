import { IconUpload, IconBook, IconClock, IconStar, IconPlus, IconUser, IconSearch } from '@tabler/icons-react';
import {
    ActionIcon,
    Badge,
    Box,
    Code,
    Group,
    ScrollArea,
    Text,
    TextInput,
    UnstyledButton,
} from '@mantine/core';
import { UserButton } from '@/components/navbar/user-button';
import classes from './index.module.css';
import Link from '@/components/link';

const mainLinks = [
    { icon: IconUpload, label: 'Upload PDF', url: '/upload' },
    { icon: IconBook, label: 'All Decks', url: '/decks' },
    { icon: IconClock, label: 'Due for Review', url: '/decks/due', notifications: 5 },
    { icon: IconPlus, label: 'Create Deck', url: '/decks/create' },
    { icon: IconUser, label: 'Profile', url: '/profile' },
];

const decks = [
    { emoji: '📘', label: 'Biology 101' },
    { emoji: '📗', label: 'World History' },
    { emoji: '📕', label: 'Spanish Vocabulary' },
    { emoji: '📙', label: 'Physics Formulas' },
    { emoji: '📒', label: 'Chemistry Reactions' },
];

export function Navbar() {
    return (
        <nav className={classes.navbar}>
            <div className={classes.section}>
                <UserButton />
            </div>

            <TextInput
                placeholder="Search decks or flashcards..."
                size="xs"
                leftSection={<IconSearch size={12} stroke={1.5} />}
                rightSectionWidth={70}
                rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
                styles={{ section: { pointerEvents: 'none' } }}
                mb="sm"
            />

            <div className={classes.section}>
                {mainLinks.map((link) => (
                    <Link href={link.url} underline="never" component={UnstyledButton} key={link.label} className={classes.mainLink}>
                        <div className={classes.mainLinkInner}>
                            <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
                            <span>{link.label}</span>
                        </div>
                        {link.notifications && (
                            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
                                {link.notifications}
                            </Badge>
                        )}
                    </Link>
                ))}
            </div>

            <div className={`${classes.section} ${classes.collectionsSection}`}>
                <Group className={classes.collectionsHeader} justify="space-between">
                    <Text size="xs" fw={500} c="dimmed">
                        Decks
                    </Text>
                </Group>

                <div className={classes.collectionsContainer}>
                    <ScrollArea className={classes.collectionsScroll}>
                        {decks.map((deck) => (
                            <UnstyledButton key={deck.label} className={classes.collectionLink}>
                                <Box component="span" mr={8} fz={16}>
                                    {deck.emoji}
                                </Box>
                                {deck.label}
                            </UnstyledButton>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
