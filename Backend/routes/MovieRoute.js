import { Router } from "express";
import createMovieController from "../controller/Movie.js";
import { getMovies } from "../controller/Movie.js"; // Ensure this is the correct path to your controller
import { authenticate } from "../middleware/middle.js";
import { getMovieShowsBySearch } from "../controller/Movie.js";
import { getAllMoviesWithPosters } from "../controller/Movie.js"; // Ensure this is the correct path to your controller
const router = Router();
router.post('/create',authenticate, createMovieController);
router.get('/getMovies', authenticate,getMovies); 
router.get('/getMovieShowsBySearch', authenticate, getMovieShowsBySearch); // Adjust the endpoint as necessary
router.get('/getallMovies', authenticate,getAllMoviesWithPosters); // Public route to get all movies
export default router;