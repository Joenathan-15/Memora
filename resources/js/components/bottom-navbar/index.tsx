import {
    IconHome,
    IconMap,
    IconCirclePlus,
    IconBuildingStore,
    IconUser,
} from '@tabler/icons-react';
import { Flex, Stack, Text, UnstyledButton } from '@mantine/core';
import classes from './index.module.css';
import Link from '@/components/link';
import { usePage } from '@inertiajs/react';

const mainLinks = [
    { icon: IconHome, label: 'Home', url: '/home', name: 'upload' },
    { icon: IconMap, label: 'Explore', url: '/explore', name: 'decks.index' },
    { icon: IconCirclePlus, label: 'Create Deck', url: '/create', name: 'decks.create' },
    { icon: IconBuildingStore, label: 'Store', url: '/store', name: 'decks.due' },
    { icon: IconUser, label: 'Profile', url: '/profile', name: 'profile' },
];

export function BottomNavbar() {
    const { url, component } = usePage(); // url = current path, component = current inertia page

    return (
        <nav className={classes.navbar}>
            <Flex justify="space-between">
                {mainLinks.map((link) => {
                    const isActive = url.startsWith(link.url);

                    return (
                        <Link
                            href={link.url}
                            underline="never"
                            key={link.label}
                            className={`${classes.mainLink} ${isActive ? classes.activeLink : ''}`}
                        >
                            <div className={classes.mainLinkInner} >
                                <link.icon
                                    size={30}
                                    className={classes.mainLinkIcon}
                                    stroke={1.5}
                                />
                            </div>
                        </Link>
                    );
                })}
            </Flex>
        </nav>
    );
}

export default BottomNavbar;
