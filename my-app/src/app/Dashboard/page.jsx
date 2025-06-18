'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
      return;
    }

    setUser({ name: 'Dhruv', email: 'dhruv@example.com' });

    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:5000/admin2/getallMovies', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        console.error('Error fetching movies:', err.message);
      }
    };

    fetchMovies();
  }, []);

  if (!user) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-800 p-6 space-y-6">
        <h1 className="text-xl font-bold">🎟️ BookIt</h1>
        <nav className="space-y-3">
          <button className="block w-full text-left hover:text-purple-400">Dashboard</button>
          <button className="block w-full text-left hover:text-purple-400">Bookings</button>
          <button className="block w-full text-left hover:text-purple-400">Profile</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome, {user.name} 👋</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search shows..."
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg"
            />
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                router.push('/');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Movies Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Now Showing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{movies.length > 0 ? (
  movies.map((movie) => (
    <div key={movie.id} className="bg-zinc-800 p-4 rounded-xl shadow hover:shadow-lg transition">
      <div className="h-48 bg-zinc-700 rounded mb-4 overflow-hidden">
        <img
          src={movie.posters?.[0]?.imageUrl || '/fallback.jpg'}
          alt={movie.title}s
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-lg font-semibold">{movie.title}</h4>
      <p className="text-sm text-zinc-400 mb-2">{movie.description}</p>
      <button
        onClick={() => router.push(`/Booking?movieId=${movie.id}`)}
        className="mt-2 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg"
      >
        Book Now
      </button>
    </div>
  ))
) : (
  <p className="text-zinc-400">No movies found.</p>
)}
          </div>
        </section>
      </main>
    </div>
  );
}
