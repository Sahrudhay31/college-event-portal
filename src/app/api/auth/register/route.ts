import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { signToken } from '@/lib/auth/jwt';

import { cookies } from 'next/headers';
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, password, role = 'student' } = body;

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role === 'admin' ? 'admin' : 'student',
        });

        // Generate token
        const token = await signToken(user);

        // Return user without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        const response = NextResponse.json(
            {
                user: userWithoutPassword,
                token,
            },
            { status: 201 }
        );

        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}