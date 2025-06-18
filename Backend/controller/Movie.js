// controllers/admin/createMovieController.js
import prisma from '../config/db.config.js';

const createMovieController = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    // Authenticated user is available via middleware (e.g., req.user)
    const user = req.user;

    // Check for admin privileges
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Only admins can create movies.' });
    }

    // Validate input
    if (!title || !duration) {
      return res.status(400).json({ message: 'Title and duration are required' });
    }

    // Create movie
    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
      },
    });

    res.status(201).json({
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default createMovieController;

export const getMovies = async (req, res) => {
    try {
        const movies = await prisma.movie.findMany();
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMovieShowsBySearch = async (req, res) => {
  try {
    const { title, city, date } = req.query;

    // Step 1: Optional movie filter
    let movieFilter = {};
    let movie = null;

    if (title) {
      movie = await prisma.movie.findFirst({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
      });

      if (!movie) {
        return res.status(404).json({ message: "Movie not found." });
      }

      movieFilter.movieId = movie.id;
    }

    // Step 2: Optional date filter
    let dateFilter = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      dateFilter.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Step 3: Optional city filter
    let screenFilter = {};
    if (city) {
      screenFilter = {
        theatre: {
          location: {
            contains: city,
            mode: 'insensitive',
          },
        },
      };
    }

    // Step 4: Query shows with all combined filters
    const shows = await prisma.show.findMany({
      where: {
        ...movieFilter,
        ...dateFilter,
        screen: city ? screenFilter : undefined,
      },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    if (shows.length === 0) {
      return res.status(404).json({ message: "No shows found matching the criteria." });
    }

    return res.status(200).json({
      ...(movie && { movie: movie.title }),
      count: shows.length,
      shows,
    });

  } catch (error) {
    console.error("Error fetching movie shows:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllMoviesWithPosters = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        posters: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Attach image URLs
    const formattedMovies = movies.map((movie) => {
      return {
        ...movie,
        posters: movie.posters.map(poster => ({
          ...poster,
          imageUrl: `http://localhost:5000/uploads/${poster.imageUrl}`,
        })),
      };
    });

    res.status(200).json({ movies: formattedMovies });
  } catch (error) {
    console.error("Error fetching movies with posters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

