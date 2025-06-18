// controllers/show/createShowController.js
import prisma from '../config/db.config.js';

const createShowController = async (req, res) => {
  try {
    const { screenId, movieId, startTime, endTime, price } = req.body;

    // Optional: Validate that the screen exists
    const screen = await prisma.screen.findUnique({
      where: { id: screenId },
      include: { theatre: true },
    });

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    // Optional: You can check if the current user owns this screen's theatre

    // Create the show
    const show = await prisma.show.create({
      data: {
        screenId,
        movieId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        price,
      },
      include: {
        movie: true,
        screen: true,
      },
    });

    res.status(201).json({
      message: 'Show created successfully',
      show,
    });
  } catch (error) {
    console.error('Create Show Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default createShowController;

export const getShowsController = async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
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
    const formattedShows = shows.map((show) => ({
      id: show.id,
      startTime: show.startTime,
      endTime: show.endTime,
      price: show.price,
      movie: {
        id: show.movie.id,
        title: show.movie.title,
        description: show.movie.description,
        duration: show.movie.duration,
      },
      screen: {
        id: show.screen.id,
        name: show.screen.name,
      },
      theatre: {
        id: show.screen.theatre.id,
        name: show.screen.theatre.name,
        location: show.screen.theatre.location,
      },
    }));

    res.status(200).json({
      message: 'Shows fetched successfully',
      shows: formattedShows,
    });
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getshowbyid = async (req, res) => {
  try {
    const userId = req.user.id; 
    // console.log('User ID:', userId);

    const theatre = await prisma.theatre.findFirst({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found for this user' });
    }

    // console.log('Theatre ID:', theatre.id);

    const shows = await prisma.show.findMany({
      where: {
        screen: {
          is: {
            theatreId: theatre.id,
          },
        },
      },
      include: {
        movie: true,
        screen: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return res.status(200).json(shows);
  } catch (e) {
    console.error('Error fetching show by ID:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getSeatsWithBookingStatusController = async (req, res) => {
  try {
    const { screenId, showId } = req.body;

    if (!screenId || !showId) {
      return res.status(400).json({ message: 'screenId and showId are required in body' });
    }

    const allSeats = await prisma.seat.findMany({
      where: { screenId },
      select: {
        id: true,
        seatNo: true,
        bookedSeats: {
          where: {
            booking: {
              showId,
              status: 'CONFIRMED'
            }
          }
        }
      },
      orderBy: { seatNo: 'asc' }
    });

    const formattedSeats = allSeats.map(seat => {
      const match = seat.seatNo.match(/^([A-Z]+)(\d+)$/);
      return {
        id: seat.id,
        seatNo: seat.seatNo,
        row: match ? match[1] : null,
        col: match ? parseInt(match[2]) : null,
        booked: seat.bookedSeats.length > 0
      };
    });

    res.status(200).json({ seats: formattedSeats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getSeatMatrixController = async (req, res) => {
  try {
    const { screenId } = req.body;

    if (!screenId) {
      return res.status(400).json({ message: 'screenId is required in body' });
    }

    
    const allSeats = await prisma.seat.findMany({
      where: { screenId },
      select: {
        id: true,
        seatNo: true
      },
      orderBy: { seatNo: 'asc' }
    });

    // Organize into a matrix (row = A, B..., col = 1, 2...)
    const matrix = {};

    for (const seat of allSeats) {
      const match = seat.seatNo.match(/^([A-Z]+)(\d+)$/);
      if (!match) continue;

      const row = match[1]; // e.g. "A"
      const col = parseInt(match[2]); // e.g. 5

      if (!matrix[row]) matrix[row] = {};
      matrix[row][col] = {
        id: seat.id,
        seatNo: seat.seatNo
      };
    }

    res.status(200).json({ seatMatrix: matrix });
  } catch (error) {
    console.error('Error generating seat matrix:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const generateSeatsController = async (req, res) => {
  try {
    const { screenId, rows, cols } = req.body;

    if (!screenId || !rows || !cols) {
      return res.status(400).json({ message: 'screenId, rows, and cols are required' });
    }

    const rowLabels = generateRowLabels(rows); // ['A', 'B', ..., 'J']
    const seatsData = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        seatsData.push({
          seatNo: `${rowLabels[r]}${c}`,
          screenId,
        });
      }
    }

    await prisma.seat.createMany({
      data: seatsData,
      skipDuplicates: true, // prevent re-creating if already exists
    });

    res.status(201).json({ message: 'Seats created successfully', total: seatsData.length });
  } catch (error) {
    console.error('Error creating seats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

function generateRowLabels(n) {
  const labels = [];
  for (let i = 0; i < n; i++) {
    let label = '';
    let num = i;
    while (num >= 0) {
      label = String.fromCharCode((num % 26) + 65) + label;
      num = Math.floor(num / 26) - 1;
    }
    labels.push(label);
  }
  return labels;
}



