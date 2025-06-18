import express from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import fs from "fs";
import path from "path";

// Import configs and routes
import "./config/passport.js"; // Google Strategy setup
import authRoutes from "./routes/authRoute.js"; 
import Theatreroute from "./routes/Theatreroute.js"; 
import MovieRoute from "./routes/MovieRoute.js"; 
import showroute from "./routes/showroute.js"; 
import Screenroute from "./routes/Screenroute.js";
import Uploadroute from "./routes/Uploadroute.js";
import BookingRoute from "./routes/BookingRoute.js"; // Booking route
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// 📦 JSON, Cookie Parser, Static
app.use(express.json());
app.use(cookieParser());

// 📁 Ensure uploads folder exists
const uploadPath = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadPath, { recursive: true });
app.use("/uploads", express.static(uploadPath));

// 🔑 Session and Passport
app.use(
  session({
    secret: process.env.JWT_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 🔐 Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: true,
  }),
  (req, res) => {
    // Redirect to frontend with user info
    const user = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`http://localhost:3000?user=${user}`);
  }
);

// 🛣️ Route registrations
app.use("/poster", Uploadroute);          // File upload route
app.use("/api", authRoutes);              // Auth route
app.use("/admin", Theatreroute);          // Theatre
app.use("/admin2", MovieRoute);           // Movies
app.use("/admin3", showroute);            // Shows
app.use("/admin4", Screenroute);          // Screens
app.use("/movie", BookingRoute);        // Booking route
// ✅ Test route to verify session login
app.get("/api/test", (req, res) => {
  res.json({ user: req.user || null });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
