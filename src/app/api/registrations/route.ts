import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Registration } from '@/models/Registration';
import { Event } from '@/models/Event';
import { requireAuth, requireAdmin } from '@/lib/auth/server';
import mongoose from 'mongoose';

// GET /api/registrations - Get registrations (admin gets all, student gets own)
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(req);

        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get('eventId');
        const status = searchParams.get('status');

        const query: any = {};

        // If student, only show their registrations
        if (user.role === 'student') {
            query.userId = user._id;
        }

        if (eventId) {
            query.eventId = eventId;
        }

        if (status) {
            query.status = status;
        }

        const registrations = await Registration.find(query)
            .populate('userId', 'name email')
            .populate('eventId')
            .sort({ registrationDate: -1 });

        return NextResponse.json({ registrations });
    } catch (error: any) {
        console.error('Get registrations error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/registrations - Register for an event
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await requireAuth(req);

        const body = await req.json();
        const { eventId } = body;

        if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
            return NextResponse.json(
                { error: 'Valid event ID is required' },
                { status: 400 }
            );
        }

        // Check if event exists and has seats
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Check if registration deadline has passed
        if (new Date() > new Date(event.registrationDeadline)) {
            return NextResponse.json(
                { error: 'Registration deadline has passed' },
                { status: 400 }
            );
        }

        // Check if event has seats available
        if (event.seatsAvailable <= 0) {
            return NextResponse.json(
                { error: 'No seats available for this event' },
                { status: 400 }
            );
        }

        // Check if user is already registered
        const existingRegistration = await Registration.findOne({
            userId: user._id,
            eventId,
            status: 'registered',
        });

        if (existingRegistration) {
            return NextResponse.json(
                { error: 'You are already registered for this event' },
                { status: 400 }
            );
        }

        // Create registration
        const registration = await Registration.create({
            userId: user._id,
            eventId,
            status: 'registered',
            qrCode: `REG-${Date.now()}-${user._id.toString().slice(-6)}`,
        });

        // Decrement seats available
        event.seatsAvailable -= 1;
        await event.save();

        return NextResponse.json(registration, { status: 201 });
    } catch (error: any) {
        console.error('Register for event error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}