import React from 'react'
import { fatchAllUrlsOfAuthUser } from '../apis/apiCalls.js';
import { useQuery } from '@tanstack/react-query';
import {
    ExternalLink,
    Copy,
    CircleCheck,
    MousePointer,
    Calendar,
    Loader2
} from 'lucide-react';


export default function DashboardComponent() {
    const REDIRECT_URL_ROUTE = `${import.meta.env.VITE_SERVER_URL}/api/v1`

    const {
        data: allUrls,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['all-urls'],
        queryFn: fatchAllUrlsOfAuthUser,
        refetchInterval: 3000,  // Refetch every 30 seconds to update click counts
        staleTime: 0    // Consider data stale immediately so it refetches when invalidated
    })

    const [isCopiedId, setIsCopiedId] = React.useState(null);

    function handleCopy(url, id) {
        navigator.clipboard.writeText(`${REDIRECT_URL_ROUTE}/${url}`);

        setIsCopiedId(id);

        // NOTE - Reset isCopied after 2 seconds
        setTimeout(() => {
            setIsCopiedId(null);
        }, 2000);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function truncateUrl(url, maxLength = 40) {
        return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
    }


    if (isLoading) {
        return (
            <div
                className="flex flex-col items-center justify-center py-12"
            >
                <Loader2
                    size={40}
                    className="animate-spin text-blue-600 mb-4"
                />
                <p
                    className="text-gray-600 text-sm"
                >
                    Loading your URLs...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl my-4 shadow-sm"
            >
                <div
                    className="flex items-center gap-3"
                >
                    <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>
                        <h3
                            className="font-semibold"
                        >
                            Error Loading URLs
                        </h3>
                        <p
                            className="text-sm text-red-700"
                        >
                            {error?.message || 'Something went wrong'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!allUrls?.data || allUrls?.data.length === 0) {
        return (
            <div
                className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-6 py-8 rounded-xl my-4 text-center shadow-sm"
            >
                <div
                    className="flex flex-col items-center gap-3"
                >
                    <svg
                        className="w-12 h-12 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0-4.92l4-4a4 4 0 015.656 0l1.102 1.102m-2.046 2.046L13.828 10.172"
                        />
                    </svg>
                    <div>
                        <h3
                            className="font-semibold text-lg mb-1"
                        >
                            No Short URLs Found
                        </h3>
                        <p
                            className="text-sm text-yellow-700"
                        >
                            Create your first shortened URL to get started!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Enhanced Header */}
            <div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 shadow-sm"
            >
                <h2
                    className="font-bold text-gray-800 text-lg mb-2"
                >
                    Your Short URLs
                </h2>
                <div
                    className="flex items-center justify-between text-sm"
                >

                    <div
                        className="flex items-center gap-4"
                    >

                        <div
                            className="flex items-center gap-2"
                        >

                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>

                            <span
                                className="text-gray-700 font-medium"
                            >
                                {allUrls.data.length} URLs
                            </span>
                        </div>

                        <div
                            className="flex items-center gap-2"
                        >

                            <MousePointer
                                className="w-4 h-4 text-green-500"
                            />
                            <span
                                className="text-gray-700 font-medium"
                            >
                                {allUrls.data.reduce((sum, url) => sum + url.clicks, 0)} total clicks
                            </span>

                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced URL List */}
            <div
                className="max-h-96 overflow-y-auto space-y-4 pr-2"
            >
                {
                    allUrls.data.map(url => (
                        <div
                            key={url._id}
                            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            {/* URL Info */}
                            <div className="mb-4">
                                <p
                                    className="font-semibold text-gray-800 mb-2 leading-relaxed"
                                >
                                    {truncateUrl(url.originalUrl, 60)}
                                </p>
                                <a
                                    href={`${REDIRECT_URL_ROUTE}/${url.shortUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2 hover:underline font-medium"
                                >
                                    {`${REDIRECT_URL_ROUTE}/${url.shortUrl}`}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Stats */}
                            <div
                                className="flex items-center justify-between text-sm text-gray-600 mb-4 py-2 border-t border-gray-100"
                            >
                                <div
                                    className="flex items-center gap-2"
                                >
                                    <MousePointer
                                        className="w-4 h-4 text-green-500"
                                    />
                                    <span
                                        className="font-semibold text-green-600"
                                    >
                                        {url.clicks}
                                    </span>

                                    <span>
                                        clicks
                                    </span>
                                </div>

                                <div
                                    className="flex items-center gap-2"
                                >
                                    <Calendar
                                        className="w-4 h-4 text-blue-500"
                                    />

                                    <span>
                                        Created {formatDate(url.createdAt)}
                                    </span>
                                </div>

                            </div>

                            {/* Copy Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => handleCopy(url.shortUrl, url._id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${isCopiedId === url._id
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md active:scale-95'
                                        }`}
                                >
                                    {isCopiedId === url._id ? (
                                        <>
                                            <CircleCheck className="w-4 h-4" />
                                            Copied to Clipboard!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy Short URL
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Full URL Expandable */}
                            {url.originalUrl.length > 60 && (
                                <div
                                    className="mt-4 pt-4 border-t border-gray-100"
                                >
                                    <details
                                        className="group"
                                    >
                                        <summary
                                            className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 font-medium"
                                        >
                                            <span>
                                                View full original URL
                                            </span>

                                            <svg
                                                className="w-4 h-4 transition-transform group-open:rotate-90"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>

                                        </summary>

                                        <div
                                            className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <code
                                                className="text-xs text-gray-700 break-all leading-relaxed"
                                            >
                                                {url.originalUrl}
                                            </code>
                                        </div>

                                    </details>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}


