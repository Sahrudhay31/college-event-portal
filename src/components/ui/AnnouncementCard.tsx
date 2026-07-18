import { formatDistanceToNow } from 'date-fns';

interface AnnouncementCardProps {
    announcement: {
        _id: string;
        title: string;
        content: string;
        createdAt: string;
        createdBy: {
            name: string;
        };
    };
    isAdmin?: boolean;
    onDelete?: (id: string) => void;
}

export default function AnnouncementCard({
    announcement,
    isAdmin = false,
    onDelete,
}: AnnouncementCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {announcement.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{announcement.content}</p>
                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>👤 {announcement.createdBy?.name || 'Admin'}</span>
                        <span>•</span>
                        <span>
                            {formatDistanceToNow(new Date(announcement.createdAt || (announcement as any).date || Date.now()), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => onDelete?.(announcement._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}