import { Button, ButtonProps } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';

export default function GithubButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
    return (
        <>
            <Button lightHidden leftSection={<IconBrandGithub size={16} color="#f7f7f7" />} variant="default" {...props} />
            <Button darkHidden leftSection={<IconBrandGithub size={16} color="#1a1e21" />} variant="default" {...props} />
        </>
    );
}
