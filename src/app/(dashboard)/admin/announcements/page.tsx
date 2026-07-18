'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AnnouncementCard from '@/components/ui/AnnouncementCard';

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('low');

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch('/api/announcements');
            const data = await res.json();
            if (data.announcements) setAnnouncements(data.announcements);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreate = async (e: any) => {
        e.preventDefault();
        const res = await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, priority })
        });
        
        if (res.ok) {
            alert('Announcement posted!');
            setTitle('');
            setContent('');
            fetchAnnouncements();
        } else {
            alert('Failed to post announcement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this announcement?')) return;
        await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
        fetchAnnouncements();
    };

    return (
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h1 className="text-2xl font-bold mb-6">Post Announcement</h1>
                <form onSubmit={handleCreate} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200">
                    <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            required rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Priority</label>
                        <select 
                            value={priority} 
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <Button type="submit">Post Announcement</Button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Recent Announcements</h2>
                <div className="space-y-4">
                    {loading ? <p>Loading...</p> : announcements.map((ann: any) => (
                        <div key={ann._id} className="relative">
                            <AnnouncementCard announcement={ann} />
                            <button 
                                onClick={() => handleDelete(ann._id)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
