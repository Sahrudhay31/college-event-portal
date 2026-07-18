import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Event } from '@/models/Event';
import { Registration } from '@/models/Registration';
import { requireAuth, requireAdmin } from '@/lib/auth/server';
import mongoose from 'mongoose';

// GET /api/events/[id] - Get a single event
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid event ID' },
                { status: 400 }
            );
        }

        const event = await Event.findById(id).populate('createdBy', 'name email');
        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error: any) {
        console.error('Get event error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/events/[id] - Update an event (admin only)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        await requireAdmin(req);

        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: 'Invalid event ID' },
                { status: 400 }
            );
        }

        const body = await req.json();
        const event = await Event.findById(id);

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Update fields
        const updateData: any = {};
        const fields = [
            'title',
            'description',
            'banner',
            'date',
            'time',
            'venue',
            'category',
            'registrationDeadline',
            'seatsAvailable',
            'totalSeats',
        ];

        for (const field of fields) {
            if (body[field] !== undefined) {
                if (field === 'date' || field === 'registrationDeadline') {
                    updateData[field] = new Date(body[field]);
                } else {
                    updateData[field] = body[field];
                }
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedEvent);
    } catch (error: any) {
        console.error('Update event error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/events/[id] - Delete an event (admin only)
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
                { error: 'Invalid event ID' },
                { status: 400 }
            );
        }

        const event = await Event.findById(id);
        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Delete all registrations for this event
        await Registration.deleteMany({ eventId: id });
        await Event.findByIdAndDelete(id);

        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete event error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}