'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params?.movieId;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:5000/admin2/getallMovies`);
        const data = await res.json();
        const found = data.movies.find((m) => m.id === Number(movieId));
        setMovie(found);
      } catch (err) {
        console.error('Failed to fetch movie:', err);
      }
    };

    if (movieId) fetchMovie();
  }, [movieId]);

  if (!movie) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Poster */}
        <div className="mb-6">
          <img
            src={movie.posters?.[0]?.imageUrl || '/placeholder.jpg'}
            alt={movie.title}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Movie Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-zinc-400 mb-1">{movie.description}</p>
          <p className="text-sm text-zinc-500">Duration: {movie.duration} min</p>
        </div>

        {/* Booking Section */}
        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Select Your Seats</h2>
          <p className="text-zinc-400 mb-4">[Seat selection UI placeholder]</p>
          <button
            onClick={() => alert('Booking logic coming soon!')}
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold transition"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
