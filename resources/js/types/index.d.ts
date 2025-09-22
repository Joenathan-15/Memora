export interface Auth {
    user: User | null;
}

export interface SharedData {
    [key: string]: unknown;
    auth: Auth;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface LayoutProps {
    child: React.ReactNode;
}
