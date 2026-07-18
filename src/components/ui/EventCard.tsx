'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Button from './Button';
import { cn } from '@/lib/utils';

interface EventCardProps {
    event: {
        _id: string;
        title: string;
        description: string;
        banner: string;
        date: string;
        time: string;
        venue: string;
        category: string;
        registrationDeadline: string;
        seatsAvailable: number;
        totalSeats: number;
    };
    isRegistered?: boolean;
    onRegister?: (eventId: string) => void;
    onCancel?: (eventId: string) => void;
    isAdmin?: boolean;
    onEdit?: (eventId: string) => void;
    onDelete?: (eventId: string) => void;
}

export default function EventCard({
    event,
    isRegistered = false,
    onRegister,
    onCancel,
    isAdmin = false,
    onEdit,
    onDelete,
}: EventCardProps) {
    const [loading, setLoading] = useState(false);
    const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
    const isEventPassed = new Date() > new Date(event.date);
    const isFull = event.seatsAvailable <= 0;

    const handleRegister = async () => {
        setLoading(true);
        try {
            await onRegister?.(event._id);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        setLoading(true);
        try {
            await onCancel?.(event._id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="relative h-48 bg-gray-200">
                {event.banner && (
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-800">
                        {event.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                    {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{format(new Date(event.date), 'PPP')}</span>
                        <span className="text-gray-400">•</span>
                        <span>🕐 {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span>
                            {event.seatsAvailable} / {event.totalSeats} seats available
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>⏰</span>
                        <span>
                            Registration deadline:{' '}
                            {format(new Date(event.registrationDeadline), 'PPP')}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    {isAdmin ? (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit?.(event._id)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete?.(event._id)}
                            >
                                Delete
                            </Button>
                        </>
                    ) : isRegistered ? (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleCancel}
                            loading={loading}
                            disabled={isEventPassed}
                        >
                            {isEventPassed ? 'Event Passed' : 'Cancel Registration'}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleRegister}
                            loading={loading}
                            disabled={isDeadlinePassed || isFull || isEventPassed}
                        >
                            {isEventPassed
                                ? 'Event Passed'
                                : isDeadlinePassed
                                    ? 'Deadline Passed'
                                    : isFull
                                        ? 'Fully Booked'
                                        : 'Register Now'}
                        </Button>
                    )}
                    {!isAdmin && isRegistered && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            ✅ Registered
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}