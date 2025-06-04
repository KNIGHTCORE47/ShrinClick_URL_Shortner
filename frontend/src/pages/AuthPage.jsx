import React from 'react';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';

export default function AuthPage() {
    const [showLogin, setShowLogin] = React.useState(true);

    return (
        <div
            className='w-full max-w-md mx-auto p-6 bg-zinc-100 rounded-lg shadow-md'
        >
            <h1
                className='text-xl font-bold text-zinc-800 mb-4 text-center'
            >
                {
                    showLogin ? 'Login Account' : 'Register Account'
                }
            </h1>

            {
                showLogin ? <LoginForm /> : <RegisterForm />
            }

            <p
                className='text-center cursor-pointer'
            >
                {
                    showLogin ?
                        <>
                            Don&apos;t have an account? <span
                                className='text-blue-600 hover:text-blue-800 hover:underline'
                                onClick={() => setShowLogin(false)}
                            >
                                Register
                            </span>
                        </>
                        :
                        <>
                            Already have an account? <span
                                className='text-blue-600 hover:text-blue-800 hover:underline' onClick={() => setShowLogin(true)}
                            >
                                Login
                            </span>
                        </>
                }
            </p>

        </div>
    )
}