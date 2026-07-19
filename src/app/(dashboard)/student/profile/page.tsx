'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                
                setUser(data.user);
                
                // Update local storage user data for other components
                const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...currentLocal, ...data.user }));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
    }

    if (loading || !user) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile 👤</h1>
                <p className="text-gray-600 dark:text-gray-400">View your academic and event statistics</p>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="h-32 w-32 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-5xl shadow-inner border-4 border-white dark:border-gray-800">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{user.email}</p>
                        
                        <div className="inline-flex mt-4 items-center px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-semibold shadow-sm">
                            🏆 {user.points || 0} Community Points
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Details</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Role</p>
                            <p className="text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Member Since</p>
                            <p className="text-gray-900 dark:text-gray-100">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </Card>
                
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievements</h3>
                    <div className="space-y-4">
                        {user.points === 0 ? (
                            <p className="text-gray-500 italic">No achievements yet. Register for events to earn points!</p>
                        ) : (
                            <ul className="space-y-3">
                                {(user.points || 0) >= 10 && (
                                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-xl">🌟</span> First Event Registration
                                    </li>
                                )}
                                {(user.points || 0) >= 50 && (
                                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-xl">🔥</span> Active Participant
                                    </li>
                                )}
                                {(user.points || 0) >= 100 && (
                                    <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-xl">👑</span> Campus Leader
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
