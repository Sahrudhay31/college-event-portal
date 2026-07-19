import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get top 20 students by points
        const leaderboard = await User.find({ role: 'student' })
            .select('name points createdAt')
            .sort({ points: -1, createdAt: 1 })
            .limit(20);

        return NextResponse.json({ leaderboard });
    } catch (error: any) {
        console.error('Leaderboard fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
