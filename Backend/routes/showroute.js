import { Router } from "express";
import createShowController from "../controller/Show.js";
import { getShowsController } from "../controller/Show.js"; // Ensure this is the correct path to your controller
import { authenticate } from "../middleware/middle.js"; // Ensure this is the correct path to your middleware
import { getshowbyid } from "../controller/Show.js";
import {getSeatsWithBookingStatusController} from "../controller/Show.js"; 
import { getSeatMatrixController } from "../controller/Show.js";
import {generateSeatsController} from "../controller/Show.js"; // Ensure this is the correct path to your controller
const router = Router();
router.post('/create-show', authenticate, createShowController); 
router.get('/getShows',authenticate,getShowsController);
router.get('/getShowsfortheatre',authenticate,getshowbyid); 
router.post('/getSeatsWithBookingStatus', authenticate,getSeatsWithBookingStatusController); // Ensure this is the correct path to your controller
router.get('/getSeatMatrix', authenticate,getSeatMatrixController); 
router.post('/generateSeats', authenticate,generateSeatsController); // Ensure this is the correct path to your controller
export default router;