import multer from 'multer';
import prisma from "../config/db.config.js";
import path from 'path';
import fs from 'fs';

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/';
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
export default upload;

// Upload Movie and Poster Handler
export const uploadMovieWithPoster = async (req, res) => {
  try {
    console.log("Received file:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No poster file uploaded." });
    }

    const { title, description, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ message: "Title and duration are required." });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description: description || null,
        duration: parseInt(duration),
      },
    });

    const poster = await prisma.poster.create({
      data: {
        movieId: movie.id,
        imageUrl: req.file.filename, // Store just the filename
      },
    });

    res.status(201).json({
      message: "Movie and poster uploaded successfully",
      movie,
      poster,
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`, // Correct URL
    });

  } catch (error) {
    console.error("Error uploading movie and poster:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
