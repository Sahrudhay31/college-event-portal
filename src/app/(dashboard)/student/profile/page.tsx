'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        github: '',
        linkedin: '',
        avatar: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setUser(data.user);
            setEditForm({
                name: data.user.name || '',
                github: data.user.github || '',
                linkedin: data.user.linkedin || '',
                avatar: data.user.avatar || ''
            });
            
            // Update local storage user data for other components
            const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentLocal, ...data.user }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            setUser(data.user);
            setIsEditing(false);
            
            const currentLocal = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentLocal, ...data.user }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 2MB to prevent large Base64 strings in DB)
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size must be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (error && !isEditing) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
    }

    if (loading || !user) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Profile 👤</h1>
                    <p className="text-gray-600 dark:text-gray-400">View and edit your personal information</p>
                </div>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                )}
            </div>

            {error && isEditing && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">{error}</div>
            )}

            <Card>
                {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                {editForm.avatar ? (
                                    <img 
                                        src={editForm.avatar} 
                                        alt="Avatar" 
                                        className="h-32 w-32 rounded-full object-cover shadow-inner border-4 border-gray-100 dark:border-gray-700"
                                    />
                                ) : (
                                    <div className="h-32 w-32 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-5xl shadow-inner border-4 border-gray-100 dark:border-gray-700">
                                        {editForm.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm font-medium">Upload Image</span>
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <p className="text-sm text-gray-500">Click the avatar to upload a new profile picture (Max 2MB).</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Full Name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                required
                            />
                            
                            <Input
                                label="GitHub Username"
                                placeholder="johndoe"
                                value={editForm.github}
                                onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                            />
                            
                            <Input
                                label="LinkedIn Profile URL"
                                placeholder="https://linkedin.com/in/johndoe"
                                value={editForm.linkedin}
                                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                            />
                        </div>
                        
                        <div className="flex gap-4 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Button 
                                type="button" 
                                variant="secondary" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setError('');
                                    setEditForm({
                                        name: user.name || '',
                                        github: user.github || '',
                                        linkedin: user.linkedin || '',
                                        avatar: user.avatar || ''
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" loading={isSaving}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {user.avatar ? (
                            <img 
                                src={user.avatar} 
                                alt="Avatar" 
                                className="h-32 w-32 rounded-full object-cover shadow-inner border-4 border-white dark:border-gray-800"
                            />
                        ) : (
                            <div className="h-32 w-32 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-5xl shadow-inner border-4 border-white dark:border-gray-800">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">{user.email}</p>
                            
                            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-semibold shadow-sm">
                                    🏆 {user.points || 0} Community Points
                                </div>
                                
                                {user.github && (
                                    <a 
                                        href={`https://github.com/${user.github}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        GitHub
                                    </a>
                                )}
                                
                                {user.linkedin && (
                                    <a 
                                        href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
