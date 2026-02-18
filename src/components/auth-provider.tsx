'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (!isLoggedIn && pathname !== '/login') {
            router.push('/login');
        } else if (isLoggedIn && pathname === '/login') {
            router.push('/');
        }

        setIsLoading(false);
    }, [pathname, router]);

    if (isLoading) return null;

    return <>{children}</>;
}
