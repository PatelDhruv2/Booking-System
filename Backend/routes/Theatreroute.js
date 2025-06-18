import { Router } from "express";
import { createTheatre } from "../controller/Theatre.js";
import {authenticate} from "../middleware/middle.js";
import { getTheatres } from "../controller/Theatre.js"; // Ensure this is the correct path to your middleware
const router = Router();
router.post('/create',authenticate, createTheatre); // Adjust the endpoint as necessary
router.get('/getTheatre',authenticate,getTheatres ); // Adjust the endpoint as necessary
export default router;