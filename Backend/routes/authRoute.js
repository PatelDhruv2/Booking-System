import { Router } from "express";
import {signupController} from "../controller/Auth.js";
import {loginController} from "../controller/Auth.js"; // Assuming loginController is also exported from Auth.js
 // Adjust the import path as necessary
const router = Router();
router.post('/signup',signupController);
router.post('/login', loginController); // Assuming loginController is also exported from Auth.js
export default router;