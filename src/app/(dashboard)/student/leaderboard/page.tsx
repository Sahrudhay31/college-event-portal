'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface LeaderboardUser {
    _id: string;
    name: string;
    points: number;
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setUsers(data.leaderboard);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campus Leaderboard 🏆</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Earn points by participating in events, organizing, and volunteering!
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <LoadingSkeleton />
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                                    <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                                    <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Community Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user, index) => {
                                    const isCurrentUser = currentUser?._id === user._id;
                                    let rankTrophy = `#${index + 1}`;
                                    if (index === 0) rankTrophy = '🥇 1st';
                                    if (index === 1) rankTrophy = '🥈 2nd';
                                    if (index === 2) rankTrophy = '🥉 3rd';

                                    return (
                                        <tr 
                                            key={user._id}
                                            className={`${isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} transition-colors`}
                                        >
                                            <td className="py-4 px-6 font-semibold text-gray-900 dark:text-gray-100">
                                                {rankTrophy}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold mr-3">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                                            {user.name} {isCurrentUser && '(You)'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    {user.points || 0} pts
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No students on the leaderboard yet. Register for an event to be the first!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
}
