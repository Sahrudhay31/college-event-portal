'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">🎓 Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.name || 'Student'}!</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/student/events"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">📅 View Events</h2>
                    <p className="text-gray-500">Browse and register for upcoming events</p>
                </Link>
                <Link
                    href="/student/registrations"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">📋 My Registrations</h2>
                    <p className="text-gray-500">View and manage your registered events</p>
                </Link>
                <Link
                    href="/student/announcements"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">📢 Announcements</h2>
                    <p className="text-gray-500">Read the latest updates</p>
                </Link>
            </div>
        </div>
    );
}