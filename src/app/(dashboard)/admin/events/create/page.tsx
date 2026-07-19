'use client';

import EventForm from '@/components/forms/EventForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CreateEventFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read AI-generated values from URL if they exist
    const initialData = {
        title: searchParams.get('title') || '',
        description: searchParams.get('description') || '',
        venue: searchParams.get('venue') || '',
    };

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
            <EventForm initialData={initialData} onSubmit={handleSubmit} />
        </div>
    );
}

export default function CreateEventPage() {
    return (
        <Suspense fallback={<div className="p-8 text-gray-500">Loading form...</div>}>
            <CreateEventFormContent />
        </Suspense>
    );
}
