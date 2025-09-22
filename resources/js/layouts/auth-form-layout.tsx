import RootLayout from '@/layouts/root-layout';
import { LayoutProps } from '@/types';

function AuthFormLayout({ child }: LayoutProps) {
    return (
        <>
            <main>{child}</main>
        </>
    );
}

AuthFormLayout.layout = (page: React.ReactNode) => <RootLayout child={page} />;

export default AuthFormLayout;
