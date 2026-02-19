'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell, Moon, Sun, User as UserIcon, LogOut, ChevronDown, Menu, MessageSquare, ListTodo, PhoneMissed, Video, Phone, X, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

interface Notification {
    id: string;
    type: 'message' | 'task' | 'missed_call' | 'video_call' | 'call';
    title: string;
    description: string;
    time: string;
    read: boolean;
    avatar?: string;
}

const initialNotifications: Notification[] = [
    {
        id: '1',
        type: 'message',
        title: 'New Message from Sarah',
        description: 'Hey! Can you review the design specs for the dashboard?',
        time: '2 min ago',
        read: false,
    },
    {
        id: '2',
        type: 'task',
        title: 'New Task Assigned',
        description: 'Complete the Q1 report by end of this week.',
        time: '15 min ago',
        read: false,
    },
    {
        id: '3',
        type: 'missed_call',
        title: 'Missed Call from Alex',
        description: 'Tried to reach you about the client meeting.',
        time: '30 min ago',
        read: false,
    },
    {
        id: '4',
        type: 'video_call',
        title: 'Video Call — Team Standup',
        description: 'Daily standup meeting started at 10:00 AM.',
        time: '1 hr ago',
        read: true,
    },
    {
        id: '5',
        type: 'message',
        title: 'Message from HR Team',
        description: 'Your leave request has been approved for next Monday.',
        time: '2 hr ago',
        read: true,
    },
    {
        id: '6',
        type: 'call',
        title: 'Call from Manager',
        description: 'Discussed project timeline and upcoming milestones.',
        time: '3 hr ago',
        read: true,
    },
    {
        id: '7',
        type: 'task',
        title: 'Task Updated',
        description: 'Bug fix for login page moved to "In Progress".',
        time: '5 hr ago',
        read: true,
    },
];

const notificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'message':
            return <MessageSquare size={16} />;
        case 'task':
            return <ListTodo size={16} />;
        case 'missed_call':
            return <PhoneMissed size={16} />;
        case 'video_call':
            return <Video size={16} />;
        case 'call':
            return <Phone size={16} />;
    }
};

const notificationColor = (type: Notification['type']) => {
    switch (type) {
        case 'message':
            return 'bg-blue-500/15 text-blue-500';
        case 'task':
            return 'bg-amber-500/15 text-amber-500';
        case 'missed_call':
            return 'bg-red-500/15 text-red-500';
        case 'video_call':
            return 'bg-purple-500/15 text-purple-500';
        case 'call':
            return 'bg-emerald-500/15 text-emerald-500';
    }
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [user, setUser] = useState({ name: '...', role: '...' });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

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

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        }
        if (notifOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notifOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
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

                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-destructive rounded-full px-1 border-2 border-card">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <>
                            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setNotifOpen(false)} />
                            <div className="fixed inset-x-4 top-20 z-50 md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 w-auto md:w-[360px] max-h-[480px] bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b bg-card/90 backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                                                title="Mark all as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setNotifOpen(false)}
                                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Notification List */}
                                <div className="overflow-y-auto max-h-[380px] divide-y divide-border/50">
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                            <Bell size={32} className="mb-2 opacity-30" />
                                            <p className="text-sm font-medium">No notifications</p>
                                            <p className="text-xs mt-1">You&apos;re all caught up!</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <button
                                                key={notif.id}
                                                onClick={() => markAsRead(notif.id)}
                                                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60 ${!notif.read ? 'bg-primary/[0.03]' : ''
                                                    }`}
                                            >
                                                <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${notificationColor(notif.type)}`}>
                                                    {notificationIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {notif.title}
                                                        </p>
                                                        {!notif.read && (
                                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                                                        {notif.description}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium">
                                                        {notif.time}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                {notifications.length > 0 && (
                                    <div className="border-t px-4 py-2.5 flex items-center justify-between bg-card/90">
                                        <button
                                            onClick={clearAll}
                                            className="text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            Clear all
                                        </button>
                                        <button
                                            onClick={() => { setNotifOpen(false); router.push('/settings'); }}
                                            className="text-[11px] font-semibold text-primary hover:underline"
                                        >
                                            Notification Settings
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

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
