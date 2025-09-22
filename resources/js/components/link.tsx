import React from "react";
import { Anchor, type AnchorProps } from "@mantine/core";
import { Link as InertiaLink } from "@inertiajs/react";
import type { ComponentProps } from 'react';

type InertiaLinkProps = ComponentProps<typeof InertiaLink>;

type Props = Omit<InertiaLinkProps, "size">
    & Omit<AnchorProps, "component">
    & { size?: AnchorProps["size"] };

export default function Link({ children, ...props }: Props) {
    return (
        <Anchor component={InertiaLink as any} {...props}>
            {children}
        </Anchor>
    );
}
