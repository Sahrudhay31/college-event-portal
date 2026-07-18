import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Announcement } from '@/models/Announcement';
import { requireAdmin } from '@/lib/auth/server';
import mongoose from 'mongoose';

// DELETE /api/announcements/[id] - Delete announcement (admin only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        await requireAdmin(req);

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid announcement ID' },
                { status: 400 }
            );
        }

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return NextResponse.json(
                { error: 'Announcement not found' },
                { status: 404 }
            );
        }

        await Announcement.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Announcement deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete announcement error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}