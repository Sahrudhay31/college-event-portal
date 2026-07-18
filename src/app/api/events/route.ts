import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Event } from '@/models/Event';
import { requireAuth, requireAdmin } from '@/lib/auth/server';

// GET /api/events - Get all events with filters
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const upcoming = searchParams.get('upcoming') === 'true';
        const limit = parseInt(searchParams.get('limit') || '50');
        const page = parseInt(searchParams.get('page') || '1');
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } },
            ];
        }

        if (upcoming) {
            query.date = { $gte: new Date() };
        }

        const [events, total] = await Promise.all([
            Event.find(query)
                .sort({ date: 1 })
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'name email'),
            Event.countDocuments(query),
        ]);

        return NextResponse.json({
            events,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Get events error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/events - Create a new event (admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await requireAdmin(req);

        const body = await req.json();
        const {
            title,
            description,
            banner,
            date,
            time,
            venue,
            category,
            registrationDeadline,
            seatsAvailable,
            totalSeats,
        } = body;

        // Validate required fields
        if (
            !title ||
            !description ||
            !date ||
            !time ||
            !venue ||
            !category ||
            !registrationDeadline ||
            seatsAvailable === undefined ||
            !totalSeats
        ) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const event = await Event.create({
            title,
            description,
            banner: banner || '/images/default-event.jpg',
            date: new Date(date),
            time,
            venue,
            category,
            registrationDeadline: new Date(registrationDeadline),
            seatsAvailable,
            totalSeats,
            createdBy: user._id,
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error: any) {
        console.error('Create event error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}