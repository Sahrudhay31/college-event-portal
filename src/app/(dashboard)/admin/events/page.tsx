'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/ui/EventCard';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function AdminEvents() {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`/api/events?page=${page}&limit=6`);
            const data = await res.json();
            if (data.events) {
                setEvents(data.events);
                setTotalPages(data.pagination?.pages || 1);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this event forever?')) return;
        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            fetchEvents();
        } catch (err) {
            alert('Error deleting event');
        }
    };

    if (loading) return <div className="p-8">Loading events...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Events</h1>
                <Button onClick={() => router.push('/admin/events/create')}>+ Create New</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event: any) => (
                    <EventCard 
                        key={event._id} 
                        event={event} 
                        isAdmin={true}
                        onEdit={(id) => router.push(`/admin/events/${id}/edit`)}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium dark:text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
