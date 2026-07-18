import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/server';
import { connectDB } from '@/lib/db/mongoose';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getCurrentUser(req);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}