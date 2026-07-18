'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

export default function EventForm({ initialData = null, onSubmit }: { initialData?: any, onSubmit: (data: any) => Promise<void> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        banner: initialData?.banner || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        time: initialData?.time || '',
        venue: initialData?.venue || '',
        category: initialData?.category || 'Technical',
        registrationDeadline: initialData?.registrationDeadline ? new Date(initialData.registrationDeadline).toISOString().split('T')[0] : '',
        totalSeats: initialData?.totalSeats || 100,
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                seatsAvailable: initialData ? initialData.seatsAvailable : formData.totalSeats // if creating, all seats are available
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Input label="Event Title" name="title" value={formData.title} onChange={handleChange} required />
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <Input label="Banner Image URL" name="banner" value={formData.banner} onChange={handleChange} placeholder="https://..." />
            
            <div className="grid grid-cols-2 gap-4">
                <Input type="date" label="Date" name="date" value={formData.date} onChange={handleChange} required />
                <Input type="time" label="Time" name="time" value={formData.time} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input label="Venue" name="venue" value={formData.venue} onChange={handleChange} required />
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Technical</option>
                        <option>Cultural</option>
                        <option>Sports</option>
                        <option>Workshop</option>
                        <option>Seminar</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input type="date" label="Registration Deadline" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required />
                <Input type="number" label="Total Seats" name="totalSeats" value={formData.totalSeats} onChange={handleChange} required min="1" />
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" loading={loading}>{initialData ? 'Update Event' : 'Create Event'}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
        </form>
    );
}
