import { Router } from "express";
import createScreenController from "../controller/Screen.js";
import { authenticate } from "../middleware/middle.js"; // Ensure this is the correct path to your middleware
const router = Router();
router.post('/create-screen', authenticate, createScreenController); // Adjust the endpoint as necessary
export default router;