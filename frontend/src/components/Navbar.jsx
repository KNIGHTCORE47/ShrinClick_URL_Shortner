import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../apis/apiCalls';
import { Link2, User } from 'lucide-react';
import { useNavigate, Link } from '@tanstack/react-router';
import { logout } from '../store/slice/authSlice';
import { useQueryClient } from '@tanstack/react-query';


export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();


    async function handleLogout() {
        try {
            await logoutUser();

            dispatch(logout());

            // NOTE - Remove queries [query cache]
            queryClient.removeQueries({ queryKey: ['checkAuth'] });

            navigate({
                to: '/auth',
                replace: true
            });

        } catch (error) {
            console.error("Internal server error, Please try again sometime.", error);

            // NOTE - Remove queries [query cache]
            queryClient.removeQueries({ queryKey: ['checkAuth'] });

            dispatch(logout());

            navigate({
                to: '/auth',
                replace: true
            });
        } finally {
            setIsDropdownOpen(false);
        }
    }

    // NOTE - Close dropdown when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event) {
            if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className='py-4 bg-zinc-400 sticky top-0 z-50 shadow-lg'>
            <div className='container flex justify-between items-center mx-auto px-4'>
                <div className='flex-1 lg:flex-none'>
                    <Link
                        to="/"
                        className='text-xl font-bold p-2 rounded-lg bg-transparent hover:bg-zinc-300 text-zinc-800 flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500'
                    >
                        <Link2
                            size={30}
                            className='inline-block mr-2'
                        />
                        ShrinClick
                    </Link>
                </div>

                <div className='flex justify-end'>
                    <div className='relative dropdown-container'>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='p-2 rounded-lg bg-transparent hover:bg-zinc-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500'
                        >
                            <User size={30} className='text-zinc-800' />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className='absolute right-0 mt-1 w-52 bg-zinc-800 rounded-lg shadow-lg border border-zinc-600 z-10 animate-in fade-in duration-150'>
                                <div className='py-1'>
                                    {auth.isAuthenticated ? (
                                        <>
                                            <div className='px-4 py-2 text-sm text-zinc-400 border-b border-zinc-600'>
                                                {auth.user?.email.split('@')[0]}
                                            </div>

                                            <Link
                                                to="/dashboard"
                                                className='block px-4 py-2 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors duration-150'
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Dashboard
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className='block w-full px-4 py-2 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors duration-150 text-left'
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/auth"
                                            className='block px-4 py-2 text-zinc-200 text-sm hover:bg-zinc-700 transition-colors duration-150'
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}