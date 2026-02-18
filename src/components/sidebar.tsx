'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CheckSquare,
    Layers,
    Calendar,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sparkles,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Projects', icon: Layers, href: '/projects' },
    { name: 'Employees', icon: Users, href: '/employees' },
    { name: 'Messages', icon: MessageSquare, href: '/chat' },
    { name: 'Calendar', icon: Calendar, href: '/calendar' },
    { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const [collapsed, setCollapsed] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setUserRole(localStorage.getItem('userRole'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <aside className={cn(
            "fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r bg-card",
            collapsed ? "w-20" : "w-64",
            // Mobile states
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
            {/* Mobile close button */}
            <button
                onClick={() => setIsOpen(false)}
                className="md:hidden absolute -right-10 top-4 p-2 bg-primary text-primary-foreground rounded-r-lg shadow-lg"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col h-full px-3 py-4">
                <div className="flex items-center justify-between mb-8 px-2">
                    {!collapsed && (
                        <div className="flex items-center gap-2 font-bold text-xl text-primary">
                            <Sparkles className="w-8 h-8" />
                            <span>Taskey</span>
                        </div>
                    )}
                    {collapsed && (
                        <Sparkles className="w-8 h-8 text-primary mx-auto" />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 rounded-md hover:bg-secondary text-muted-foreground"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {sidebarItems.map((item) => {
                        // Role-based filtering
                        if (item.name === 'Employees' && userRole !== 'admin') {
                            return null;
                        }

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", isActive ? "" : "group-hover:text-primary")} />
                                {!collapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t pt-4 space-y-2">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-secondary hover:text-destructive w-full",
                            collapsed ? "justify-center" : ""
                        )}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
