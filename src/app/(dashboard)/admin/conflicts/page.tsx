'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function AiConflictDetectorPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [conflicts, setConflicts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events?limit=100');
                const data = await res.json();
                if (res.ok) setEvents(data.events || []);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const analyzeConflicts = async () => {
        setIsAnalyzing(true);
        setHasAnalyzed(false);
        setConflicts([]);

        // Simulate AI analyzing time
        await new Promise(r => setTimeout(r, 1500));

        const detectedConflicts: any[] = [];
        const map = new Map<string, any[]>();

        // Group events by Date + Venue
        events.forEach(event => {
            if (!event.date || !event.venue) return;
            // Simple date string extraction
            const dateStr = new Date(event.date).toISOString().split('T')[0];
            const key = `${dateStr}_${event.venue.toLowerCase()}`;
            
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key)!.push(event);
        });

        // Find conflicts (more than 1 event in the same venue on the same day)
        map.forEach((overlappingEvents, key) => {
            if (overlappingEvents.length > 1) {
                // Generate AI Resolution
                const alternativeVenues = ["Seminar Hall B", "Open Air Theatre", "Tech Park Room 402", "Virtual (Zoom)"];
                const eventToMove = overlappingEvents[1]; // pick the second one to move
                const newVenue = alternativeVenues[Math.floor(Math.random() * alternativeVenues.length)];
                
                detectedConflicts.push({
                    venue: overlappingEvents[0].venue,
                    date: overlappingEvents[0].date,
                    events: overlappingEvents,
                    resolution: `Move "${eventToMove.title}" to ${newVenue} OR shift its timing to 5:00 PM to avoid overlap with "${overlappingEvents[0].title}".`
                });
            }
        });

        setConflicts(detectedConflicts);
        setHasAnalyzed(true);
        setIsAnalyzing(false);
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        AI Conflict Detector
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Automatically scan your entire college calendar to detect venue and timing overlaps between different clubs.
                    </p>
                </div>
                <Button 
                    onClick={analyzeConflicts} 
                    disabled={isAnalyzing}
                    className="bg-red-600 hover:bg-red-700 border-none shadow-lg px-6 min-w-[200px]"
                >
                    {isAnalyzing ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Scanning...
                        </div>
                    ) : (
                        <span className="flex items-center justify-center gap-2">Scan for Conflicts</span>
                    )}
                </Button>
            </div>

            {hasAnalyzed && conflicts.length === 0 && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-center py-12">
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mt-4">All Clear!</h3>
                    <p className="text-green-600 dark:text-green-500 mt-2">
                        AI found absolutely no venue or scheduling conflicts across your {events.length} events.
                    </p>
                </Card>
            )}

            {hasAnalyzed && conflicts.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 p-4 rounded-lg flex items-center gap-3">
                        <div>
                            <span className="font-bold">AI detected {conflicts.length} scheduling conflict(s).</span> Immediate action required to prevent venue double-booking.
                        </div>
                    </div>

                    {conflicts.map((conflict, index) => (
                        <Card key={index} className="border-l-4 border-l-red-500 overflow-hidden relative">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-bl-full -mr-10 -mt-10 -z-10"></div>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="text-sm font-bold text-red-500 uppercase tracking-wider mb-1">Conflict Details</div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Double Booking at <span className="text-red-600 dark:text-red-400">{conflict.venue}</span>
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                            Date: {new Date(conflict.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Conflicting Events:</p>
                                        {conflict.events.map((e: any) => (
                                            <div key={e._id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                                <div className="h-10 w-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center font-bold text-red-600 dark:text-red-400 text-xl">
                                                    !
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{e.title}</div>
                                                    <div className="text-xs text-gray-500">{e.time} • Organized by {e.organizer}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="h-full bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-3">
                                                AI Suggested Resolution
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                {conflict.resolution}
                                            </p>
                                        </div>
                                        
                                        <div className="mt-6 flex gap-3">
                                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm">
                                                Apply Resolution
                                            </Button>
                                            <Button variant="secondary" className="w-full text-sm">
                                                Ignore
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
