import { LayoutProps } from '@/types';

function RootLayout({ child }: LayoutProps) {
    document.body.dataset.loaded = "true";

    return (
        <>
            {child}
        </>
    );
}

export default RootLayout;
