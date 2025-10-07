import {
    IconHome,
    IconCompass,
    IconCirclePlus,
    IconBuildingStore,
    IconUser,
} from '@tabler/icons-react';
import { Flex, Tooltip } from '@mantine/core';
import classes from './index.module.css';
import Link from '@/components/link';
import { usePage } from '@inertiajs/react';

const mainLinks = [
    { icon: IconHome, label: 'Home', url: '/home', name: 'upload' },
    { icon: IconCompass, label: 'Explore', url: '/explore', name: 'decks.index' },
    { icon: IconCirclePlus, label: 'Create', url: '/create', name: 'decks.create' },
    { icon: IconBuildingStore, label: 'Shop', url: '/shop', name: 'decks.due' },
    { icon: IconUser, label: 'Profile', url: '/profile', name: 'profile' },
];

export function BottomNavbar() {
    const { url } = usePage();

    return (
        <nav className={classes.navbar}>
            <Flex justify="space-around" align="center" h="100%">
                {mainLinks.map((link) => {
                    const isActive = url.startsWith(link.url);

                    return (
                        <Tooltip
                            key={link.label}
                            label={link.label}
                            position="top"
                            withArrow
                            openDelay={300}
                        >
                            <Link
                                href={link.url}
                                underline="never"
                                className={`${classes.mainLink} ${isActive ? classes.activeLink : ''}`}
                            >
                                <div className={classes.mainLinkInner}>
                                    <link.icon
                                        size={26}
                                        className={classes.mainLinkIcon}
                                        stroke={1.8}
                                    />
                                </div>
                            </Link>
                        </Tooltip>
                    );
                })}
            </Flex>
        </nav>
    );
}

export default BottomNavbar;
