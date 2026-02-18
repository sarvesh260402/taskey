'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Moon, Sun, User as UserIcon, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [user, setUser] = useState({ name: '...', role: '...' });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const role = localStorage.getItem('userRole');

        if (role === 'admin') {
            setUser({ name: 'HR Admin', role: 'Administrator' });
        } else if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({ name: parsed.name, role: parsed.role || 'Member' });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
    };

    return (
        <header className="fixed top-0 right-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card/80 backdrop-blur-md border-b md:left-[var(--sidebar-width,256px)] left-0">
            <div className="flex items-center gap-2 md:gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground md:hidden"
                >
                    <Menu size={24} />
                </button>
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects..."
                        className="w-full bg-secondary py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
                </button>

                <div className="h-8 w-[1px] bg-border mx-2"></div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 p-1 pl-2 rounded-full hover:bg-secondary transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                            <UserIcon size={18} />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-semibold leading-none">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{user.role}</p>
                        </div>
                        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40 bg-transparent"
                                onClick={() => setDropdownOpen(false)}
                            ></div>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-card border rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-2 border-b mb-1 md:hidden">
                                    <p className="text-sm font-bold">{user.name}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-semibold"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
