'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
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
            const parsed = JSON.parse(userData);
            if (parsed.role !== 'admin') {
                router.push('/student');
                return;
            }
            setUser(parsed);
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
            <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.name || 'Admin'}!</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/events"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">🎯 Manage Events</h2>
                    <p className="text-gray-500">Create, edit, or delete events</p>
                </Link>
                <Link
                    href="/admin/events/create"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">➕ Create Event</h2>
                    <p className="text-gray-500">Add a new event</p>
                </Link>
                <Link
                    href="/admin/registrations"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">📋 Registrations</h2>
                    <p className="text-gray-500">View all student registrations</p>
                </Link>
                <Link
                    href="/admin/announcements"
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-400 transition"
                >
                    <h2 className="text-xl font-semibold">📢 Announcements</h2>
                    <p className="text-gray-500">Post or manage announcements</p>
                </Link>
            </div>
        </div>
    );
}