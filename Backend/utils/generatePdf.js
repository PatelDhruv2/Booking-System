import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generateTicketPDF = (booking, seatIds, show, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      
      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // PDF Content
      doc.fontSize(20).text('🎟️ Movie Ticket Confirmation', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Booking ID: ${booking.id}`);
      doc.text(`User ID: ${booking.userId}`);
      doc.text(`Show ID: ${show.id}`);
      doc.text(`Screen ID: ${show.screenId}`);
      doc.text(`Seats: ${seatIds.join(', ')}`);
      doc.text(`Total Price: ₹${booking.totalPrice}`);
      doc.text(`Booking Status: ${booking.status}`);
      doc.text(`Booking Time: ${new Date(booking.bookingTime).toLocaleString()}`);

      doc.moveDown().text('Enjoy your movie! 🍿', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(outputPath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
