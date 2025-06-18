import nodemailer from 'nodemailer';
import path from 'path';

export const sendBookingEmail = async (userEmail, pdfPath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Movie Booking 🎬" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Your Movie Ticket 🎟',
    text: 'Attached is your movie ticket. Enjoy the show!',
    attachments: [
      {
        filename: 'ticket.pdf',
        path: pdfPath,
      },
    ],
  });

  console.log('Email sent: ', info.messageId);
};
