'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/ui/EventCard';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function AdminEvents() {
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            if (data.events) setEvents(data.events);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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
        </div>
    );
}
