import React from 'react'
import HomePage from './pages/HomePage.jsx'
import AuthPage from './pages/AuthPage.jsx'


export default function App() {
  return (
    <div
      className='min-h-screen flex items-center justify-center bg-zinc-700'
    >
      {/* <HomePage /> */}
      {/* <RegisterPage /> */}
      <AuthPage />
    </div>
  )
}

