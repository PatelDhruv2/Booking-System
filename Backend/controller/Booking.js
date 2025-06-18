import prisma from '../config/db.config.js';
import { generateTicketPDF } from '../utils/generatePdf.js';
import { sendBookingEmail } from '../utils/sendBookingEmail.js';
import path from 'path';

export const bookSeatsController = async (req, res) => {
  try {
    const { userId, showId, screenId, seatIds } = req.body;
    const userEmail = req.user.email; // Assuming user email is available in the request object
    const show = await prisma.show.findUnique({ where: { id: showId } });
    if (!show || show.screenId !== screenId) {
      return res.status(400).json({ message: "Show not found or does not match screen." });
    }

    const seats = await prisma.seat.findMany({
      where: {
        seatNo: { in: seatIds },
        screenId,
      },
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({ message: "Invalid seat numbers for the given screen." });
    }

    const seatIdList = seats.map(s => s.id);

    const alreadyBooked = await prisma.bookedSeat.findMany({
      where: {
        seatId: { in: seatIdList },
        booking: { showId, status: "CONFIRMED" },
      },
    });

    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: "Some of the selected seats are already booked",
        seats: alreadyBooked.map(bs => bs.seatId),
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        showId,
        totalPrice: show.price * seatIdList.length,
        status: "CONFIRMED",
        bookedSeats: {
          create: seatIdList.map(seatId => ({ seatId })),
        },
      },
      include: {
        bookedSeats: true,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const movie = await prisma.movie.findUnique({ where: { id: show.movieId } });

    const seatNos = seats.map(s => s.seatNo);
    const pdfPath = path.join('tickets', `ticket-${booking.id}.pdf`);

    await generateTicketPDF(booking, seatNos, {
      movieTitle: movie.title,
      screenId: screenId,
      startTime: show.startTime,
    }, pdfPath);

    await sendBookingEmail(userEmail, pdfPath);

    return res.status(201).json({
      message: "Booking successful, ticket sent via email!",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
