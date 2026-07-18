import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Announcement } from '@/models/Announcement';
import { requireAuth, requireAdmin } from '@/lib/auth/server';

// GET /api/announcements - Get all announcements
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;

        const [announcements, total] = await Promise.all([
            Announcement.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'name email'),
            Announcement.countDocuments(),
        ]);

        return NextResponse.json({
            announcements,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Get announcements error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/announcements - Create announcement (admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await requireAdmin(req);

        const body = await req.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const announcement = await Announcement.create({
            title,
            content,
            createdBy: user._id,
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error: any) {
        console.error('Create announcement error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}