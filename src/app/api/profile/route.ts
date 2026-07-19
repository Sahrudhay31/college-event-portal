import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { requireAuth } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await requireAuth(req);

        const user = await User.findById(userPayload._id).select('-password');
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await requireAuth(req);

        const body = await req.json();
        const { github, linkedin, avatar, name } = body;

        const updatedUser = await User.findByIdAndUpdate(
            userPayload._id,
            { 
                ...(name && { name }),
                ...(github !== undefined && { github }),
                ...(linkedin !== undefined && { linkedin }),
                ...(avatar !== undefined && { avatar })
            },
            { new: true }
        ).select('-password');

        return NextResponse.json({ user: updatedUser });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
