import React from "react";
import { Anchor, type AnchorProps } from "@mantine/core";
import { Link as InertiaLink } from "@inertiajs/react";
import type {
    ComponentProps,
    ElementType,
    ReactNode,
} from 'react';

type InertiaLinkProps = ComponentProps<typeof InertiaLink>;

type Props = Omit<InertiaLinkProps, "size">
    & Omit<AnchorProps, "component">
    & {
    size?: AnchorProps["size"];
    component?: ElementType;
    children?: ReactNode;
    underline?: 'always' | 'hover' | 'never' | 'not-hover',
};

export default function Link({ children, ...props }: Props) {
    return (
        <Anchor component={InertiaLink as any} {...props}>
            {children}
        </Anchor>
    );
}
