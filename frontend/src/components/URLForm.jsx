import React from 'react'
import { Loader2, CircleCheck } from 'lucide-react';
import { fetchShortUrl } from '../apis/apiCalls.js';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

export default function URLForm() {

    const [longURL, setLongURL] = React.useState('');
    const [shortURL, setShortURL] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [submitting, setSubmitting] = React.useState(false);
    const [customSlug, setCustomSlug] = React.useState('');
    const [isCopied, setIsCopied] = React.useState(false);

    const queryClient = useQueryClient();
    const auth = useSelector(state => state.auth);

    async function handleSubmit(event) {
        event.preventDefault();

        // NOTE - Validation for Empty URL value
        if (!longURL || longURL.trim() === '') {
            setError('Please enter a URL');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetchShortUrl(longURL, customSlug);

            // NOTE - Set Data
            const data = await response.json();

            setShortURL(data?.data);

            // NOTE - Funtionality of re-fetching new created short url [tanstack query]
            await queryClient.invalidateQueries(['all-urls']);

        } catch (error) {
            console.error("Internal server error, Please try again sometime.", error);

            if (error instanceof Error) {
                setError(error.message || "Internal server error, Please try again sometime.");
            }

        } finally {
            setSubmitting(false);
        }
    }

    function handleCopy() {
        navigator.clipboard.writeText(shortURL);
        setIsCopied(true);

        // NOTE - Reset isCopied after 2 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className='space-y-4 mb-4'
            >
                <div className='space-y-2'>
                    <label
                        htmlFor='url'
                        className='block text-sm font-semibold text-gray-700 mb-2'
                    >
                        🔗 Enter your URL to shorten
                    </label>

                    <div className='relative group'>
                        <span
                            className='absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none z-10'
                        >
                            https://
                        </span>

                        <input
                            type='text'
                            id='url'
                            value={longURL}
                            onChange={event => setLongURL(event.target.value)}
                            className='w-full pl-20 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg'
                            placeholder='www.example.com/'
                            required
                        />
                        <div
                            className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'
                        >

                        </div>

                    </div>
                    <p
                        className='text-xs text-gray-500 mt-1 flex items-center gap-1'
                    >
                        <svg
                            className='w-3 h-3'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                        </svg>
                        We'll automatically add https:// if needed
                    </p>
                </div>


                {auth.isAuthenticated && (
                    <div
                        className='space-y-2'
                    >
                        <label
                            htmlFor='short-url'
                            className='block text-sm font-semibold text-gray-700 mb-2'
                        >
                            🎉 Custom URL (optional)
                        </label>

                        <div
                            className='relative group'
                        >
                            <input
                                type='text'
                                id='customSlug'
                                value={customSlug}
                                onChange={event => setCustomSlug(event.target.value)}
                                className='w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg'
                                placeholder='custom-url'
                            />
                            <div
                                className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'
                            >
                            </div>

                        </div>

                    </div>
                )}

                <button
                    type='submit'
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md'
                        }`}
                    disabled={submitting}
                >
                    {submitting ? (
                        <span
                            className='flex items-center justify-center gap-2'
                        >
                            <Loader2
                                className='animate-spin w-4 h-4'
                            />
                            Creating your short link...
                        </span>
                    ) : (
                        <span
                            className='flex items-center justify-center gap-2'
                        >
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0-4.92l4-4a4 4 0 015.656 0l1.102 1.102m-2.046 2.046L13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m0-4.92l4-4a4 4 0 015.656 0l1.102 1.102m-2.046 2.046L13.828 10.172'
                                />
                            </svg>
                            ✨ Shorten URL
                        </span>
                    )}
                </button>

                {
                    error && (
                        <div
                            className='bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm animate-in slide-in-from-top-2 duration-300'
                        >
                            <div className='flex items-start gap-3'>

                                <div className='flex-shrink-0'>

                                    <svg
                                        className='w-5 h-5 text-red-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                    </svg>
                                </div>

                                <div className='flex-1'>

                                    <h3
                                        className='text-sm font-semibold text-red-800 mb-1'
                                    >
                                        Oops! Something went wrong
                                    </h3>
                                    <p
                                        className='text-sm text-red-700'
                                    >
                                        {error}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className='flex-shrink-0 text-red-400 hover:text-red-600 transition-colors duration-200'
                                    aria-label='Dismiss error'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                }
            </form>

            {
                shortURL && (
                    <div
                        className='bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 space-y-4 shadow-sm'
                    >
                        <div
                            className='flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 shadow-sm'
                        >
                            <div className='flex-1 min-w-0'>
                                <p
                                    className='text-sm text-gray-500 mb-1'
                                >
                                    Your shortened URL:
                                </p>
                                <p
                                    className='text-blue-600 font-medium text-lg truncate'
                                >
                                    {shortURL}
                                </p>
                            </div>
                            <button
                                className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${isCopied
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md active:scale-95'
                                    }`}
                                onClick={handleCopy}
                            >
                                {
                                    isCopied ? (
                                        <>
                                            <CircleCheck className='w-4 h-4' />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                            </svg>
                                            Copy
                                        </>
                                    )
                                }
                            </button>
                        </div>

                        <div className='text-center'>
                            <p className='text-sm text-gray-600'>
                                ✨ Your URL has been successfully shortened and is ready to share!
                            </p>
                        </div>
                    </div>
                )
            }
        </>
    )
}