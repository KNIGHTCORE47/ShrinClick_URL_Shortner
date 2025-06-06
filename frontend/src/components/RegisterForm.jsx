import React from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../apis/apiCalls.js';
import { useNavigate } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice.js';

export default function RegisterForm() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    async function handleSubmit(event) {
        event.preventDefault();

        // NOTE - Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match, Please enter again.');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await registerUser(email, password);

            // NOTE - Parse response
            const data = await response.json();

            // NOTE - Set Store Data
            dispatch(login(data.data));

            // NOTE - Set Input Fields to Empty
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // NOTE - Redirect to Home Page
            navigate({ to: '/' });

        } catch (error) {
            console.error("Internal server error, Please try again sometime.", error);

            if (error instanceof Error) {
                setError(error.message || "Internal server error, Please try again sometime.");
            } else {
                setError("Internal server error, Please try again sometime.");
            }

        } finally {
            setSubmitting(false);
        }
    }


    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-4 mb-4'
        >
            <div
                className='space-y-2'
            >
                <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-gray-700 mb-2'
                >
                    Email
                </label>

                <div className='group relative'>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        className='w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg'
                        placeholder='email@example.com'
                        required
                    />
                    <div
                        className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'
                    >

                    </div>
                </div>

            </div>

            <div
                className='space-y-2'
            >
                <label
                    htmlFor='password'
                    className='block text-sm font-semibold text-gray-700 mb-2'
                >
                    Password
                </label>

                <div
                    className='group relative'
                >
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        id='password'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        className='w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg'
                        placeholder="••••••••"
                        required
                    />

                    <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded-md p-1 transition-colors duration-200'
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        tabIndex={0}
                    >
                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>


                    <div
                        className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'
                    >

                    </div>
                </div>

            </div>

            <div
                className='space-y-2'
            >
                <label
                    htmlFor='confirm-password'
                    className='block text-sm font-semibold text-gray-700 mb-2'
                >
                    Confirm Password
                </label>

                <div
                    className='group relative'
                >
                    <input
                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                        id='confirm-password'
                        value={confirmPassword}
                        onChange={event => setConfirmPassword(event.target.value)}
                        className='w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg'
                        placeholder="Confirm Password"
                        required
                    />

                    <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded-md p-1 transition-colors duration-200'
                        onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                        tabIndex={0}
                    >
                        {isConfirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>


                    <div
                        className='absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'
                    >

                    </div>
                </div>

            </div>

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

            <button
                type='submit'
                className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all duration-200 mt-2'
                disabled={submitting}
            >
                {
                    submitting ? (
                        <span
                            className='flex items-center justify-center gap-2'
                        >
                            <Loader2 className='w-4 h-4 animate-spin' />
                        </span>
                    ) : <span
                        className='font-semibold text-sm'>
                        Register
                    </span>
                }

            </button>

        </form>
    )
}