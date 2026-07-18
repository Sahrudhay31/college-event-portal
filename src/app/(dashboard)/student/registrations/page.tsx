'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/ui/EventCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function StudentRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/registrations');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setRegistrations(data.registrations);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (eventId: string) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) return;
        
        try {
            // Find the registration ID for this event
            const reg = registrations.find((r: any) => r.eventId._id === eventId);
            if (!reg) return;

            const res = await fetch(`/api/registrations/${(reg as any)._id}`, {
                method: 'DELETE'
            });
            
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Failed to cancel');
                return;
            }
            
            alert('Registration cancelled.');
            fetchRegistrations(); // Refresh list
        } catch (err) {
            alert('Error cancelling registration');
        }
    };

    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">My Registrations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                ) : (
                    <>
                        {registrations.map((reg: any) => (
                            <EventCard 
                                key={reg._id} 
                                event={reg.eventId} 
                                isRegistered={true}
                                onCancel={handleCancel}
                                qrCode={reg.qrCode}
                            />
                        ))}
                        {registrations.length === 0 && <p className="col-span-3 text-gray-500">You haven't registered for any events.</p>}
                    </>
                )}
            </div>
        </div>
    );
}
