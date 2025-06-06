import DashboardComponent from '../components/DashboardComponent.jsx';

export default function DashboardPage() {
    return (
        <div
            className='w-full max-w-lg mx-auto p-6 bg-zinc-100 rounded-lg shadow-md'
        >
            <h1
                className='text-xl font-bold text-zinc-800 mb-4 text-center'
            >
                Dashboard
            </h1>

            <DashboardComponent />
        </div>
    )
}
