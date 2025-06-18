import { Router } from "express";
import { uploadMovieWithPoster } from "../controller/Upload.js";
import upload from '../controller/Upload.js'; // Import the multer configuration

const router = Router();
router.post('/upload',upload.single('poster'),uploadMovieWithPoster); // Endpoint for uploading movie with poster
export default router;