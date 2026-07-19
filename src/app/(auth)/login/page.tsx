'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/student');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                <p className="text-gray-300 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-white">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="text-white">
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <Button type="submit" fullWidth loading={loading}>
                    Sign In
                </Button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-gray-400">Admin Access</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                        setEmail('admin@college.edu');
                        setPassword('password123');
                    }}
                    className="bg-white/5 hover:bg-white/10 text-white border-white/20"
                >
                    Login as Admin
                </Button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign up
                </Link>
            </p>
        </div>
    );
}