'use client';

import { useState, useEffect } from 'react';
import EventForm from '@/components/forms/EventForm';
import { useRouter } from 'next/navigation';

export default function EditEventPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/events/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.event) setEvent(data.event);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    const handleSubmit = async (data: any) => {
        const res = await fetch(`/api/events/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || 'Failed to update event');
            return;
        }

        alert('Event updated successfully!');
        router.push('/admin/events');
    };

    if (loading) return <div className="p-8">Loading event data...</div>;
    if (!event) return <div className="p-8 text-red-500">Event not found.</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
            <EventForm initialData={event} onSubmit={handleSubmit} />
        </div>
    );
}
