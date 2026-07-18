'use client';

import { useState, useEffect } from 'react';
import AnnouncementCard from '@/components/ui/AnnouncementCard';

export default function StudentAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/announcements')
            .then(res => res.json())
            .then(data => {
                if (data.announcements) setAnnouncements(data.announcements);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8">Loading announcements...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Announcements</h1>
            <div className="space-y-4">
                {announcements.map((ann: any) => (
                    <AnnouncementCard key={ann._id} announcement={ann} />
                ))}
                {announcements.length === 0 && <p>No announcements yet.</p>}
            </div>
        </div>
    );
}
