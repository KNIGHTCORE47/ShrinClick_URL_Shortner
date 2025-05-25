import URLForm from '../components/URLForm.jsx';


export default function HomePage() {
    return (
        <div
            className='max-w-md mx-auto p-6 bg-zinc-100 rounded-lg shadow-md'
        >
            <h1
                className='text-xl font-bold text-zinc-800 mb-4 text-center'
            >
                URL Shortener
            </h1>

            <URLForm />
        </div>
    )
}

