import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/models/User';
import { requireAuth } from '@/lib/auth/server';

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
