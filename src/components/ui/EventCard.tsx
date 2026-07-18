'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
    qrCode?: string;
}

export default function EventCard({
    event,
    isRegistered = false,
    onRegister,
    onCancel,
    isAdmin = false,
    onEdit,
    onDelete,
    qrCode,
}: EventCardProps) {
    const [loading, setLoading] = useState(false);
    const isDeadlinePassed = event.registrationDeadline ? new Date() > new Date(event.registrationDeadline) : false;
    const isEventPassed = event.date ? new Date() > new Date(event.date) : false;
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-300 group">
            <div className="relative h-48 bg-gray-200">
                {event.banner && (
                    <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200">
                        {event.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{event.date ? format(new Date(event.date), 'PPP') : 'TBA'}</span>
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
                            {event.registrationDeadline ? format(new Date(event.registrationDeadline), 'PPP') : 'TBA'}
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

                {qrCode && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-2 font-medium">Your Registration QR Ticket</p>
                        <QRCodeSVG value={qrCode} size={96} />
                        <p className="text-xs font-mono text-gray-400 mt-2">{qrCode}</p>
                    </div>
                )}
            </div>
        </div>
    );
}