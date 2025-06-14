import express from "express"; // Ensure correct path and file extension
import cors from "cors";
import authRoutes from "./routes/authroute.js"; // Adjust the import path as necessary
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api',authRoutes); // Use the auth routes under /api path


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});