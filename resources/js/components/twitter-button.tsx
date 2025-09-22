import { Button, ButtonProps } from '@mantine/core';
import { IconBrandTwitterFilled } from '@tabler/icons-react';

export default function TwitterButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
    return (
        <Button leftSection={<IconBrandTwitterFilled size={16} color="#00ACEE" />} variant="default" {...props} />
    );
}
