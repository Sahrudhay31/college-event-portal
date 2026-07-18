export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-48 w-full"></div>
            <div className="mt-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );
}