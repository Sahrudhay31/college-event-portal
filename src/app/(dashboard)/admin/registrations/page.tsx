'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/registrations')
            .then(res => res.json())
            .then(data => {
                if (data.registrations) setRegistrations(data.registrations);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8">Loading registrations...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">All Student Registrations</h1>
            
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Event Title</th>
                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Registration Date</th>
                            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">QR Code</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {registrations.map((reg: any) => (
                            <tr key={reg._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4">{reg.userId?.name || 'Unknown'}</td>
                                <td className="p-4">{reg.userId?.email || 'N/A'}</td>
                                <td className="p-4 font-medium">{reg.eventId?.title || 'Deleted Event'}</td>
                                <td className="p-4">{format(new Date(reg.registrationDate), 'PPP p')}</td>
                                <td className="p-4 font-mono text-xs text-gray-500">{reg.qrCode}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {registrations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No registrations found.</div>
                )}
            </div>
        </div>
    );
}
