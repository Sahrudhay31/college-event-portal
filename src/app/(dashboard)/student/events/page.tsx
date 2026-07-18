'use client';

import { useState, useEffect, useCallback } from 'react';
import EventCard from '@/components/ui/EventCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import Input from '@/components/ui/Input';

export default function StudentEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (search) queryParams.append('search', search);
            if (category) queryParams.append('category', category);
            
            const res = await fetch(`/api/events?${queryParams.toString()}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setEvents(data.events);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, category]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleRegister = async (eventId: string) => {
        try {
            const res = await fetch('/api/registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId })
            });
            const data = await res.json();
            
            if (!res.ok) {
                alert(data.error || 'Registration failed');
                return;
            }
            
            alert('Successfully registered!');
            fetchEvents(); // Refresh seats available
        } catch (err: any) {
            alert('Error registering for event');
        }
    };

    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
                <h1 className="text-2xl font-bold">Upcoming Events</h1>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-64">
                        <Input 
                            label="Search Events" 
                            placeholder="Search by title, venue..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 h-[42px]"
                        >
                            <option value="">All Categories</option>
                            <option value="Technical">Technical</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Sports">Sports</option>
                            <option value="Workshop">Workshop</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                ) : (
                    <>
                        {events.map((event: any) => (
                            <EventCard 
                                key={event._id} 
                                event={event} 
                                onRegister={handleRegister} 
                            />
                        ))}
                        {events.length === 0 && <p className="text-gray-500 col-span-3">No events match your search.</p>}
                    </>
                )}
            </div>
        </div>
    );
}
