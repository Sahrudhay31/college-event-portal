import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Registration } from '@/models/Registration';
import { Event } from '@/models/Event';
import { requireAuth } from '@/lib/auth/server';
import mongoose from 'mongoose';

// DELETE /api/registrations/[id] - Cancel registration
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const user = await requireAuth(req);

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid registration ID' },
                { status: 400 }
            );
        }

        const registration = await Registration.findById(id);
        if (!registration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        // Check if user owns this registration (or is admin)
        if (user.role !== 'admin' && registration.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                { error: 'You do not have permission to cancel this registration' },
                { status: 403 }
            );
        }

        // Check if already cancelled
        if (registration.status === 'cancelled') {
            return NextResponse.json(
                { error: 'Registration is already cancelled' },
                { status: 400 }
            );
        }

        // Update registration status
        registration.status = 'cancelled';
        await registration.save();

        // Increment seats available
        const event = await Event.findById(registration.eventId);
        if (event) {
            event.seatsAvailable += 1;
            await event.save();
        }

        return NextResponse.json(
            { message: 'Registration cancelled successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Cancel registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}