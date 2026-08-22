import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bookingRoutes from './src/routes/bookingRoutes.js'
import uploadRoutes from "./src/routes/uploadRoutes.js"
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "https://bookloom-psi.vercel.app",
    credentials: true
  })
);
app.use(express.json());

app.use("/api/books",bookingRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", profileRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));