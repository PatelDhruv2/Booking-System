import { Router } from "express";
import {bookSeatsController} from "../controller/Booking.js";
import { authenticate } from "../middleware/middle.js"; // Assuming you have an authentication middleware
const router = Router();
router.post('/Book-seats',authenticate,bookSeatsController); // Endpoint for booking seats
export default router;