'use client';

import { useState, useEffect } from 'react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    isSameMonth, 
    isSameDay, 
    addDays,
    parseISO,
    isToday
} from 'date-fns';
import Card from '@/components/ui/Card';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch all events for the calendar
                const res = await fetch('/api/events?limit=100');
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                setEvents(data.events);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Calendar logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            const cloneDay = day;
            
            // Find events for this day
            const dayEvents = events.filter(e => {
                if (!e.date) return false;
                return isSameDay(new Date(e.date), cloneDay);
            });

            days.push(
                <div 
                    key={day.toString()} 
                    className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 transition-colors
                        ${!isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400 dark:bg-gray-800/50 dark:text-gray-500" : "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"}
                        ${isToday(day) ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}
                    `}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className={`font-semibold text-sm ${isToday(day) ? "bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center" : ""}`}>
                            {formattedDate}
                        </span>
                        {dayEvents.length > 0 && (
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                {dayEvents.length}
                            </span>
                        )}
                    </div>
                    
                    <div className="space-y-1 mt-2">
                        {dayEvents.map((event, idx) => (
                            <div 
                                key={event._id}
                                onClick={() => setSelectedEvent(event)}
                                className={`
                                    text-xs truncate px-2 py-1 rounded cursor-pointer transition-transform hover:scale-105 shadow-sm
                                    ${event.category === 'Technical' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : ''}
                                    ${event.category === 'Cultural' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' : ''}
                                    ${event.category === 'Seminar' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : ''}
                                    ${!['Technical', 'Cultural', 'Seminar'].includes(event.category) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : ''}
                                `}
                                title={event.title}
                            >
                                {event.time} - {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="grid grid-cols-7" key={day.toString()}>
                {days}
            </div>
        );
        days = [];
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Calendar 📅</h1>
                    <p className="text-gray-600 dark:text-gray-400">Plan your academic year</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        ◀
                    </button>
                    <span className="text-lg font-bold min-w-[150px] text-center dark:text-white">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button 
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <LoadingSkeleton />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                            <div key={dayName} className="py-3 text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {dayName}
                            </div>
                        ))}
                    </div>
                    {/* Calendar Grid */}
                    <div className="flex flex-col border-l border-gray-200 dark:border-gray-700">
                        {rows}
                    </div>
                </div>
            )}

            {/* Event Detail Modal Overlay */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold dark:text-white">{selectedEvent.title}</h3>
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
                            >
                                &times;
                            </button>
                        </div>
                        
                        {selectedEvent.banner && (
                            <img 
                                src={selectedEvent.banner} 
                                alt={selectedEvent.title} 
                                className="w-full h-40 object-cover rounded-lg mb-4"
                            />
                        )}
                        
                        <div className="space-y-3 text-sm">
                            <p className="text-gray-600 dark:text-gray-300">
                                {selectedEvent.description}
                            </p>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <span>📍</span> {selectedEvent.venue}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <span>⏰</span> {selectedEvent.time}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <span>🏷️</span> {selectedEvent.category}
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
