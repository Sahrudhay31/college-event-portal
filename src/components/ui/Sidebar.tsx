'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
    isOpen: boolean;
    isAdmin: boolean;
}

const studentLinks = [
    { href: '/student', label: 'Dashboard' },
    { href: '/student/events', label: 'Events' },
    { href: '/student/calendar', label: 'Calendar' },
    { href: '/student/registrations', label: 'My Registrations' },
    { href: '/student/announcements', label: 'Announcements' },
    { href: '/student/leaderboard', label: 'Leaderboard' },
    { href: '/student/profile', label: 'My Profile' },
];

const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/events', label: 'Manage Events' },
    { href: '/admin/events/create', label: 'Create Event' },
    { href: '/admin/ai-planner', label: 'AI Event Planner' },
    { href: '/admin/conflicts', label: 'AI Conflict Detector' },
    { href: '/admin/registrations', label: 'Registrations' },
    { href: '/admin/announcements', label: 'Announcements' },
    { href: '/student/leaderboard', label: 'Leaderboard' },
];

export default function Sidebar({ isOpen, isAdmin }: SidebarProps) {
    const pathname = usePathname();
    const links = isAdmin ? adminLinks : studentLinks;

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 bottom-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 overflow-y-auto',
                !isOpen && '-translate-x-full'
            )}
        >
            <nav className="p-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                            )}
                        >
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}