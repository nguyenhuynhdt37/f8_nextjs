export default function Loading() {
    return (
        <div className="p-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

            <div className="mb-6">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full bg-white border border-gray-200">
                    <div className="bg-gray-100 h-12"></div>
                    <div className="space-y-3 py-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
} 