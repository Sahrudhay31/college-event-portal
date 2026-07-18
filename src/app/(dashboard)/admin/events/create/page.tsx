'use client';

import EventForm from '@/components/forms/EventForm';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || 'Failed to create event');
            return;
        }

        alert('Event created successfully!');
        router.push('/admin/events');
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Event</h1>
            <EventForm onSubmit={handleSubmit} />
        </div>
    );
}
