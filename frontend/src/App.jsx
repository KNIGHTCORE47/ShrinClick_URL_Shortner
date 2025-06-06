import React from 'react';
import { Outlet } from '@tanstack/react-router'
import { useDispatch } from 'react-redux';
import { checkAuth } from './apis/apiCalls.js';
import { login, logout } from './store/slice/authSlice.js';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from './components/Navbar.jsx';



export default function App() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    async function reHydrateAuth() {
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['checkAuth'],
          queryFn: checkAuth,
          staleTime: 0,
          retry: false
        });

        if (data?.data) {
          dispatch(login(data.data));
        } else {
          dispatch(logout());
        }

      } catch (error) {
        console.error("Error re-hydrating auth:", error);
        dispatch(logout());
      }
    };

    reHydrateAuth();
  }, [dispatch, queryClient]);

  return (
    <main
      className='min-h-screen bg-zinc-700'
    >
      <Navbar />
      <div
        className='min-h-[calc(100vh-78px)] flex items-center justify-center'
      >
        <Outlet />
      </div>
    </main>
  )
}

