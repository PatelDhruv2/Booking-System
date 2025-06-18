import { Router } from "express";
import {signupController} from "../controller/Auth.js";
import {loginController} from "../controller/Auth.js";
import { verifyOtp } from "../controller/Auth.js";
// Assuming loginController is also exported from Auth.js
 // Adjust the import path as necessary
const router = Router();
router.post('/signup',signupController);
router.post('/login', loginController); 
router.post('/signup/verify-otp', verifyOtp); // Endpoint for verifying OTP
 // Dummy route for testing purposes
export default router;